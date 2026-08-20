import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { textStyles } from '../styles/text.styles';
import * as Progress from 'react-native-progress';
import COLORS from '../constants/colors';
import { awardStyles } from '../styles/awards.styles';

type AwardProps = {
  progress: number;
  name: string;
  description?: string;
};

export default function Award({
  progress,
  name,
  description = '',
}: AwardProps) {
  function formattedProgress(progress: number): string {
    //return "🏆";
    return '🎖️';
  }

  return (
    <View style={awardStyles.container}>
      <Progress.Circle
        size={80}
        progress={progress}
        showsText={true}
        formatText={formattedProgress}
        textStyle={awardStyles.progressText}
        thickness={15}
        color={COLORS.primary}
        unfilledColor={COLORS.grey}
        borderWidth={0}
        // borderColor={COLORS.dark_grey}
      />
      <Text style={awardStyles.awardName}>{name}</Text>

      <Text style={awardStyles.awardDescription}>{description}</Text>
    </View>
  );
}
