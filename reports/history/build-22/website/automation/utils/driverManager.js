const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const env = require('../config/env');

class DriverManager {
    async buildDriver() {
        let options = new chrome.Options();
        if (env.HEADLESS) {
            options.addArguments('--headless=new');
            options.addArguments('--no-sandbox');
            options.addArguments('--disable-dev-shm-usage');
        }
        options.addArguments(`--window-size=${env.WINDOW_SIZE.width},${env.WINDOW_SIZE.height}`);

        return await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();
    }
}

module.exports = new DriverManager();
