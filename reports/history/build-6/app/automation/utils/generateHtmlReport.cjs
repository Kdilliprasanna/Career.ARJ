const fs = require('fs');

function generateHtmlReport(summary) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Execution Report</title>
  <style>
    body { background-color: #1e1e1e; color: #f0f0f0; font-family: sans-serif; padding: 2rem; }
    h1 { color: #4af; }
    table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
    th, td { border: 1px solid #444; padding: 8px; text-align: left; }
    th { background-color: #333; }
    .passed { color: #4f4; }
    .failed { color: #f44; }
  </style>
</head>
<body>
  <h1>Test Execution Report</h1>
  <p>Total: ${summary.total} | Passed: ${summary.passed} | Failed: ${summary.failed}</p>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Total Tests</td><td>${summary.total}</td></tr>
    <tr><td>Pass Rate</td><td class="${summary.passed === summary.total ? 'passed' : 'failed'}">${(summary.passed / (summary.total || 1) * 100).toFixed(2)}%</td></tr>
  </table>
</body>
</html>
  `;
  fs.writeFileSync('execution-report.html', html);
}

module.exports = { generateHtmlReport };
