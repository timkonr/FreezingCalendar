import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, TouchableHighlight, View } from 'react-native';
import { RootStackParamList } from '../types';

export const SettingsButton = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View
      style={{
        height: 24,
        width: 24,
        margin: 'auto',
        padding: 'auto',
      }}
    >
      <TouchableHighlight
        onPress={() => {
          navigation.navigate('Settings');
        }}
        activeOpacity={0.6}
        underlayColor="white"
      >
        <Image
          style={{
            height: '100%',
            width: '100%',
          }}
          source={require('../assets/baseline_settings_black_24dp.png')}
        />
      </TouchableHighlight>
    </View>
  );
};
