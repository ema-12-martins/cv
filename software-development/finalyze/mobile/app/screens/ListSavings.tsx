// frontend/src/screens/SavingGoalsListScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useAuth } from '../contexts/AuthContext';
import BackgroundLayout from '../components/BackgroundContainer';

type SavingGoal = {
  id: number;
  userId: number;
  name: string;
  amount: number;
  byDate: string;
  priority: number;
  active: boolean;
};

export default function SavingGoalsListScreen() {
  const api_url = process.env.EXPO_PUBLIC_API_URL;
  const { user } = useAuth();
  const userId = user?.id;

  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    fetch(`${api_url}/savings-target/user?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch saving goals');
        return res.json();
      })
      .then((data: SavingGoal[]) => {
        const sorted = data.sort((a, b) => a.priority - b.priority);
        setGoals(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const updatePrioritiesOnServer = async (reorderedGoals: SavingGoal[]) => {
    try {
      await fetch(`${api_url}/savings-target/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reorderedGoals),
      });
    } catch (err) {
      console.error('Error updating priorities', err);
      // Você pode adicionar aqui um rollback se quiser reverter as mudanças no caso de erro
    }
  };

  if (loading) {
    return (
      <BackgroundLayout title="Saving Goals">
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      </BackgroundLayout>
    );
  }

  if (error) {
    return (
      <BackgroundLayout title="Saving Goals">
        <Text style={styles.errorText}>{error}</Text>
      </BackgroundLayout>
    );
  }

  if (goals.length === 0) {
    return (
      <BackgroundLayout title="Saving Goals">
        <Text style={styles.noDataText}>No saving goals found.</Text>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout title="Saving Goals">
      <View style={styles.contentContainer}>
        <DraggableFlatList
          data={goals}
          keyExtractor={(item) => item.id.toString()}
          onDragEnd={({ data }) => {
            // Atualiza as prioridades localmente primeiro
            const updatedGoals = data.map((goal, index) => ({
              ...goal,
              priority: index + 1,
            }));

            setGoals(updatedGoals); // Atualiza o estado local imediatamente
            updatePrioritiesOnServer(updatedGoals); // Envia para o servidor
          }}
          renderItem={({
            item,
            drag,
            isActive,
          }: RenderItemParams<SavingGoal>) => (
            <Pressable
              onLongPress={drag}
              delayLongPress={150}
              style={[
                styles.goalItem,
                { backgroundColor: isActive ? '#d0d0ff' : '#f0f0ff' },
              ]}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.amount}>
                Target: €{item.amount.toFixed(2)}
              </Text>
              <Text style={styles.date}>
                By: {new Date(item.byDate).toLocaleDateString()}
              </Text>
              <Text style={styles.priority}>Priority: {item.priority}</Text>
              <Text style={styles.status}>
                Status: {item.active ? 'Active' : 'Inactive'}
              </Text>
            </Pressable>
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
  goalItem: {
    backgroundColor: '#f0f0ff',
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
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  amount: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  priority: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  status: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
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
