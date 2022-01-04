import React from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';
import Colors from '../constants/Colors';
import { TrackedTime } from '../types';

export type WeeklyProps = {
  times?: TrackedTime[];
  xLabels?: string[];
  yLabels?: number[];
};

export const Weekly = ({ times, xLabels, yLabels }: WeeklyProps) => {
  return (
    <>
      <Text style={{ fontSize: 24, paddingTop: StatusBar.currentHeight }}>
        Woche
      </Text>
      <View style={{ width: '100%', padding: 0 }}>
        {times && xLabels && yLabels ? (
          <VictoryChart
            domainPadding={20}
            width={350}
            padding={70}
            theme={VictoryTheme.material}
          >
            <VictoryAxis
              label="Tag"
              style={{
                axisLabel: { padding: 35 },
                tickLabels: { padding: 15 },
              }}
              tickValues={xLabels}
              fixLabelOverlap
            />
            <VictoryAxis
              label="Minuten"
              dependentAxis
              tickValues={yLabels}
              style={{ axisLabel: { padding: 50 } }}
            />
            <VictoryBar data={times} x="day" y="time" />
          </VictoryChart>
        ) : (
          <ActivityIndicator size="large" color={Colors.primary} />
        )}
      </View>
    </>
  );
};
