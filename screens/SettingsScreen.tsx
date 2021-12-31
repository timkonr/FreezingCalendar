import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import { Card } from '../components/Card';
import { Context } from '../components/Context';
import { FrequencyInput } from '../components/FrequencyInput';
import Colors from '../constants/Colors';
import { CUEING_FREQUENCY } from '../constants/Values';
import { Metronome, Tracker } from '../utils';

export const SettingsScreen = () => {
  const [bpm, setBpm] = useState<number>();
  const [bpmModifier, setBpmModifier] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [vibrationMode, setVibrationMode] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [metronome, setMetronome] = useState<Metronome>();
  const [tracker, setTracker] = useState<Tracker>();
  const [modusButtons, setModusButtons] = useState<RadioButtonProps[]>([
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
  const [schwierigkeitsButtons, setSchwierigkeitsButtons] = useState<
    RadioButtonProps[]
  >([
    {
      id: '1',
      label: 'leicht',
      value: 'leicht',
      onPress: () => setBpmModifier(0.9),
      disabled: isTraining,
      containerStyle: styles.button,
    },
    {
      id: '2',
      label: 'normal',
      value: 'normal',
      selected: true,
      onPress: () => setBpmModifier(1),
      disabled: isTraining,
      containerStyle: styles.button,
    },
    {
      id: '3',
      label: 'schwer',
      value: 'schwer',
      onPress: () => setBpmModifier(1.1),
      disabled: isTraining,
      containerStyle: styles.button,
    },
  ]);

  const context = useContext(Context);

  const setFrequency = (frequency: number) => {
    setBpm(frequency);
    setModalVisible(false);
    AsyncStorage.setItem(CUEING_FREQUENCY, frequency.toString());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.screen}>
        <View style={{ alignItems: 'center' }}>
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
                radioButtons={modusButtons}
                onPress={(radioButtonsArray) =>
                  setModusButtons(radioButtonsArray)
                }
                layout="row"
              />
            </View>
          </Card>
          <Card style={styles.inputContainer} title="Schwierigkeit">
            <View style={styles.buttonContainer}>
              <RadioGroup
                radioButtons={schwierigkeitsButtons}
                onPress={(radioButtonsArray) =>
                  setSchwierigkeitsButtons(radioButtonsArray)
                }
                layout="column"
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
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
