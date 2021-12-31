import AsyncStorage from '@react-native-async-storage/async-storage';
import { TIMES } from '../constants/Values';
import { TrackedTime } from '../types';

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
    if (this.props.isTracking) {
      this.props.isTracking = false;
      this.saveTime();
    }
  }

  saveTime = async () => {
    if (this.props.trackingStart) {
    // calculate time
    const trackingEnd = Date.now();
    let duration = trackingEnd - this.props.trackingStart;
    const date = new Date();
    // FIXME doesn't work properly because react native uses wrong toLocaleDateString function here
    const today = date.toLocaleDateString('de-AT', {year: 'numeric', month: '2-digit', day: '2-digit'});
    console.log("[Tracker] stopTracking", today, duration.toString());
    
    // get previous times
    const jsonTimes = await AsyncStorage.getItem(TIMES);
    let times: TrackedTime[] = jsonTimes ? JSON.parse(jsonTimes) : [];
    const daily = times.find(time => time.day === today) ?? {day: today, time: 0};
    const idx = times.indexOf(daily);

    // add new time
    daily.time += duration;
    if (idx === -1) {
      times.push(daily);
    } else {
      times[idx] = daily;
    }
    
    AsyncStorage.setItem(TIMES, JSON.stringify(times));
    }
  }
}




