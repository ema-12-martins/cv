import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { textStyles } from '../styles/text.styles';
import * as Progress from 'react-native-progress';
import COLORS from '../constants/colors';
import { awardStyles } from '../styles/awards.styles';

type AwardRecievedProps = {
  name: string;
  description?: string;
};

export default function AwardRecieved({
  name,
  description = '',
}: AwardRecievedProps) {
  function formattedProgress(progress: number): string {
    //return "🏆";
    return '🎖️';
  }

  return (
    <View style={awardStyles.container}>
      <Text style={awardStyles.awardRecieved}>🎖️</Text>
      <Text style={awardStyles.awardName}>{name}</Text>

      <Text style={awardStyles.awardDescription}>{description}</Text>
    </View>
  );
}
