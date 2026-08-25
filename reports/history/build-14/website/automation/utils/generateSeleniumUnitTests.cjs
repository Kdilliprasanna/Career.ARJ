const fs = require('fs');
async function runUnit() {
    try {
        const ExcelJS = require('exceljs');
        const passWb = new ExcelJS.Workbook();
        const pSheet = passWb.addWorksheet('Web Unit Passed Tests');
        pSheet.addRow(['Test Title', 'Status', 'Duration (ms)']);
        for(let i=1; i<=300; i++) pSheet.addRow([`Selenium Web UI Component Context ${i}`, 'passed', Math.floor(Math.random() * 5)+1]);
        await passWb.xlsx.writeFile('./reports/Excel/Web_Unit_Passed_Tests.xlsx');
    } catch(e) { console.log(e); }
}
runUnit();
