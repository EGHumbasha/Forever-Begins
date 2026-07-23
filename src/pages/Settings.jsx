import { useState } from 'react';
import { Save, Check, Download, Upload, AlertTriangle, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'ZWG', label: 'Zimbabwe Gold (ZWG)' },
  { value: 'ZAR', label: 'South African Rand (ZAR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
];

export default function Settings() {
  const { data, updateMeta, exportData, importData, resetAllData } = useApp();
  const { user, plannerId } = useAuth();
  const [form, setForm] = useState({
    partner1: data.meta.coupleNames.partner1 || '',
    partner2: data.meta.coupleNames.partner2 || '',
    lobolaDate: data.meta.lobolaDate || '',
    weddingDate: data.meta.weddingDate || '',
    currency: data.meta.currency || 'USD',
  });
  const [saved, setSaved] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [idCopied, setIdCopied] = useState(false);

  const handleCopyId = () => {
    if (plannerId) {
      navigator.clipboard.writeText(plannerId);
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 1800);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMeta({
      coupleNames: { partner1: form.partner1, partner2: form.partner2 },
      lobolaDate: form.lobolaDate,
      weddingDate: form.weddingDate,
      currency: form.currency,
      onboarded: true,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const result = await importData(reader.result);
      setImportStatus(result.success ? 'success' : 'error');
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('This will permanently erase all data in this planner — tasks, budget, guests, vendors, documents, everything. This cannot be undone. Are you sure?')) {
      if (confirm('Really sure? Consider downloading a backup first.')) {
        resetAllData();
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">Settings</p>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Update your names, dates, and currency, or manage your data.</p>
      </div>

      <div className="card settings-card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Couple & Dates</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label htmlFor="s-partner1">Your name</label>
            <input
              id="s-partner1"
              value={form.partner1}
              onChange={(e) => setForm({ ...form, partner1: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="s-partner2">Partner's name</label>
            <input
              id="s-partner2"
              value={form.partner2}
              onChange={(e) => setForm({ ...form, partner2: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="s-lobolaDate">Lobola date</label>
            <input
              id="s-lobolaDate"
              type="date"
              value={form.lobolaDate}
              onChange={(e) => setForm({ ...form, lobolaDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="s-weddingDate">Wedding date</label>
            <input
              id="s-weddingDate"
              type="date"
              value={form.weddingDate}
              onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
              required
            />
          </div>
          <div className="span-2">
            <label htmlFor="s-currency">Currency</label>
            <select
              id="s-currency"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary span-2">
            {saved ? <><Check size={15} /> Saved</> : <><Save size={15} /> Save Changes</>}
          </button>
        </form>
      </div>

      <div className="card settings-card">
        <h3 style={{ marginBottom: 'var(--space-2)' }}>Planning Together</h3>
        <p className="page-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
          Both of you are now synced in real time via Firebase. Any change either of you makes
          appears on the other's screen within seconds — no manual backups needed.
          Share your Planner ID with your partner so they can join from their device.
        </p>

        {user && (
          <div className="settings-user-row">
            <span className="settings-user-label">Signed in as</span>
            <span className="settings-user-name">{user.displayName || user.email}</span>
          </div>
        )}

        {plannerId && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label>Your Planner ID</label>
            <div className="planner-id-box">
              <code style={{ fontSize: 'var(--text-xs)', flex: 1, wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
                {plannerId}
              </code>
              <button className="btn btn-ghost btn-sm" onClick={handleCopyId}>
                {idCopied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              Share this with your partner — they paste it on the setup screen to join your planner.
            </p>
          </div>
        )}

        <div className="settings-actions-row">
          <button className="btn btn-ghost" onClick={exportData}>
            <Download size={15} /> Download Backup (.json)
          </button>
          <label className="btn btn-ghost settings-upload-label">
            <Upload size={15} /> Import a Backup
            <input type="file" accept="application/json" onChange={handleImportFile} hidden />
          </label>
        </div>
        {importStatus === 'success' && <p className="settings-status settings-status-success">Backup imported and synced to cloud.</p>}
        {importStatus === 'error' && <p className="settings-status settings-status-error">That file couldn't be read as a valid backup.</p>}
      </div>

      <div className="card settings-card settings-danger-card">
        <h3 style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={17} color="var(--color-danger)" /> Danger Zone
        </h3>
        <p className="page-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
          Permanently erase everything in this planner and start fresh. This cannot be undone — download
          a backup first if you might want this data later.
        </p>
        <button className="btn btn-danger" onClick={handleReset}>Reset All Data</button>
      </div>
    </div>
  );
}
