import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { categoryColors } from '../utils/categoryColors';
import { donutChartStyles } from '../styles/donutchart.styles';
import ChartLegend from './ChartLegend';
import { textStyles } from '../styles/text.styles';

type DonutChartProps = {
  data: { categoryName: string; total: number; percentage: number }[];
  hasLegend: boolean;
  title?: string;
};

export default function DonutChart({
  data,
  hasLegend,
  title,
}: DonutChartProps) {
  const widthAndHeight = 120;

  const series = data.map((item, index) => ({
    value: item.percentage,
    color: categoryColors[item.categoryName as keyof typeof categoryColors],
    //label: { text: item.categoryName },
  }));

  return (
    <View
      style={[donutChartStyles.container, { maxHeight: widthAndHeight * 1.5 }]}
    >
      <View style={donutChartStyles.donutChart}>
        {title ? (
          <Text style={textStyles.bodyText}>{title}</Text>
        ) : (
          <View></View>
        )}
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          cover={0.45}
        />
      </View>
      {hasLegend ? (
        <ScrollView
          style={donutChartStyles.legendContainer}
          nestedScrollEnabled={true}
          persistentScrollbar={true}
        >
          {data.map((item, index) => (
            <View key={index}>
              <ChartLegend name={item.categoryName} total={item.percentage} />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View></View>
      )}
    </View>
  );
}
