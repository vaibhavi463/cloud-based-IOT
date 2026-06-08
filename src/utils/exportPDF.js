import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate a styled PDF report from tabular data.
 * @param {string} title - Report title
 * @param {string[]} columns - Column headers
 * @param {Array<Array>} rows - Row data (array of arrays)
 * @param {string} [filename] - Output filename
 */
export function exportPDF(title, columns, rows, filename = 'report.pdf') {
  const doc = new jsPDF();

  // Header background
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, 210, 40, 'F');

  // Title
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 20);

  // Subtitle
  doc.setTextColor(156, 162, 184);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.text('Smart IoT RFID Attendance System', 14, 36);

  // Table
  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 48,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [30, 34, 49],
      lineColor: [200, 200, 210],
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: [139, 92, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [245, 243, 255],
    },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(filename);
}
