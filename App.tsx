import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Header } from './components/Header';
import { MetronomScreen } from './screens/MetronomScreen';

export default function App() {
  return (
    <View style={styles.screen}>
      <Header title={'Freezing Calendar'} />
      <MetronomScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
