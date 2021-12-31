import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TIMES } from '../constants/Values';
import { Props, TrackedTime } from '../types';

const toTimeString = (ms: number) => {
  return `${Math.floor(ms / 6000) / 10} Minuten`;
};

export const StatistikScreen = ({ navigation }: Props<'Statistik'>) => {
  const [times, setTimes] = useState<TrackedTime[]>();

  const loadTimes = useCallback(async () => {
    const jsonTimes = await AsyncStorage.getItem(TIMES);
    const times: TrackedTime[] = jsonTimes ? JSON.parse(jsonTimes) : [];
    setTimes(times);
  }, [setTimes]);

  useEffect(() => {
    loadTimes();
  }, [loadTimes]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={times}
        keyExtractor={(item) => item.day}
        renderItem={(item) => (
          <Text>
            {item.item.day}: {toTimeString(item.item.time)}
          </Text>
        )}
      />
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
