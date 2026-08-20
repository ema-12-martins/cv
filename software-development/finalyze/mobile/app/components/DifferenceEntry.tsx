import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { textStyles } from '../styles/text.styles';
import { donutChartStyles } from '../styles/donutchart.styles';

type DifferenceEntryProps = {
  categoryName: string;
  difference: number;
};

export default function DifferenceEntry({
  categoryName,
  difference,
}: DifferenceEntryProps) {
  const differenceStyle =
    difference > 0 ? donutChartStyles.positive : donutChartStyles.negative;

  return (
    <View style={donutChartStyles.differenceContainer}>
      <Text style={[textStyles.bodyText, donutChartStyles.categoryName]}>
        {categoryName}
      </Text>
      <Text style={[textStyles.bodyText, differenceStyle]}>
        {difference.toFixed(2)}%
      </Text>
    </View>
  );
}
