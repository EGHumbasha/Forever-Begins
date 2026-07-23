import { useMemo } from 'react';
import { Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../utils/dateUtils';
import ShoppingCategoryPanel from '../components/shopping/ShoppingCategoryPanel';
import { downloadAsText } from '../utils/exportUtils';
import './ShoppingLists.css';

export default function ShoppingLists() {
  const { data, addShoppingItem, updateShoppingItem, deleteShoppingItem, addShoppingItemsBulk } = useApp();
  const { categories } = data.shoppingLists;
  const currency = data.meta.currency;

  const totals = useMemo(() => {
    let totalItems = 0;
    let purchasedItems = 0;
    let totalEstimate = 0;
    categories.forEach((c) => {
      totalItems += c.items.length;
      purchasedItems += c.items.filter((i) => i.purchased).length;
      totalEstimate += c.items.reduce((s, i) => s + Number(i.estimatedCost) * Number(i.quantity || 1), 0);
    });
    return { totalItems, purchasedItems, totalEstimate };
  }, [categories]);

  const handleExportAll = () => {
    const lines = [];
    categories.forEach((c) => {
      if (c.items.length === 0) return;
      lines.push(`${c.name.toUpperCase()}`);
      c.items.forEach((i) => {
        lines.push(
          `${i.purchased ? '[x]' : '[ ]'} ${i.name} — qty ${i.quantity} — ${formatMoney(i.estimatedCost, currency)} each${i.assignedTo ? ` — assigned to ${i.assignedTo}` : ''}`
        );
      });
      lines.push('');
    });
    downloadAsText('shopping-lists', lines.join('\n'));
  };

  return (
    <div className="page-container">
      <div className="page-header tasks-header">
        <div>
          <p className="page-eyebrow">Shopping Lists</p>
          <h1 className="page-title">Shopping Lists</h1>
          <p className="page-subtitle">Food, drinks, decorations, gifts, and traditional items — all tracked in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={handleExportAll}>
          <Download size={16} /> Export All
        </button>
      </div>

      <div className="guest-summary-row">
        <div className="card guest-summary-card">
          <p className="summary-value">{totals.totalItems}</p>
          <p className="summary-label">Total Items</p>
        </div>
        <div className="card guest-summary-card">
          <p className="summary-value">{totals.purchasedItems}</p>
          <p className="summary-label">Purchased</p>
        </div>
        <div className="card guest-summary-card">
          <p className="summary-value">{totals.totalItems - totals.purchasedItems}</p>
          <p className="summary-label">Remaining</p>
        </div>
        <div className="card guest-summary-card">
          <p className="summary-value">{formatMoney(totals.totalEstimate, currency)}</p>
          <p className="summary-label">Estimated Total</p>
        </div>
      </div>

      <div className="shopping-grid">
        {categories.map((c) => (
          <ShoppingCategoryPanel
            key={c.id}
            category={c}
            currency={currency}
            onAdd={addShoppingItem}
            onUpdate={updateShoppingItem}
            onDelete={deleteShoppingItem}
            onBulkAdd={addShoppingItemsBulk}
          />
        ))}
      </div>
    </div>
  );
}
