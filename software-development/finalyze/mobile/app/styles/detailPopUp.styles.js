import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const detailStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.medium,
    padding: 20,
    elevation: 10,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  fieldIndicator: {
    fontSize: 18,
    color: COLORS.primary,
  },
  text: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.primary,
  },
  buttonRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.small,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
