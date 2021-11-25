import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Props } from '../types';

export const StartScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.screen}>
      <Button
        title="Metronom"
        onPress={() => navigation.navigate('Metronom')}
      />
    </View>
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
