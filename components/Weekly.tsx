import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import Colors from '../constants/Colors';
import { TrackedTime } from '../types';
import { Card } from './Card';

export type WeeklyProps = {
  times?: TrackedTime[];
  xLabels?: string[];
  yLabels?: number[];
};

export const Weekly = ({ times, xLabels, yLabels }: WeeklyProps) => {
  return (
    <Card style={styles.inputContainer} title="Woche">
      {times && xLabels && yLabels ? (
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
      ) : (
        <ActivityIndicator size="large" color={Colors.primary} />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
  inputContainer: {
    maxWidth: '90%',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: Colors.primaryLight,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 15,
  },
  button: {
    width: 100,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});
