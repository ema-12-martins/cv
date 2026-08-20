import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { newProfileStyles } from '../styles/newProfile.styles';
import BottomSheet from '../components/BottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackingEntry from '../components/TrackingEntry';
import LineSeparator from '../components/LineSeparator';
import TabSwitcher from '../components/TabSwitcher';
import { TouchableOpacity } from 'react-native';
import {
  useNavigation,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Entry = {
  id: number;
  value: number;
  label: string;
  category: string;
  occurrenceDate: string;
  type: string;
};

const api_url = process.env.EXPO_PUBLIC_API_URL;

export default function NewProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'incomes' | 'expenses'>('incomes');

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const loadImage = async () => {
      if (!user?.email) return;
      const uri = await AsyncStorage.getItem(`profileImage_${user.email}`);
      if (uri) setProfileImage(uri);
    };
    loadImage();
  }, [user]);

  const fetchEntries = useCallback(
    async (loadMore: boolean, pageNumber?: number) => {
      if (!user?.id) return;

      try {
        if (loadMore) {
          setLoading(true);
        } else {
          setIsRefreshing(true);
        }

        const pageToFetch = pageNumber !== undefined ? pageNumber : 0;

        const response = await fetch(
          `${api_url}/tracking?userId=${user.id}&page=${pageToFetch}&size=${pageSize}`
        );

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        const data: Entry[] = await response.json();

        const filtered = data.filter((entry) =>
          activeTab === 'incomes'
            ? entry.type.toLowerCase() === 'income'
            : entry.type.toLowerCase() === 'expense'
        );

        if (loadMore) {
          setEntries((prev) => [...prev, ...filtered]);
          setCurrentPage(pageToFetch + 1);
        } else {
          setEntries(filtered);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Failed to fetch tracking entries:', error);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [user, activeTab]
  );

  const fetchPoints = async () => {
    if (!user?.id) {
      console.warn('[XP] No user ID available, skipping XP fetch');
      return;
    }

    try {
      const res = await fetch(`${api_url}/gamification/user/${user.id}/points`);
      const data = await res.json();
      if (typeof data === 'number') {
        setPoints(data);
      } else if (data && typeof data.points === 'number') {
        setPoints(data.points);
      } else {
        console.warn('[XP] Unexpected response format:', data);
      }
    } catch (error) {
      console.error('[XP] Failed to fetch points:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPoints();
    }, [user])
  );

  useEffect(() => {
    setCurrentPage(0);
    fetchEntries(false, 0);
  }, [fetchEntries, activeTab, user]);

  const handleRefresh = () => {
    fetchEntries(false, 0);
  };

  const handleLoadMore = () => {
    if (!loading) {
      fetchEntries(true, currentPage);
    }
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

  return (
    <BottomSheet>
      <View style={{ flex: 1 }}>
        <View style={newProfileStyles.container}>
          {/* Profile Image */}
          <View style={newProfileStyles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={newProfileStyles.profileImage}
              />
            ) : (
              <View style={newProfileStyles.profileImagePlaceholder}>
                <Text style={newProfileStyles.profileImagePlaceholderText}>
                  Profile
                </Text>
              </View>
            )}
          </View>

          <Text style={{ fontSize: 48, fontWeight: 'bold' }}>
            {user?.name || 'User'}
          </Text>

          <View style={newProfileStyles.levelInfoContainer}>
            <Text style={newProfileStyles.levelText}>Level</Text>
            <Text style={newProfileStyles.xpPoints}>{points} XP</Text>
          </View>

          {/* Use your reusable TabSwitcher here */}
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Entries list wrapper with flex:1 to contain FlatList */}
          <View style={newProfileStyles.entriesWrapper}>
            {loading && entries.length === 0 ? (
              <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : entries.length === 0 ? (
              <Text style={{ marginTop: 20, textAlign: 'center' }}>
                No {activeTab} found.
              </Text>
            ) : (
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={entries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                style={{ flex: 1 }}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
              />
            )}
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
