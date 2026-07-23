import { useState } from 'react';
import Modal from '../common/Modal';

export default function GuestFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: '', phone: '', side: 'both', partySize: 1, rsvp: 'pending', table: '', notes: '' }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, partySize: Number(form.partySize) || 1 });
    onClose();
  };

  return (
    <Modal title={initial ? 'Edit Guest' : 'Add Guest'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="span-2">
          <label htmlFor="gname">Name</label>
          <input id="gname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
        </div>
        <div>
          <label htmlFor="gphone">Phone</label>
          <input id="gphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label htmlFor="gside">Side</label>
          <select id="gside" value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value })}>
            <option value="bride">Bride's side</option>
            <option value="groom">Groom's side</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div>
          <label htmlFor="gparty">Party size</label>
          <input
            id="gparty"
            type="number"
            min="1"
            value={form.partySize}
            onChange={(e) => setForm({ ...form, partySize: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="grsvp">RSVP</label>
          <select id="grsvp" value={form.rsvp} onChange={(e) => setForm({ ...form, rsvp: e.target.value })}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <div className="span-2">
          <label htmlFor="gtable">Table assignment</label>
          <input id="gtable" value={form.table} onChange={(e) => setForm({ ...form, table: e.target.value })} placeholder="e.g. Table 4" />
        </div>
        <button type="submit" className="btn btn-primary span-2">{initial ? 'Save Changes' : 'Add Guest'}</button>
      </form>
    </Modal>
  );
}
