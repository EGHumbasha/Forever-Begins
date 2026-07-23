import { useState } from 'react';
import { FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DOCUMENT_TYPES, DOCUMENT_SECTIONS } from '../utils/documentRegistry';
import DocumentEditorModal from '../components/documents/DocumentEditorModal';
import './Documents.css';

export default function Documents() {
  const { data, saveDocument } = useApp();
  const [openType, setOpenType] = useState(null);

  const findSavedDoc = (key) => data.documents.find((d) => d.typeKey === key);

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">Document Generator</p>
        <h1 className="page-title">Documents</h1>
        <p className="page-subtitle">
          Invitations, programs, scripts, speeches, vows, and prayers — generated from your details and
          ready to edit and export.
        </p>
      </div>

      {DOCUMENT_SECTIONS.map((section) => {
        const docsInSection = DOCUMENT_TYPES.filter((d) => d.section === section);
        return (
          <div key={section} className="doc-section">
            <h3 className="doc-section-title">{section}</h3>
            <div className="doc-grid">
              {docsInSection.map((docType) => {
                const saved = findSavedDoc(docType.key);
                return (
                  <button key={docType.key} className="doc-tile" onClick={() => setOpenType(docType)}>
                    <div className="doc-tile-icon">
                      <FileText size={18} />
                    </div>
                    <div className="doc-tile-text">
                      <p className="doc-tile-label">{docType.label}</p>
                      <p className="doc-tile-status">
                        {saved ? (
                          <span className="doc-tile-saved"><CheckCircle2 size={12} /> Draft saved</span>
                        ) : (
                          'Not started'
                        )}
                      </p>
                    </div>
                    <ChevronRight size={16} className="doc-tile-chevron" />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {openType && (
        <DocumentEditorModal
          docType={openType}
          data={data}
          savedDoc={findSavedDoc(openType.key)}
          onSave={saveDocument}
          onClose={() => setOpenType(null)}
        />
      )}
    </div>
  );
}
