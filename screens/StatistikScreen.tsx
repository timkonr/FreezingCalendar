import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Weekly } from '../components/Weekly';
import { TIMES } from '../constants/Values';
import { Props, TrackedTime } from '../types';

//TODO: save date like this
const toLocaleDateString = (date: string) => {
  return `${date.slice(3, 5)}.${date.slice(0, 2)}`;
};

// TODO: add plot for month
// TODO: add lifetime stats for trained days
// TODO: add streaks?
// inspiration: https://agentestudio.com/blog/healthcare-app-gamification
export const StatistikScreen = ({ navigation }: Props<'Statistik'>) => {
  const [totalTimes, setTotalTimes] = useState<TrackedTime[]>();
  const [weeklyTimes, setWeeklyTimes] = useState<TrackedTime[]>();
  const [yLabels, setYLabels] = useState<number[]>();
  const [xLabels, setXLabels] = useState<string[]>();

  // FIXME: split functionality into different methods?
  const loadTimes = useCallback(async () => {
    const jsonTimes = await AsyncStorage.getItem(TIMES);
    const times: TrackedTime[] = jsonTimes
      ? (JSON.parse(jsonTimes) as TrackedTime[]).map((time) => {
          return {
            day: toLocaleDateString(time.day),
            time: Math.floor(time.time / 6000) / 10,
          };
        })
      : [];
    setTotalTimes(times);
    const timeArray = times.map((time) => time.time);
    const max = Math.max(...timeArray, 10);
    setYLabels([
      Math.floor((10 * max) / 4) / 10,
      Math.floor((10 * max * 2) / 4) / 10,
      Math.floor((10 * max * 3) / 4) / 10,
      max,
    ]);
    const date = new Date();

    const datesArray = Array.from(Array(7), (v, k) => {
      let day = new Date();
      day.setDate(date.getDate() - k);

      return toLocaleDateString(day.toLocaleDateString('de-AT'));
    });

    setWeeklyTimes(
      datesArray.map((date) => {
        return (
          times.find((time) => time.day === date) ?? { day: date, time: 0 }
        );
      })
    );
    setXLabels(datesArray.reverse());
  }, [setTotalTimes, setWeeklyTimes, setXLabels, setYLabels]);

  useEffect(() => {
    loadTimes();
  }, [loadTimes]);

  return (
    <View style={styles.screen}>
      <Weekly times={weeklyTimes} xLabels={xLabels} yLabels={yLabels} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
  inputContainer: {
    width: 300,
    maxWidth: '80%',
    alignItems: 'center',
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 15,
  },
  button: {
    width: 100,
  },
});
