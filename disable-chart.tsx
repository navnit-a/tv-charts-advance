// src/components/TradingViewChart.tsx
import React, {useEffect, useRef} from 'react';
import {ResolutionString, Timezone} from '@libs/charting_library/charting_library';
import {createPriceDataFeed} from "@features/chart-system/trading-view/mock-chart/mockDataFeed";
import {useSelector} from "react-redux";
import {getCurrentChart} from "@redux/dashboard-contracts/selector";

declare const TradingView: any;

export const TradingViewChart: React.FC = () => {
    const {stripId, productId} = useSelector(getCurrentChart);
    const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
    // const chartContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (chartContainerRef.current) {
            new TradingView.widget({
                symbol: 'Bitfinex:ETH/GBP',
                interval: 'D' as ResolutionString,
                theme: 'dark',
                type: 'area',
                enabled_features: ["hide_left_toolbar_by_default"],
                disabled_features: ["use_localstorage_for_settings", "chart_type_line", "chart_type_candles"],
                debug: false,
                container: chartContainerRef.current,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
                datafeed: createPriceDataFeed(productId, stripId),
                fullscreen: false,
                overrides: {
                    'mainSeriesProperties.style': 3,
                },
                autosize: true,
                library_path: 'charting_library/', // Adjust the path if necessary
                drawings_access: {
                    type: 'white',
                    tools: [
                        {
                            name: 'Trend Line',
                            // grayed: true
                        },
                    ]
                },

            });
        }

    }, [chartContainerRef, productId, stripId]);

    return <div ref={chartContainerRef} className={'TVChartContainer'}/>;
}


