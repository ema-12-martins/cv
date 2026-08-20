import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { categoryColors } from '../utils/categoryColors';
import { donutChartStyles } from '../styles/donutchart.styles';

type ChartLegendProps = {
  name: string;
  total: number;
};

export default function ChartLegend({ name, total }: ChartLegendProps) {
  return (
    <View style={donutChartStyles.legendEntryContainer}>
      <View
        style={[
          donutChartStyles.coloredBox,
          { backgroundColor: categoryColors[name] },
        ]}
      />
      <Text style={donutChartStyles.legendText}>
        {name}: {total.toFixed(1)}%
      </Text>
    </View>
  );
}
