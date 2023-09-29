import { useEffect, useRef } from 'react';
import { ChartingLibraryWidgetOptions, ResolutionString, Timezone } from '@libs/charting_library/charting_library';
import { ChartContainerProps } from '@features/chart-system/types';
import { createPriceDataFeed } from '@features/chart-system/trading-view/tv-chart-container/datafeed';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const StyledChartBox = styled(Box)(() => ({
  height: 'calc(1000vh - 80px)',
  width: '100%',
}));

export function TVChartContainer() {
  const chartContainerRef = useRef<HTMLDivElement>();

  const defaultProps: Omit<ChartContainerProps, 'container'> = {
    symbol: 'Bitfinex:ETH/GBP',
    interval: 'D' as ResolutionString,
    datafeed: createPriceDataFeed(14, 47),
    libraryPath: '/charting_library/',
    fullscreen: false,
    autosize: true,
    custom_css_url: '/charting_library/custom.css',
    studiesOverrides: {},
    studies_access: {
      type: 'black',
      tools: [
        {
          name: '52 Week High/Low',
        },
        {
          name: 'Accelerator Oscillator',
        },
        {
          name: 'Average Price',
        },
        {
          name: 'Donchian Channels',
        },
        {
          name: 'Ichimoku Cloud',
        },
        {
          name: 'Parabolic SAR',
        },
        {
          name: 'Pivot Points Standard',
        },
        {
          name: 'Price Channel',
        },
        {
          name: 'Typical Price',
        },
        {
          name: 'Volatility O-H-L-C',
        },
      ],
    },
    theme: 'dark',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
    debug: false,
    overrides: {
      // Main Series
      'mainSeriesProperties.style': 3,
      'mainSeriesProperties.showCountdown': false,
      'mainSeriesProperties.statusViewStyle.fontSize': 12,

      // Scales
      'scalesProperties.crosshairLabelBgColorDark': '#12141A',
      'scalesProperties.lineColor': '#999',
      'scalesProperties.textColor': '#999',
      'scalesProperties.fontSize': 12,

      // Pane
      'paneProperties.legendProperties.showBarChange': true,
      'paneProperties.legendProperties.showVolume': false,
      'paneProperties.background': '#12141A',
      'paneProperties.backgroundType': 'solid',
      'paneProperties.legendProperties.backgroundTransparency': 80,

      // Area
      'mainSeriesProperties.areaStyle.linecolor': '#ffffff',
      'mainSeriesProperties.areaStyle.transparency ': '50',
      'mainSeriesProperties.areaStyle.color1': 'rgba(156, 240, 250, 1)',
      'mainSeriesProperties.areaStyle.color2': '#000',

      // Line
      'mainSeriesProperties.lineStyle.color': 'rgba(156, 240, 250, 50)',

      // Line with markers
      'mainSeriesProperties.lineWithMarkersStyle.color': 'rgba(156, 240, 250, 50)',

      // Step Line
      'mainSeriesProperties.steplineStyle.color': 'rgba(156, 240, 250, 50)',

      // Columns
      'mainSeriesProperties.columnStyle.upColor': 'rgba(156, 240, 250, 50)',
      'mainSeriesProperties.columnStyle.downColor': '#fff',
    },
    enabled_features: ['hide_left_toolbar_by_default', 'side_toolbar_in_fullscreen_mode'],
    disabled_features: [
      'items_favoriting',
      'show_object_tree',
      'timezone_menu',
      'timeframes_toolbar',
      'use_localstorage_for_settings',
      'save_chart_properties_to_local_storage',
    ],
  };

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: defaultProps.symbol as string,
      datafeed: defaultProps.datafeed,
      interval: defaultProps.interval as ResolutionString,
      container: chartContainerRef.current as HTMLDivElement,
      library_path: defaultProps.libraryPath as string,
      custom_css_url: defaultProps.custom_css_url,
      locale: 'en',
      timezone: defaultProps.timezone,
      disabled_features: defaultProps.disabled_features,
      enabled_features: defaultProps.enabled_features,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      studies_access: defaultProps.studies_access,
      theme: defaultProps.theme,
      debug: defaultProps.debug,
      overrides: defaultProps.overrides,
    };

    const tvWidget = new (window as any).TradingView.widget(widgetOptions);

    return () => {
      tvWidget.remove();
    };
  }, []);

  return <StyledChartBox ref={chartContainerRef} />;
}
