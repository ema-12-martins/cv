import React from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import MainTabs from './MainTabs';

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <MainTabs />
    </View>
  );
}
