import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';

// Assuming these components are available in your project structure
import BackgroundLayout from '../components/BackgroundContainer';
import BottomSheet from '../components/BottomSheet';
import { textStyles } from '../styles/text.styles';
import { useAuth } from '../contexts/AuthContext';
import { categoryColors } from '../utils/categoryColors';

// --- UPDATED INTERFACES ---

interface FixedIncome {
  id: number;
  userId: number;
  labelId: number;
  value: number;
  startDate: string; // e.g., "YYYY-MM-DD"
  frequency: string; // e.g., "MONTHLY", "WEEKLY", "ANNUALLY"
  insertionDate: string; // e.g., "YYYY-MM-DD"
}

interface FixedExpense {
  id: number;
  userId: number;
  labelId: number;
  value: number;
  startDate: string; // e.g., "YYYY-EE-DD"
  frequency: string; // e.g., "MONTHLY", "WEEKLY", "ANNUALLY"
  insertionDate: string; // e.g., "YYYY-MM-DD"
}

interface ExpenseLabel {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}

interface VariableExpense {
  id: number;
  userId: number;
  value: number;
  occurrenceDate: string; // "YYYY-MM-DD"
  label: ExpenseLabel; // Represents the nested label and category data
}

export type CategorySummary = {
  categoryName: string;
  total: number;
  percentage: number;
  color: string;
};

// Helper function to get month name from 0-indexed month (if needed, but less focus now)
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

// --- NEW BarChart Component ---
interface BarChartProps {
  data: CategorySummary[];
  title: string;
  hasLegend?: boolean; // Optional, as it might not always be needed for simple bars
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <View style={barChartStyles.noDataContainer}>
        <Text style={barChartStyles.noDataText}>
          No data available for {title}.
        </Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40; // 20 padding on each side
  const maxTotal = Math.max(...data.map((item) => item.total));

  return (
    <View style={barChartStyles.chartContainer}>
      <Text style={barChartStyles.chartTitle}>{title}</Text>
      <View style={barChartStyles.barsWrapper}>
        {data.map((item, index) => (
          <View key={index} style={barChartStyles.barItem}>
            <Text style={barChartStyles.barLabel}>
              {item.categoryName} (${item.total.toFixed(2)})
            </Text>
            <View style={barChartStyles.barBackground}>
              <View
                style={[
                  barChartStyles.barFill,
                  {
                    width: `${(item.total / maxTotal) * 100}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const barChartStyles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  barsWrapper: {
    width: '100%',
  },
  barItem: {
    marginBottom: 10,
  },
  barLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  barBackground: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  noDataContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
});
// --- END NEW BarChart Component ---

// --- NEW ComparisonSection Component ---
interface ComparisonSectionProps {
  fixedIncomeData: CategorySummary[];
  fixedExpenseData: CategorySummary[];
  variableExpenseData: CategorySummary[];
  frequency: string; // "MONTHLY", "WEEKLY", "ANNUALLY", "DAILY"
  totalFixedIncome: number;
  totalFixedExpense: number;
  totalVariableExpense: number;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  fixedIncomeData,
  fixedExpenseData,
  variableExpenseData,
  frequency,
  totalFixedIncome,
  totalFixedExpense,
  totalVariableExpense,
}) => {
  const netFixedBalance = totalFixedIncome - totalFixedExpense;
  const netOverallBalance = netFixedBalance - totalVariableExpense;

  return (
    <View style={comparisonStyles.container}>
      <Text style={comparisonStyles.title}>
        Your {frequency} Financial Snapshot
      </Text>

      <BarChart
        data={fixedIncomeData}
        title={`Your Fixed Income (${frequency})`}
      />
      <BarChart
        data={fixedExpenseData}
        title={`Your Fixed Expenses (${frequency})`}
      />
      <BarChart
        data={variableExpenseData}
        title={`Your Variable Expenses by Category (${frequency})`}
      />

      <View style={comparisonStyles.summaryBox}>
        <Text style={comparisonStyles.summaryText}>
          Total Fixed Income: ${totalFixedIncome.toFixed(2)}
        </Text>
        <Text style={comparisonStyles.summaryText}>
          Total Fixed Expenses: -${totalFixedExpense.toFixed(2)}
        </Text>
        <Text style={comparisonStyles.summaryText}>
          Net Fixed Balance: ${netFixedBalance.toFixed(2)}
        </Text>
        <Text style={comparisonStyles.summaryText}>
          Total Variable Expenses: -${totalVariableExpense.toFixed(2)}
        </Text>
        <View
          style={[
            comparisonStyles.netOverallContainer,
            netOverallBalance >= 0
              ? comparisonStyles.netPositive
              : comparisonStyles.netNegative,
          ]}
        >
          <Text style={comparisonStyles.netOverallText}>
            Overall Net Balance: ${netOverallBalance.toFixed(2)}
          </Text>
        </View>

        {netOverallBalance < 0 ? (
          <Text style={comparisonStyles.adviceTextBad}>
            Your {frequency} expenses exceed your income. Consider reviewing
            your spending in both fixed and variable categories.
          </Text>
        ) : (
          <Text style={comparisonStyles.adviceTextGood}>
            You have a positive {frequency} balance! Great job managing your
            finances.
          </Text>
        )}
      </View>
    </View>
  );
};

const comparisonStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  summaryBox: {
    marginTop: 20,
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  netOverallContainer: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  netPositive: {
    backgroundColor: '#e8f5e9', // Light green
    borderColor: '#4caf50',
  },
  netNegative: {
    backgroundColor: '#ffebee', // Light red
    borderColor: '#f44336',
  },
  netOverallText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  adviceTextGood: {
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  adviceTextBad: {
    fontSize: 14,
    color: '#c62828',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
// --- END NEW ComparisonSection Component ---

export default function FixedVariable() {
  const api_url = process.env.EXPO_PUBLIC_API_URL;
  const { user } = useAuth();
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States to hold processed data for each frequency
  const [monthlyIncomeChartData, setMonthlyIncomeChartData] = useState<
    CategorySummary[]
  >([]);
  const [monthlyFixedExpenseChartData, setMonthlyFixedExpenseChartData] =
    useState<CategorySummary[]>([]);
  const [monthlyVariableExpenseChartData, setMonthlyVariableExpenseChartData] =
    useState<CategorySummary[]>([]);

  const [weeklyIncomeChartData, setWeeklyIncomeChartData] = useState<
    CategorySummary[]
  >([]);
  const [weeklyFixedExpenseChartData, setWeeklyFixedExpenseChartData] =
    useState<CategorySummary[]>([]);
  const [weeklyVariableExpenseChartData, setWeeklyVariableExpenseChartData] =
    useState<CategorySummary[]>([]);

  const [annuallyIncomeChartData, setAnnuallyIncomeChartData] = useState<
    CategorySummary[]
  >([]);
  const [annuallyFixedExpenseChartData, setAnnuallyFixedExpenseChartData] =
    useState<CategorySummary[]>([]);
  const [
    annuallyVariableExpenseChartData,
    setAnnuallyVariableExpenseChartData,
  ] = useState<CategorySummary[]>([]);

  // States to hold total values for each frequency
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState(0);
  const [totalMonthlyFixedExpense, setTotalMonthlyFixedExpense] = useState(0);
  const [totalMonthlyVariableExpense, setTotalMonthlyVariableExpense] =
    useState(0);

  const [totalWeeklyIncome, setTotalWeeklyIncome] = useState(0);
  const [totalWeeklyFixedExpense, setTotalWeeklyFixedExpense] = useState(0);
  const [totalWeeklyVariableExpense, setTotalWeeklyVariableExpense] =
    useState(0);

  const [totalAnnuallyIncome, setTotalAnnuallyIncome] = useState(0);
  const [totalAnnuallyFixedExpense, setTotalAnnuallyFixedExpense] = useState(0);
  const [totalAnnuallyVariableExpense, setTotalAnnuallyVariableExpense] =
    useState(0);

  // Helper function to generate a random hex color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Helper to convert value to a specific frequency (simplified for demonstration)
  // In a real app, you'd need more robust date logic for daily/weekly/monthly/annually
  // For fixed items, we'll process them based on their declared frequency.
  // For variable expenses, we'll assume the API provides a total for the last X period,
  // and we'll project that to monthly, weekly, annually.
  const convertToFrequency = (
    value: number,
    itemFrequency: string, // This is the source frequency of the 'value'
    targetFrequency: string // This is the frequency we want to convert 'value' to
  ): number => {
    // Define a base unit (e.g., DAILY) and convert everything to that, then to target.
    // Or, define conversion factors relative to a common unit, e.g., MONTHLY.
    const monthlyValue: number = (() => {
      switch (itemFrequency) {
        case 'DAILY':
          return value * 30; // Approx 30 days in a month
        case 'WEEKLY':
          return value * 4; // Approx 4 weeks in a month
        case 'MONTHLY':
          return value;
        case 'ANNUALLY':
          return value / 12;
        default:
          return value; // Return as is if frequency is unknown
      }
    })();

    switch (targetFrequency) {
      case 'DAILY':
        return monthlyValue / 30;
      case 'WEEKLY':
        return monthlyValue / 4;
      case 'MONTHLY':
        return monthlyValue;
      case 'ANNUALLY':
        return monthlyValue * 12;
      default:
        return value; // Should not happen if targetFrequency is always one of the defined ones
    }
  };

  // Helper to process data into a format suitable for the BarChart,
  // adding percentages and assigning a random color.
  const processChartData = useCallback(
    (
      items: any[],
      categoryKey: string,
      valueKey: string,
      targetFrequency: string
    ): CategorySummary[] => {
      const categoryMap = new Map<string, number>();

      items.forEach((item) => {
        let categoryName = 'Uncategorized';
        // Handle nested categoryKey (e.g., 'label.category.name')
        if (categoryKey.includes('.')) {
          const keys = categoryKey.split('.');
          let currentLevel = item;
          for (let i = 0; i < keys.length; i++) {
            if (currentLevel && currentLevel[keys[i]] !== undefined) {
              currentLevel = currentLevel[keys[i]];
            } else {
              currentLevel = undefined; // Path not found
              break;
            }
          }
          if (typeof currentLevel === 'string') {
            categoryName = currentLevel;
          }
        } else {
          if (item[categoryKey] !== undefined) {
            categoryName = item[categoryKey];
          }
        }

        let value = item[valueKey];
        // For fixed items, convert based on their intrinsic frequency
        if (item.frequency) {
          value = convertToFrequency(value, item.frequency, targetFrequency);
        }

        categoryMap.set(
          categoryName,
          (categoryMap.get(categoryName) || 0) + value
        );
      });

      const total = Array.from(categoryMap.values()).reduce(
        (sum, val) => sum + val,
        0
      );

      return Array.from(categoryMap.entries()).map(([name, value]) => ({
        categoryName: name,
        total: value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color:
          categoryColors[name as keyof typeof categoryColors] ||
          getRandomColor(),
      }));
    },
    []
  );

  // Fetches financial data from the API and processes it for comparison.
  const fetchData = useCallback(async () => {
    if (!userId) {
      setError('User not authenticated. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Fixed Incomes for the user
      const fixedIncomesResponse = await fetch(
        `${api_url}/fixed_incomes/user/${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!fixedIncomesResponse.ok) {
        throw new Error(
          `Failed to fetch fixed incomes: ${fixedIncomesResponse.status}`
        );
      }
      const fixedIncomesData: FixedIncome[] = await fixedIncomesResponse.json();
      console.log('Fixed Incomes:', fixedIncomesData);

      // 2. Fetch Fixed Expenses for the user
      const fixedExpensesResponse = await fetch(
        `${api_url}/fixed_expenses/user/${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!fixedExpensesResponse.ok) {
        throw new Error(
          `Failed to fetch fixed expenses: ${fixedExpensesResponse.status}`
        );
      }
      const fixedExpensesData: FixedExpense[] =
        await fixedExpensesResponse.json();
      console.log('Fixed Expenses (for user):', fixedExpensesData);

      // 3. Fetch Variable Expenses for the user (Current Month - this is key for comparison)
      // We assume the backend provides a monthly summary for variable expenses
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 0-indexed

      const variableExpensesMonthlySummaryResponse = await fetch(
        `${api_url}/expenses/summary/user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            year: currentYear,
            month: currentMonth,
          }),
        }
      );

      if (!variableExpensesMonthlySummaryResponse.ok) {
        throw new Error(
          `Failed to fetch current month variable expense summary: ${variableExpensesMonthlySummaryResponse.status}`
        );
      }
      const variableExpensesMonthlySummary: {
        categoryName: string;
        total: number;
      }[] = await variableExpensesMonthlySummaryResponse.json();
      console.log(
        'Current Month Variable Expenses Summary:',
        variableExpensesMonthlySummary
      );

      // Process and set data for each frequency
      // Monthly
      setMonthlyIncomeChartData(
        processChartData(fixedIncomesData, 'frequency', 'value', 'MONTHLY')
      );
      setMonthlyFixedExpenseChartData(
        processChartData(fixedExpensesData, 'frequency', 'value', 'MONTHLY')
      );
      // For variable expenses, convert the monthly summary data to CategorySummary format
      setMonthlyVariableExpenseChartData(
        variableExpensesMonthlySummary.map((item) => ({
          categoryName: item.categoryName,
          total: item.total,
          percentage: 0, // Recalculated by BarChart, or we could pass total here
          color: getRandomColor(),
        }))
      );

      setTotalMonthlyIncome(
        fixedIncomesData.reduce(
          (sum, inc) =>
            sum + convertToFrequency(inc.value, inc.frequency, 'MONTHLY'),
          0
        )
      );
      setTotalMonthlyFixedExpense(
        fixedExpensesData.reduce(
          (sum, exp) =>
            sum + convertToFrequency(exp.value, exp.frequency, 'MONTHLY'),
          0
        )
      );
      setTotalMonthlyVariableExpense(
        variableExpensesMonthlySummary.reduce(
          (sum, item) => sum + item.total,
          0
        )
      );

      // Weekly
      setWeeklyIncomeChartData(
        processChartData(fixedIncomesData, 'frequency', 'value', 'WEEKLY')
      );
      setWeeklyFixedExpenseChartData(
        processChartData(fixedExpensesData, 'frequency', 'value', 'WEEKLY')
      );
      setWeeklyVariableExpenseChartData(
        variableExpensesMonthlySummary.map((item) => ({
          categoryName: item.categoryName,
          total: convertToFrequency(item.total, 'MONTHLY', 'WEEKLY'), // Project monthly to weekly
          percentage: 0,
          color: getRandomColor(),
        }))
      );

      setTotalWeeklyIncome(
        fixedIncomesData.reduce(
          (sum, inc) =>
            sum + convertToFrequency(inc.value, inc.frequency, 'WEEKLY'),
          0
        )
      );
      setTotalWeeklyFixedExpense(
        fixedExpensesData.reduce(
          (sum, exp) =>
            sum + convertToFrequency(exp.value, exp.frequency, 'WEEKLY'),
          0
        )
      );
      setTotalWeeklyVariableExpense(
        variableExpensesMonthlySummary.reduce(
          (sum, item) =>
            sum + convertToFrequency(item.total, 'MONTHLY', 'WEEKLY'),
          0
        )
      );

      // Annually
      setAnnuallyIncomeChartData(
        processChartData(fixedIncomesData, 'frequency', 'value', 'ANNUALLY')
      );
      setAnnuallyFixedExpenseChartData(
        processChartData(fixedExpensesData, 'frequency', 'value', 'ANNUALLY')
      );
      setAnnuallyVariableExpenseChartData(
        variableExpensesMonthlySummary.map((item) => ({
          categoryName: item.categoryName,
          total: convertToFrequency(item.total, 'MONTHLY', 'ANNUALLY'), // Project monthly to annually
          percentage: 0,
          color: getRandomColor(),
        }))
      );

      setTotalAnnuallyIncome(
        fixedIncomesData.reduce(
          (sum, inc) =>
            sum + convertToFrequency(inc.value, inc.frequency, 'ANNUALLY'),
          0
        )
      );
      setTotalAnnuallyFixedExpense(
        fixedExpensesData.reduce(
          (sum, exp) =>
            sum + convertToFrequency(exp.value, exp.frequency, 'ANNUALLY'),
          0
        )
      );
      setTotalAnnuallyVariableExpense(
        variableExpensesMonthlySummary.reduce(
          (sum, item) =>
            sum + convertToFrequency(item.total, 'MONTHLY', 'ANNUALLY'),
          0
        )
      );
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError(
        `Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      Alert.alert(
        'Error',
        `Failed to load financial data. Please check your network or try again. Details: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  }, [userId, api_url, processChartData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <BackgroundLayout title="Financial Analysis">
      <BottomSheet>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={fetchData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Refresh Data</Text>
            )}
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && (
            <View>
              {/* Monthly Comparison */}
              <ComparisonSection
                fixedIncomeData={monthlyIncomeChartData}
                fixedExpenseData={monthlyFixedExpenseChartData}
                variableExpenseData={monthlyVariableExpenseChartData}
                frequency="MONTHLY"
                totalFixedIncome={totalMonthlyIncome}
                totalFixedExpense={totalMonthlyFixedExpense}
                totalVariableExpense={totalMonthlyVariableExpense}
              />

              {/* Weekly Comparison */}
              <ComparisonSection
                fixedIncomeData={weeklyIncomeChartData}
                fixedExpenseData={weeklyFixedExpenseChartData}
                variableExpenseData={weeklyVariableExpenseChartData}
                frequency="WEEKLY"
                totalFixedIncome={totalWeeklyIncome}
                totalFixedExpense={totalWeeklyFixedExpense}
                totalVariableExpense={totalWeeklyVariableExpense}
              />

              {/* Annually Comparison */}
              <ComparisonSection
                fixedIncomeData={annuallyIncomeChartData}
                fixedExpenseData={annuallyFixedExpenseChartData}
                variableExpenseData={annuallyVariableExpenseChartData}
                frequency="ANNUALLY"
                totalFixedIncome={totalAnnuallyIncome}
                totalFixedExpense={totalAnnuallyFixedExpense}
                totalVariableExpense={totalAnnuallyVariableExpense}
              />
            </View>
          )}
        </ScrollView>
      </BottomSheet>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c62828',
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
    color: '#444',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    fontSize: 12,
    color: '#333',
    marginBottom: 10,
    overflow: 'hidden',
  },
});
