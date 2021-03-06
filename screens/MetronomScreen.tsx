import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AppRegistry,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {
  GameLoop,
  GameLoopUpdateEventOptionType,
} from 'react-native-game-engine';
import Colors from '../constants/Colors';
import { BPM, BPM_MODIFIER, VIBRATION_MODE } from '../constants/Values';
import { Props } from '../types';
import { Metronome, Tracker } from '../utils';

export const MetronomScreen = ({ navigation }: Props<'Metronom'>) => {
  const [bpm, setBpm] = useState<number>();
  const [bpmModifier, setBpmModifier] = useState(1);
  const [vibrationMode, setVibrationMode] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [metronome, setMetronome] = useState<Metronome>();
  const [tracker, setTracker] = useState<Tracker>();

  const loadBpm = useCallback(async () => {
    const savedBpm = await AsyncStorage.getItem(BPM);
    console.log('[loadBpm]', savedBpm);

    if (savedBpm) setBpm(parseInt(savedBpm));
  }, [setBpm]);

  const loadBpmModifier = useCallback(async () => {
    const savedBpmModifier = await AsyncStorage.getItem(BPM_MODIFIER);
    console.log('[loadBpmModifier]', parseFloat(savedBpmModifier ?? ''));

    if (savedBpmModifier) setBpmModifier(parseFloat(savedBpmModifier));
  }, [setBpmModifier]);

  const loadVibrationMode = useCallback(async () => {
    const savedMode = await AsyncStorage.getItem(VIBRATION_MODE);
    console.log('[loadVibrationMode]', savedMode);

    if (savedMode) setVibrationMode(savedMode === 'true');
  }, [setVibrationMode]);

  const loadData = useCallback(async () => {
    await loadBpm();
    await loadBpmModifier();
    await loadVibrationMode();
  }, [loadBpm, loadBpmModifier, loadVibrationMode]);

  useEffect(() => {
    console.log('[MetronomScreen] useEffect');

    return navigation.addListener('focus', () => {
      loadData();
      console.log('[MetronomeScreen] was focused');
    });
  }, [loadData]);

  useEffect(() => {
    if (!metronome) setMetronome(new Metronome());
    if (!tracker) setTracker(new Tracker());
  }, [metronome, setMetronome, tracker, setTracker]);

  const startTrainingHandler = useCallback(() => {
    if (isTraining) return;
    if (bpm) {
      setIsTraining(true);
      tracker?.startTracking(bpm * bpmModifier);
      if (vibrationMode) {
        const duration = 100;
        const freq = 60000 / bpm;
        Vibration.vibrate([freq - duration, duration], true);
      } else {
        metronome?.start(bpm * bpmModifier);
      }
    }
  }, [
    bpm,
    bpmModifier,
    metronome,
    vibrationMode,
    isTraining,
    setIsTraining,
    tracker,
  ]);

  const stopTrainingHandler = () => {
    if (isTraining) {
      metronome?.stop();
      Vibration.cancel();
    }
    tracker?.stopTracking();
    setIsTraining(false);
  };

  const onUpdateHandler = (args: GameLoopUpdateEventOptionType) => {
    metronome?.updateMetronome({ ...args });
  };

  return (
    <GameLoop onUpdate={onUpdateHandler}>
      <View style={styles.screen}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={startTrainingHandler}
            disabled={!bpm || isTraining}
            activeOpacity={0.6}
            style={{
              ...styles.button,
              ...styles.startButton,
              backgroundColor:
                !bpm || isTraining ? Colors.inactive : Colors.primary,
            }}
          >
            <Text
              style={{
                fontSize: 45,
                color: !bpm || isTraining ? 'grey' : 'white',
              }}
            >
              START
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={stopTrainingHandler}
            disabled={!bpm || !isTraining}
            activeOpacity={0.6}
            style={{
              ...styles.button,
              ...styles.stopButton,
              backgroundColor:
                !bpm || !isTraining ? Colors.inactive : Colors.accent,
            }}
          >
            <Text
              style={{
                fontSize: 45,
                color: !bpm || !isTraining ? 'grey' : 'white',
              }}
            >
              STOP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GameLoop>
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
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    padding: 15,
  },
  button: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    color: 'white',
    marginVertical: 10,
  },
  inactiveButton: {
    backgroundColor: Colors.inactive,
    color: 'grey',
  },
  startButton: {
    backgroundColor: Colors.primary,
  },
  stopButton: {
    backgroundColor: Colors.accent,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingBottom: StatusBar.currentHeight,
  },
});

AppRegistry.registerComponent('MetronomScreen', () => MetronomScreen);
