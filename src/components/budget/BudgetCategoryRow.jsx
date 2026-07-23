import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { formatMoney } from '../../utils/dateUtils';

export default function BudgetCategoryRow({ category, currency, onUpdate, onDelete }) {
  const [planned, setPlanned] = useState(category.planned);
  const [spent, setSpent] = useState(category.spent);

  const pct = category.planned > 0 ? Math.min(100, Math.round((category.spent / category.planned) * 100)) : 0;
  const isOver = category.spent > category.planned && category.planned > 0;

  const commit = (field, value) => {
    const num = Number(value) || 0;
    onUpdate(category.id, { [field]: num });
  };

  return (
    <tr>
      <td className="budget-cat-name">{category.name}</td>
      <td>
        <input
          type="number"
          min="0"
          step="0.01"
          value={planned}
          onChange={(e) => setPlanned(e.target.value)}
          onBlur={(e) => commit('planned', e.target.value)}
          className="budget-input"
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          step="0.01"
          value={spent}
          onChange={(e) => setSpent(e.target.value)}
          onBlur={(e) => commit('spent', e.target.value)}
          className="budget-input"
        />
      </td>
      <td className={isOver ? 'budget-over-text' : ''}>
        {formatMoney(category.planned - category.spent, currency)}
      </td>
      <td>
        <div className="budget-mini-track">
          <div
            className="budget-mini-fill"
            style={{ width: `${pct}%`, background: isOver ? 'var(--color-danger)' : 'var(--color-gold)' }}
          />
        </div>
      </td>
      <td>
        <button className="icon-btn-danger" onClick={() => onDelete(category.id)} aria-label={`Delete ${category.name}`}>
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
