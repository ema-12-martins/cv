import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext'; // seu contexto de auth
import BackgroundLayout from '../components/BackgroundContainer';

type Notification = {
  id: number;
  userId: number;
  notificationDate: string;
  title: string;
  text: string;
};

export default function NotificationListScreen() {
  const api_url = process.env.EXPO_PUBLIC_API_URL;
  const { user } = useAuth();
  const userId = user?.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    fetch(`${api_url}/notifications/user/${userId}`)
      .then((res) => {
        console.log(`${api_url}/notifications/user/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return res.json();
      })
      .then((data: Notification[]) => {
        const sorted = data.sort(
          (a, b) =>
            new Date(b.notificationDate).getTime() -
            new Date(a.notificationDate).getTime()
        );
        setNotifications(sorted);
        setLoading(false);
        markAllAsRead(userId); //all true
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const markAllAsRead = async (userId: number) => {
    try {
      const res = await fetch(
        `${api_url}/notifications/user/${userId}/mark-all-read`,
        {
          method: 'PUT',
        }
      );

      if (!res.ok) {
        console.warn('Falha ao marcar notificações como lidas');
      }
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err);
    }
  };

  if (loading) {
    return (
      <BackgroundLayout title="Notifications">
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      </BackgroundLayout>
    );
  }

  if (error) {
    return (
      <BackgroundLayout title="Notifications">
        <Text style={styles.errorText}>{error}</Text>
      </BackgroundLayout>
    );
  }

  if (notifications.length === 0) {
    return (
      <BackgroundLayout title="Notifications">
        <Text style={styles.noDataText}>No notifications found.</Text>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout title="Notifications">
      <View style={styles.contentContainer}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>
                {new Date(item.notificationDate).toLocaleDateString()}
              </Text>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          )}
        />
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    overflow: 'hidden',
  },

  notificationItem: {
    backgroundColor: '#d6d6f5',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  noDataText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});
