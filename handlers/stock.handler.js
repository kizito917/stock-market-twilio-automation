async function getMarketPrices(symbol) {
    const marketPrice = await getStockMarketCurrentPrice(symbol);
    const volatilityResult = await getVolatilityIndexData();
    
    console.log(marketPrice);
    console.log(volatilityResult);

    return {
        marketPrice,
        volatilityResult
    }
}

async function getVolatilityIndexData() {
    try {
        const response = await fetch(`${process.env.YAHOO_FINANCE_API_URL}/%5EVIX`);
        if (response.status !== 200 && response.statusText !== 'OK') {
            return null;
        }

        const result = await response.json();
        const { longName, symbol, regularMarketPrice, previousClose, regularMarketDayLow, regularMarketDayHigh, fiftyTwoWeekLow, fiftyTwoWeekHigh } = result.chart.result[0].meta;

        return `The ${longName} (${symbol}) is currently trading at $${regularMarketPrice}, ${regularMarketPrice > previousClose ? 'up' : 'down'} from its previous close of $${previousClose}. Today's trading range is between $${regularMarketDayLow} and $${regularMarketDayHigh}. Over the past 52 weeks, the VIX has ranged from $${fiftyTwoWeekLow} to $${fiftyTwoWeekHigh}.`;
    } catch (err) {
        return null;
    }
}

async function getStockMarketCurrentPrice(marketSymbol) {
    try {
        if (!marketSymbol) {
            return null;
        }

        const response = await fetch(`${process.env.YAHOO_FINANCE_API_URL}/${marketSymbol}`);
        if (response.status !== 200 && response.statusText !== 'OK') {
            return null;
        }

        const result = await response.json();
        const { longName, symbol, regularMarketPrice, previousClose, regularMarketDayLow, regularMarketDayHigh, fiftyTwoWeekLow, fiftyTwoWeekHigh } = result.chart.result[0].meta;

        return `The ${longName} (${symbol}) is currently trading at $${regularMarketPrice}, ${regularMarketPrice > previousClose ? 'up' : 'down'} from its previous close of $${previousClose}. Today's trading range is between $${regularMarketDayLow} and $${regularMarketDayHigh}. Over the past 52 weeks, the SPY has ranged from $${fiftyTwoWeekLow} to $${fiftyTwoWeekHigh}.`;
    } catch (err) {
        return null;
    }
    
}

module.exports = {
    getMarketPrices
}