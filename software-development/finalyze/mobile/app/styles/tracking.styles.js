import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const trackingStyles = StyleSheet.create({
  trackingEntryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  trackingEntryIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SPACING.medium,
    backgroundColor: COLORS.blue,
    padding: SPACING.small,
    height: 50,
    width: 50,
    elevation: 4,
  },
  trackingEntryInfoContainer: {
    height: 50,
    marginLeft: 10,
  },
  trackingEntryValueContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  trackingEntryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 18,
    alignItems: 'flex-start',
  },
  labelText: {},
  valueText: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.blue,
  },
});
