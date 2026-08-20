import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';

interface BottomSheetProps {
  children: React.ReactNode;
  style?: ViewStyle;
  // withHandle?: boolean;
  contentContainerStyle?: ViewStyle;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  style,
  // withHandle = true,
  contentContainerStyle,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoiding}
    >
      <View style={[styles.container, style]}>
        {/* {withHandle && <View style={styles.handle} />} */}
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SPACING.xxxlarge,
    borderTopRightRadius: SPACING.xxxlarge,
    paddingHorizontal: SPACING.xlarge,
    paddingTop: SPACING.xxlarge,
    // paddingBottom: SPACING.xxxlarge,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  // handle: {
  //   width: 40,
  //   height: 4,
  //   backgroundColor: COLORS.black,
  //   opacity: 0.2,
  //   borderRadius: 2,
  //   alignSelf: 'center',
  //   marginBottom: SPACING.medium,
  // },
  content: {
    flex: 1,
  },
});

export default BottomSheet;
