import { useState } from 'react';
import { Plus, Trash2, Phone, Car } from 'lucide-react';

export default function TransportPanel({ transport, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    vehicle: '', driver: '', driverPhone: '', pickupTime: '', pickupLocation: '', dropoffLocation: '', passengers: '',
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.vehicle.trim()) return;
    onAdd(form);
    setForm({ vehicle: '', driver: '', driverPhone: '', pickupTime: '', pickupLocation: '', dropoffLocation: '', passengers: '' });
    setShowForm(false);
  };

  return (
    <div className="card">
      <div className="card-header-row">
        <h3>Transport Schedule</h3>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowForm((s) => !s)}>
          <Plus size={13} /> Add Vehicle
        </button>
      </div>

      {transport.length === 0 && !showForm ? (
        <p className="empty-hint">No transport arranged yet.</p>
      ) : (
        <div className="transport-grid">
          {transport.map((t) => (
            <div key={t.id} className="transport-card">
              <div className="transport-card-top">
                <span className="transport-vehicle"><Car size={13} /> {t.vehicle}</span>
                <button className="icon-btn-danger" onClick={() => onDelete(t.id)} aria-label={`Remove ${t.vehicle}`}>
                  <Trash2 size={13} />
                </button>
              </div>
              <input
                className="transport-field"
                placeholder="Driver name"
                defaultValue={t.driver}
                onBlur={(e) => onUpdate(t.id, { driver: e.target.value })}
              />
              <input
                className="transport-field"
                placeholder="Driver phone"
                defaultValue={t.driverPhone}
                onBlur={(e) => onUpdate(t.id, { driverPhone: e.target.value })}
              />
              <div className="transport-field-row">
                <input
                  className="transport-field"
                  placeholder="Pickup time"
                  defaultValue={t.pickupTime}
                  onBlur={(e) => onUpdate(t.id, { pickupTime: e.target.value })}
                />
                <input
                  className="transport-field"
                  placeholder="Passengers"
                  defaultValue={t.passengers}
                  onBlur={(e) => onUpdate(t.id, { passengers: e.target.value })}
                />
              </div>
              <input
                className="transport-field"
                placeholder="Pickup location"
                defaultValue={t.pickupLocation}
                onBlur={(e) => onUpdate(t.id, { pickupLocation: e.target.value })}
              />
              <input
                className="transport-field"
                placeholder="Drop-off location"
                defaultValue={t.dropoffLocation}
                onBlur={(e) => onUpdate(t.id, { dropoffLocation: e.target.value })}
              />
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="transport-new-form">
          <input
            placeholder="Vehicle (e.g. Bridal car, Family car 1)"
            value={form.vehicle}
            onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-sm">Add</button>
        </form>
      )}
    </div>
  );
}
