import { useState } from 'react';
import { Link as LinkIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './PendingApproval.css';

export default function JoinPlanner() {
  const { user, logout, requestAccess } = useAuth();
  const [plannerIdInput, setPlannerIdInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await requestAccess(plannerIdInput);
    if (!result.success) {
      setError(result.error);
    }
    // On success, accessStatus becomes 'pending' and App re-renders
    // into the waiting-for-approval screen automatically.
    setLoading(false);
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

        <div className="pending-icon">
          <LinkIcon size={28} color="var(--color-gold)" />
        </div>

        <h2>Join your partner's planner</h2>
        <p className="auth-subtitle">
          Hi {user?.displayName} — enter the Planner ID your partner shared with you.
          After you submit it, they'll approve your access from their Admin Panel.
        </p>

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: 'var(--space-4)' }}>
          <div>
            <label htmlFor="plannerIdInput">Planner ID</label>
            <input
              id="plannerIdInput"
              value={plannerIdInput}
              onChange={(e) => setPlannerIdInput(e.target.value)}
              placeholder="planner_xxxxxxxx_xxxxxxxxxxxxx"
              autoFocus
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Checking…' : 'Request Access'}
          </button>
        </form>

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
