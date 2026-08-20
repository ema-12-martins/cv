import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    // zIndex: 0,
  },
  shapeContainer1: {
    position: 'absolute',
    top: -40,
    right: -100,
    width: 200,
    height: 200,
    // zIndex: 1,
  },
  shape: {
    opacity: 0.7,
  },
  kav: {
    flex: 1,
  },
  bottomSheet: {
    flex: 1,
    marginTop: '40%',
    // fontFamily: "SpaceMono-Regular",
  },
  bottomSheetContent: {
    justifyContent: 'center',
    flex: 1,
  },
  titleContainer: {
    position: 'absolute',
    top: '7.5%',
    width: '100%',
    zIndex: 10,
    paddingHorizontal: SPACING.small,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    textAlign: 'center',
    color: COLORS.white,
    fontWeight: 'bold',
  },
  label: {
    fontSize: FONT_SIZES.medium,
    marginBottom: SPACING.xxsmall,
    paddingHorizontal: SPACING.large,
    color: COLORS.black,
    fontWeight: '500',
  },
  input: {
    // height: 40,
    fontSize: FONT_SIZES.medium,
    borderWidth: 0,
    marginBottom: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: SPACING.medium,
    backgroundColor: COLORS.secondary,
  },
  button: {
    width: '57.5%',
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.large,
    paddingVertical: SPACING.small,
    marginTop: SPACING.small,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: SPACING.medium,
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: FONT_SIZES.medrium,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xlarge,
  },
  signupText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.medium,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: SPACING.small,
    textAlign: 'center',
  },
  headerContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#805AD5',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  shape: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
