import { useState, useEffect } from 'react';
import { RotateCcw, Download, Printer, Save, Plus, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import { downloadAsText, printDocument } from '../../utils/exportUtils';
import './DocumentEditorModal.css';

export default function DocumentEditorModal({ docType, data, savedDoc, onSave, onClose }) {
  const isList = docType.shape === 'list';
  const initialContent = savedDoc?.content ?? docType.generate(data);
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(false);
  }, [content]);

  const handleRegenerate = () => {
    if (confirm('Regenerate from scratch? This will replace your current edits.')) {
      setContent(docType.generate(data));
    }
  };

  const handleSave = () => {
    onSave(docType.key, docType.label, content);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const asPlainText = () => {
    if (!isList) return content;
    return content
      .map((row) => docType.listFields.map((f) => row[f]).filter(Boolean).join(' — '))
      .join('\n');
  };

  const handleDownload = () => {
    downloadAsText(docType.label.replace(/\s+/g, '-').toLowerCase(), asPlainText());
  };

  const handlePrint = () => {
    printDocument(docType.label, asPlainText().replace(/\n/g, '<br/>'));
  };

  const updateListRow = (index, field, value) => {
    setContent((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addListRow = () => {
    const blankRow = Object.fromEntries(docType.listFields.map((f) => [f, '']));
    setContent((prev) => [...prev, blankRow]);
  };

  const removeListRow = (index) => {
    setContent((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal title={docType.label} onClose={onClose} wide>
      <p className="doc-editor-hint">
        This is a starting draft generated from your details — edit it freely below. Nothing here
        is final until you make it your own.
      </p>

      {isList ? (
        <div className="doc-list-editor">
          {content.map((row, i) => (
            <div key={i} className="doc-list-row">
              <span className="doc-list-index">{i + 1}</span>
              {docType.listFields.map((field) => (
                <input
                  key={field}
                  value={row[field] || ''}
                  placeholder={field}
                  onChange={(e) => updateListRow(i, field, e.target.value)}
                  className={field === 'script' || field === 'item' || field === 'activity' ? 'doc-list-main-field' : 'doc-list-side-field'}
                />
              ))}
              <button
                className="icon-btn-danger doc-list-remove"
                onClick={() => removeListRow(i)}
                aria-label={`Remove row ${i + 1}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={addListRow} style={{ marginTop: 'var(--space-2)' }}>
            <Plus size={14} /> Add Row
          </button>
        </div>
      ) : (
        <textarea
          className="doc-text-editor"
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      )}

      <div className="doc-editor-actions">
        <button className="btn btn-ghost btn-sm" onClick={handleRegenerate}>
          <RotateCcw size={14} /> Regenerate
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleDownload}>
          <Download size={14} /> Download .txt
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handlePrint}>
          <Printer size={14} /> Print / Save as PDF
        </button>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          <Save size={14} /> {saved ? 'Saved' : 'Save Draft'}
        </button>
      </div>
    </Modal>
  );
}
