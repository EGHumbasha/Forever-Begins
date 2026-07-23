import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatMoney, formatDate } from './dateUtils';

const EMERALD = [11, 61, 46];
const INK = [28, 27, 24];
const MUTED = [122, 116, 104];

function newDoc(title, coupleNames) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(...EMERALD);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, 14, 17);

  const subtitle = coupleNames?.partner1 && coupleNames?.partner2
    ? `${coupleNames.partner1} & ${coupleNames.partner2} — Forever Begins`
    : 'Forever Begins';
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, pageWidth - 14, 17, { align: 'right' });

  doc.setTextColor(...INK);
  return doc;
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`Generated ${formatDate(new Date().toISOString().slice(0, 10))}`, 14, pageHeight - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
  }
}

function tableTheme() {
  return {
    headStyles: { fillColor: EMERALD, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [246, 239, 226] },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 },
  };
}

export function generateBudgetReport(data) {
  const doc = newDoc('Budget Report', data.meta.coupleNames);
  const { categories, payments } = data.budget;
  const currency = data.meta.currency;

  const totalPlanned = categories.reduce((s, c) => s + Number(c.planned), 0);
  const totalSpent = categories.reduce((s, c) => s + Number(c.spent), 0);

  doc.setFontSize(10);
  doc.text(`Total Planned: ${formatMoney(totalPlanned, currency)}`, 14, 36);
  doc.text(`Total Spent: ${formatMoney(totalSpent, currency)}`, 14, 42);
  doc.text(`Remaining: ${formatMoney(totalPlanned - totalSpent, currency)}`, 14, 48);

  autoTable(doc, {
    startY: 56,
    head: [['Category', 'Planned', 'Spent', 'Remaining']],
    body: categories.map((c) => [
      c.name,
      formatMoney(c.planned, currency),
      formatMoney(c.spent, currency),
      formatMoney(c.planned - c.spent, currency),
    ]),
    ...tableTheme(),
  });

  if (payments.length > 0) {
    const finalY = doc.lastAutoTable.finalY || 56;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment History', 14, finalY + 12);
    autoTable(doc, {
      startY: finalY + 16,
      head: [['Date', 'Category', 'Description', 'Amount']],
      body: [...payments]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((p) => {
          const cat = categories.find((c) => c.id === p.categoryId);
          return [formatDate(p.date), cat?.name || '—', p.description || '—', formatMoney(p.amount, currency)];
        }),
      ...tableTheme(),
    });
  }

  addFooter(doc);
  return doc;
}

export function generateGuestReport(data) {
  const doc = newDoc('Guest List Report', data.meta.coupleNames);
  const { guests } = data;
  const confirmed = guests.filter((g) => g.rsvp === 'confirmed');
  const totalHeadcount = confirmed.reduce((s, g) => s + Number(g.partySize || 1), 0);

  doc.setFontSize(10);
  doc.text(`Total Invited: ${guests.length}`, 14, 36);
  doc.text(`Confirmed: ${confirmed.length} (${totalHeadcount} headcount)`, 14, 42);
  doc.text(`Pending: ${guests.filter((g) => g.rsvp === 'pending').length}`, 14, 48);

  autoTable(doc, {
    startY: 56,
    head: [['Name', 'Side', 'Party Size', 'RSVP', 'Table']],
    body: guests.map((g) => [g.name, g.side, g.partySize, g.rsvp, g.table || '—']),
    ...tableTheme(),
  });

  addFooter(doc);
  return doc;
}

export function generateLobolaReport(data) {
  const doc = newDoc('Lobola Requirements Report', data.meta.coupleNames);
  const { requirements, brideFamily, groomFamily } = data.lobola;
  const currency = data.meta.currency;

  let y = 36;
  doc.setFontSize(10);
  doc.text(`Bride's Family Contacts: ${brideFamily.length}`, 14, y);
  doc.text(`Groom's Family Contacts: ${groomFamily.length}`, 14, y + 6);
  y += 16;

  const groups = [
    { key: 'cash', label: 'Cash Payments', hasAmount: true },
    { key: 'cattle', label: 'Cattle', hasAmount: false },
    { key: 'groceries', label: 'Groceries', hasAmount: false },
    { key: 'clothing', label: 'Clothing', hasAmount: false },
    { key: 'giftsForRelatives', label: 'Gifts for Relatives', hasAmount: true },
    { key: 'transport', label: 'Transport', hasAmount: true },
  ];

  groups.forEach((g) => {
    const items = requirements[g.key] || [];
    if (items.length === 0) return;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(g.label, 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: g.hasAmount ? [['Item', 'Amount', 'Status']] : [['Item', 'Quantity', 'Status']],
      body: items.map((i) => [
        i.item,
        g.hasAmount ? formatMoney(i.amount, currency) : i.quantity || 1,
        i.status,
      ]),
      ...tableTheme(),
    });
    y = (doc.lastAutoTable.finalY || y) + 12;
  });

  addFooter(doc);
  return doc;
}

export function generateVendorReport(data) {
  const doc = newDoc('Vendor Report', data.meta.coupleNames);
  const { vendors } = data;
  const currency = data.meta.currency;

  const totalContracted = vendors.reduce((s, v) => s + Number(v.totalCost), 0);
  const totalDeposits = vendors.reduce((s, v) => s + Number(v.deposit), 0);

  doc.setFontSize(10);
  doc.text(`Total Vendors: ${vendors.length}`, 14, 36);
  doc.text(`Total Contracted: ${formatMoney(totalContracted, currency)}`, 14, 42);
  doc.text(`Total Deposits Paid: ${formatMoney(totalDeposits, currency)}`, 14, 48);

  autoTable(doc, {
    startY: 56,
    head: [['Vendor', 'Category', 'Status', 'Total', 'Deposit', 'Balance', 'Contract']],
    body: vendors.map((v) => [
      v.name,
      v.category,
      v.status,
      formatMoney(v.totalCost, currency),
      formatMoney(v.deposit, currency),
      formatMoney(v.totalCost - v.deposit, currency),
      v.contractSigned ? 'Signed' : 'No',
    ]),
    ...tableTheme(),
  });

  addFooter(doc);
  return doc;
}

export function downloadPdf(doc, filename) {
  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
