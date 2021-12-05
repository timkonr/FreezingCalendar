import AsyncStorage from '@react-native-async-storage/async-storage';

let trackingStart: number;
let trackingBpm: number;

export const startTracking = (bpm: number) => {
  trackingStart = Date.now();
  trackingBpm = bpm;
}

export const stopTracking = async () => {
  if (trackingStart && trackingBpm) {
    const trackingEnd = Date.now();
    let duration = trackingEnd - trackingStart;
    const date = new Date();
    const key = '@'
    let daily = await AsyncStorage.getItem(key);
    // FIXME handle faulty values that are not caught by isNaN
    if (daily && !isNaN(parseInt(daily))) {
      duration += parseInt(daily);
    }
    AsyncStorage.setItem(key, duration.toString())
  }
}
