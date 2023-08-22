export const TVChartContainer: React.FC<{
    defaultProps: Omit<ChartContainerProps, 'container'>;
    productId: number | undefined;
    stripId: number | undefined;
}> = ({defaultProps, productId, stripId}) => {
    // ... 

    useEffect(() => {
        const widgetOptions: ChartingLibraryWidgetOptions = {
            // ...
        };

        const tvWidget = new (window as any).TradingView.widget(widgetOptions);

        tvWidget.onChartReady(() => {
            tvWidget.subscribe("time_interval", (obj) => {
                console.log("Interval changed to:", obj.label);
                tvWidget.chart().resetData();
            });
        });

        return () => {
            tvWidget.remove();
        };
    }, [productId, stripId, defaultProps.interval]);

    return <div ref={chartContainerRef} className={'TVChartContainer'}/>;
};
