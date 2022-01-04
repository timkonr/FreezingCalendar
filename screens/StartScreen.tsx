import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { Props } from '../types';

export const StartScreen = ({ navigation }: Props<'Home'>) => {
  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Metronom')}
          activeOpacity={0.6}
          style={{ ...styles.button, backgroundColor: Colors.primary }}
        >
          <Text
            style={{
              fontSize: 45,
              color: 'white',
            }}
          >
            TRAINING
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Statistik')}
          activeOpacity={0.6}
          style={{ ...styles.button, backgroundColor: Colors.secondary }}
        >
          <Text
            style={{
              fontSize: 45,
              color: 'white',
            }}
          >
            STATISTIK
          </Text>
        </TouchableOpacity>
      </View>
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
  button: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    color: 'white',
    marginVertical: 10,
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    padding: 15,
  },
});
