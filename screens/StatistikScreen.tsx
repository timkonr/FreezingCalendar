import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';
import { TIMES } from '../constants/Values';
import { Props, TrackedTime } from '../types';

const toLocaleDateString = (date: string) => {
  return `${date.slice(3, 5)}.${date.slice(0, 2)}.${date.slice(6, 10)}`;
};

export const StatistikScreen = ({ navigation }: Props<'Statistik'>) => {
  const [times, setTimes] = useState<TrackedTime[]>();
  const [yLabels, setYLabels] = useState<number[]>();

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
  }, [setTimes]);

  useEffect(() => {
    loadTimes();
  }, [loadTimes]);

  return (
    <View style={styles.screen}>
      {times && (
        <VictoryChart
          domainPadding={20}
          theme={VictoryTheme.material}
          padding={100}
        >
          <VictoryAxis label="Tag" style={{ axisLabel: { padding: 30 } }} />
          <VictoryAxis
            label="Minuten"
            dependentAxis
            tickValues={yLabels}
            style={{ axisLabel: { padding: 50 } }}
          />
          <VictoryBar data={times} x="day" y="time" />
        </VictoryChart>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
