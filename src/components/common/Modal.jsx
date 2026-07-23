import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export default function Modal({ title, children, onClose, hideCloseButton = false, wide = false }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && !hideCloseButton) onClose();
    };
    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, hideCloseButton]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && !hideCloseButton) onClose(); }}>
      <div
        className={`modal-box ${wide ? 'modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          {!hideCloseButton && (
            <button className="modal-close" onClick={onClose} aria-label="Close dialog">
              <X size={20} />
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
