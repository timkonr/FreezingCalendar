import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { Card } from '../components/Card';
import { FrequencyInput } from '../components/FrequencyInput';
import Colors from '../constants/Colors';
import { BPM, BPM_MODIFIER, VIBRATION_MODE } from '../constants/Values';

export const SettingsScreen = () => {
  const [bpm, setBpm] = useState<number>();
  const [bpmModifier, setBpmModifier] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [vibrationMode, setVibrationMode] = useState(false);

  const saveVibrationMode = useCallback(
    (vibrationMode: boolean) => {
      setVibrationMode(vibrationMode);
      AsyncStorage.setItem(VIBRATION_MODE, vibrationMode.toString());
    },
    [setVibrationMode]
  );

  const saveBpmModifier = useCallback(
    (bpmModifier: number) => {
      setBpmModifier(bpmModifier);
      AsyncStorage.setItem(BPM_MODIFIER, bpmModifier.toString());
    },
    [setVibrationMode]
  );

  const vibrationModeButtons = useMemo(() => {
    return (
      <RadioGroup
        radioButtons={[
          {
            id: '1',
            label: 'Sound',
            value: 'sound',
            selected: !vibrationMode,
            onPress: () => saveVibrationMode(false),
          },
          {
            id: '2',
            label: 'Vibration',
            value: 'vibration',
            onPress: () => saveVibrationMode(true),
            selected: vibrationMode,
          },
        ]}
        layout="row"
      />
    );
  }, [vibrationMode, saveVibrationMode]);

  const bpmModifierButtons = useMemo(() => {
    return (
      <RadioGroup
        radioButtons={[
          {
            id: '1',
            label: 'leicht',
            value: 'leicht',
            selected: bpmModifier === 0.9,
            onPress: () => saveBpmModifier(0.9),
            containerStyle: styles.button,
          },
          {
            id: '2',
            label: 'normal',
            value: 'normal',
            selected: bpmModifier === 1,
            onPress: () => saveBpmModifier(1),
            containerStyle: styles.button,
          },
          {
            id: '3',
            label: 'schwer',
            value: 'schwer',
            selected: bpmModifier === 1.1,
            onPress: () => saveBpmModifier(1.1),
            containerStyle: styles.button,
          },
        ]}
        layout="column"
      />
    );
  }, [bpmModifier, saveBpmModifier]);

  const loadBpm = useCallback(async () => {
    const savedBpm = await AsyncStorage.getItem(BPM);
    if (savedBpm) setBpm(parseInt(savedBpm));
  }, [setBpm]);

  const loadBpmModifier = useCallback(async () => {
    const savedBpmModifier = await AsyncStorage.getItem(BPM_MODIFIER);
    if (savedBpmModifier) setBpmModifier(parseFloat(savedBpmModifier));
  }, [setBpmModifier]);

  const loadVibrationMode = useCallback(async () => {
    const savedMode = await AsyncStorage.getItem(VIBRATION_MODE);
    if (savedMode) setVibrationMode(savedMode === 'true');
  }, [setVibrationMode]);

  const saveBpm = useCallback(
    (bpmToSave: number) => {
      setBpm(bpmToSave);
      setModalVisible(false);
      AsyncStorage.setItem(BPM, bpmToSave.toString());
    },
    [setBpm, setModalVisible]
  );

  useEffect(() => {
    console.log('[SettingsScreen] useEffect');

    loadBpm();
    loadBpmModifier();
    loadVibrationMode();
  }, [loadBpm, loadBpmModifier, loadVibrationMode]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
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
              />
            </Card>
            <FrequencyInput
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              setFrequency={saveBpm}
              cueingFrequency={bpm}
            />
            <Card style={styles.inputContainer} title="Modus">
              <View style={styles.buttonContainer}>{vibrationModeButtons}</View>
            </Card>
            <Card style={styles.inputContainer} title="Schwierigkeit">
              <View style={styles.buttonContainer}>{bpmModifierButtons}</View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
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
