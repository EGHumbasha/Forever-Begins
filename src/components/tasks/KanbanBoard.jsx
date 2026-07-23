import { useState } from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import './KanbanBoard.css';

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

export default function KanbanBoard({ tasks, onStatusChange, onEdit, onDelete }) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) onStatusChange(taskId, status);
    setDragOverCol(null);
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            className={`kanban-column ${dragOverCol === col.key ? 'kanban-column-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, col.key)}
          >
            <div className="kanban-column-header">
              <span>{col.label}</span>
              <span className="kanban-count">{colTasks.length}</span>
            </div>
            <div className="kanban-cards">
              {colTasks.length === 0 && (
                <p className="kanban-empty">No tasks here</p>
              )}
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  className="kanban-card"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                >
                  <div className="kanban-card-top">
                    <span className={`priority-pill priority-pill-${task.priority}`}>{task.priority}</span>
                    <span className="kanban-card-cat">{task.category}</span>
                  </div>
                  <p className="kanban-card-title">{task.title}</p>
                  {task.dueDate && (
                    <p className={`kanban-card-date ${isOverdue(task.dueDate, task.status) ? 'kanban-card-overdue' : ''}`}>
                      <Calendar size={12} /> {formatDate(task.dueDate)}
                    </p>
                  )}
                  <div className="kanban-card-actions">
                    <button onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
