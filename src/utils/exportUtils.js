/**
 * Browser-side export helpers. This is a static, client-only app (no
 * server), so "export to Word/PDF" here means: a clean .txt download
 * (works everywhere, opens in Word/Docs instantly) and a print-formatted
 * view that uses the browser's native print-to-PDF, rather than pulling
 * in a heavy client-side PDF/DOCX generation library for content that's
 * fundamentally just formatted text.
 */

export function downloadAsText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printDocument(title, content) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Please allow pop-ups to print or save this document as a PDF.');
    return;
  }
  const escaped = String(content)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <style>
          @media print {
            @page { margin: 2cm; }
          }
          body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.7;
            color: #1c1b18;
            max-width: 680px;
            margin: 3rem auto;
            padding: 0 1.5rem;
            white-space: pre-wrap;
          }
          h1 {
            font-size: 1.4rem;
            margin-bottom: 2rem;
            text-align: center;
            letter-spacing: 0.02em;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${escaped}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 300);
}

export function listToPrintableText(items, fields) {
  return items
    .map((item) => fields.map((f) => item[f]).filter(Boolean).join(' — '))
    .join('\n\n');
}
