import { useState } from 'react';
import { Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { SCHEDULE_TEMPLATE } from '../../utils/weddingDayTemplates';

export default function ScheduleTracker({ schedule, onAdd, onUpdate, onDelete, onBulkAdd }) {
  const [form, setForm] = useState({ time: '', activity: '', owner: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.activity.trim()) return;
    onAdd({ ...form });
    setForm({ time: '', activity: '', owner: '' });
  };

  const handleQuickFill = () => {
    if (schedule.length > 0 && !confirm('Add the standard wedding-day schedule template? This adds to your existing items.')) return;
    onBulkAdd(SCHEDULE_TEMPLATE);
  };

  const sorted = [...schedule].sort((a, b) => (a.time || 'zz').localeCompare(b.time || 'zz'));

  return (
    <div className="card">
      <div className="card-header-row">
        <h3>Minute-by-Minute Schedule</h3>
        <button className="btn btn-ghost btn-sm" onClick={handleQuickFill}>
          <Sparkles size={13} /> Quick-fill template
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="empty-hint">No schedule items yet — quick-fill a template or add your own below.</p>
      ) : (
        <ul className="ops-list">
          {sorted.map((item) => (
            <li key={item.id} className={`ops-item ${item.status === 'done' ? 'ops-item-done' : ''}`}>
              <button
                className={`payment-check ${item.status === 'done' ? 'payment-check-done' : ''}`}
                onClick={() => onUpdate(item.id, { status: item.status === 'done' ? 'pending' : 'done' })}
                aria-label="Toggle complete"
              >
                {item.status === 'done' && <Check size={12} />}
              </button>
              <input
                className="ops-time-input"
                placeholder="time"
                defaultValue={item.time}
                onBlur={(e) => onUpdate(item.id, { time: e.target.value })}
              />
              <input
                className="ops-main-input"
                defaultValue={item.activity}
                onBlur={(e) => onUpdate(item.id, { activity: e.target.value })}
              />
              <input
                className="ops-side-input"
                placeholder="owner"
                defaultValue={item.owner}
                onBlur={(e) => onUpdate(item.id, { owner: e.target.value })}
              />
              <button className="icon-btn-danger" onClick={() => onDelete(item.id)} aria-label="Remove item">
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="ops-add-form">
        <input
          placeholder="Time (e.g. 2:00 PM)"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="ops-time-input"
        />
        <input
          placeholder="Activity"
          value={form.activity}
          onChange={(e) => setForm({ ...form, activity: e.target.value })}
          className="ops-main-input"
        />
        <input
          placeholder="Owner"
          value={form.owner}
          onChange={(e) => setForm({ ...form, owner: e.target.value })}
          className="ops-side-input"
        />
        <button type="submit" className="btn btn-ghost btn-sm"><Plus size={14} /></button>
      </form>
    </div>
  );
}
