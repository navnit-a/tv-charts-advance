getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    console.log('[getBars]: Method call');

    const unitElement = resolutionToTimeUnit[resolution];
    const period = resolutionToPeriod[resolution];
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);

    try {
        const toDate = new Date(periodParams.to * 1000).toISOString();
        const fromDate = new Date(periodParams.from * 1000).toISOString();

        const pricesData = await fetchPricesData(fromDate, toDate, unitElement, period, productId, stripId);

        const bars = pricesData.quotes.map(quote => ({
            time: new Date(quote.DT).getTime(),
            open: quote.Close,
            high: quote.Close,
            low: quote.Close,
            close: quote.Close,
        }));

        if (!bars.length) {
            onHistoryCallback([], {noData: true});
            return;
        }

        onHistoryCallback(bars, {noData: false});
    } catch (error) {
        console.log('[getBars]: Get error', error);
        onErrorCallback(error);
    }
},
