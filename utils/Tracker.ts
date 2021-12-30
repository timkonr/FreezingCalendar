import AsyncStorage from '@react-native-async-storage/async-storage';

type TrackerProps = {
trackingStart?: number;
trackingBpm?: number;
isTracking: boolean;
}
export class Tracker {
  props: TrackerProps;

  constructor () {
    this.props = {isTracking: false}
  }
  startTracking = (bpm: number) => {
    if (!this.props.isTracking) {
      console.log("[Tracker] startTracking");
      
      this.props.isTracking = true;
      this.props.trackingStart = Date.now();
      this.props.trackingBpm = bpm;
    }
  }

  stopTracking = async () => {
    if (this.props.isTracking && this.props.trackingStart) {
      this.props.isTracking = false;
      const trackingEnd = Date.now();
      let duration = trackingEnd - this.props.trackingStart;
      const date = new Date();
      const key = `@${date.toLocaleDateString('en-US')}`
      let daily = await AsyncStorage.getItem(key);
      // FIXME handle faulty values that are not caught by isNaN
      if (daily && !isNaN(parseInt(daily))) {
        duration += parseInt(daily);
      }
      console.log("[Tracker] stopTracking", key, duration.toString());
      
      AsyncStorage.setItem(key, duration.toString())
    }
  }
}




