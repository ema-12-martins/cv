import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import BackgroundLayout from '../components/BackgroundContainer';
import BottomSheet from '../components/BottomSheet';
import { textStyles } from '../styles/text.styles';
import { useAuth } from '../contexts/AuthContext';
import DonutChart from '../components/DonutChart';
import ExpenseDifferences from '../components/ExpenseDifferences';

export type CategorySummary = {
  categoryName: string;
  total: number;
  percentage: number;
};

const getMonthName = (monthIndex: number): string => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[monthIndex];
};

export default function QuickAnalysisScreen() {
  const api_url = process.env.EXPO_PUBLIC_API_URL;
  const { user } = useAuth();
  const userId = user?.id;
  const [data, setData] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAverage, setLoadingAverage] = useState(true);
  const [averageData, setAverageData] = useState<CategorySummary[]>([]);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    if (!userId) return;

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api_url}/expenses/summary/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            year,
            month,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const json: CategorySummary[] = await response.json();

        const totalExpenses = json.reduce(
          (sum, category) => sum + category.total,
          0
        );

        const dataWithPercentages = json.map((category) => ({
          ...category,
          percentage:
            totalExpenses > 0 ? (category.total / totalExpenses) * 100 : 0,
        }));

        setData(dataWithPercentages);
        console.log('Data:', dataWithPercentages);
      } catch (error) {
        console.error('Failed to fetch expense summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [userId]);

  useEffect(() => {
    const fetchAverageSummary = async () => {
      setLoadingAverage(true);
      try {
        const response = await fetch(`${api_url}/expenses/summary/average`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            year,
            month,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const json: CategorySummary[] = await response.json();

        const totalExpenses = json.reduce(
          (sum, category) => sum + category.total,
          0
        );

        const dataWithPercentages = json.map((category) => ({
          ...category,
          percentage:
            totalExpenses > 0 ? (category.total / totalExpenses) * 100 : 0,
        }));

        setAverageData(dataWithPercentages);
        console.log('Average Data:', dataWithPercentages);
      } catch (error) {
        console.error('Failed to fetch average expense summary:', error);
      } finally {
        setLoadingAverage(false);
      }
    };

    fetchAverageSummary();
  }, []);

  return (
    <BackgroundLayout title="Quick Analysis">
      <BottomSheet>
        {loading ? (
          <Text>Loading your data...</Text>
        ) : data.length === 0 ? (
          <Text style={textStyles.headerText}>
            No data available for this month.
          </Text>
        ) : (
          <>
            <DonutChart
              data={data}
              hasLegend={true}
              title={getMonthName(month - 1)}
            />
          </>
        )}

        {loadingAverage ? (
          <Text>Loading average data...</Text>
        ) : averageData.length === 0 ? (
          <Text style={textStyles.headerText}>
            No average data available for this month.
          </Text>
        ) : (
          <>
            <DonutChart data={averageData} hasLegend={true} title="Average" />
          </>
        )}

        {loadingAverage && loading ? (
          <Text>Loading data...</Text>
        ) : (
          <ExpenseDifferences userData={data} averageData={averageData} />
        )}
      </BottomSheet>
    </BackgroundLayout>
  );
}
