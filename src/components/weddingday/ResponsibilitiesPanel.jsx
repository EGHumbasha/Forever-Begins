import { useState } from 'react';
import { Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { RESPONSIBILITIES_TEMPLATE } from '../../utils/weddingDayTemplates';

export default function ResponsibilitiesPanel({ responsibilities, onAdd, onUpdate, onDelete, onBulkAdd }) {
  const [form, setForm] = useState({ task: '', owner: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.task.trim()) return;
    onAdd(form);
    setForm({ task: '', owner: '' });
  };

  const handleQuickFill = () => {
    if (responsibilities.length > 0 && !confirm('Add the standard responsibilities checklist? This adds to your existing items.')) return;
    onBulkAdd(RESPONSIBILITIES_TEMPLATE);
  };

  return (
    <div className="card">
      <div className="card-header-row">
        <h3>Responsibilities Matrix</h3>
        <button className="btn btn-ghost btn-sm" onClick={handleQuickFill}>
          <Sparkles size={13} /> Quick-fill template
        </button>
      </div>

      {responsibilities.length === 0 ? (
        <p className="empty-hint">No responsibilities assigned yet.</p>
      ) : (
        <ul className="ops-list">
          {responsibilities.map((r) => (
            <li key={r.id} className={`ops-item ${r.status === 'done' ? 'ops-item-done' : ''}`}>
              <button
                className={`payment-check ${r.status === 'done' ? 'payment-check-done' : ''}`}
                onClick={() => onUpdate(r.id, { status: r.status === 'done' ? 'pending' : 'done' })}
                aria-label="Toggle complete"
              >
                {r.status === 'done' && <Check size={12} />}
              </button>
              <input
                className="ops-main-input"
                defaultValue={r.task}
                onBlur={(e) => onUpdate(r.id, { task: e.target.value })}
              />
              <input
                className="ops-side-input"
                placeholder="owner"
                defaultValue={r.owner}
                onBlur={(e) => onUpdate(r.id, { owner: e.target.value })}
              />
              <button className="icon-btn-danger" onClick={() => onDelete(r.id)} aria-label="Remove item">
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="ops-add-form">
        <input
          placeholder="Task"
          value={form.task}
          onChange={(e) => setForm({ ...form, task: e.target.value })}
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
