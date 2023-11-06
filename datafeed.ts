import { format, fromUnixTime } from 'date-fns';
import { Bars, PriceData, ResolutionConfig, SearchSymbolResult, SymbolInfo, TimeUnit } from '@features/dashboard-v1/widgets/chart/types';
import { fetchPricesData, searchSymbols } from '@features/dashboard-v1/widgets/chart/trading-view/apiHelper';
import { HistoryCallback, PeriodParams, ResolutionString, SubscribeBarsCallback } from '@libs/charting_library/charting_library';
import { subscribeOnStream } from './streaming';

const lastBarsCache = new Map();

const resolutionConfig = {
  '1W': { unit: TimeUnit.Day, period: 1 },
  '1D': { unit: TimeUnit.Day, period: 1 },
  '240': { unit: TimeUnit.Minute, period: 240 },
  '30': { unit: TimeUnit.Minute, period: 30 },
  '15': { unit: TimeUnit.Minute, period: 15 },
  '10': { unit: TimeUnit.Minute, period: 10 },
  '5': { unit: TimeUnit.Minute, period: 5 },
  '1': { unit: TimeUnit.Minute, period: 1 },
};

const configurationData = {
  supported_resolutions: Object.keys(resolutionConfig),
};

const datafeed = {
  onReady: (callback: (arg: ResolutionConfig) => void) => {
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (userInput: string, _exchange: string, _symbolType: string, onResultReadyCallback: (arg: SearchSymbolResult) => void) => {
    const data = await searchSymbols(userInput);

    const matchedSymbols = data.matches.map(match => ({
      symbol: match.fullName,
      full_name: match.fullName,
      description: match.description,
      exchange: '',
      type: match.type,
    }));

    onResultReadyCallback(matchedSymbols);
  },

  resolveSymbol: async (symbolName: string, onSymbolResolvedCallback: (arg: any) => void, onResolveErrorCallback: (arg: string) => void) => {
    const data = await searchSymbols(symbolName);

    if (data.matches.length === 0) {
      onResolveErrorCallback('Cannot resolve symbol');
      return;
    }

    const match = data.matches[0];

    const symbolInfo = {
      ticker: match.fullName,
      name: match.fullName,
      full_name: match.fullName,
      listed_exchange: '',
      format: 'price',
      description: match.description,
      type: match.type,
      session: '24x7',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      exchange: '',
      minmov: 1,
      pricescale: 100,
      has_daily: true,
      has_weekly_and_monthly: true,
      has_intraday: true,
      has_seconds: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      product_id: match.productId,
      strip_id: match.stripId,
    };

    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (
    symbolInfo: SymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onErrorCallback: (error: any) => void
  ) => {
    const unitElement = resolutionConfig[resolution].unit;
    const period = resolutionConfig[resolution].period;

    try {
      const bars: Bars = [];

      const fromDate = format(fromUnixTime(periodParams.from), 'yyyy-MM-dd HH:mm:ss');
      const toDate = format(fromUnixTime(periodParams.to), 'yyyy-MM-dd HH:mm:ss');
      const firstDataRequest = periodParams.firstDataRequest;
      const data: PriceData = await fetchPricesData(fromDate, toDate, unitElement, period, symbolInfo.product_id, symbolInfo.strip_id);

      data.bars.forEach(bar => {
        bars.push({
          time: bar.time * 1000,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
        });
      });

      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, { ...bars[bars.length - 1] });
      }

      const hasNoData = bars.length === 0;

      onResult(bars, { noData: hasNoData });
    } catch (error) {
      onErrorCallback(error);
    }
  },

  subscribeBars: (
    symbolInfo: SymbolInfo,
    resolution: ResolutionString,
    listenerGuid: string,
    onTick: SubscribeBarsCallback,
    _onResetCacheNeededCallback: () => void
  ) => {
    console.log('listenerGuid ---->', listenerGuid);
    console.log('symbolInfo ---->', symbolInfo);
    console.log('resolution ---->', resolution);

    const last = lastBarsCache.get(symbolInfo.full_name);
    console.log('last ---->', last);

    subscribeOnStream(symbolInfo, resolution, onTick, listenerGuid, lastBarsCache.get(symbolInfo.full_name));

    // create an interval which runs a console out hello every 10s
    // const interval = setInterval(() => {
    //   // get unix time using date-fns
    //   const unixTime = new Date().getTime();
    //   console.log('unixTime', unixTime);

    //   const bar = {
    //     time: unixTime,
    //     open: Math.floor(Math.random() * 100),
    //     high: Math.floor(Math.random() * 100),
    //     low: Math.floor(Math.random() * 100),
    //     close: Math.floor(Math.random() * 100),
    //   };

    //   onTick(bar);
    // }, 5000);

    // console.log('interval', interval);

    // const unsubscribe = signalrClient.onLivePricesValueUpdated(payload => {
    //   console.log('************************************', payload);
    // });

    // return () => {
    //   unsubscribe();
    // };
  },

  unsubscribeBars: (subscriberUID: string) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
  },
};

export default datafeed;
