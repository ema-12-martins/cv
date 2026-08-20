import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PointsProvider } from './contexts/PointsContext';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import IncomeInsertionScreen from './screens/IncomeInsertion';
import ExpenseInsertionScreen from './screens/ExpenseInsertion';
import TrackingScreen from './screens/TrackingScreen';
import IncomeUpdateScreen from './screens/IncomeUpdateScreen';
import ExpenseUpdateScreen from './screens/ExpenseUpdateScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationListScreen from './screens/NotificationListScreen';
import { usePeriodicNotification } from './hooks/usePeriodicNotification';
import QuickAnalysisScreen from './screens/QuickAnalysisScreen';
import FixedVariableScreen from './screens/FixedVariable';
import AwardsScreen from './screens/AwardsScreen';
import NewProfileScreen from './screens/ProfileScreenNew';
import SavingsInsertionScreen from './screens/SavingsInsertion';
import ListSavings from './screens/ListSavings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  usePeriodicNotification(user?.id);

  if (loading) return null;

  console.log('User in AppNavigator:', user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen
            name="Notifications"
            component={NotificationListScreen}
          />
          <Stack.Screen
            name="IncomeInsertion"
            component={IncomeInsertionScreen}
          />
          <Stack.Screen
            name="ExpenseInsertion"
            component={ExpenseInsertionScreen}
          />
          <Stack.Screen name="Tracking" component={TrackingScreen} />
          <Stack.Screen name="IncomeUpdate" component={IncomeUpdateScreen} />
          <Stack.Screen name="ExpenseUpdate" component={ExpenseUpdateScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="QuickAnalysis" component={QuickAnalysisScreen} />
          <Stack.Screen name="FixedVariable" component={FixedVariableScreen} />
          <Stack.Screen name="Awards" component={AwardsScreen} />
          <Stack.Screen name="NewProfile" component={NewProfileScreen} />
          <Stack.Screen name="ListSavings" component={ListSavings} />
          <Stack.Screen
            name="SavingsInsertion"
            component={SavingsInsertionScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <PointsProvider>
            <AppNavigator />
          </PointsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
