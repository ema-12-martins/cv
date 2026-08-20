import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from '../contexts/AuthContext';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppNavigatorParamList } from '../../.expo/types/AppNavigatorParamList';
import FloatingActionMenu from './FloatingActionMenu';
import MainPageScreen from './MainPageScreen';
import TrackingScreen from './TrackingScreen';
import NewProfileScreen from './ProfileScreenNew';
import ProfileScreen from './ProfileScreen';
import HistoryScreen from './History';
import BackgroundLayout from '../components/BackgroundContainer';
import CategoryIcon from '../components/CategoryIcon';
import { tabColors, maintabStyles } from '../styles/maintabStyles';

const Tab = createMaterialTopTabNavigator();

import type { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';

function MyCustomTabBar({
  state,
  descriptors,
  navigation,
  position,
  setMenuVisible,
}: MaterialTopTabBarProps & { setMenuVisible: (visible: boolean) => void }) {
  const { colors } = useTheme();
  const renderIcon = (
    route: { key: string; name: string },
    focused: boolean
  ) => {
    const { options } = descriptors[route.key];
    const category =
      route.name === 'Main'
        ? 'Salary'
        : route.name === 'History'
          ? 'List'
          : route.name === 'Tracking'
            ? 'Pie'
            : route.name === 'Profile'
              ? 'Profile'
              : 'Default';

    return (
      <View
        style={
          focused
            ? maintabStyles.iconContainerFocused
            : maintabStyles.iconContainerUnfocused
        }
      >
        <CategoryIcon category={category} color={'black'} />
      </View>
    );
  };

  return (
    <View style={maintabStyles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <React.Fragment key={route.key}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={maintabStyles.tabBarItem}
            >
              {renderIcon(route, isFocused)}
            </TouchableOpacity>
            {index === 1 && (
              <TouchableOpacity
                style={maintabStyles.addButton}
                onPress={() => setMenuVisible(true)}
              >
                <CategoryIcon category={'Add'} color={'white'} />
              </TouchableOpacity>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default function MainTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppNavigatorParamList>>();

  const getTitle = (index: number) => {
    switch (index) {
      case 0:
        return 'Home';
      case 1:
        return 'History';
      case 2:
        return 'Tracking';
      case 3:
        return 'Profile';
      default:
        return 'Home';
    }
  };

  const IconContainer: React.FC<{
    focused: boolean;
    children: React.ReactNode;
  }> = ({ focused, children }) => (
    <View
      style={
        focused
          ? maintabStyles.iconContainerFocused
          : maintabStyles.iconContainerUnfocused
      }
    >
      {children}
    </View>
  );

  return (
    <BackgroundLayout title={getTitle(activeIndex)} showBackButton={false}>
      <FloatingActionMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onIncome={() => {
          setMenuVisible(false);
          navigation.navigate('IncomeInsertion');
        }}
        onExpense={() => {
          setMenuVisible(false);
          navigation.navigate('ExpenseInsertion');
        }}
        onSaving={() => {
          setMenuVisible(false);
          navigation.navigate('SavingsInsertion');
        }}
        onListSaving={() => {
          setMenuVisible(false);
          navigation.navigate('ListSavings');
        }}
      />

      <Tab.Navigator
        tabBar={(props) => (
          <MyCustomTabBar {...props} setMenuVisible={setMenuVisible} />
        )}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarShowIcon: true,
          tabBarIndicatorStyle: { display: 'none' },
          tabBarItemStyle: maintabStyles.tabBarItem,
          tabBarStyle: maintabStyles.tabBarContainer,
          tabBarContentContainerStyle: maintabStyles.tabBarContent,
          sceneStyle: maintabStyles.sceneContainer,
          tabBarActiveTintColor: tabColors.activeTint,
          tabBarInactiveTintColor: tabColors.inactiveTint,
        }}
        tabBarPosition="bottom"
      >
        <Tab.Screen
          name="Main"
          component={NewProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <IconContainer focused={focused}>
                <CategoryIcon category={'Salary'} color={'black'} />
              </IconContainer>
            ),
          }}
          listeners={{
            focus: () => setActiveIndex(0),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <IconContainer focused={focused}>
                <CategoryIcon category={'List'} color={'black'} />
              </IconContainer>
            ),
          }}
          listeners={{
            focus: () => setActiveIndex(1),
          }}
        />
        <Tab.Screen
          name="Tracking"
          component={TrackingScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <IconContainer focused={focused}>
                <CategoryIcon category={'Pie'} color={'black'} />
              </IconContainer>
            ),
          }}
          listeners={{
            focus: () => setActiveIndex(2),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <IconContainer focused={focused}>
                <CategoryIcon category={'Profile'} color={'black'} />
              </IconContainer>
            ),
          }}
          listeners={{
            focus: () => setActiveIndex(3),
          }}
        />
      </Tab.Navigator>
    </BackgroundLayout>
  );
}
