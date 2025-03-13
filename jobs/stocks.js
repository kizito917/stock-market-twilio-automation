const cron = require('node-cron');
const path = require('path');
const { writeFileSync } = require('fs-extra');

async function retrieveStockSymbols() {
    const response = await fetch(process.env.STOCKS_LIST_API_URL);
    if (response.statusText != 'OK' && response.status !== 200) {
        return null;
    }

    const result = await response.json();
    return result;
}

const setupStockCronJobs = async () => {
    // Cron to perform stock related jobs
    cron.schedule('0 1 * * *', async () => {
        const symbols = await retrieveStockSymbols();
        if (symbols !== null) {
            try {
                const filePath = path.join(__dirname, '../utils/stocks-symbols.js');
                const fileContent = `module.exports = ${JSON.stringify(symbols, null, 2)};`;
                writeFileSync(filePath, fileContent, 'utf-8');
            } catch (err) {
                console.log("Unable to write data to file", err);
            }
        }
    })
}

module.exports = {
    setupStockCronJobs
}