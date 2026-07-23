import { useState } from 'react';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './PendingApproval.css';

export default function PendingApproval({ status }) {
  const { user, logout, checkAccessStatus } = useAuth();
  const [checking, setChecking] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleCheck = async () => {
    setChecking(true);
    const result = await checkAccessStatus();
    setLastResult(result.status);
    setChecking(false);
    // If approved, the context state update re-renders App into the planner automatically
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">FB</span>
          <div>
            <h1 className="auth-brand-name">Forever Begins</h1>
            <p className="auth-brand-tag">Lobola &amp; Wedding Planner</p>
          </div>
        </div>

        <div className={`pending-icon ${status === 'rejected' ? 'pending-icon-rejected' : ''}`}>
          {status === 'rejected' ? '✕' : <Clock size={32} color="var(--color-gold)" />}
        </div>

        {status === 'rejected' ? (
          <>
            <h2>Access not granted</h2>
            <p className="auth-subtitle">
              Your access to this planner was not approved or was revoked.
              Contact the planner owner if you think this is a mistake.
            </p>
            <button
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 'var(--space-4)' }}
              onClick={handleCheck}
              disabled={checking}
            >
              <RefreshCw size={14} className={checking ? 'spin' : ''} /> Check again
            </button>
          </>
        ) : (
          <>
            <h2>Waiting for approval</h2>
            <p className="auth-subtitle">
              Hi {user?.displayName} — you're registered and logged in.
              The planner owner needs to approve your access from their
              <strong> Admin Panel</strong>.
            </p>
            <p className="auth-subtitle" style={{ marginTop: 'var(--space-2)' }}>
              Once they've approved you, tap the button below — no need to reload the page.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'var(--space-4)' }}
              onClick={handleCheck}
              disabled={checking}
            >
              <RefreshCw size={14} className={checking ? 'spin' : ''} />
              {checking ? ' Checking…' : ' Check approval status'}
            </button>
            {lastResult === 'pending' && !checking && (
              <p className="auth-subtitle" style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
                Still pending — ask the planner owner to approve you, then check again.
              </p>
            )}
          </>
        )}

        <button
          className="btn btn-ghost"
          style={{ width: '100%', marginTop: 'var(--space-3)' }}
          onClick={logout}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
}
