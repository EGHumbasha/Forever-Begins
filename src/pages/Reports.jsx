import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ReportCard from '../components/reports/ReportCard';
import { downloadCsv } from '../utils/csvExport';
import { CSV_COLUMNS, buildBudgetRows, buildPaymentRows, buildVendorRows } from '../utils/csvColumns';
import './Reports.css';

export default function Reports() {
  const { data } = useApp();
  const [generating, setGenerating] = useState(null);

  const withPdfModule = async (key, fn) => {
    setGenerating(key);
    try {
      const mod = await import('../utils/pdfReports');
      fn(mod);
    } finally {
      setGenerating(null);
    }
  };

  const handleBudgetPdf = () =>
    withPdfModule('budget', (m) => m.downloadPdf(m.generateBudgetReport(data), 'budget-report'));
  const handleBudgetCsv = () =>
    downloadCsv('budget-categories', buildBudgetRows(data.budget.categories), CSV_COLUMNS.budget);
  const handlePaymentsCsv = () =>
    downloadCsv('payment-history', buildPaymentRows(data.budget.payments, data.budget.categories), CSV_COLUMNS.payments);

  const handleGuestPdf = () =>
    withPdfModule('guests', (m) => m.downloadPdf(m.generateGuestReport(data), 'guest-list-report'));
  const handleGuestCsv = () => downloadCsv('guest-list', data.guests, CSV_COLUMNS.guests);

  const handleLobolaPdf = () =>
    withPdfModule('lobola', (m) => m.downloadPdf(m.generateLobolaReport(data), 'lobola-requirements-report'));

  const handleVendorPdf = () =>
    withPdfModule('vendors', (m) => m.downloadPdf(m.generateVendorReport(data), 'vendor-report'));
  const handleVendorCsv = () => downloadCsv('vendors', buildVendorRows(data.vendors), CSV_COLUMNS.vendors);

  const handleTasksCsv = () => downloadCsv('tasks', data.tasks, CSV_COLUMNS.tasks);

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">Reports</p>
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">
          Export your data as polished PDF reports or raw CSV spreadsheets — for sharing with family,
          vendors, or just keeping an offline copy.
        </p>
      </div>

      <div className="reports-grid">
        <ReportCard
          title="Budget Report"
          description="Category breakdown, totals, and full payment history."
          count={`${data.budget.categories.length} categories · ${data.budget.payments.length} payments logged`}
          onExportPdf={handleBudgetPdf}
          onExportCsv={handleBudgetCsv}
          pdfLoading={generating === 'budget'}
        />
        <ReportCard
          title="Payment History"
          description="Every logged payment as a flat spreadsheet."
          count={`${data.budget.payments.length} payments`}
          onExportCsv={handlePaymentsCsv}
        />
        <ReportCard
          title="Guest List Report"
          description="Full guest list with RSVP status, party size, and table assignments."
          count={`${data.guests.length} guests invited`}
          onExportPdf={handleGuestPdf}
          onExportCsv={handleGuestCsv}
          pdfLoading={generating === 'guests'}
        />
        <ReportCard
          title="Lobola Requirements Report"
          description="Cash, cattle, groceries, clothing, gifts, and transport — all in one document."
          count={`${data.lobola.brideFamily.length + data.lobola.groomFamily.length} family contacts on file`}
          onExportPdf={handleLobolaPdf}
          pdfLoading={generating === 'lobola'}
        />
        <ReportCard
          title="Vendor Report"
          description="Every vendor with contract status, costs, and balances."
          count={`${data.vendors.length} vendors`}
          onExportPdf={handleVendorPdf}
          onExportCsv={handleVendorCsv}
          pdfLoading={generating === 'vendors'}
        />
        <ReportCard
          title="Task List"
          description="All tasks as a spreadsheet — useful for sharing a checklist with family helping out."
          count={`${data.tasks.length} tasks`}
          onExportCsv={handleTasksCsv}
        />
      </div>
    </div>
  );
}
