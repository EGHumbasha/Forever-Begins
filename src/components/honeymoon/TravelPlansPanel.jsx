import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export default function TravelPlansPanel({ travelPlans, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', details: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd(form);
    setForm({ title: '', date: '', details: '' });
    setShowForm(false);
  };

  const sorted = [...travelPlans].sort((a, b) => (a.date || 'zz').localeCompare(b.date || 'zz'));

  return (
    <div className="card">
      <div className="card-header-row">
        <h3>Travel Plans</h3>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowForm((s) => !s)}>
          <Plus size={13} /> Add Plan
        </button>
      </div>
      <p className="page-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
        Flights, hotel bookings, activities, anything with a date worth tracking.
      </p>

      {sorted.length === 0 && !showForm ? (
        <p className="empty-hint">No travel plans added yet.</p>
      ) : (
        <ul className="travel-plan-list">
          {sorted.map((t) => (
            <li key={t.id} className="travel-plan-item">
              <div className="travel-plan-date">{t.date ? formatDate(t.date) : 'No date'}</div>
              <div className="travel-plan-main">
                <input
                  className="travel-plan-title"
                  defaultValue={t.title}
                  onBlur={(e) => onUpdate(t.id, { title: e.target.value })}
                />
                <textarea
                  className="travel-plan-details"
                  rows={2}
                  defaultValue={t.details}
                  onBlur={(e) => onUpdate(t.id, { details: e.target.value })}
                  placeholder="Confirmation number, time, address..."
                />
              </div>
              <button className="icon-btn-danger" onClick={() => onDelete(t.id)} aria-label={`Remove ${t.title}`}>
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="travel-plan-new-form">
          <input
            placeholder="Title (e.g. Flight to Victoria Falls)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <button type="submit" className="btn btn-primary btn-sm">Add</button>
        </form>
      )}
    </div>
  );
}
