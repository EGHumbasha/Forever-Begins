import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatMoney } from '../../utils/dateUtils';

const STATUS_OPTIONS = ['pending', 'arranged', 'delivered'];

export default function RequirementGroup({ title, hint, items, hasAmount, hasQuantity, currency, onAdd, onUpdate, onDelete }) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    onAdd({ item: newItem.trim(), amount: 0, quantity: 1 });
    setNewItem('');
  };

  return (
    <div className="req-group">
      <div className="req-group-header">
        <h4>{title}</h4>
        {hint && <p className="req-hint">{hint}</p>}
      </div>
      {items.length === 0 ? (
        <p className="empty-hint" style={{ padding: 'var(--space-2) 0' }}>Nothing added yet.</p>
      ) : (
        <ul className="req-list">
          {items.map((r) => (
            <li key={r.id} className="req-item">
              <span className="req-item-name">{r.item}</span>
              {hasAmount && (
                <input
                  type="number"
                  className="req-amount-input"
                  defaultValue={r.amount}
                  onBlur={(e) => onUpdate(r.id, { amount: Number(e.target.value) || 0 })}
                  aria-label={`Amount for ${r.item}`}
                />
              )}
              {hasQuantity && (
                <input
                  type="number"
                  className="req-amount-input"
                  defaultValue={r.quantity}
                  min="1"
                  onBlur={(e) => onUpdate(r.id, { quantity: Number(e.target.value) || 1 })}
                  aria-label={`Quantity for ${r.item}`}
                />
              )}
              <select
                value={r.status}
                onChange={(e) => onUpdate(r.id, { status: e.target.value })}
                className={`req-status req-status-${r.status}`}
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="icon-btn-danger" onClick={() => onDelete(r.id)} aria-label={`Remove ${r.item}`}>
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleAdd} className="req-add-form">
        <input
          placeholder={`Add to ${title.toLowerCase()}...`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost btn-sm"><Plus size={13} /></button>
      </form>
    </div>
  );
}
