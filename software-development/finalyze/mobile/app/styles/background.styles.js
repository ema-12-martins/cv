import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

export const backgroundStyles = StyleSheet.create({
  background: {
    backgroundColor: COLORS.primary,
  },
  headerContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  headerItemLeft: {
    position: 'absolute',
    left: 10,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 15,
    zIndex: 100,
  },
  headerItemRight: {
    position: 'absolute',
    right: 10,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 15,
    zIndex: 100,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'center',
  },
  shapeContainer1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    height: 200,
    // zIndex: 1,
  },
  shape1: {
    opacity: 0.7,
    position: 'absolute',
    top: -70,
    right: -100,
    transform: [{ rotate: '-30deg' }, { scale: 0.7 }],
  },
  shape2: {
    opacity: 0.7,
    position: 'absolute',
    top: -100,
    left: -230,
    transform: [{ rotate: '200deg' }, { scale: 0.8 }],
  },
  logoutButton: {
    position: 'absolute',
    left: 10,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 15,
    zIndex: 100,
  },
});
