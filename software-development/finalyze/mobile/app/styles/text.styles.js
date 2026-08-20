import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const textStyles = StyleSheet.create({
  headerText: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.black,
  },
  bodyText: {
    fontSize: FONT_SIZES.medium,
    marginVertical: SPACING.small,
  },
  smallText: {
    fontSize: FONT_SIZES.small,
    marginVertical: SPACING.small,
  },
  centeredText: {
    textAlign: 'center',
  },
});
