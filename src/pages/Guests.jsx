import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, MessageCircle, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePlannerStats } from '../hooks/usePlannerStats';
import GuestFormModal from '../components/guests/GuestFormModal';
import { generateWhatsAppInvite, generateRsvpReminder } from '../utils/messageTemplates';
import Modal from '../components/common/Modal';
import './Guests.css';

export default function Guests() {
  const { data, addGuest, updateGuest, deleteGuest } = useApp();
  const stats = usePlannerStats();
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [messageGuest, setMessageGuest] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return data.guests;
    return data.guests.filter((g) => g.rsvp === filter);
  }, [data.guests, filter]);

  const handleSave = (guestData) => {
    if (editingGuest) {
      updateGuest(editingGuest.id, guestData);
    } else {
      addGuest(guestData);
    }
    setEditingGuest(null);
  };

  return (
    <div className="page-container">
      <div className="page-header tasks-header">
        <div>
          <p className="page-eyebrow">Guest Management</p>
          <h1 className="page-title">Guests</h1>
          <p className="page-subtitle">Track invitations, RSVPs, and seating for the wedding day.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingGuest(null); setShowForm(true); }}>
          <Plus size={16} /> Add Guest
        </button>
      </div>

      <div className="guest-summary-row">
        <div className="card guest-summary-card">
          <p className="summary-value">{data.guests.length}</p>
          <p className="summary-label">Total Invited</p>
        </div>
        <div className="card guest-summary-card">
          <p className="summary-value">{stats.confirmedGuests.length}</p>
          <p className="summary-label">Confirmed</p>
        </div>
        <div className="card guest-summary-card">
          <p className="summary-value">{stats.pendingGuests.length}</p>
          <p className="summary-label">Pending</p>
        </div>
        <div className="card guest-summary-card">
          <p className="summary-value">{stats.totalHeadcount}</p>
          <p className="summary-label">Total Headcount</p>
        </div>
      </div>

      <div className="filter-pills" style={{ marginBottom: 'var(--space-4)' }}>
        {['all', 'confirmed', 'pending', 'declined'].map((f) => (
          <button key={f} className={`filter-pill ${filter === f ? 'filter-pill-active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card task-list-card">
        {filtered.length === 0 ? (
          <p className="empty-hint">No guests in this view yet.</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Side</th>
                <th>Party</th>
                <th>RSVP</th>
                <th>Table</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td>{g.name}</td>
                  <td className="task-table-cat">{g.side}</td>
                  <td>{g.partySize}</td>
                  <td>
                    <select
                      value={g.rsvp}
                      onChange={(e) => updateGuest(g.id, { rsvp: e.target.value })}
                      className={`rsvp-select rsvp-${g.rsvp}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="declined">Declined</option>
                    </select>
                  </td>
                  <td>{g.table || '—'}</td>
                  <td className="guest-actions">
                    <button className="icon-btn-ghost" onClick={() => setMessageGuest(g)} aria-label={`Message ${g.name}`}>
                      <MessageCircle size={14} />
                    </button>
                    <button className="icon-btn-ghost" onClick={() => { setEditingGuest(g); setShowForm(true); }} aria-label={`Edit ${g.name}`}>
                      <Pencil size={14} />
                    </button>
                    <button className="icon-btn-danger" onClick={() => deleteGuest(g.id)} aria-label={`Delete ${g.name}`}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <GuestFormModal
          initial={editingGuest}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingGuest(null); }}
        />
      )}

      {messageGuest && (
        <MessageModal
          guest={messageGuest}
          coupleNames={data.meta.coupleNames}
          weddingDate={data.meta.weddingDate}
          onClose={() => setMessageGuest(null)}
        />
      )}
    </div>
  );
}

function MessageModal({ guest, coupleNames, weddingDate, onClose }) {
  const [copied, setCopied] = useState(false);
  const invite = generateWhatsAppInvite({ guestName: guest.name, coupleNames, weddingDate });
  const reminder = generateRsvpReminder({ guestName: guest.name, coupleNames, weddingDate });
  const [text, setText] = useState(invite);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Modal title={`Message for ${guest.name}`} onClose={onClose}>
      <div className="message-tabs">
        <button className="btn btn-ghost btn-sm" onClick={() => setText(invite)}>Invitation</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setText(reminder)}>RSVP Reminder</button>
      </div>
      <textarea rows={9} value={text} onChange={(e) => setText(e.target.value)} style={{ marginTop: 'var(--space-3)' }} />
      <button className="btn btn-primary" style={{ marginTop: 'var(--space-3)', width: '100%' }} onClick={handleCopy}>
        {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Message</>}
      </button>
    </Modal>
  );
}
