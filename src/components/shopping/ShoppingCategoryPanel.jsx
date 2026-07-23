import { useState } from 'react';
import { Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { formatMoney } from '../../utils/dateUtils';
import { SHOPPING_TEMPLATES } from '../../utils/shoppingTemplates';

export default function ShoppingCategoryPanel({ category, currency, onAdd, onUpdate, onDelete, onBulkAdd }) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    onAdd(category.id, { name: newItem.trim() });
    setNewItem('');
  };

  const handleQuickFill = () => {
    const existingNames = new Set(category.items.map((i) => i.name.toLowerCase()));
    const template = SHOPPING_TEMPLATES[category.id] || [];
    const toAdd = template.filter((t) => !existingNames.has(t.name.toLowerCase()));
    if (toAdd.length === 0) return;
    onBulkAdd(category.id, toAdd);
  };

  const totalEstimate = category.items.reduce((s, i) => s + Number(i.estimatedCost) * Number(i.quantity || 1), 0);
  const purchasedCount = category.items.filter((i) => i.purchased).length;
  const hasTemplate = !!SHOPPING_TEMPLATES[category.id];

  return (
    <div className="card shopping-panel">
      <div className="card-header-row">
        <div>
          <h3>{category.name}</h3>
          <p className="shopping-panel-sub">
            {category.items.length} item{category.items.length === 1 ? '' : 's'} · {purchasedCount} purchased ·{' '}
            {formatMoney(totalEstimate, currency)} estimated
          </p>
        </div>
        {hasTemplate && (
          <button className="btn btn-ghost btn-sm" onClick={handleQuickFill}>
            <Sparkles size={13} /> Quick-fill list
          </button>
        )}
      </div>

      {category.items.length === 0 ? (
        <p className="empty-hint">Nothing added yet — use Quick-fill or add your own items below.</p>
      ) : (
        <ul className="shopping-item-list">
          {category.items.map((item) => (
            <li key={item.id} className={`shopping-item ${item.purchased ? 'shopping-item-done' : ''}`}>
              <button
                className={`payment-check ${item.purchased ? 'payment-check-done' : ''}`}
                onClick={() => onUpdate(category.id, item.id, { purchased: !item.purchased })}
                aria-label={item.purchased ? 'Mark not purchased' : 'Mark purchased'}
              >
                {item.purchased && <Check size={12} />}
              </button>
              <span className="shopping-item-name">{item.name}</span>
              <input
                type="number"
                min="1"
                className="shopping-mini-input"
                defaultValue={item.quantity}
                onBlur={(e) => onUpdate(category.id, item.id, { quantity: Number(e.target.value) || 1 })}
                aria-label={`Quantity for ${item.name}`}
                title="Quantity"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                className="shopping-mini-input"
                defaultValue={item.estimatedCost}
                onBlur={(e) => onUpdate(category.id, item.id, { estimatedCost: Number(e.target.value) || 0 })}
                aria-label={`Estimated cost for ${item.name}`}
                title="Est. cost each"
              />
              <input
                className="shopping-assignee-input"
                placeholder="Assigned to"
                defaultValue={item.assignedTo}
                onBlur={(e) => onUpdate(category.id, item.id, { assignedTo: e.target.value })}
                aria-label={`Assigned to for ${item.name}`}
              />
              <button className="icon-btn-danger" onClick={() => onDelete(category.id, item.id)} aria-label={`Remove ${item.name}`}>
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="req-add-form">
        <input
          placeholder={`Add to ${category.name.toLowerCase()}...`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost btn-sm"><Plus size={13} /></button>
      </form>
    </div>
  );
}
