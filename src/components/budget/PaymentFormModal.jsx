import { useState } from 'react';
import Modal from '../common/Modal';

export default function PaymentFormModal({ categories, onSave, onClose }) {
  const [form, setForm] = useState({
    categoryId: categories[0]?.id || '',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.categoryId) return;
    onSave({ ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <Modal title="Log a Payment" onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="span-2">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="span-2">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. Deposit to venue"
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary span-2" style={{ marginTop: 'var(--space-2)' }}>
          Log Payment
        </button>
      </form>
    </Modal>
  );
}
