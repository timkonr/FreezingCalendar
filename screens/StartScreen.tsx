import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Card } from '../components/Card';
import { Props } from '../types';

export const StartScreen = ({ navigation }: Props<'Home'>) => {
  return (
    <View style={styles.screen}>
      <Card style={styles.inputContainer}>
        <View style={styles.buttonContainer}>
          <Button
            title="Metronom"
            onPress={() => navigation.navigate('Metronom')}
          />
          <Button
            title="Statistik"
            onPress={() => navigation.navigate('Statistik')}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  'screen button': { margin: 10 },
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
  button: {
    width: 100,
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    padding: 15,
  },
});
