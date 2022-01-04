import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';
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
  const [times, setTimes] = useState<TrackedTime[]>();
  const [yLabels, setYLabels] = useState<number[]>();
  const [xLabels, setXLabels] = useState<string[]>();

  // FIXME: dependency array, split functionality into different methods?
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
    setTimes(times);
    const timeArray = times.map((time) => time.time);
    const max = Math.max(...timeArray);
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

    setXLabels(datesArray.reverse());
  }, [setTimes]);

  useEffect(() => {
    loadTimes();
  }, [loadTimes]);

  return (
    <View style={styles.screen}>
      {times && (
        <>
          <Text style={{ fontSize: 34 }}>Woche</Text>
          <View style={{ width: '100%', borderWidth: 5 }}>
            <VictoryChart
              domainPadding={20}
              width={350}
              padding={70}
              theme={VictoryTheme.material}
            >
              <VictoryAxis
                label="Tag"
                style={{
                  axisLabel: { padding: 35 },
                  tickLabels: { padding: 15 },
                }}
                tickValues={xLabels}
                fixLabelOverlap
              />
              <VictoryAxis
                label="Minuten"
                dependentAxis
                tickValues={yLabels}
                style={{ axisLabel: { padding: 50 } }}
              />
              <VictoryBar data={times} x="day" y="time" />
            </VictoryChart>
          </View>
        </>
      )}
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
