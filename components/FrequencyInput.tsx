import React, { useState } from 'react';
import {
  Alert,
  Button,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Colors from '../constants/Colors';
import { maxBpm, minBpm } from '../constants/Values';
import { Input } from './Input';

export type FrequencyInputProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFrequency: (value: React.SetStateAction<number>) => void;
};

export const FrequencyInput = ({
  modalVisible,
  setModalVisible,
  setFrequency,
}: FrequencyInputProps) => {
  const [enteredValue, setEnteredValue] = useState('');

  const numberInputHandler = (inputText) => {
    setEnteredValue(inputText.replace(/[^0-9]/g, ''));
  };

  const resetInputHandler = () => {
    setEnteredValue('');
    setModalVisible(false);
  };

  const confirmInputHandler = () => {
    const chosenNumber = parseInt(enteredValue);
    if (isNaN(chosenNumber) || chosenNumber < minBpm || chosenNumber > maxBpm) {
      Alert.alert(
        'Ungültige Frequenz',
        `Frequenz muss zwischen ${minBpm} und ${maxBpm} bpm liegen.`,
        [{ text: 'Okay', style: 'destructive', onPress: resetInputHandler }]
      );
      return;
    }
    setFrequency(chosenNumber);
    setEnteredValue('');
    Keyboard.dismiss();
  };

  return (
    <Modal animationType="slide" transparent={false} visible={modalVisible}>
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
          value={enteredValue}

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
    maxWidth: "100%"
  },
  button: {
    width: 100,
  },
  inputContainer: {
    alignItems: 'center',
    margin: 40,
  },
});
