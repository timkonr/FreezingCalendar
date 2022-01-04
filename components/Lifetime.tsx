import React from 'react';
import { Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { styles } from '../constants/Styles';
import { TrackedTime } from '../types';
import { Card } from './Card';
export type LifetimeProps = {
  times: TrackedTime[];
};

export const Lifetime = ({ times }: LifetimeProps) => {
  return (
    <Card
      title="Gesamt"
      style={{
        ...styles.inputContainer,
        backgroundColor: Colors.secondaryLight,
        width: '100%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-evenly',
          width: '100%',
          paddingBottom: 70,
        }}
      >
        <View>
          <Text style={{ fontSize: 30, alignSelf: 'center' }}>
            {times.map((time) => time.time).reduce((acc, curr) => acc + curr)}
          </Text>
          <Text style={{ fontSize: 18 }}>Minuten</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30, alignSelf: 'center' }}>
            {times.length}
          </Text>
          <Text style={{ fontSize: 18 }}>Tage</Text>
        </View>
      </View>
    </Card>
  );
};
