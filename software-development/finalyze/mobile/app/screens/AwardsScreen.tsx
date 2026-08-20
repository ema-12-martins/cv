import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomSheet from '../components/BottomSheet';
import BackgroundLayout from '../components/BackgroundContainer';
import Award from '../components/Award';
import AwardRecieved from '../components/AwardRecieved';
import { useAuth } from '../contexts/AuthContext';

export default function AwardsScreen() {
  const [awards, setAwards] = useState<any[]>([]); // State to store fetched awards
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const api_url = process.env.EXPO_PUBLIC_API_URL; // Backend API URL
  const { user } = useAuth();
  const userId = user?.id;

  // Fetch amount saved, awards, and gamification data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch amount saved
        const savedAmount = await fetchAmountSaved();

        // Fetch gamification data
        const gamificationData = await fetchGamification();

        // Fetch awards
        const receivedResponse = await fetch(
          `${api_url}/awards/user/${userId}/received`
        );
        const unreceivedResponse = await fetch(
          `${api_url}/awards/user/${userId}/unreceived`
        );

        if (!receivedResponse.ok || !unreceivedResponse.ok) {
          throw new Error('Failed to fetch awards');
        }

        const receivedAwards = await receivedResponse.json();
        const unreceivedAwards = await unreceivedResponse.json();

        console.log('Received Awards:', receivedAwards);
        console.log('Unreceived Awards:', unreceivedAwards);

        // Combine received and unreceived awards into a single list
        const combinedAwards = [
          ...receivedAwards.map((award: any) => ({
            ...award,
            received: true,
          })),
          ...unreceivedAwards.map((award: any) => ({
            ...award,
            received: false,
            progress: calculateProgress(
              award.conditionType,
              award.conditionThreshold,
              gamificationData,
              savedAmount
            ), // Use the saved amount
          })),
        ];

        setAwards(combinedAwards);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateProgress = (
    type: string,
    threshold: number,
    gamificationData,
    savedAmount
  ): number => {
    console.log(
      `Calculating progress for type: ${type} with threshold: ${threshold}`
    );
    try {
      switch (type) {
        case 'amount_saved': {
          if (savedAmount === null || savedAmount === undefined) {
            return 0; // Return 0 if saved amount is null or undefined
          }
          let value = Math.min(savedAmount / threshold, 1);
          return value;
        }

        case 'consecutive_login': {
          if (!gamificationData || !gamificationData.consecutiveLogin) {
            console.log(gamificationData);
            console.warn(
              'Gamification data not available or consecutiveLogin is missing'
            );
            return 0; // Return 0 if gamification data is not available
          }
          console.log(
            Math.min(gamificationData.consecutiveLogin / threshold, 1)
          ); // NAO TIRAR ESTE LOG, AS COISAS PARAM DE FUNCIONAR
          return Math.min(gamificationData.consecutiveLogin / threshold, 1);
        }

        case 'consecutive_income': {
          if (!gamificationData || !gamificationData.consecutiveIncome) {
            console.warn(
              'GamificationData data not available or consecutiveIncome is missing'
            );
            return 0;
          }
          console.log(
            Math.min(gamificationData.consecutiveIncome / threshold, 1)
          ); // NAO TIRAR ESTE LOG, AS COISAS PARAM DE FUNCIONAR
          return Math.min(gamificationData.consecutiveIncome / threshold, 1);
        }

        // Add more cases here for other types if needed
        default:
          console.warn(`Unsupported type: ${type}`);
          return 0; // Return 0 for unsupported types
      }
    } catch (error) {
      console.error('Error calculating progress:', error);
      return 0; // Return 0 in case of an error
    }
  };

  const fetchAmountSaved = async (): Promise<number | null> => {
    try {
      const response = await fetch(
        `${api_url}/expenses/total/user/${userId}/category/Savings`
      );
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const total: number = await response.json();
      console.log(`Total Saved:`, total);
      return total;
    } catch (error) {
      console.error('Failed to fetch total expenses for category:', error);
      return null; // Return null in case of an error
    }
  };

  const fetchGamification = async (): Promise<any | null> => {
    try {
      const response = await fetch(`${api_url}/gamification/user/${userId}`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const gamificationData = await response.json();
      console.log(`Gamification Data Fetched:`, gamificationData);
      return gamificationData;
    } catch (error) {
      console.error('Failed to fetch gamification data:', error);
      return null; // Return null in case of an error
    }
  };

  if (isLoading) {
    return (
      <BackgroundLayout title="Awards">
        <ActivityIndicator size="large" color="#0000ff" />
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout title="Awards">
      <BottomSheet>
        <FlatList
          data={awards}
          keyExtractor={(_, index) => index.toString()} // Use index as key
          numColumns={3} // Number of columns in the grid
          renderItem={({ item }) => (
            <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
              {item.received ? (
                <AwardRecieved
                  name={item.name}
                  description={item.description}
                />
              ) : (
                <Award
                  progress={item.progress}
                  name={item.name}
                  description={item.description}
                />
              )}
            </View>
          )}
        />
      </BottomSheet>
    </BackgroundLayout>
  );
}
