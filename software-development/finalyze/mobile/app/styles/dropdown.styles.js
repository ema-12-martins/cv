import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const dropdownStyles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderRadius: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.secondary,
    marginBottom: SPACING.small,
  },
  dropdownDisabled: {
    height: 50,
    borderRadius: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.grey,
    marginBottom: SPACING.small,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  placeholderStyle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    paddingLeft: 0,
  },
  selectedTextStyle: {
    fontSize: FONT_SIZES.medium,
    marginBottom: SPACING.xxsmall,
    paddingHorizontal: SPACING.xxxsmall,
    color: COLORS.black,
    fontWeight: '500',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: FONT_SIZES.medium,
    borderRadius: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    color: COLORS.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  item: {
    padding: SPACING.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  textItem: {
    fontSize: FONT_SIZES.medium,
    marginBottom: SPACING.xxsmall,
    paddingHorizontal: SPACING.medium,
    color: COLORS.black,
    fontWeight: '500',
  },
  icon: {
    marginRight: SPACING.small,
  },
});
