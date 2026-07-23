import { useState } from 'react';
import Modal from '../common/Modal';

export default function FamilyMemberModal({ side, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', role: '', phone: '', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <Modal title={`Add ${side === 'bride' ? "Bride's" : "Groom's"} Family Member`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="span-2">
          <label htmlFor="name">Full name</label>
          <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
        </div>
        <div>
          <label htmlFor="role">Role / relation</label>
          <input
            id="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="e.g. Munyai, Tete, Sekuru"
          />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="span-2">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary span-2">Add Member</button>
      </form>
    </Modal>
  );
}
