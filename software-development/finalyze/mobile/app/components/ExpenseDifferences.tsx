import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CategorySummary } from '../screens/QuickAnalysisScreen';
import { textStyles } from '../styles/text.styles';
import DifferenceEntry from './DifferenceEntry';

type ExpenseDifferencesProps = {
  userData: CategorySummary[];
  averageData: CategorySummary[];
};

const calculateDifferences = (
  userData: CategorySummary[],
  averageData: CategorySummary[]
): Record<string, number> => {
  const differences: Record<string, number> = {};

  userData.forEach((userCategory) => {
    const averageCategory = averageData.find(
      (avg) => avg.categoryName === userCategory.categoryName
    );
    if (averageCategory) {
      differences[userCategory.categoryName] =
        userCategory.percentage - averageCategory.percentage;
    }
  });

  return differences;
};

export default function ExpenseDifferences({
  userData,
  averageData,
}: ExpenseDifferencesProps) {
  const differences = calculateDifferences(userData, averageData);

  return (
    <View style={styles.container}>
      <Text style={textStyles.headerText}>Differences:</Text>
      {Object.entries(differences).map(([categoryName, difference]) => (
        <DifferenceEntry
          key={categoryName}
          categoryName={categoryName}
          difference={difference}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
