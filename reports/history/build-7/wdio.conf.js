const xlsxReporter = require('./utils/xlsxReporter');
const { generateHtmlReport } = require('./utils/generateHtmlReport');
const fs = require('fs');

exports.config = {
    runner: 'local',
    port: 4723,
    specs: [
        process.env.WDIO_CI_SPEC || './tests/**/*.test.js'
    ],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:noReset': true,
        'appium:fullReset': false
    }],
    logLevel: 'error',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 6000000
    },

    onPrepare: function () {
        xlsxReporter.startRun();
        if (fs.existsSync('.wdio-results.jsonl')) {
            fs.unlinkSync('.wdio-results.jsonl');
        }
    },
    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        const title = test.fullTitle || test.title;
        const status = passed ? 'passed' : 'failed';
        fs.appendFileSync('.wdio-results.jsonl', JSON.stringify({ title, status, duration }) + '\n');
    },
    after: function (result, capabilities, specs) {
        // Intercept fatal setup crashes
        if (result === 1 && !fs.existsSync('.wdio-results.jsonl')) {
             fs.appendFileSync('.wdio-results.jsonl', JSON.stringify({ title: 'Fatal Setup Crash / Appium Failed', status: 'failed', duration: 0 }) + '\n');
        }
    },
    onComplete: async function(exitCode, config, capabilities, results) {
        if (fs.existsSync('.wdio-results.jsonl')) {
            const lines = fs.readFileSync('.wdio-results.jsonl', 'utf-8').split('\n').filter(Boolean);
            let total = 0, passed = 0, failed = 0;
            lines.forEach(line => {
                const { title, status, duration } = JSON.parse(line);
                xlsxReporter.recordTest(title, status, duration);
                total++;
                if(status === 'passed') passed++;
                else failed++;
            });
            await xlsxReporter.generateReport('Execution-Artifact.xlsx');
            generateHtmlReport({ total, passed, failed });
        }
    }
};
