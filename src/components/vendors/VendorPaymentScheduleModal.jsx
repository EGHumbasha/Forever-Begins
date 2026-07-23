import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import Modal from '../common/Modal';
import { formatMoney, formatDate } from '../../utils/dateUtils';

export default function VendorPaymentScheduleModal({ vendor, currency, onAdd, onUpdate, onDelete, onClose }) {
  const [form, setForm] = useState({ label: '', amount: '', dueDate: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.amount) return;
    onAdd(vendor.id, { label: form.label.trim(), amount: Number(form.amount), dueDate: form.dueDate, paid: false });
    setForm({ label: '', amount: '', dueDate: '' });
  };

  const totalScheduled = vendor.paymentSchedule.reduce((s, p) => s + Number(p.amount), 0);
  const totalPaid = vendor.paymentSchedule.filter((p) => p.paid).reduce((s, p) => s + Number(p.amount), 0);
  const remainingOnContract = vendor.totalCost - (vendor.deposit + totalPaid);

  return (
    <Modal title={`Payment Schedule — ${vendor.name}`} onClose={onClose} wide>
      <div className="vendor-cost-summary">
        <div>
          <p className="summary-label">Contract Total</p>
          <p className="summary-value">{formatMoney(vendor.totalCost, currency)}</p>
        </div>
        <div>
          <p className="summary-label">Deposit Paid</p>
          <p className="summary-value">{formatMoney(vendor.deposit, currency)}</p>
        </div>
        <div>
          <p className="summary-label">Scheduled Payments</p>
          <p className="summary-value">{formatMoney(totalScheduled, currency)}</p>
        </div>
        <div>
          <p className="summary-label">Balance Remaining</p>
          <p className={`summary-value ${remainingOnContract < 0 ? 'budget-over-text' : ''}`}>
            {formatMoney(Math.max(0, remainingOnContract), currency)}
          </p>
        </div>
      </div>

      {vendor.paymentSchedule.length === 0 ? (
        <p className="empty-hint">No scheduled payments yet — add installments below.</p>
      ) : (
        <ul className="payment-schedule-list">
          {vendor.paymentSchedule
            .slice()
            .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
            .map((p) => (
              <li key={p.id} className={`payment-schedule-item ${p.paid ? 'payment-schedule-paid' : ''}`}>
                <button
                  className={`payment-check ${p.paid ? 'payment-check-done' : ''}`}
                  onClick={() => onUpdate(vendor.id, p.id, { paid: !p.paid })}
                  aria-label={p.paid ? 'Mark unpaid' : 'Mark paid'}
                >
                  {p.paid && <Check size={12} />}
                </button>
                <div className="payment-schedule-info">
                  <p className="payment-desc">{p.label}</p>
                  <p className="payment-meta">{p.dueDate ? formatDate(p.dueDate) : 'No date set'}</p>
                </div>
                <span className="payment-amount">{formatMoney(p.amount, currency)}</span>
                <button className="icon-btn-danger" onClick={() => onDelete(vendor.id, p.id)} aria-label="Remove installment">
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="payment-schedule-form">
        <input
          placeholder="e.g. Final balance"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <button type="submit" className="btn btn-ghost btn-sm"><Plus size={14} /> Add</button>
      </form>
    </Modal>
  );
}
