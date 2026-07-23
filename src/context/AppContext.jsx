import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { defaultData } from '../data/defaultData';

const AppContext = createContext(null);

function mergeWithDefaults(parsed) {
  return {
    ...defaultData,
    ...parsed,
    meta: { ...defaultData.meta, ...parsed.meta },
    budget: { ...defaultData.budget, ...parsed.budget },
    lobola: {
      ...defaultData.lobola,
      ...parsed.lobola,
      requirements: { ...defaultData.lobola.requirements, ...(parsed.lobola?.requirements || {}) },
    },
    shoppingLists: parsed.shoppingLists || defaultData.shoppingLists,
    weddingDayOps: parsed.weddingDayOps || defaultData.weddingDayOps,
    risks: parsed.risks || defaultData.risks,
    honeymoon: parsed.honeymoon || defaultData.honeymoon,
    settings: { ...defaultData.settings, ...parsed.settings },
    // Keep vendorCategories from backup if present, else default
    vendorCategories: parsed.vendorCategories || defaultData.vendorCategories,
  };
}

export function AppProvider({ children }) {
  const { plannerId } = useAuth();
  const [data, setData] = useState(defaultData);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [dataLoading, setDataLoading] = useState(true);

  // Track whether the latest data change came from Firestore (remote) or
  // local user action — so we don't write Firestore's own updates back to it.
  const remoteUpdateRef = useRef(false);

  // Subscribe to Firestore real-time updates when plannerId is available
  useEffect(() => {
    if (!plannerId) {
      setDataLoading(false);
      return;
    }
    setDataLoading(true);
    const plannerRef = doc(db, 'planners', plannerId);
    const unsub = onSnapshot(plannerRef, (snap) => {
      if (snap.exists()) {
        remoteUpdateRef.current = true;
        setData(mergeWithDefaults(snap.data()));
      }
      setDataLoading(false);
    }, (err) => {
      console.error('Firestore sync error:', err);
      setDataLoading(false);
    });
    return unsub;
  }, [plannerId]);

  // Write to Firestore whenever data changes from a LOCAL action (not remote)
  useEffect(() => {
    if (remoteUpdateRef.current) {
      remoteUpdateRef.current = false;
      return;
    }
    if (!plannerId) return;
    setSaveStatus('saving');
    const plannerRef = doc(db, 'planners', plannerId);
    setDoc(plannerRef, data, { merge: true })
      .then(() => setSaveStatus('saved'))
      .catch((e) => {
        console.error('Save failed:', e);
        setSaveStatus('error');
      });
  }, [data, plannerId]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.settings.theme);
  }, [data.settings.theme]);

  // ---------- Generic helpers ----------
  const update = useCallback((updater) => {
    setData((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  const updateMeta = useCallback((patch) => {
    setData((prev) => ({ ...prev, meta: { ...prev.meta, ...patch } }));
  }, []);

  const toggleTheme = useCallback(() => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme: prev.settings.theme === 'light' ? 'dark' : 'light' },
    }));
  }, []);

  // ---------- Tasks ----------
  const addTask = useCallback((task) => {
    setData((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        { id: uuid(), status: 'todo', priority: 'medium', recurrence: 'none', createdAt: new Date().toISOString(), ...task },
      ],
    }));
  }, []);

  const updateTask = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const deleteTask = useCallback((id) => {
    setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
  }, []);

  // ---------- Budget ----------
  const addBudgetCategory = useCallback((cat) => {
    setData((prev) => ({
      ...prev,
      budget: {
        ...prev.budget,
        categories: [...prev.budget.categories, { id: uuid(), planned: 0, spent: 0, ...cat }],
      },
    }));
  }, []);

  const updateBudgetCategory = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      budget: {
        ...prev.budget,
        categories: prev.budget.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    }));
  }, []);

  const deleteBudgetCategory = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      budget: { ...prev.budget, categories: prev.budget.categories.filter((c) => c.id !== id) },
    }));
  }, []);

  const addPayment = useCallback((payment) => {
    setData((prev) => ({
      ...prev,
      budget: {
        ...prev.budget,
        payments: [...prev.budget.payments, { id: uuid(), date: new Date().toISOString().slice(0, 10), ...payment }],
      },
    }));
  }, []);

  const deletePayment = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      budget: { ...prev.budget, payments: prev.budget.payments.filter((p) => p.id !== id) },
    }));
  }, []);

  // ---------- Lobola: family members ----------
  const addFamilyMember = useCallback((side, member) => {
    const key = side === 'bride' ? 'brideFamily' : 'groomFamily';
    setData((prev) => ({
      ...prev,
      lobola: { ...prev.lobola, [key]: [...prev.lobola[key], { id: uuid(), ...member }] },
    }));
  }, []);

  const updateFamilyMember = useCallback((side, id, patch) => {
    const key = side === 'bride' ? 'brideFamily' : 'groomFamily';
    setData((prev) => ({
      ...prev,
      lobola: {
        ...prev.lobola,
        [key]: prev.lobola[key].map((m) => (m.id === id ? { ...m, ...patch } : m)),
      },
    }));
  }, []);

  const deleteFamilyMember = useCallback((side, id) => {
    const key = side === 'bride' ? 'brideFamily' : 'groomFamily';
    setData((prev) => ({
      ...prev,
      lobola: { ...prev.lobola, [key]: prev.lobola[key].filter((m) => m.id !== id) },
    }));
  }, []);

  // ---------- Lobola: requirements ----------
  const addRequirement = useCallback((group, item) => {
    setData((prev) => ({
      ...prev,
      lobola: {
        ...prev.lobola,
        requirements: {
          ...prev.lobola.requirements,
          [group]: [...(prev.lobola.requirements[group] || []), { id: uuid(), status: 'pending', notes: '', ...item }],
        },
      },
    }));
  }, []);

  const updateRequirement = useCallback((group, id, patch) => {
    setData((prev) => ({
      ...prev,
      lobola: {
        ...prev.lobola,
        requirements: {
          ...prev.lobola.requirements,
          [group]: prev.lobola.requirements[group].map((r) => (r.id === id ? { ...r, ...patch } : r)),
        },
      },
    }));
  }, []);

  const deleteRequirement = useCallback((group, id) => {
    setData((prev) => ({
      ...prev,
      lobola: {
        ...prev.lobola,
        requirements: {
          ...prev.lobola.requirements,
          [group]: prev.lobola.requirements[group].filter((r) => r.id !== id),
        },
      },
    }));
  }, []);

  // ---------- Lobola: negotiation meetings ----------
  const addMeeting = useCallback((meeting) => {
    setData((prev) => ({
      ...prev,
      lobola: {
        ...prev.lobola,
        negotiationMeetings: [...prev.lobola.negotiationMeetings, { id: uuid(), ...meeting }],
      },
    }));
  }, []);

  const updateMeeting = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      lobola: {
        ...prev.lobola,
        negotiationMeetings: prev.lobola.negotiationMeetings.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      },
    }));
  }, []);

  const deleteMeeting = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      lobola: { ...prev.lobola, negotiationMeetings: prev.lobola.negotiationMeetings.filter((m) => m.id !== id) },
    }));
  }, []);

  // ---------- Guests ----------
  const addGuest = useCallback((guest) => {
    setData((prev) => ({
      ...prev,
      guests: [...prev.guests, { id: uuid(), rsvp: 'pending', side: 'both', partySize: 1, ...guest }],
    }));
  }, []);

  const updateGuest = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));
  }, []);

  const deleteGuest = useCallback((id) => {
    setData((prev) => ({ ...prev, guests: prev.guests.filter((g) => g.id !== id) }));
  }, []);

  // ---------- Vendors ----------
  const addVendor = useCallback((vendor) => {
    setData((prev) => ({
      ...prev,
      vendors: [
        ...prev.vendors,
        {
          id: uuid(),
          category: 'Other',
          status: 'considering', // considering | contacted | booked | paid | completed
          rating: 0,
          contractSigned: false,
          totalCost: 0,
          deposit: 0,
          paymentSchedule: [],
          notes: '',
          phone: '',
          createdAt: new Date().toISOString(),
          ...vendor,
        },
      ],
    }));
  }, []);

  const updateVendor = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }));
  }, []);

  const deleteVendor = useCallback((id) => {
    setData((prev) => ({ ...prev, vendors: prev.vendors.filter((v) => v.id !== id) }));
  }, []);

  const addVendorPaymentDue = useCallback((vendorId, payment) => {
    setData((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              paymentSchedule: [
                ...v.paymentSchedule,
                { id: uuid(), label: '', amount: 0, dueDate: '', paid: false, ...payment },
              ],
            }
          : v
      ),
    }));
  }, []);

  const updateVendorPaymentDue = useCallback((vendorId, paymentId, patch) => {
    setData((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              paymentSchedule: v.paymentSchedule.map((p) => (p.id === paymentId ? { ...p, ...patch } : p)),
            }
          : v
      ),
    }));
  }, []);

  const deleteVendorPaymentDue = useCallback((vendorId, paymentId) => {
    setData((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) =>
        v.id === vendorId
          ? { ...v, paymentSchedule: v.paymentSchedule.filter((p) => p.id !== paymentId) }
          : v
      ),
    }));
  }, []);

  // ---------- Documents ----------
  const saveDocument = useCallback((typeKey, label, content) => {
    setData((prev) => {
      const existingIndex = prev.documents.findIndex((d) => d.typeKey === typeKey);
      const docEntry = {
        id: existingIndex >= 0 ? prev.documents[existingIndex].id : uuid(),
        typeKey,
        label,
        content,
        updatedAt: new Date().toISOString(),
      };
      const documents =
        existingIndex >= 0
          ? prev.documents.map((d, i) => (i === existingIndex ? docEntry : d))
          : [...prev.documents, docEntry];
      return { ...prev, documents };
    });
  }, []);

  const deleteDocument = useCallback((typeKey) => {
    setData((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.typeKey !== typeKey) }));
  }, []);

  // ---------- Shopping Lists ----------
  const addShoppingItem = useCallback((categoryId, item) => {
    setData((prev) => ({
      ...prev,
      shoppingLists: {
        ...prev.shoppingLists,
        categories: prev.shoppingLists.categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: [
                  ...c.items,
                  { id: uuid(), name: '', quantity: 1, estimatedCost: 0, purchased: false, assignedTo: '', ...item },
                ],
              }
            : c
        ),
      },
    }));
  }, []);

  const updateShoppingItem = useCallback((categoryId, itemId, patch) => {
    setData((prev) => ({
      ...prev,
      shoppingLists: {
        ...prev.shoppingLists,
        categories: prev.shoppingLists.categories.map((c) =>
          c.id === categoryId
            ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
            : c
        ),
      },
    }));
  }, []);

  const deleteShoppingItem = useCallback((categoryId, itemId) => {
    setData((prev) => ({
      ...prev,
      shoppingLists: {
        ...prev.shoppingLists,
        categories: prev.shoppingLists.categories.map((c) =>
          c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
        ),
      },
    }));
  }, []);

  const addShoppingItemsBulk = useCallback((categoryId, items) => {
    setData((prev) => ({
      ...prev,
      shoppingLists: {
        ...prev.shoppingLists,
        categories: prev.shoppingLists.categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: [
                  ...c.items,
                  ...items.map((item) => ({
                    id: uuid(),
                    quantity: 1,
                    estimatedCost: 0,
                    purchased: false,
                    assignedTo: '',
                    ...item,
                  })),
                ],
              }
            : c
        ),
      },
    }));
  }, []);

  // ---------- Wedding Day Operations ----------
  const addScheduleItem = useCallback((item) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        schedule: [...prev.weddingDayOps.schedule, { id: uuid(), time: '', activity: '', owner: '', status: 'pending', ...item }],
      },
    }));
  }, []);

  const updateScheduleItem = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        schedule: prev.weddingDayOps.schedule.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      },
    }));
  }, []);

  const deleteScheduleItem = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: { ...prev.weddingDayOps, schedule: prev.weddingDayOps.schedule.filter((s) => s.id !== id) },
    }));
  }, []);

  const addScheduleItemsBulk = useCallback((items) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        schedule: [
          ...prev.weddingDayOps.schedule,
          ...items.map((item) => ({ id: uuid(), time: '', owner: '', status: 'pending', ...item })),
        ],
      },
    }));
  }, []);

  const addTransportItem = useCallback((item) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        transport: [
          ...prev.weddingDayOps.transport,
          { id: uuid(), vehicle: '', driver: '', driverPhone: '', pickupTime: '', pickupLocation: '', dropoffLocation: '', passengers: '', ...item },
        ],
      },
    }));
  }, []);

  const updateTransportItem = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        transport: prev.weddingDayOps.transport.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      },
    }));
  }, []);

  const deleteTransportItem = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: { ...prev.weddingDayOps, transport: prev.weddingDayOps.transport.filter((t) => t.id !== id) },
    }));
  }, []);

  const addEmergencyContact = useCallback((contact) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        emergencyContacts: [...prev.weddingDayOps.emergencyContacts, { id: uuid(), name: '', role: '', phone: '', ...contact }],
      },
    }));
  }, []);

  const updateEmergencyContact = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        emergencyContacts: prev.weddingDayOps.emergencyContacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    }));
  }, []);

  const deleteEmergencyContact = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        emergencyContacts: prev.weddingDayOps.emergencyContacts.filter((c) => c.id !== id),
      },
    }));
  }, []);

  const addResponsibility = useCallback((item) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        responsibilities: [...prev.weddingDayOps.responsibilities, { id: uuid(), task: '', owner: '', status: 'pending', ...item }],
      },
    }));
  }, []);

  const updateResponsibility = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        responsibilities: prev.weddingDayOps.responsibilities.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      },
    }));
  }, []);

  const deleteResponsibility = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        responsibilities: prev.weddingDayOps.responsibilities.filter((r) => r.id !== id),
      },
    }));
  }, []);

  const addResponsibilitiesBulk = useCallback((items) => {
    setData((prev) => ({
      ...prev,
      weddingDayOps: {
        ...prev.weddingDayOps,
        responsibilities: [
          ...prev.weddingDayOps.responsibilities,
          ...items.map((item) => ({ id: uuid(), owner: '', status: 'pending', ...item })),
        ],
      },
    }));
  }, []);

  // ---------- Risk Management ----------
  const updateRisk = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      risks: prev.risks.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const addRisk = useCallback((risk) => {
    setData((prev) => ({
      ...prev,
      risks: [...prev.risks, { id: uuid(), title: '', defaultPlan: '', status: 'not-prepared', notes: '', ...risk }],
    }));
  }, []);

  const deleteRisk = useCallback((id) => {
    setData((prev) => ({ ...prev, risks: prev.risks.filter((r) => r.id !== id) }));
  }, []);

  // ---------- Honeymoon Planner ----------
  const updateHoneymoon = useCallback((patch) => {
    setData((prev) => ({ ...prev, honeymoon: { ...prev.honeymoon, ...patch } }));
  }, []);

  const addPackingItem = useCallback((item) => {
    setData((prev) => ({
      ...prev,
      honeymoon: {
        ...prev.honeymoon,
        packingList: [...prev.honeymoon.packingList, { id: uuid(), name: '', packed: false, ...item }],
      },
    }));
  }, []);

  const addPackingItemsBulk = useCallback((items) => {
    setData((prev) => ({
      ...prev,
      honeymoon: {
        ...prev.honeymoon,
        packingList: [...prev.honeymoon.packingList, ...items.map((item) => ({ id: uuid(), packed: false, ...item }))],
      },
    }));
  }, []);

  const updatePackingItem = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      honeymoon: {
        ...prev.honeymoon,
        packingList: prev.honeymoon.packingList.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      },
    }));
  }, []);

  const deletePackingItem = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      honeymoon: { ...prev.honeymoon, packingList: prev.honeymoon.packingList.filter((i) => i.id !== id) },
    }));
  }, []);

  const addTravelPlanItem = useCallback((item) => {
    setData((prev) => ({
      ...prev,
      honeymoon: {
        ...prev.honeymoon,
        travelPlans: [...prev.honeymoon.travelPlans, { id: uuid(), title: '', date: '', details: '', ...item }],
      },
    }));
  }, []);

  const updateTravelPlanItem = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      honeymoon: {
        ...prev.honeymoon,
        travelPlans: prev.honeymoon.travelPlans.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      },
    }));
  }, []);

  const deleteTravelPlanItem = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      honeymoon: { ...prev.honeymoon, travelPlans: prev.honeymoon.travelPlans.filter((t) => t.id !== id) },
    }));
  }, []);

  // ---------- Backup / restore ----------
  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `forever-begins-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback(async (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);

      // Strip Firestore-internal fields that got included in the export
      // (members, createdAt at top level) — these are managed separately
      const { members: _m, createdAt: _c, ...plannerData } = parsed;

      const merged = mergeWithDefaults({
        ...plannerData,
        meta: { ...plannerData.meta, lastImportedAt: new Date().toISOString() },
      });

      if (plannerId) {
        const plannerRef = doc(db, 'planners', plannerId);
        // Preserve the existing members list — rules require it to be present
        const snap = await getDoc(plannerRef);
        const existingMembers = snap.exists() ? (snap.data().members || []) : [];
        await setDoc(plannerRef, { ...merged, members: existingMembers }, { merge: false });
      }

      setData(merged);
      return { success: true };
    } catch (e) {
      console.error('Import failed:', e.code, e.message);
      return { success: false, error: e.message };
    }
  }, [plannerId]);

  const resetAllData = useCallback(async () => {
    if (plannerId) {
      const plannerRef = doc(db, 'planners', plannerId);
      await setDoc(plannerRef, defaultData, { merge: false });
    }
    setData(defaultData);
  }, [plannerId]);

  const value = {
    data,
    saveStatus,
    dataLoading,
    update,
    updateMeta,
    toggleTheme,
    addTask,
    updateTask,
    deleteTask,
    addBudgetCategory,
    updateBudgetCategory,
    deleteBudgetCategory,
    addPayment,
    deletePayment,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addGuest,
    updateGuest,
    deleteGuest,
    addVendor,
    updateVendor,
    deleteVendor,
    addVendorPaymentDue,
    updateVendorPaymentDue,
    deleteVendorPaymentDue,
    saveDocument,
    deleteDocument,
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    addShoppingItemsBulk,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    addScheduleItemsBulk,
    addTransportItem,
    updateTransportItem,
    deleteTransportItem,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    addResponsibility,
    updateResponsibility,
    deleteResponsibility,
    addResponsibilitiesBulk,
    updateRisk,
    addRisk,
    deleteRisk,
    updateHoneymoon,
    addPackingItem,
    addPackingItemsBulk,
    updatePackingItem,
    deletePackingItem,
    addTravelPlanItem,
    updateTravelPlanItem,
    deleteTravelPlanItem,
    exportData,
    importData,
    resetAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
