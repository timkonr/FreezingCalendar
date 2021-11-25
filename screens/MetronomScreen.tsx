import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Card } from '../components/Card';
import { FrequencyInput } from '../components/FrequencyInput';
import Colors from '../constants/Colors';
import { Props } from '../types';

export const MetronomScreen = ({ navigation }: Props) => {
  const [cueingFrequency, setCueingFrequency] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState(new Audio.Sound());

  const [soundInterval, setSoundInterval] = useState(null);

  useEffect(() => {
    if (sound) {
      loadSound();
    }

    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function loadSound() {
    await sound.loadAsync(
      require('../assets/metronome-tempo-single-sound_G_major.mp3')
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        if (status.shouldPlay) {
          // Vibration.vibrate(100, false);
        }
      }
    });
  }

  async function playSound(frequency) {
    if (sound) {
      setSoundInterval(
        setInterval(async () => {
          sound.replayAsync();
          // Vibration.vibrate(100, false);
        }, frequency)
      );
    }
  }

  const startTrainingHandler = () => {
    if (cueingFrequency) {
      const duration = 100;
      const freq = 60000 / cueingFrequency;
      playSound(freq);
      // Vibration.vibrate([freq - duration, duration], true);
    } else {
      console.log('select please');
    }
  };

  const stopTrainingHandler = () => {
    if (soundInterval) {
      clearInterval(soundInterval);
    }
    if (sound) {
      sound.stopAsync();
    }
  };

  const setFrequency = (frequency: number) => {
    setCueingFrequency(frequency);
    setModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.screen}>
        <Card style={styles.inputContainer}>
          <Button
            color={Colors.primary}
            title="Cueing Frequenz einstellen"
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </Card>
        <FrequencyInput
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setFrequency={setFrequency}
        />
        <Card style={styles.inputContainer}>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                color={Colors.primary}
                title="Start"
                onPress={startTrainingHandler}
              />
            </View>
            <View style={styles.button}>
              <Button
                color={Colors.primary}
                title="Stopp"
                onPress={stopTrainingHandler}
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
