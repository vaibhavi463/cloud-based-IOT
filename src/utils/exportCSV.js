/**
 * Export data to a CSV file and trigger download.
 * @param {string[]} headers - Column headers
 * @param {Array<Array>} rows - Row data
 * @param {string} [filename] - Output filename
 */
export function exportCSV(headers, rows, filename = 'export.csv') {
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(cell => {
        const str = String(cell ?? '');
        // Escape cells containing commas, quotes, or newlines
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
