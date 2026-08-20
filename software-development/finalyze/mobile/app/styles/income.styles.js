import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const incomeStyles = StyleSheet.create({
  label: {
    fontSize: FONT_SIZES.medium,
    marginBottom: SPACING.xxsmall,
    paddingHorizontal: SPACING.large,
    color: COLORS.black,
    fontWeight: '500',
  },
  input: {
    height: 50,
    fontSize: FONT_SIZES.medium,
    borderWidth: 0,
    marginBottom: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: SPACING.medium,
    backgroundColor: COLORS.secondary,
  },
  labelInput: {
    height: 50,
    fontSize: FONT_SIZES.medium,
    borderWidth: 0,
    marginBottom: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: SPACING.medium,
    backgroundColor: COLORS.secondary,
    flex: 1,
  },
  error: {
    color: 'red',
    marginBottom: SPACING.small,
    textAlign: 'center',
  },
  formWrapper: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    elevation: 4,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#e0dfff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0dfff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#805AD5',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: '#e0dfff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },
});
