import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import BackgroundLayout from '../components/BackgroundContainer';
import BottomSheet from '../components/BottomSheet';
import TrackingEntry from '../components/TrackingEntry';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { incomeStyles } from '../styles/income.styles';

const FILTER_OPTIONS = [
  { label: '1M', value: 1 },
  { label: '3M', value: 3 },
  { label: '6M', value: 6 },
  { label: '1Y', value: 12 },
];

type ChartDataItem = {
  label: string;
  value: number;
};

export default function TrackingScreen() {
  const API_BASE_URL = 'http://10.0.2.2:8080';
  const { user } = useAuth();
  const userId = user?.id;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [selectedFilter, setSelectedFilter] = useState<number>(1);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchChartData = async (months: number) => {
    if (!userId) return;

    setLoading(true);
    setChartData([]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/expenses/summary/user/${userId}?months=${months}`,
        {
          credentials: 'include',
        }
      );

      const data = await response.json();
      const transformed = Object.entries(data).map(([label, value]) => ({
        label,
        value: Number(value),
      }));

      setChartData(transformed);
    } catch (err) {
      console.error('Failed to load summary data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData(selectedFilter);
  }, [selectedFilter]);

  const values = chartData.map((item) => item.value);

  const sliceColors = [
    '#007bff',
    '#ffce56',
    '#4caf50',
    '#ff6384',
    '#36a2eb',
    '#ff9800',
    '#9c27b0',
    '#03a9f4',
    '#795548',
    '#e91e63',
  ].slice(0, values.length);

  const pieSlices = chartData.map((item, index) => ({
    value: item.value,
    color: sliceColors[index % sliceColors.length],
  }));

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth * 0.6;

  return (
    <BottomSheet>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginVertical: 20,
          backgroundColor: '#d6d6f5',
          borderRadius: 25,
          padding: 5,
          marginHorizontal: 20,
        }}
      >
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => setSelectedFilter(opt.value)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 20,
              backgroundColor:
                selectedFilter === opt.value ? '#3366ff' : 'transparent',
            }}
          >
            <Text
              style={{
                color: selectedFilter === opt.value ? '#fff' : '#333',
                fontWeight: '600',
                fontSize: 14,
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 40 }}
        />
      ) : chartData.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          No data to display.
        </Text>
      ) : (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <PieChart widthAndHeight={200} series={pieSlices} />
          <View style={{ marginTop: 20 }}>
            {chartData.map((item, index) => (
              <Text key={index} style={{ fontSize: 14 }}>
                <Text
                  style={{ color: sliceColors[index % sliceColors.length] }}
                >
                  ⬤{' '}
                </Text>
                {item.label}: {item.value.toFixed(2)} €
              </Text>
            ))}
          </View>
        </View>
      )}
      <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={incomeStyles.saveButton}
          onPress={() => navigation.navigate('QuickAnalysis')}
        >
          <Text style={incomeStyles.saveButtonText}>Quick Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[incomeStyles.saveButton, { marginTop: 10 }]}
          onPress={() => navigation.navigate('FixedVariable')}
        >
          <Text style={incomeStyles.saveButtonText}>Fixed/Variable</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}