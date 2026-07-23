import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, isOverdue } from '../utils/dateUtils';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskFormModal from '../components/tasks/TaskFormModal';
import './Tasks.css';

const CATEGORY_LABELS = {
  lobola: 'Lobola',
  wedding: 'Wedding',
  finance: 'Finance',
  guests: 'Guests',
  vendor: 'Vendors',
  other: 'Other',
};

export default function Tasks() {
  const { data, addTask, updateTask, deleteTask } = useApp();
  const [view, setView] = useState('board');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return data.tasks;
    return data.tasks.filter((t) => t.category === filter);
  }, [data.tasks, filter]);

  const handleSave = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setEditingTask(null);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this task?')) deleteTask(id);
  };

  return (
    <div className="page-container">
      <div className="page-header tasks-header">
        <div>
          <p className="page-eyebrow">Task Manager</p>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Daily, weekly, and milestone tasks across lobola and wedding planning.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingTask(null); setShowForm(true); }}>
          <Plus size={16} /> Add Task
        </button>
      </div>

      <div className="tasks-toolbar">
        <div className="filter-pills">
          <button className={`filter-pill ${filter === 'all' ? 'filter-pill-active' : ''}`} onClick={() => setFilter('all')}>
            All
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`filter-pill ${filter === key ? 'filter-pill-active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="view-toggle">
          <button className={view === 'board' ? 'active' : ''} onClick={() => setView('board')} aria-label="Board view">
            <LayoutGrid size={16} />
          </button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="List view">
            <ListIcon size={16} />
          </button>
        </div>
      </div>

      {view === 'board' ? (
        <KanbanBoard
          tasks={filtered}
          onStatusChange={(id, status) => updateTask(id, { status })}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="card task-list-card">
          {filtered.length === 0 ? (
            <p className="empty-hint">No tasks in this category yet.</p>
          ) : (
            <table className="task-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Task</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Due</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className={t.status === 'done' ? 'task-row-done' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={t.status === 'done'}
                        onChange={(e) => updateTask(t.id, { status: e.target.checked ? 'done' : 'todo' })}
                        aria-label={`Mark ${t.title} complete`}
                      />
                    </td>
                    <td>{t.title}</td>
                    <td className="task-table-cat">{CATEGORY_LABELS[t.category] || t.category}</td>
                    <td><span className={`priority-pill priority-pill-${t.priority}`}>{t.priority}</span></td>
                    <td className={isOverdue(t.dueDate, t.status) ? 'kanban-card-overdue' : ''}>
                      {formatDate(t.dueDate)}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showForm && (
        <TaskFormModal
          initial={editingTask}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}
