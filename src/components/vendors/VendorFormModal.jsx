import { useState } from 'react';
import Modal from '../common/Modal';

const STATUS_OPTIONS = [
  { value: 'considering', label: 'Considering' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'booked', label: 'Booked' },
  { value: 'paid', label: 'Paid in Full' },
  { value: 'completed', label: 'Completed' },
];

export default function VendorFormModal({ initial, categories, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || {
      name: '',
      category: categories[0] || 'Other',
      phone: '',
      email: '',
      status: 'considering',
      rating: 0,
      contractSigned: false,
      totalCost: 0,
      deposit: 0,
      notes: '',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      totalCost: Number(form.totalCost) || 0,
      deposit: Number(form.deposit) || 0,
      rating: Number(form.rating) || 0,
    });
    onClose();
  };

  return (
    <Modal title={initial ? 'Edit Vendor' : 'Add Vendor'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="span-2">
          <label htmlFor="vname">Vendor / business name</label>
          <input id="vname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
        </div>
        <div>
          <label htmlFor="vcategory">Category</label>
          <select id="vcategory" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="vstatus">Status</label>
          <select id="vstatus" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="vphone">Phone</label>
          <input id="vphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label htmlFor="vemail">Email</label>
          <input id="vemail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label htmlFor="vtotal">Total cost</label>
          <input
            id="vtotal"
            type="number"
            min="0"
            step="0.01"
            value={form.totalCost}
            onChange={(e) => setForm({ ...form, totalCost: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="vdeposit">Deposit paid</label>
          <input
            id="vdeposit"
            type="number"
            min="0"
            step="0.01"
            value={form.deposit}
            onChange={(e) => setForm({ ...form, deposit: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="vrating">Rating (0–5)</label>
          <input
            id="vrating"
            type="number"
            min="0"
            max="5"
            step="1"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          />
        </div>
        <div className="vendor-checkbox-field">
          <label htmlFor="vcontract" style={{ marginBottom: 0 }}>Contract signed</label>
          <input
            id="vcontract"
            type="checkbox"
            style={{ width: 'auto' }}
            checked={form.contractSigned}
            onChange={(e) => setForm({ ...form, contractSigned: e.target.checked })}
          />
        </div>
        <div className="span-2">
          <label htmlFor="vnotes">Notes</label>
          <textarea
            id="vnotes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Quotes received, what was discussed, anything to remember"
          />
        </div>
        <button type="submit" className="btn btn-primary span-2">{initial ? 'Save Changes' : 'Add Vendor'}</button>
      </form>
    </Modal>
  );
}
