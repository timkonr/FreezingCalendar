import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Metronom: undefined;
};

export type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
