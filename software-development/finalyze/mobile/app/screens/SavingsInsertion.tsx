import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  useNavigation,
  ParamListBase,
  NativeStackNavigationProp,
} from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuth } from '../contexts/AuthContext';
import { incomeStyles } from '../styles/income.styles';
import { dropdownStyles } from '../styles/dropdown.styles';
import BackgroundLayout from '../components/BackgroundContainer';
import BottomSheet from '../components/BottomSheet';

export default function SavingGoalScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const api_url = process.env.EXPO_PUBLIC_API_URL;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [byDate, setByDate] = useState(new Date());
  const [priority, setPriority] = useState(null);
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!name || !amount || !byDate) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      //Obter o count da API
      let count = 0;
      const countResponse = await fetch(
        `${api_url}/savings-target/count?userId=${user?.id}`
      );
      if (!countResponse.ok) {
        throw new Error('Failed to fetch count');
      } else {
        count = await countResponse.json();
      }

      //Criar payload
      const payload = {
        userId: user?.id,
        name,
        amount: parseFloat(amount),
        byDate: byDate.toISOString().split('T')[0],
        priority: count + 1,
        active,
      };

      //POST
      console.log(payload);
      const response = await fetch(`${api_url}/savings-target`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save savings target');
      }

      const data = await response.json();
      console.log('Savings goal saved:', data);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving the goal.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setByDate(selectedDate);
  };

  return (
    <BackgroundLayout title="Create Saving Goal">
      <BottomSheet>
        <Text style={incomeStyles.label}>Goal Name</Text>
        <TextInput
          style={incomeStyles.input}
          placeholder="e.g. Buy a house"
          value={name}
          onChangeText={setName}
        />

        <Text style={incomeStyles.label}>Target Amount</Text>
        <TextInput
          style={incomeStyles.input}
          placeholder="e.g. 1000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={incomeStyles.label}>Deadline</Text>
        <TouchableOpacity
          style={incomeStyles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={incomeStyles.inputText}>
            {byDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={byDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}
        >
          <Text style={incomeStyles.label}>Active</Text>
          <Switch value={active} onValueChange={setActive} />
        </View>

        {!!error && <Text style={{ color: 'red' }}>{error}</Text>}

        <TouchableOpacity style={incomeStyles.saveButton} onPress={handleSave}>
          <Text style={incomeStyles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </BottomSheet>
    </BackgroundLayout>
  );
}
