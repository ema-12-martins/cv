import React from 'react';
import { Modal, TouchableOpacity, View, Text, Button } from 'react-native';
import { detailStyles } from '../styles/detailPopUp.styles';
import LineSeparator from './LineSeparator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';

type detailsProp = {
  menuVisible: boolean;
  closeMenu: () => void;
  id: number;
  value: number;
  label: string;
  category: string;
  occurrenceDate: string;
  type: string;
};

export default function DetailsPopUp({
  menuVisible,
  closeMenu,
  id,
  value,
  label,
  category,
  occurrenceDate,
  type,
}: detailsProp) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const api_url = process.env.EXPO_PUBLIC_API_URL;
  const handleEdit = () => {
    const screen = type === 'income' ? 'IncomeUpdate' : 'ExpenseUpdate';
    navigation.navigate(screen, { incomeId: id });
  };

  const handleDelete = async () => {
    closeMenu();
    try {
      const response = await fetch(`${api_url}/${type}s/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to delete');
      }
      const data = await response.json();
      console.log('Deleted:', data);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <Modal
      visible={menuVisible}
      transparent
      animationType="fade"
      onRequestClose={closeMenu}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={detailStyles.modalBackground}
        onPress={closeMenu}
      >
        <View style={detailStyles.card}>
          <Text style={detailStyles.cardTitle}>
            {type === 'income' ? 'Income' : 'Expense'}
          </Text>
          <View style={detailStyles.fieldContainer}>
            <Text style={detailStyles.fieldIndicator}>Catagory:</Text>
            <Text style={detailStyles.text}>{category}</Text>
          </View>
          <LineSeparator />
          <View style={detailStyles.fieldContainer}>
            <Text style={detailStyles.fieldIndicator}>Label:</Text>
            <Text style={detailStyles.text}>{label}</Text>
          </View>
          <LineSeparator />
          <View style={detailStyles.fieldContainer}>
            <Text style={detailStyles.fieldIndicator}>Amount:</Text>
            <Text style={detailStyles.text}>{value}</Text>
          </View>
          <LineSeparator />
          <View style={detailStyles.fieldContainer}>
            <Text style={detailStyles.fieldIndicator}>Date:</Text>
            <Text style={detailStyles.text}>{occurrenceDate}</Text>
          </View>
          <View style={detailStyles.buttonRow}>
            <TouchableOpacity style={detailStyles.button} onPress={handleEdit}>
              <Text style={detailStyles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={detailStyles.button}
              onPress={handleDelete}
            >
              <Text style={detailStyles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
