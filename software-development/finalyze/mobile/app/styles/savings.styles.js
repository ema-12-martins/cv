import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const savingsStyles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.small,
  },
  column: {
    flex: 1, // Allow the column to take up available space
    justifyContent: 'center', // Center items vertically in the column
    alignItems: 'center', // Center the column itself
  },
  valuesContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between the two columns
    alignItems: 'center', // Center the columns vertically
    paddingHorizontal: SPACING.medium,
  },

  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center', // Center the columns vertically
    paddingHorizontal: SPACING.medium,
    marginVertical: SPACING.small,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'left', // Align text to the left inside the column
  },
  value: {
    fontSize: FONT_SIZES.large,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'left', // Align text to the left inside the column
  },
  vLineSeparator: {
    width: 1, // Vertical line width
    backgroundColor: COLORS.gray, // Line color
    height: '80%', // Adjust height to fit content
    alignSelf: 'center', // Center the line vertically
  },
  progressBar: {
    margin: SPACING.small,
    elevation: 10,
  },
  percentage: {
    fontSize: FONT_SIZES.small,
    color: COLORS.black,
  },
});
