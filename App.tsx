import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from './components/Header';
import MetronomScreen from './screens/MetronomScreen';

export default function App() {
  return (
    <View style={styles.screen}>
      <Header title={"Unfreeze me"} />
      <MetronomScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
