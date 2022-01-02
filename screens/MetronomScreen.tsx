import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AppRegistry,
  Button,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import {
  GameLoop,
  GameLoopUpdateEventOptionType,
} from 'react-native-game-engine';
import { Card } from '../components/Card';
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
    loadData();
    if (!metronome) setMetronome(new Metronome());
    if (!tracker) setTracker(new Tracker());

    return navigation.addListener('focus', () => {
      loadData();
      console.log('[MetronomeScreen] was focused');
    });
  }, [
    loadBpm,
    loadBpmModifier,
    loadVibrationMode,
    metronome,
    setMetronome,
    tracker,
    setTracker,
  ]);

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
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <GameLoop onUpdate={onUpdateHandler}>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.screen}>
            <View style={{ alignItems: 'center' }}>
              <Card style={styles.inputContainer}>
                <View style={styles.buttonContainer}>
                  <View style={styles.button}>
                    <Button
                      color={Colors.primary}
                      title="Start"
                      onPress={startTrainingHandler}
                      disabled={!bpm || isTraining}
                    />
                  </View>
                  <View style={styles.button}>
                    <Button
                      color={Colors.accent}
                      title="Stopp"
                      onPress={stopTrainingHandler}
                      disabled={!bpm || !isTraining}
                    />
                  </View>
                </View>
              </Card>
            </View>
          </ScrollView>
        </SafeAreaView>
      </GameLoop>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});

AppRegistry.registerComponent('MetronomScreen', () => MetronomScreen);
