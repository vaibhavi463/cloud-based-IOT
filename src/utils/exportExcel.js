import * as XLSX from 'xlsx';

/**
 * Export data to an Excel (.xlsx) file.
 * @param {string} sheetName - Name of the worksheet
 * @param {string[]} headers - Column headers
 * @param {Array<Array>} rows - Row data
 * @param {string} [filename] - Output filename
 */
export function exportExcel(sheetName, headers, rows, filename = 'report.xlsx') {
  const data = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 4, 15) }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}
