import React from 'react';
import { Text } from 'react-native';
import { TrackedTime } from '../types';
import { Card } from './Card';
export type LifetimeProps = {
  times?: TrackedTime[];
};

export const Lifetime = ({ times }: LifetimeProps) => {
  return (
    <Card>
      <Text>
        {times?.map((time) => time.time).reduce((acc, curr) => acc + curr)}
      </Text>
    </Card>
  );
};
