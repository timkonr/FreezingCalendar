import { StatusBar, StyleSheet } from 'react-native';
import Colors from './Colors';

export const styles = StyleSheet.create({
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
