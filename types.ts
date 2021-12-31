import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Metronom: undefined;
  Statistik: undefined;
  Settings: undefined;
};

export type Props<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type TrackedTime = {
  day: string;
  time: number;
}
