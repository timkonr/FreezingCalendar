import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Keyboard,
  Alert,
  Modal,
} from "react-native";
import Input from "./Input";
import Colors from "../constants/Colors";

const minBpm = 10;
const maxBpm = 200;

const FrequencyInput = (props) => {
  const [enteredValue, setEnteredValue] = useState("");

  const numberInputHandler = (inputText) => {
    setEnteredValue(inputText.replace(/[^0-9]/g, ""));
  };

  const resetInputHandler = () => {
    setEnteredValue("");
    props.setModalVisible(false);
  };

  const confirmInputHandler = () => {
    const chosenNumber = parseInt(enteredValue);
    if (isNaN(chosenNumber) || chosenNumber < minBpm || chosenNumber > maxBpm) {
      Alert.alert(
        "Ungültige Frequenz",
        `Frequenz muss zwischen ${minBpm} und ${maxBpm} bpm liegen.`,
        [{ text: "Okay", style: "destructive", onPress: resetInputHandler }]
      );
      return;
    }
    props.setFrequency(chosenNumber);
    setEnteredValue("");
    Keyboard.dismiss();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.modalVisible}
    >
      <View style={(styles.centeredView, styles.inputContainer)}>
        <Text>Frequenz in bpm</Text>
        <Input
          style={styles.input}
          blurOnSubmit
          autoCapitalize={"none"}
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
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
  },
  input: {
    width: 150,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 15,
  },
  button: {
    width: 100,
  },
  inputContainer: {
    // width: 300,
    maxWidth: "80%",
    alignItems: "center",
    margin: 10,
  },
});

export default FrequencyInput;
