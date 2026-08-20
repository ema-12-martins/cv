import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const styles = StyleSheet.create({
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: SPACING.medium, // Using SPACING.medium
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.black, // Using a grey from COLORS constant
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    color: COLORS.white,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    marginBottom: SPACING.xxsmall,
    paddingHorizontal: SPACING.large,
    color: COLORS.black,
    fontWeight: '500',
  },
  input: {
    fontSize: FONT_SIZES.medium,
    borderWidth: 0,
    marginBottom: SPACING.medium,
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.small,
    borderRadius: SPACING.medium,
    backgroundColor: COLORS.secondary,
  },
  button: {
    width: '40%',
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.large,
    paddingVertical: SPACING.small,
    marginTop: SPACING.small,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red', // Specific color for delete
    marginTop: SPACING.xlarge,
  },
  logoutButton: {
    marginTop: SPACING.small,
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
  },
  levelInfoContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  xpPoints: {
    fontSize: 16,
    color: '#008000',
  },
});
