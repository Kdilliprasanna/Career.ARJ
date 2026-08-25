const ExcelJS = require('exceljs');
async function run() {
    const wb = new ExcelJS.Workbook();
    const sheet = wb.addWorksheet('Summary');
    sheet.addRows([
      ['Metric', 'Value'],
      ['Total Tests', 1],
      ['Passed', 0],
      ['Failed', 1]
    ]);
    sheet.addRow(['Fatal Error', 'Appium/Emulator failed prior to initialization.']);
    
    await wb.xlsx.writeFile('Execution-Artifact.xlsx');
    console.log("Fallback XLSX generated.");
}
run();
