import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';

export default function OnboardingModal({ onClose }) {
  const { data, updateMeta } = useApp();
  const [form, setForm] = useState({
    partner1: data.meta.coupleNames.partner1 || '',
    partner2: data.meta.coupleNames.partner2 || '',
    lobolaDate: data.meta.lobolaDate || '',
    weddingDate: data.meta.weddingDate || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMeta({
      coupleNames: { partner1: form.partner1, partner2: form.partner2 },
      lobolaDate: form.lobolaDate,
      weddingDate: form.weddingDate,
      onboarded: true,
    });
    onClose();
  };

  return (
    <Modal title="Welcome — let's set things up" onClose={onClose} hideCloseButton>
      <p className="modal-intro">
        A few details to personalise your planner. You can change these any time from the Dashboard.
      </p>
      <form onSubmit={handleSubmit} className="form-grid">
        <div>
          <label htmlFor="partner1">Your name</label>
          <input
            id="partner1"
            value={form.partner1}
            onChange={(e) => setForm({ ...form, partner1: e.target.value })}
            placeholder="e.g. Rashford"
            required
          />
        </div>
        <div>
          <label htmlFor="partner2">Partner's name</label>
          <input
            id="partner2"
            value={form.partner2}
            onChange={(e) => setForm({ ...form, partner2: e.target.value })}
            placeholder="e.g. Tanaka"
            required
          />
        </div>
        <div>
          <label htmlFor="lobolaDate">Lobola date</label>
          <input
            id="lobolaDate"
            type="date"
            value={form.lobolaDate}
            onChange={(e) => setForm({ ...form, lobolaDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="weddingDate">Wedding date</label>
          <input
            id="weddingDate"
            type="date"
            value={form.weddingDate}
            onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-2)' }}>
          Start Planning
        </button>
      </form>
    </Modal>
  );
}
