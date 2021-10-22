import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Card = ({ children, style }: CardProps) => {
  return <View style={{ ...styles.card, ...(style as {}) }}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 6,
    backgroundColor: 'white',
    elevation: 8,
    padding: 20,
    borderRadius: 10,
  },
});
