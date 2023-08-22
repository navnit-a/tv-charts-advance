// ...
export const Chart = () => {
    //... 

    const priceDateFeed = createPriceDataFeed(productId, stripId);

    const defaultProps: Omit<ChartContainerProps, 'container'> = {
        symbol: 'Bitfinex:ETH/GBP',
        interval: '1' as ResolutionString,
        datafeed: priceDateFeed,
        libraryPath: '/charting_library/',
        chartsStorageUrl: 'https://saveload.tradingview.com',
        chartsStorageApiVersion: '1.1',
        clientId: 'tradingview.com',
        userId: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
        theme: 'dark',
        debug: false,
        overrides: {
            'mainSeriesProperties.style': 3,
        },
    };

    return <TVChartContainer productId={productId} stripId={stripId} defaultProps={defaultProps}/>;
};
