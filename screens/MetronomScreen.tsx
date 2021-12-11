import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { Card } from '../components/Card';
import { FrequencyInput } from '../components/FrequencyInput';
import Colors from '../constants/Colors';
import { CUEING_FREQUENCY } from '../constants/Values';
import { Props } from '../types';

export const MetronomScreen = ({ navigation }: Props) => {
  const [bpm, setBpm] = useState<number>();
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState(new Audio.Sound());
  const [soundInterval, setSoundInterval] = useState<number>();
  const [vibrationMode, setVibrationMode] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
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

  const loadSound = useCallback(async () => {
    await sound.loadAsync(
      require('../assets/metronome-tempo-single-sound_G_major.mp3')
    );
    // unsuccessful attempt of synchronising sound and vibration
    // sound.setOnPlaybackStatusUpdate((status) => {
    //   if (status.isLoaded) {
    //     if (status.shouldPlay) {
    //       // Vibration.vibrate(100, false);
    //     }
    //   }
    // });
  }, [sound]);

  useEffect(() => {
    if (sound) {
      loadSound();
    }

    loadSavedFrequency();
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound, loadSound, loadSavedFrequency]);

  const playSound = useCallback(
    async (frequency) => {
      if (sound) {
        setSoundInterval(
          setInterval(async () => {
            sound.replayAsync();
          }, frequency)
        );
      }
    },
    [sound, setSoundInterval]
  );

  const startTrainingHandler = useCallback(() => {
    if (bpm) {
      if (isTraining) return;
      setIsTraining(true);

      const duration = 100;
      const freq = 60000 / bpm;
      if (vibrationMode) {
        Vibration.vibrate([freq - duration, duration], true);
      } else {
        playSound(freq);
      }
    }
  }, [bpm, vibrationMode, playSound, isTraining, setIsTraining]);

  const stopTrainingHandler = () => {
    if (soundInterval) {
      clearInterval(soundInterval);
    }
    setIsTraining(false);
    if (sound) {
      sound.stopAsync();
      Vibration.cancel();
    }
  };

  const setFrequency = (frequency: number) => {
    setBpm(frequency);
    setModalVisible(false);
    AsyncStorage.setItem(CUEING_FREQUENCY, frequency.toString());
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
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
