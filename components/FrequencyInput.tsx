import React, { useState } from 'react';
import {
  Alert,
  Button,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Colors from '../constants/Colors';
import { maxBpm, minBpm } from '../constants/Values';
import { Input } from './Input';

export type FrequencyInputProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFrequency: (frequency: number) => void;
  cueingFrequency?: number;
};

export const FrequencyInput = ({
  modalVisible,
  setModalVisible,
  setFrequency,
  cueingFrequency,
}: FrequencyInputProps) => {
  const [input, setInput] = useState(cueingFrequency?.toString() ?? '');

  const numberInputHandler = (text: string) => {
    setInput(text.replace(/[^0-9]/g, ''));
  };

  const resetInputHandler = () => {
    setInput('');
    setModalVisible(false);
  };

  const confirmInputHandler = () => {
    const chosenNumber = parseInt(input);
    if (isNaN(chosenNumber) || chosenNumber < minBpm || chosenNumber > maxBpm) {
      Alert.alert(
        'Ungültige Frequenz',
        `Frequenz muss zwischen ${minBpm} und ${maxBpm} bpm liegen.`,
        [{ text: 'Okay', style: 'destructive' }]
      );
      return;
    }
    setFrequency(chosenNumber);
    setInput('');
    Keyboard.dismiss();
  };

  return (
    <Modal animationType="slide" transparent={false} visible={modalVisible}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={(styles.centeredView, styles.inputContainer)}>
          <Text>Frequenz in bpm</Text>
          <Input
            blurOnSubmit
            style={styles.input}
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType="number-pad"
            maxLength={3}
            onChangeText={numberInputHandler}
            value={input}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title="Abbrechen"
                onPress={resetInputHandler}
                color={Colors.accent}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Bestätigen"
                onPress={confirmInputHandler}
                color={Colors.primary}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
  },
  input: {
    width: 150,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 15,
    maxWidth: '100%',
  },
  button: {
    width: 100,
  },
  inputContainer: {
    alignItems: 'center',
    margin: 40,
  },
});
