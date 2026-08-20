// maintabStyles.js
import { StyleSheet, Dimensions } from 'react-native'; // Import Dimensions
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import FONT_SIZES from '../constants/font_sizes';

// Calculate width available for each tab based on total width and gap size
// This is a rough estimation; adjust 'YOUR_GAP_WIDTH' and 'YOUR_ICON_SIZE_APPROX' as needed
const SCREEN_WIDTH = Dimensions.get('window').width;
const MIDDLE_GAP_WIDTH = SCREEN_WIDTH * 0.15; // Example: 15% of screen width for the gap
const PADDING_HORIZONTAL = SPACING.medium * 2; // Double default padding for edges
// Approx width per tab item, accounting for gap and padding.
// (SCREEN_WIDTH - PADDING_HORIZONTAL - MIDDLE_GAP_WIDTH) / 4 actual tabs
const TAB_ITEM_WIDTH =
  (SCREEN_WIDTH - PADDING_HORIZONTAL - MIDDLE_GAP_WIDTH) / 4;

export const maintabStyles = StyleSheet.create({
  // Style for each individual tab bar item (e.g., Home, Profile)
  tabBarItem: {
    backgroundColor: 'transparent',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // Set a flexible basis for items, so they fill remaining space after the gap
    flex: 1, // Let items expand to fill remaining space
    maxWidth: TAB_ITEM_WIDTH, // Cap max width to prevent them from becoming too large
  },
  // Style for the main container of the tab bar
  tabBarContainer: {
    position: 'absolute',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'space-between', // Changed to space-between
    alignItems: 'center', // Center items vertically
    backgroundColor: '#CAD3FF',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    // borderRadius: 0,
    borderTopLeftRadius: SPACING.xlarge,
    borderTopRightRadius: SPACING.xlarge,
    paddingHorizontal: PADDING_HORIZONTAL / 2, // Apply padding to the container
    height: 60,
  },
  // Style for the content inside each tab bar item (e.g., icon and text)
  tabBarContent: {
    // This style is now largely controlled by customTabBar's internal layout
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Style for the icon container when the tab is focused (active)
  iconContainerFocused: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 8,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  // Style for the icon container when the tab is unfocused (inactive)
  iconContainerUnfocused: {
    backgroundColor: 'transparent',
    borderRadius: 15,
    padding: 8,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  // Style for the container of the main content scene
  sceneContainer: {
    backgroundColor: 'transparent',
    paddingBottom: 30,
  },
  // --- NEW STYLE FOR THE MIDDLE GAP ---
  middleGap: {
    width: MIDDLE_GAP_WIDTH,
    height: '100%',
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.xxxlarge,
    padding: 8,
    borderWidth: 0,
    borderColor: 'transparent',
    bottom: 14,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const tabColors = {
  activeTint: '#FFFFFF',
  inactiveTint: '#E8E0F0',
};
