import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const awardStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: SPACING.small,
  },
  awardName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.small,
  },
  awardDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.black,
    marginBottom: SPACING.small,
  },
  progressText: {
    fontSize: FONT_SIZES.xlarge,
    zIndex: 10,
  },
  awardRecieved: {
    fontSize: FONT_SIZES.xxxlarge,
  },
});
