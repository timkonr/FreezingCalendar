import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SettingsButton } from './components/SettingsButton';
import { MetronomScreen } from './screens/MetronomScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StartScreen } from './screens/StartScreen';
import { StatistikScreen } from './screens/StatistikScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ orientation: 'portrait_up' }}
      >
        <Stack.Screen
          name="Home"
          component={StartScreen}
          options={{ title: 'Start' }}
        />
        <Stack.Screen
          name="Metronom"
          component={MetronomScreen}
          options={{ headerRight: SettingsButton }}
        />
        <Stack.Screen name="Statistik" component={StatistikScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
