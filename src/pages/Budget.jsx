import { useState } from 'react';
import { Plus, TrendingUp, PiggyBank } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePlannerStats } from '../hooks/usePlannerStats';
import { formatMoney, formatDate } from '../utils/dateUtils';
import BudgetCategoryRow from '../components/budget/BudgetCategoryRow';
import BudgetChart from '../components/budget/BudgetChart';
import PaymentFormModal from '../components/budget/PaymentFormModal';
import './Budget.css';

export default function Budget() {
  const { data, addBudgetCategory, updateBudgetCategory, deleteBudgetCategory, addPayment, deletePayment, update } = useApp();
  const stats = usePlannerStats();
  const [newCatName, setNewCatName] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const { categories, payments } = data.budget;
  const currency = data.meta.currency;

  const setEmergencyFundTarget = (val) => {
    update((prev) => ({ ...prev, budget: { ...prev.budget, emergencyFundTarget: val } }));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addBudgetCategory({ name: newCatName.trim(), type: 'other', planned: 0, spent: 0 });
    setNewCatName('');
  };

  // Simple savings recommendation: split remaining budget need across days left
  const daysToWedding = stats.weddingDays;
  const remainingNeeded = Math.max(0, stats.totalPlanned - stats.totalSpent);
  const weeklySavingsTarget = daysToWedding && daysToWedding > 0
    ? Math.ceil((remainingNeeded / daysToWedding) * 7)
    : 0;

  return (
    <div className="page-container">
      <div className="page-header tasks-header">
        <div>
          <p className="page-eyebrow">Budget System</p>
          <h1 className="page-title">Budget</h1>
          <p className="page-subtitle">Plan, track, and stay ahead of every cost for lobola and the wedding.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowPaymentForm(true)}>
          <Plus size={16} /> Log Payment
        </button>
      </div>

      <div className="budget-summary-row">
        <div className="card budget-summary-card">
          <p className="summary-label">Total Planned</p>
          <p className="summary-value">{formatMoney(stats.totalPlanned, currency)}</p>
        </div>
        <div className="card budget-summary-card">
          <p className="summary-label">Total Spent</p>
          <p className="summary-value">{formatMoney(stats.totalSpent, currency)}</p>
        </div>
        <div className="card budget-summary-card">
          <p className="summary-label">Remaining</p>
          <p className={`summary-value ${stats.remaining < 0 ? 'budget-over-text' : ''}`}>
            {formatMoney(stats.remaining, currency)}
          </p>
        </div>
        <div className="card budget-summary-card">
          <p className="summary-label">Utilization</p>
          <p className="summary-value">{stats.budgetUtilization}%</p>
        </div>
      </div>

      <div className="budget-columns">
        <div className="card">
          <div className="card-header-row">
            <h3>Categories</h3>
          </div>
          <div className="budget-table-wrap">
            <table className="budget-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Planned</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>Progress</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <BudgetCategoryRow
                    key={c.id}
                    category={c}
                    currency={currency}
                    onUpdate={updateBudgetCategory}
                    onDelete={deleteBudgetCategory}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <form onSubmit={handleAddCategory} className="add-category-form">
            <input
              placeholder="New category name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost btn-sm"><Plus size={14} /> Add</button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Spending Breakdown</h3>
          <BudgetChart categories={categories} currency={currency} />
        </div>
      </div>

      <div className="budget-columns">
        <div className="card">
          <div className="card-header-row">
            <h3>Payment History</h3>
          </div>
          {payments.length === 0 ? (
            <p className="empty-hint">No payments logged yet.</p>
          ) : (
            <ul className="payment-list">
              {[...payments].sort((a, b) => new Date(b.date) - new Date(a.date)).map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                return (
                  <li key={p.id} className="payment-item">
                    <div>
                      <p className="payment-desc">{p.description || cat?.name || 'Payment'}</p>
                      <p className="payment-meta">{cat?.name} · {formatDate(p.date)}</p>
                    </div>
                    <div className="payment-right">
                      <span className="payment-amount">{formatMoney(p.amount, currency)}</span>
                      <button className="icon-btn-danger" onClick={() => deletePayment(p.id)} aria-label="Delete payment">×</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card savings-card">
          <div className="card-header-row">
            <h3><PiggyBank size={16} style={{ verticalAlign: -2, marginRight: 6 }} />Savings Plan</h3>
          </div>
          <p className="savings-line">
            <TrendingUp size={14} /> To cover the remaining <strong>{formatMoney(remainingNeeded, currency)}</strong> before
            your wedding{daysToWedding && daysToWedding > 0 ? ` in ${daysToWedding} days` : ''}, aim to save approximately:
          </p>
          <p className="savings-target">
            {weeklySavingsTarget > 0 ? formatMoney(weeklySavingsTarget, currency) : '—'}
            <span> / week</span>
          </p>
          <div className="emergency-fund-row">
            <label htmlFor="emergencyTarget">Emergency Fund Target</label>
            <input
              id="emergencyTarget"
              type="number"
              min="0"
              defaultValue={data.budget.emergencyFundTarget}
              onBlur={(e) => setEmergencyFundTarget(Number(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {showPaymentForm && (
        <PaymentFormModal
          categories={categories}
          onSave={addPayment}
          onClose={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
}
