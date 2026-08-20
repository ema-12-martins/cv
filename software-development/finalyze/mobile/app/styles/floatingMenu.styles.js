import { StyleSheet } from 'react-native';

export const floatingMenuStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  menu: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: 250,
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#9370DB',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});