import { FileDown, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function ReportCard({ title, description, count, onExportPdf, onExportCsv, pdfLoading }) {
  return (
    <div className="card report-card">
      <h3 className="report-card-title">{title}</h3>
      <p className="report-card-desc">{description}</p>
      <p className="report-card-count">{count}</p>
      <div className="report-card-actions">
        {onExportPdf && (
          <button className="btn btn-ghost btn-sm" onClick={onExportPdf} disabled={pdfLoading}>
            {pdfLoading ? <Loader2 size={14} className="spin" /> : <FileDown size={14} />} PDF
          </button>
        )}
        {onExportCsv && (
          <button className="btn btn-ghost btn-sm" onClick={onExportCsv}>
            <FileSpreadsheet size={14} /> CSV
          </button>
        )}
      </div>
    </div>
  );
}
