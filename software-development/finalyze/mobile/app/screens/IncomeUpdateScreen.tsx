import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { incomeStyles } from '../styles/income.styles';
import { dropdownStyles } from '../styles/dropdown.styles';
import {
  ParamListBase,
  useNavigation,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import BackgroundLayout from '../components/BackgroundContainer';
import BottomSheet from '../components/BottomSheet';
import { useAuth } from '../contexts/AuthContext';

export default function IncomeUpdateScreen() {
  const api_url = process.env.EXPO_PUBLIC_API_URL;
  const { user } = useAuth();
  const userId = user?.id;
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [labelData, setLabelData] = useState([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const route = useRoute<RouteProp<ParamListBase>>();
  const { incomeId } = route.params as { incomeId: number };

  const categoryData = [
    { label: 'Salary', value: 1 },
    { label: 'Investment', value: 2 },
    { label: 'Freelance', value: 3 },
  ];

  useEffect(() => {
    if (!incomeId) return;
    const fetchIncome = async () => {
      try {
        const res = await fetch(`${api_url}/incomes/${incomeId}`);
        console.log('resposta:');
        console.log(res);
        if (!res.ok) {
          throw new Error('Failed to fetch income');
        }
        const income = await res.json();
        console.log(
          'income: ' +
            income.id +
            income.value +
            income.labelName +
            income.categoryName
        );
        setAmount(income.value.toString());
        setDate(new Date(income.occurrenceDate));
        const foundCategory = categoryData.find(
          (option) => option.label === income.category
        );
        const foundLabel = labelData.find(
          (option) => option.label === income.label
        );

        setCategory(foundCategory ? String(foundCategory.value) : '');
        setLabel(foundLabel ? String(foundLabel.value) : '');
      } catch (err) {
        console.error(err);
        setError('Failed to load income data.');
      }
    };

    fetchIncome();
  }, [incomeId]);

  const renderCategoryItem = (item) => {
    return (
      <View style={dropdownStyles.item}>
        <Text style={dropdownStyles.textItem}>{item.label}</Text>
        {item.value === category && (
          <AntDesign
            style={dropdownStyles.icon}
            color="black"
            name="check"
            size={20}
          />
        )}
      </View>
    );
  };

  const renderLabelItem = (item) => {
    return (
      <View style={dropdownStyles.item}>
        <Text style={dropdownStyles.textItem}>{item.label}</Text>
        {item.value === label && (
          <AntDesign
            style={dropdownStyles.icon}
            color="black"
            name="check"
            size={20}
          />
        )}
      </View>
    );
  };

  const fetchLabels = (selectedCategory: number) => {
    setError('');
    fetch(
      `${api_url}/income-labels/user/${userId}/category/${selectedCategory}`
    ) //user id must be changed and be passed through auth
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const transformedData = data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setLabelData(transformedData);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };

  const handleSave = async () => {
    setError('');
    if (!category || !label || !amount || !date) {
      setError('Please fill in all fields.');
      console.log('Please fill in all fields.');
      return;
    }
    const labelExists = labelData.some((item) => item.value === label);
    let labelId = label;
    if (!labelExists) {
      try {
        const res = await fetch(
          `${api_url}/income-labels/user/${userId}/category/${category}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: label }),
          }
        );
        const newLabel = await res.json();
        labelId = newLabel.id;
      } catch (err) {
        console.error(err);
        setError('Failed to create label');
        return;
      }
    }
    const payload = {
      value: parseFloat(amount),
      occurrenceDate: date.toISOString().split('T')[0],
      label: labelId,
    };

    try {
      const response = await fetch(`${api_url}/incomes/${incomeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to update income');
      }
      const data = await response.json();
      console.log('Income updated:', data);

      navigation.goBack();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate: Date) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <BackgroundLayout title="Edit Income">
      <BottomSheet>
        <Text style={incomeStyles.label}>Category</Text>
        <Dropdown
          style={dropdownStyles.dropdown}
          selectedTextStyle={dropdownStyles.selectedTextStyle}
          iconStyle={dropdownStyles.iconStyle}
          data={categoryData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Catagory"
          value={category}
          onChange={(item) => {
            setCategory(item.value);
            fetchLabels(item.value);
          }}
          renderItem={renderCategoryItem}
        />

        <Text style={incomeStyles.label}>Label</Text>

        <View style={[{ flex: 4 }]}>
          {category !== '' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <TextInput
                style={incomeStyles.labelInput}
                placeholder="New"
                keyboardType="default"
                value={label}
                onChangeText={setLabel}
              />
              <Dropdown
                style={dropdownStyles.dropdown}
                selectedTextStyle={dropdownStyles.selectedTextStyle}
                iconStyle={dropdownStyles.iconStyle}
                data={labelData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Label"
                value={label}
                onChange={(item) => {
                  setLabel(item.value);
                }}
                renderItem={renderLabelItem}
              />
            </View>
          ) : (
            <Dropdown
              style={dropdownStyles.dropdownDisabled}
              selectedTextStyle={dropdownStyles.selectedTextStyle}
              iconStyle={dropdownStyles.iconStyle}
              data={labelData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Please choose a category first"
              disable
              value={label}
              onChange={(item) => {
                setLabel(item.value);
              }}
              renderItem={renderLabelItem}
            />
          )}
        </View>

        <Text style={incomeStyles.label}>Amount</Text>
        <TextInput
          style={incomeStyles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={incomeStyles.label}>Date:</Text>
        <TouchableOpacity
          style={incomeStyles.dateButton}
          onPress={showDatepicker}
        >
          <Text style={incomeStyles.inputText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            is24Hour={true}
            onChange={onChange}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity style={incomeStyles.saveButton} onPress={handleSave}>
          <Text style={incomeStyles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </BottomSheet>
    </BackgroundLayout>
  );
}
