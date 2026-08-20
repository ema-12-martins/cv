import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomSheet from '../components/BottomSheet';
import { incomeStyles } from '../styles/income.styles';

export default function MainPageScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    // <BackgroundLayout title="Home">
    <BottomSheet>
      <TouchableOpacity
        style={incomeStyles.saveButton}
        onPress={() => navigation.navigate('QuickAnalysis')}
      >
        <Text style={incomeStyles.saveButtonText}>Quick Analysis</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={incomeStyles.saveButton}
        onPress={() => navigation.navigate('FixedVariable')}
      >
        <Text style={incomeStyles.saveButtonText}>Fixed/Variable</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={incomeStyles.saveButton}
        onPress={() => navigation.navigate('Tracking')}
      >
        <Text style={incomeStyles.saveButtonText}>Tracking</Text>
      </TouchableOpacity>
    </BottomSheet>
    // </BackgroundLayout>
  );
}
