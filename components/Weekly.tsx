import React from 'react';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import { styles } from '../constants/Styles';
import { TrackedTime } from '../types';
import { Card } from './Card';

export type WeeklyProps = {
  times: TrackedTime[];
  xLabels: string[];
  yLabels: number[];
};

export const Weekly = ({ times, xLabels, yLabels }: WeeklyProps) => {
  return (
    <Card style={styles.inputContainer} title="Woche">
      <VictoryChart
        domainPadding={20}
        width={320}
        height={200}
        padding={{ left: 80, right: 40, bottom: 60, top: 20 }}
        style={{
          parent: { padding: 0 },
        }}
      >
        <VictoryAxis
          label="Tag"
          style={{
            axisLabel: { padding: 35 },
            tickLabels: { padding: 15 },
            grid: { stroke: 'white', strokeDasharray: 1 },
            ticks: { stroke: 'white', strokeDasharray: 1, size: 2 },
            axis: { strokeOpacity: 0.4 },
          }}
          tickValues={xLabels}
          fixLabelOverlap
        />
        <VictoryAxis
          label="Minuten"
          dependentAxis
          tickValues={yLabels}
          style={{
            axisLabel: { padding: 50 },
            grid: {
              stroke: 'white',
              strokeDasharray: 1,
            },
            ticks: { stroke: 'white', strokeDasharray: 1, size: 2 },
            axis: { strokeOpacity: 0.4 },
          }}
        />
        <VictoryLine
          data={times}
          x="day"
          y="time"
          style={{
            data: {
              stroke: 'black',
              strokeWidth: 1,
            },
          }}
        />
      </VictoryChart>
    </Card>
  );
};
