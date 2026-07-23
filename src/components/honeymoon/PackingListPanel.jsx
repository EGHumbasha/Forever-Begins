import { useState } from 'react';
import { Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { PACKING_TEMPLATE } from '../../utils/honeymoonTemplates';

export default function PackingListPanel({ packingList, onAdd, onUpdate, onDelete, onBulkAdd }) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    onAdd({ name: newItem.trim() });
    setNewItem('');
  };

  const handleQuickFill = () => {
    const existing = new Set(packingList.map((i) => i.name.toLowerCase()));
    const toAdd = PACKING_TEMPLATE.filter((t) => !existing.has(t.name.toLowerCase()));
    if (toAdd.length === 0) return;
    onBulkAdd(toAdd);
  };

  const packedCount = packingList.filter((i) => i.packed).length;

  return (
    <div className="card">
      <div className="card-header-row">
        <div>
          <h3>Packing List</h3>
          <p className="shopping-panel-sub">{packedCount} of {packingList.length} packed</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleQuickFill}>
          <Sparkles size={13} /> Quick-fill
        </button>
      </div>

      {packingList.length === 0 ? (
        <p className="empty-hint">Nothing added yet — quick-fill the essentials or add your own.</p>
      ) : (
        <ul className="shopping-item-list">
          {packingList.map((item) => (
            <li key={item.id} className={`shopping-item ${item.packed ? 'shopping-item-done' : ''}`}>
              <button
                className={`payment-check ${item.packed ? 'payment-check-done' : ''}`}
                onClick={() => onUpdate(item.id, { packed: !item.packed })}
                aria-label={item.packed ? 'Mark not packed' : 'Mark packed'}
              >
                {item.packed && <Check size={12} />}
              </button>
              <span className="shopping-item-name">{item.name}</span>
              <button className="icon-btn-danger" onClick={() => onDelete(item.id)} aria-label={`Remove ${item.name}`}>
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="req-add-form">
        <input
          placeholder="Add an item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost btn-sm"><Plus size={13} /></button>
      </form>
    </div>
  );
}
