import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { MetronomScreen } from './screens/MetronomScreen';
import { StartScreen } from './screens/StartScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // <View style={styles.screen}>
    //   <Header title={'Freezing Calendar'} />
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={StartScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen name="Metronom" component={MetronomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    // </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
