import * as XLSX from "xlsx";

export async function downloadExcelFromCSV(data: string) {
  const csv = data;
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  // Convert CSV to worksheet
  const workbook = XLSX.read(csv, { type: "string" });

  // Export as Excel (.xlsx)
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Trigger download
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", `${date}_plant_data.xlsx`);

  document.body.appendChild(link);
  link.click();
  link.remove();
}
