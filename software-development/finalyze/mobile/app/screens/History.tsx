import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StyleSheet } from 'react-native';
import BottomSheet from '../components/BottomSheet';
import TrackingEntry from '../components/TrackingEntry';
import { useAuth } from '../contexts/AuthContext';
import LineSeparator from '../components/LineSeparator';
import SavingsTargetDisplay from '../components/SavingsTargetDisplay';

import COLORS from '../constants/colors';

type Entry = {
  id: number;
  value: number;
  label: string;
  category: string;
  occurrenceDate: string;
  type: string;
};

type SavingsTarget = {
  id: number;
  userId: number;
  name: string;
  amount: number;
  byDate: string;
  priority: number;
  active: boolean;
};

type FilterType = 'date' | 'amount';
type SortOrder = 'asc' | 'desc';

export default function HistoryScreen() {
  const api_url = process.env.EXPO_PUBLIC_API_URL;
  const { user } = useAuth();
  const userId = user?.id;

  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savingsTarget, setSavingsTarget] = useState<SavingsTarget | null>(
    null
  );
  const [amountSaved, setamountSaved] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    if (userId) {
      fetchEntries(false);
      fetchHighestPrioritySavingsTarget();
      fetchamountSavedForCategory('Savings');
    }
  }, [userId]);

  // Fetch entries when filter type or sort order changes
  useEffect(() => {
    if (userId && entries.length > 0) {
      fetchEntries(false);
    }
  }, [filterType, sortOrder]);

  const fetchEntries = async (loadMore: boolean) => {
    try {
      if (loadMore) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const response = await fetch(
        `${api_url}/tracking?userId=${userId}&page=${loadMore ? currentPage : 0}&size=10&sortBy=${filterType}&sortOrder=${sortOrder}`
      );
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data: Entry[] = await response.json();
      console.log(data);

      if (loadMore) {
        setEntries((prevEntries) => [...prevEntries, ...data]);
        setCurrentPage((prev) => prev + 1);
      } else {
        setEntries(data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch tracking entries:', error);
      setError('Failed to load tracking entries');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchHighestPrioritySavingsTarget = async () => {
    try {
      const response = await fetch(
        `${api_url}/savings-target/highest-priority?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data: SavingsTarget = await response.json();
      console.log('Highest Priority Savings Target:', data);
      setSavingsTarget(data);
    } catch (error) {
      console.error('Failed to fetch highest-priority savings target:', error);
      setError('No data to display.');
    }
  };

  const fetchamountSavedForCategory = async (categoryName: string) => {
    try {
      const response = await fetch(
        `${api_url}/expenses/total/user/${userId}/category/${categoryName}`
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const total: number = await response.json();
      console.log(`Total expenses for category "${categoryName}":`, total);
      setamountSaved(total);
    } catch (error) {
      console.error('Failed to fetch total expenses for category:', error);
      setError('Failed to load total expenses');
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && entries.length > 0) {
      fetchEntries(true);
    }
  };

  const handleRefresh = () => {
    fetchEntries(false);
  };

  const toggleFilter = () => {
    const newFilterType = filterType === 'date' ? 'amount' : 'date';
    setFilterType(newFilterType);
    // Reset pagination when changing filter
    setCurrentPage(0);
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);
    // Reset pagination when changing sort order
    setCurrentPage(0);
  };

  const renderItem = ({ item }: { item: Entry }) => (
    <View>
      <TrackingEntry
        id={item.id}
        value={item.value}
        label={item.label}
        category={item.category}
        occurrenceDate={item.occurrenceDate}
        type={item.type}
      />
      <LineSeparator />
    </View>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
        <Text style={styles.filterButtonText}>
          Sort by: {filterType === 'date' ? 'Date' : 'Amount'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sortOrderButton}
        onPress={toggleSortOrder}
      >
        <Text style={styles.filterButtonText}>
          {sortOrder === 'desc' ? '↓ Desc' : '↑ Asc'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (isLoading && entries.length === 0) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error && entries.length === 0) {
      return (
        <Text style={{ textAlign: 'center', padding: 20 }}>Error: {error}</Text>
      );
    }

    if (entries.length === 0) {
      return (
        <Text style={{ textAlign: 'center', padding: 20 }}>
          No tracking entries found
        </Text>
      );
    }

    return (
      <View style={styles.listContainer}>
        {renderFilterButtons()}
        <FlatList
          data={entries}
          keyExtractor={(item, index) =>
            `${item.category}-${item.occurrenceDate}-${index}`
          }
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {amountSaved !== null && savingsTarget && (
        <View style={styles.savingsTargetContainer}>
          <SavingsTargetDisplay
            name={savingsTarget.name}
            target={savingsTarget.amount}
            byDate={savingsTarget.byDate}
            saved={amountSaved || 0}
          />
        </View>
      )}
      <View style={styles.bottomSheetContainer}>
        <BottomSheet>{renderContent()}</BottomSheet>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  savingsTargetContainer: {
    flex: 0,
    height: 'auto',
  },
  bottomSheetContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    gap: 12,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  sortOrderButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
