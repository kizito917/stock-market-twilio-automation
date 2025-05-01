async function getMarketPrices(symbol) {
    const marketPrice = await getStockMarketCurrentPrice(symbol);
    const volatilityResult = await getVolatilityIndexData();
    
    console.log("Market price result: ", marketPrice);
    console.log("Volatility result: ", volatilityResult);

    return {
        marketPrice,
        volatilityResult
    }
}

async function getVolatilityIndexData() {
    console.log("I am getting called");
    try {
        const response = await fetch(`${process.env.YAHOO_FINANCE_API_URL}/%5EVIX`);
        if (response.status !== 200 && response.statusText !== 'OK') {
            return null;
        }

        const result = await response.json();
        //console.log("Result from Volatility index", JSON.stringify(result));
        const { longName, symbol, regularMarketPrice, previousClose, regularMarketDayLow, regularMarketDayHigh, fiftyTwoWeekLow, fiftyTwoWeekHigh } = result.chart.result[0].meta;

        return `The ${longName} (${symbol}) is currently trading at $${regularMarketPrice}, ${regularMarketPrice > previousClose ? 'up' : 'down'} from its previous close of $${previousClose}. Today's trading range is between $${regularMarketDayLow} and $${regularMarketDayHigh}. Over the past 52 weeks, the VIX has ranged from $${fiftyTwoWeekLow} to $${fiftyTwoWeekHigh}.`;
    } catch (err) {
        console.log("Error from Volatility index result", err);
        return null;
    }
}

async function getStockMarketCurrentPrice(marketSymbol) {
    console.log("I am getting called 2");
    try {
        if (!marketSymbol) {
            return null;
        }

        const response = await fetch(`${process.env.YAHOO_FINANCE_API_URL}/${marketSymbol}`);
        if (response.status !== 200 && response.statusText !== 'OK') {
            return null;
        }

        const result = await response.json();
        //console.log("Result from Stock market price", JSON.stringify(result));
        const { longName, symbol, regularMarketPrice, previousClose, regularMarketDayLow, regularMarketDayHigh, fiftyTwoWeekLow, fiftyTwoWeekHigh } = result.chart.result[0].meta;

        return `The ${longName} (${symbol}) is currently trading at $${regularMarketPrice}, ${regularMarketPrice > previousClose ? 'up' : 'down'} from its previous close of $${previousClose}. Today's trading range is between $${regularMarketDayLow} and $${regularMarketDayHigh}. Over the past 52 weeks, the SPY has ranged from $${fiftyTwoWeekLow} to $${fiftyTwoWeekHigh}.`;
    } catch (err) {
        console.log("Error from Stock market price result", err);
        return null;
    }
    
}

module.exports = {
    getMarketPrices
}