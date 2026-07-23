import { useState } from 'react';
import { Plus, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { defaultData } from '../../data/defaultData';
import './PlannerSetup.css';

export default function PlannerSetup() {
  const { user, createPlanner, joinPlanner } = useAuth();
  const [mode, setMode] = useState(null); // null | 'create' | 'join'
  const [joinId, setJoinId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    const result = await createPlanner(defaultData);
    if (result.success) {
      setCreatedId(result.plannerId);
    } else {
      setError(result.error || 'Failed to create planner.');
    }
    setLoading(false);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinId.trim()) return;
    setLoading(true);
    setError('');
    const result = await joinPlanner(joinId.trim());
    if (!result.success) {
      setError(result.error || 'Could not join that planner.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (createdId) {
    return (
      <div className="planner-setup-screen">
        <div className="planner-setup-card">
          <div className="planner-setup-icon">✓</div>
          <h2>Planner created!</h2>
          <p className="planner-setup-sub">
            Share this Planner ID with your partner. They'll use it to join from their
            device under "Join an existing planner."
          </p>
          <div className="planner-id-box">
            <code>{createdId}</code>
            <button onClick={handleCopy} className="btn btn-ghost btn-sm">
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          <p className="planner-setup-note">
            You can also find this ID later in Settings → Planning Together.
          </p>
          <p className="planner-setup-note" style={{ marginTop: 0 }}>
            The planner will open in a moment…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-setup-screen">
      <div className="planner-setup-card">
        <div className="auth-brand" style={{ marginBottom: 'var(--space-5)' }}>
          <span className="auth-brand-mark">FB</span>
          <div>
            <h1 className="auth-brand-name">Forever Begins</h1>
            <p className="auth-brand-tag">Welcome, {user?.displayName || 'there'}</p>
          </div>
        </div>

        <h2 style={{ marginBottom: 'var(--space-2)' }}>Set up your planner</h2>
        <p className="planner-setup-sub">
          Create a new shared planner, or join your partner's if they've already created one.
        </p>

        {!mode && (
          <div className="planner-setup-options">
            <button className="planner-option-btn" onClick={() => { setMode('create'); handleCreate(); }}>
              <Plus size={22} />
              <span className="planner-option-label">Create a new planner</span>
              <span className="planner-option-hint">Start fresh — share the ID with your partner afterwards</span>
            </button>
            <button className="planner-option-btn" onClick={() => setMode('join')}>
              <LinkIcon size={22} />
              <span className="planner-option-label">Join existing planner</span>
              <span className="planner-option-hint">Your partner already created one and gave you the ID</span>
            </button>
          </div>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoin} className="planner-join-form">
            <label htmlFor="joinId">Planner ID (from your partner)</label>
            <input
              id="joinId"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              placeholder="planner_xxxxxx_xxxxxxxxxx"
              autoFocus
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Joining…' : 'Join Planner'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setMode(null); setError(''); }}>
              Back
            </button>
          </form>
        )}

        {mode === 'create' && loading && (
          <p className="planner-setup-sub" style={{ marginTop: 'var(--space-4)' }}>Creating your planner…</p>
        )}

        {error && mode !== 'join' && <p className="auth-error" style={{ marginTop: 'var(--space-4)' }}>{error}</p>}
      </div>
    </div>
  );
}
