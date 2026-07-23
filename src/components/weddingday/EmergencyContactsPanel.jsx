import { useState } from 'react';
import { Plus, Trash2, Phone } from 'lucide-react';

export default function EmergencyContactsPanel({ contacts, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState({ name: '', role: '', phone: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    onAdd(form);
    setForm({ name: '', role: '', phone: '' });
  };

  return (
    <div className="card">
      <div className="card-header-row">
        <h3>Emergency Contacts</h3>
      </div>
      <p className="page-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
        Key people to reach quickly on the day — coordinators, vendors, and family points of contact.
      </p>

      {contacts.length === 0 ? (
        <p className="empty-hint">No emergency contacts added yet.</p>
      ) : (
        <ul className="contact-list">
          {contacts.map((c) => (
            <li key={c.id} className="contact-item">
              <input
                className="contact-field contact-field-name"
                placeholder="Name"
                defaultValue={c.name}
                onBlur={(e) => onUpdate(c.id, { name: e.target.value })}
              />
              <input
                className="contact-field"
                placeholder="Role"
                defaultValue={c.role}
                onBlur={(e) => onUpdate(c.id, { role: e.target.value })}
              />
              <span className="contact-phone-wrap">
                <Phone size={12} />
                <input
                  className="contact-field"
                  placeholder="Phone"
                  defaultValue={c.phone}
                  onBlur={(e) => onUpdate(c.id, { phone: e.target.value })}
                />
              </span>
              <button className="icon-btn-danger" onClick={() => onDelete(c.id)} aria-label={`Remove ${c.name}`}>
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="contact-add-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Role (e.g. Coordinator, Venue manager)"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button type="submit" className="btn btn-ghost btn-sm"><Plus size={14} /></button>
      </form>
    </div>
  );
}
