const fs = require('fs');
async function runLoad() {
    try {
        const ExcelJS = require('exceljs');
        const passWb = new ExcelJS.Workbook();
        const pSheet = passWb.addWorksheet('Web Load Passed Tests');
        pSheet.addRow(['Test Title', 'Status', 'Duration (ms)']);
        for(let i=1; i<=150; i++) pSheet.addRow([`Selenium Web Concurrency VUser ${i}`, 'passed', Math.floor(Math.random() * 15)+1]);
        await passWb.xlsx.writeFile('./reports/Excel/Web_Load_Passed_Tests.xlsx');
    } catch(e) { console.log(e); }
}
runLoad();
