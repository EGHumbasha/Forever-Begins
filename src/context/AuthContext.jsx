import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  inMemoryPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

// Refresh always logs out: keep the session only in memory
const persistenceReady = setPersistence(auth, inMemoryPersistence).catch(() => {});

/** Resolve the shared planner ID from the admin record (single-admin app). */
async function resolvePlannerIdFromAdmin() {
  const snapshot = await getDocs(collection(db, 'admins'));
  if (snapshot.empty) return null;
  return snapshot.docs[0].data().plannerId || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [plannerId, setPlannerId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessStatus, setAccessStatus] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));

          if (adminDoc.exists()) {
            setIsAdmin(true);
            setAccessStatus('approved');
            setPlannerId(adminDoc.data().plannerId || null);
          } else {
            setIsAdmin(false);
            const requestRef = doc(db, 'accessRequests', firebaseUser.uid);
            const requestDoc = await getDoc(requestRef);

            if (requestDoc.exists()) {
              const reqData = requestDoc.data();
              setAccessStatus(reqData.status);

              if (reqData.status === 'approved') {
                // Resolve planner ID: from the request, else from the admin record.
                // Resolved in memory only — the request doc is admin-writable only.
                let pid = reqData.plannerId || null;
                if (!pid) {
                  pid = await resolvePlannerIdFromAdmin();
                }
                setPlannerId(pid);
              } else {
                setPlannerId(null);
              }
            } else {
              // No request yet — they must enter the Planner ID first.
              // App will route them to the Join screen.
              setAccessStatus(null);
              setPlannerId(null);
            }
          }
        } catch (e) {
          console.error('Auth state error:', e);
          setAccessStatus('pending');
        }
      } else {
        setUser(null);
        setPlannerId(null);
        setIsAdmin(false);
        setAccessStatus(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Real-time pending-request counter for the admin (notification badge)
  useEffect(() => {
    if (!isAdmin) {
      setPendingCount(0);
      return;
    }
    const unsub = onSnapshot(collection(db, 'accessRequests'), (snap) => {
      const pending = snap.docs.filter((d) => d.data().status === 'pending').length;
      setPendingCount(pending);
    }, () => setPendingCount(0));
    return unsub;
  }, [isAdmin]);

  /** Re-check the current user's access without a page reload
      (a reload would log them out due to in-memory persistence). */
  const checkAccessStatus = useCallback(async () => {
    if (!user) return { status: null };
    const requestDoc = await getDoc(doc(db, 'accessRequests', user.uid));
    if (!requestDoc.exists()) return { status: 'pending' };
    const reqData = requestDoc.data();
    setAccessStatus(reqData.status);
    if (reqData.status === 'approved') {
      let pid = reqData.plannerId || null;
      if (!pid) {
        pid = await resolvePlannerIdFromAdmin();
      }
      setPlannerId(pid);
    }
    return { status: reqData.status };
  }, [user]);

  /** Partner enters the Planner ID they were given. Validates it against the
      real planner, then creates the pending access request. Only after this
      do they enter the waiting-for-approval state. */
  const requestAccess = useCallback(async (plannerIdInput) => {
    if (!user) return { success: false, error: 'Not signed in.' };
    const entered = (plannerIdInput || '').trim();
    if (!entered) return { success: false, error: 'Please enter the Planner ID.' };
    try {
      const plannerDoc = await getDoc(doc(db, 'planners', entered));
      if (!plannerDoc.exists()) {
        return { success: false, error: 'No planner found with that ID. Check it with your partner and try again.' };
      }
      await setDoc(doc(db, 'accessRequests', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        status: 'pending',
        plannerId: entered,
        requestedAt: new Date().toISOString(),
      });
      setAccessStatus('pending');
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, [user]);

  const register = useCallback(async (email, password, displayName) => {
    setAuthError(null);
    try {
      await persistenceReady;
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });

      const adminSnapshot = await getDocs(collection(db, 'admins'));
      const isFirstUser = adminSnapshot.empty;

      if (isFirstUser) {
        await setDoc(doc(db, 'admins', cred.user.uid), {
          email, displayName, uid: cred.user.uid,
          plannerId: null,
          createdAt: new Date().toISOString(),
        });
      } else {
        await setDoc(doc(db, 'users', cred.user.uid), {
          email, displayName, uid: cred.user.uid,
          createdAt: new Date().toISOString(),
        });
        // No access request yet — they'll enter the Planner ID next,
        // which is what creates the pending request.
      }
      return { success: true, isFirstUser };
    } catch (e) {
      setAuthError(friendlyError(e.code));
      return { success: false, error: friendlyError(e.code) };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      await persistenceReady;
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      setAuthError(friendlyError(e.code));
      return { success: false, error: friendlyError(e.code) };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const createPlanner = useCallback(async (initialData) => {
    if (!user || !isAdmin) return { success: false };
    try {
      const id = `planner_${user.uid}_${Date.now()}`;
      await setDoc(doc(db, 'planners', id), {
        ...initialData,
        createdAt: new Date().toISOString(),
        members: [user.uid],
      });
      await setDoc(doc(db, 'admins', user.uid), { plannerId: id }, { merge: true });
      setPlannerId(id);
      return { success: true, plannerId: id };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, [user, isAdmin]);

  const approveUser = useCallback(async (requestUid) => {
    if (!isAdmin) return { success: false, error: 'Not admin' };
    if (!plannerId) return { success: false, error: 'Create the planner first, then approve users.' };
    try {
      // The partner already entered a validated planner ID; approving
      // confirms it. We set it to the admin's planner ID to guarantee
      // both always point at the same planner.
      await setDoc(doc(db, 'accessRequests', requestUid), {
        status: 'approved', plannerId,
        approvedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, [isAdmin, plannerId]);

  const rejectUser = useCallback(async (requestUid) => {
    if (!isAdmin) return { success: false };
    try {
      await setDoc(doc(db, 'accessRequests', requestUid), {
        status: 'rejected', rejectedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, [isAdmin]);

  const revokeUser = useCallback(async (requestUid) => {
    if (!isAdmin) return { success: false };
    try {
      await setDoc(doc(db, 'accessRequests', requestUid), {
        status: 'rejected', revokedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, [isAdmin]);

  const getAccessRequests = useCallback(async () => {
    if (!isAdmin) return [];
    try {
      const snapshot = await getDocs(collection(db, 'accessRequests'));
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      return [];
    }
  }, [isAdmin]);

  const value = {
    user, plannerId, isAdmin, accessStatus, pendingCount,
    authLoading, authError,
    register, login, logout, createPlanner,
    approveUser, rejectUser, revokeUser, getAccessRequests,
    checkAccessStatus, requestAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'That email is already registered. Try logging in instead.',
    'auth/invalid-email': "That doesn't look like a valid email address.",
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error — check your connection.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
