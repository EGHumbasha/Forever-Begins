import { useState } from 'react';
import Modal from '../common/Modal';

const CATEGORIES = [
  { value: 'lobola', label: 'Lobola' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'finance', label: 'Finance' },
  { value: 'guests', label: 'Guests' },
  { value: 'vendor', label: 'Vendors' },
  { value: 'other', label: 'Other' },
];

export default function TaskFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || {
      title: '',
      description: '',
      category: 'wedding',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <Modal title={initial ? 'Edit Task' : 'New Task'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="span-2">
          <label htmlFor="title">Task title</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Confirm caterer menu"
            required
            autoFocus
          />
        </div>
        <div className="span-2">
          <label htmlFor="description">Notes (optional)</label>
          <textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Any details worth remembering"
          />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary span-2" style={{ marginTop: 'var(--space-2)' }}>
          {initial ? 'Save Changes' : 'Add Task'}
        </button>
      </form>
    </Modal>
  );
}
