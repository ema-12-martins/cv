import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { backgroundStyles } from '../styles/background.styles';
import Shape1 from './Shape1';
import {
  ParamListBase,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from '../contexts/AuthContext';
import NotificationEventEmitter from '../events/NotificationEventEmitter';

const api_url = process.env.EXPO_PUBLIC_API_URL;

type BackgroundLayoutProps = {
  title: string;
  children: ReactNode;
  showBackButton?: boolean;
  showLogoutButton?: boolean;
  showTrophyButton?: boolean;
  showBellButton?: boolean;
  onLogout?: () => void;
};

export default function BackgroundLayout({
  title,
  children,
  showBackButton = true,
  showLogoutButton = false,
  showTrophyButton = true,
  showBellButton = true,
  onLogout,
}: BackgroundLayoutProps) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { user } = useAuth();
  const userId = user?.id;
  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUnreadCount();
      }
    }, [userId])
  );

  useEffect(() => {
    const subscription = NotificationEventEmitter.addListener(
      'refreshUnreadCount',
      () => {
        fetchUnreadCount();
      }
    );

    return () => {
      subscription.remove();
    };
  }, [userId]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        `${api_url}/notifications/user/${userId}/unread/count`
      );
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      const data = await response.json();
      setUnreadCount(data);
    } catch (error) {
      console.error('Erro ao buscar notificações não lidas:', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoAwards = () => {
    navigation.navigate('Awards');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#805AD5' }}>
      {/* Header */}
      <View style={backgroundStyles.headerContainer}>
        {showBackButton ? (
          <TouchableOpacity
            style={backgroundStyles.headerItemLeft}
            onPress={handleGoBack}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
        ) : showTrophyButton !== false ? (
          <TouchableOpacity
            style={backgroundStyles.headerItemLeft}
            onPress={handleGoAwards}
          >
            <AntDesign name="Trophy" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={backgroundStyles.headerItemLeft} />
        )}

        {/* Title */}
        <Text style={backgroundStyles.headerTitle}>{title}</Text>

        {/* Bell Icon with Badge */}
        {showBellButton ? (
          <TouchableOpacity
            style={backgroundStyles.headerItemRight}
            onPress={() => navigation.navigate('Notifications')}
          >
            <AntDesign name="bells" size={24} color="white" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={backgroundStyles.headerItemLeft} />
        )}
      </View>

      {/* Shapes */}
      <View style={backgroundStyles.shapeContainer1}>
        <Shape1 style={[backgroundStyles.shape1]} />
        <Shape1 style={[backgroundStyles.shape2]} />
      </View>

      {/* Content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
