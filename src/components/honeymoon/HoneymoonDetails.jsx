import { useState } from 'react';
import { formatMoney } from '../../utils/dateUtils';

const DESTINATION_IDEAS = [
  { name: 'Victoria Falls, Zimbabwe', note: 'Close to home, world-famous views, luxury lodges available' },
  { name: 'Cape Town, South Africa', note: 'Wine country, beaches, and city all in one trip' },
  { name: 'Zanzibar, Tanzania', note: 'Classic beach honeymoon, short flight from the region' },
  { name: 'Mauritius', note: 'Resort-focused, popular for honeymoon packages' },
  { name: 'Bali, Indonesia', note: 'Longer-haul, very popular honeymoon destination globally' },
  { name: 'Seychelles', note: 'Premium beach destination, very private' },
];

export default function HoneymoonDetails({ honeymoon, currency, onUpdate }) {
  const [form, setForm] = useState({
    destination: honeymoon.destination,
    startDate: honeymoon.startDate,
    endDate: honeymoon.endDate,
    budget: honeymoon.budget,
    notes: honeymoon.notes,
  });

  const handleBlurSave = () => {
    onUpdate({ ...form, budget: Number(form.budget) || 0 });
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: 'var(--space-4)' }}>Trip Details</h3>
      <div className="form-grid" onBlur={handleBlurSave}>
        <div className="span-2">
          <label htmlFor="hm-dest">Destination</label>
          <input
            id="hm-dest"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            placeholder="Where are you headed?"
          />
        </div>
        <div>
          <label htmlFor="hm-start">Start date</label>
          <input
            id="hm-start"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="hm-end">End date</label>
          <input
            id="hm-end"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>
        <div className="span-2">
          <label htmlFor="hm-budget">Budget ({currency})</label>
          <input
            id="hm-budget"
            type="number"
            min="0"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />
        </div>
        <div className="span-2">
          <label htmlFor="hm-notes">Notes</label>
          <textarea
            id="hm-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Booking references, ideas, anything to remember"
          />
        </div>
      </div>

      <div className="honeymoon-ideas">
        <h4 style={{ marginBottom: 'var(--space-3)' }}>Destination Ideas</h4>
        <div className="honeymoon-idea-grid">
          {DESTINATION_IDEAS.map((d) => (
            <button
              key={d.name}
              className="honeymoon-idea-card"
              onClick={() => {
                const updated = { ...form, destination: d.name };
                setForm(updated);
                onUpdate({ ...updated, budget: Number(updated.budget) || 0 });
              }}
            >
              <p className="honeymoon-idea-name">{d.name}</p>
              <p className="honeymoon-idea-note">{d.note}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
