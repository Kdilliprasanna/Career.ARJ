const fs = require('fs');
async function run() {
    try {
        const ExcelJS = require('exceljs');
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
    } catch(e) {
        fs.writeFileSync('Execution-Artifact.xlsx', 'Fallback excel creation failed');
    }
    
    fs.writeFileSync('execution-report.html', '<html><body><h1>Fallback Execution Report</h1><p>Action exited early.</p></body></html>');
    console.log("Fallback files generated.");
}
run();
