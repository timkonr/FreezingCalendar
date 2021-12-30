import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AppRegistry,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import {
  GameLoop,
  GameLoopUpdateEventOptionType,
} from 'react-native-game-engine';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { Card } from '../components/Card';
import { FrequencyInput } from '../components/FrequencyInput';
import Colors from '../constants/Colors';
import { CUEING_FREQUENCY } from '../constants/Values';
import { Props } from '../types';
import { Metronome } from '../utils';

export const MetronomScreen = ({ navigation }: Props<'Metronom'>) => {
  const [bpm, setBpm] = useState<number>();
  const [modalVisible, setModalVisible] = useState(false);
  const [vibrationMode, setVibrationMode] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [metronome, setMetronome] = useState<Metronome>(new Metronome());
  const [radioButtons, setRadioButtons] = useState<RadioButtonProps[]>([
    {
      id: '1',
      label: 'Sound',
      value: 'sound',
      selected: true,
      onPress: () => setVibrationMode(false),
      disabled: isTraining,
    },
    {
      id: '2',
      label: 'Vibration',
      value: 'vibration',
      onPress: () => setVibrationMode(true),
      disabled: isTraining,
    },
  ]);

  const loadSavedFrequency = useCallback(async () => {
    const savedFrequency = await AsyncStorage.getItem(CUEING_FREQUENCY);
    if (savedFrequency) setBpm(parseInt(savedFrequency));
  }, [setBpm]);

  useEffect(() => {
    console.log('[useEffect] load saved frequency');
    loadSavedFrequency();
  }, [loadSavedFrequency]);

  const startTrainingHandler = useCallback(() => {
    if (isTraining) return;
    if (bpm) {
      setIsTraining(true);
      if (vibrationMode) {
        const duration = 100;
        const freq = 60000 / bpm;
        Vibration.vibrate([freq - duration, duration], true);
      } else {
        metronome?.start(bpm);
      }
    }
  }, [bpm, metronome, vibrationMode, isTraining, setIsTraining]);

  const stopTrainingHandler = () => {
    if (isTraining) {
      metronome?.stop();
      Vibration.cancel();
    }
    setIsTraining(false);
  };

  const setFrequency = (frequency: number) => {
    setBpm(frequency);
    setModalVisible(false);
    AsyncStorage.setItem(CUEING_FREQUENCY, frequency.toString());
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
        <View style={styles.screen}>
          <Card style={styles.inputContainer} title="Cueing Frequenz">
            <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
              {bpm ? bpm + ' bpm' : 'Bitte einstellen'}
            </Text>
            <Button
              color={Colors.primary}
              title={bpm ? 'Ändern' : 'Einstellen'}
              onPress={() => {
                setModalVisible(true);
              }}
              disabled={isTraining}
            />
          </Card>
          <FrequencyInput
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setFrequency={setFrequency}
            cueingFrequency={bpm}
          />
          <Card style={styles.inputContainer} title="Modus">
            <View style={styles.buttonContainer}>
              <RadioGroup
                radioButtons={radioButtons}
                onPress={(radioButtonsArray) =>
                  setRadioButtons(radioButtonsArray)
                }
                layout="row"
              />
            </View>
          </Card>
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
      </GameLoop>
    </TouchableWithoutFeedback>
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

AppRegistry.registerComponent('MetronomScreen', () => MetronomScreen);
