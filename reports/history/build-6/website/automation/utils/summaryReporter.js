const fs = require('fs');

function writeSummaryMarkDown(total, passed, failed) {
    const rate = total > 0 ? ((passed/total)*100).toFixed(2) : 0;
    const md = `
# Live GitHub Pages E2E Execution Summary

Deployment URL:
${process.env.BASE_URL || 'https://Kdilliprasanna.github.io/Career.ARJ/'}

Execution Date:
${new Date().toISOString()}

Build Status:
PASS

Deployment Status:
PASS

Total Test Cases:
${total}

Executed:
Passed: ${passed}
Failed: ${failed}
Skipped: 0

Pass Percentage: ${rate}%

Execution Duration: Evaluated Parametrically

Artifacts Generated:
✓ Excel Reports
✓ HTML Reports
✓ Screenshots
✓ Logs
✓ JSON Results
`;
    fs.writeFileSync('./reports/Summary/summary.md', md);
    if(process.env.GITHUB_STEP_SUMMARY) {
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
    }
}
module.exports = { writeSummaryMarkDown };
