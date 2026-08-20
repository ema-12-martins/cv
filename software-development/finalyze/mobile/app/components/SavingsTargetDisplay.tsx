import React from 'react';
import { View, Text } from 'react-native';
import { savingsStyles } from '../styles/savings.styles';
import LineSeparator from './LineSeparator';
import VLineSeparator from './VLineSeparator';
import * as Progress from 'react-native-progress';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';

type SavingsTargetProps = {
  name: string;
  target: number;
  byDate: string;
  saved: number;
};

export default function SavingsTargetDisplay({
  name,
  target,
  byDate,
  saved,
}: SavingsTargetProps) {
  return (
    <View style={savingsStyles.container}>
      <View style={savingsStyles.valuesContainer}>
        <View style={savingsStyles.column}>
          <Text style={savingsStyles.label}>{name}:</Text>
          <Text style={savingsStyles.value}>${target}</Text>
        </View>
        <VLineSeparator />
        <View style={savingsStyles.column}>
          <Text style={savingsStyles.label}>Saved:</Text>
          <Text style={savingsStyles.value}>${saved}</Text>
        </View>
      </View>
      <View style={savingsStyles.progressContainer}>
        <Text style={savingsStyles.label}>
          {((saved / target) * 100).toFixed(1)}%
        </Text>
        <Progress.Bar
          progress={saved / target}
          width={200}
          height={20}
          color={COLORS.white}
          unfilledColor={COLORS.black}
          style={savingsStyles.progressBar}
          borderWidth={2}
          borderColor={COLORS.white}
          borderRadius={SPACING.medium}
        />
      </View>
    </View>
  );
}
