import { signalrClient } from '@services/signalR/singleton';

const channelToSubscription = new Map();

export function subscribeOnStream(symbolInfo, resolution, onTick, subscriberUID, lastDailyBar) {
  //   const symbol = symbolInfo.ticker || symbolInfo.name;
  //   const subscriptionKey = `${symbol}-${resolution}`;

  const subscription = {
    subscriberUID,
    resolution,
    lastDailyBar,
    onTick,
  };

  // Subscribe to the SignalR event for live price updates
  const unsubscribe = signalrClient.onLivePricesValueUpdated(payload => {
    console.log('************************************', payload);
    // ... your logic to handle the incoming payload and update the bar ...
    // This is where you would call onTick with the new bar data

    const unixTime = new Date().getTime();
    const bar = {
      time: unixTime,
      open: Math.floor(Math.random() * 100),
      high: Math.floor(Math.random() * 100),
      low: Math.floor(Math.random() * 100),
      close: Math.floor(Math.random() * 100),
    };

    subscription.onTick(bar);
  });

  // Store the subscription by its unique identifier
  channelToSubscription.set(subscriberUID, {
    unsubscribe,
    symbolInfo,
    resolution,
    lastDailyBar,
    onTick,
  });
}

export function unsubscribeFromStream(subscriberUID) {
  // Retrieve the subscription by its unique identifier
  const subscription = channelToSubscription.get(subscriberUID);
  if (subscription) {
    // Call the SignalR client's unsubscribe method
    subscription.unsubscribe();
    // Remove the subscription from the map
    channelToSubscription.delete(subscriberUID);
  }
}
