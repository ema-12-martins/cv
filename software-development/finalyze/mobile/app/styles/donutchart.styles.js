import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const donutChartStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.medium,
    backgroundColor: COLORS.grey,
    borderRadius: SPACING.medium,
    marginVertical: SPACING.small,
  },
  donutChart: {
    flex: 1,
    alignItems: 'center',
    marginRight: SPACING.medium,
    paddingBottom: SPACING.medium,
  },
  coloredBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: SPACING.small,
  },

  legendContainer: {
    flex: 2,
  },
  legendText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
  },
  legendEntryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  differenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    flex: 1,
  },
  negative: {
    color: 'green',
  },
  positive: {
    color: 'red',
  },
});
