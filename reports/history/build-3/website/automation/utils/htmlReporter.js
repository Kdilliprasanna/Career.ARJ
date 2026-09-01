const fs = require('fs');

function generateHtml(total, passed, failed) {
    const rate = total > 0 ? ((passed/total)*100).toFixed(2) : 0;
    const html = `<!DOCTYPE html><html><head><title>Automation Report</title>
<style>body{font-family:sans-serif; background:#111; color:#fff;} table{width:100%; border-collapse:collapse; border:1px solid #444;} th,td{border:1px solid #444; padding:8px;} .pass{color:#4f4;} .fail{color:#f44;}</style></head>
<body><h1>Execution Report</h1>
<table>
<tr><th>Total Tests</th><th>Passed</th><th>Failed</th><th>Success Rate</th></tr>
<tr><td>${total}</td><td class="pass">${passed}</td><td class="fail">${failed}</td><td>${rate}%</td></tr>
</table>
</body></html>`;
    
    fs.writeFileSync('./reports/HTML/execution-report.html', html);
    fs.writeFileSync('./reports/HTML/dashboard.html', html);
    fs.writeFileSync('./reports/JSON/execution-results.json', JSON.stringify({ total, passed, failed }));
}
module.exports = { generateHtml };
