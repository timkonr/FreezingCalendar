import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Card } from '../components/Card';
import { FrequencyInput } from '../components/FrequencyInput';
import Colors from '../constants/Colors';
import { CUEING_FREQUENCY } from '../constants/Values';
import { Props } from '../types';

export const MetronomScreen = ({ navigation }: Props) => {
  const [cueingFrequency, setCueingFrequency] = useState<number>();
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState(new Audio.Sound());
  const [soundInterval, setSoundInterval] = useState(null);

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
  }, [sound]);

  const loadSavedFrequency = useCallback(async () => {
    const freq = await AsyncStorage.getItem(CUEING_FREQUENCY);
    if (freq) setCueingFrequency(parseInt(freq));
  }, []);

  const loadSound = useCallback(async () => {
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
  }, []);

  const playSound = useCallback(async (frequency) => {
    if (sound) {
      setSoundInterval(
        setInterval(async () => {
          sound.replayAsync();
          // Vibration.vibrate(100, false);
        }, frequency)
      );
    }
  }, []);

  const startTrainingHandler = useCallback(() => {
    if (cueingFrequency) {
      const duration = 100;
      const freq = 60000 / cueingFrequency;
      playSound(freq);
    } else {
      console.log('select please');
    }
  }, []);

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
    AsyncStorage.setItem(CUEING_FREQUENCY, frequency.toString());
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.screen}>
        <Card style={styles.inputContainer}>
          <Text style={{ marginBottom: 10 }}>
            Cueing Frequenz: {cueingFrequency ?? 'Bitte einstellen'}
          </Text>
          <Button
            color={Colors.primary}
            title="Einstellen"
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </Card>
        <FrequencyInput
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setFrequency={setFrequency}
          cueingFrequency={cueingFrequency}
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
