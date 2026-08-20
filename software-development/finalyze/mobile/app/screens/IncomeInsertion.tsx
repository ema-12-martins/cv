import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { incomeStyles } from '../styles/income.styles';
import { dropdownStyles } from '../styles/dropdown.styles';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import BackgroundLayout from '../components/BackgroundContainer';
import BottomSheet from '../components/BottomSheet';
import { useAuth } from '../contexts/AuthContext';
import NotificationEventEmitter from '../events/NotificationEventEmitter';

export default function IncomeInsertionScreen() {
  const api_url = process.env.EXPO_PUBLIC_API_URL;
  const { user } = useAuth();
  const userId = user?.id;
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [labelData, setLabelData] = useState<
    { label: string; value: number }[]
  >([]);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<string | null>(null);

  const frequencyOptions = [
    { label: 'Daily', value: 'DAILY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Yearly', value: 'YEARLY' },
  ];

  const categoryData = [
    { label: 'Salary', value: '1' },
    { label: 'Investment', value: '2' },
    { label: 'Freelance', value: '3' },
  ];

  const renderCategoryItem = (item: { label: string; value: string }) => (
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

  const renderLabelItem = (item: { label: string; value: number }) => (
    <View style={dropdownStyles.item}>
      <Text style={dropdownStyles.textItem}>{item.label}</Text>
      {item.value.toString() === label && (
        <AntDesign
          style={dropdownStyles.icon}
          color="black"
          name="check"
          size={20}
        />
      )}
    </View>
  );

  const fetchLabels = (selectedCategory: string) => {
    console.log('Fetching labels for category:', selectedCategory);
    setError('');
    fetch(
      `${api_url}/income-labels/user/${userId}/category/${selectedCategory}`
    )
      .then((response) => {
        console.log('Fetch labels response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      })
      .then((data) => {
        console.log('Fetched labels data:', data);
        const transformedData = data.map(
          (item: { name: string; id: number }) => ({
            label: item.name,
            value: item.id,
          })
        );
        setLabelData(transformedData);
        setLabel(''); // Clear the current label when category changes
      })
      .catch((err) => {
        console.error('Error fetching labels:', err);
        setError(err.message);
      });
  };

  const handleSave = async () => {
    setError('');
    console.log('Attempting to save income...');
    console.log('Current state values:');
    console.log('Category:', category);
    console.log('Label:', label);
    console.log('Amount:', amount);
    console.log('Date:', date);
    console.log('Is Recurring:', isRecurring);
    console.log('Frequency (if recurring):', frequency);

    if (
      !category ||
      !label ||
      !amount ||
      !date ||
      (isRecurring && !frequency)
    ) {
      console.log('Validation failed: Missing fields.');
      setError('Please fill in all fields.');
      return;
    }

    let actualLabelId: number; // Renamed for clarity to distinguish from state 'label'
    const labelExists = labelData.some(
      (item) => item.value.toString() === label
    );
    console.log('Label exists in data (as string comparison):', labelExists);

    if (!labelExists) {
      console.log(
        'Label does not exist, attempting to create new label:',
        label
      );
      try {
        const res = await fetch(
          `${api_url}/income-labels/user/${userId}/category/${category}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: label,
              userId: userId, // **FIX for Issue 1**
              categoryId: parseInt(category), // **FIX for Issue 1**
            }),
          }
        );
        console.log('Create label response status:', res.status);
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Failed to create label. Server response:', errorData);
          throw new Error(errorData.message || 'Failed to create label');
        }
        const newLabel = await res.json();
        actualLabelId = newLabel.id;
        console.log('New label created with ID:', actualLabelId);
      } catch (err: any) {
        console.error('Error during label creation:', err);
        setError(err.message || 'Failed to create label');
        return;
      }
    } else {
      actualLabelId = parseInt(label); // **Ensures it's a number from existing label**
      console.log('Using existing label ID:', actualLabelId);
    }

    const parsedAmount = parseFloat(amount);
    const formattedDate = date.toISOString().split('T')[0];

    const payload = isRecurring
      ? {
          labelId: actualLabelId,
          userId,
          value: parsedAmount,
          startDate: formattedDate,
          frequency,
          insertionDate: new Date().toISOString().split('T')[0],
        }
      : {
          value: parsedAmount,
          occurrenceDate: formattedDate,
        };

    const endpoint = isRecurring
      ? `${api_url}/fixed_incomes`
      : `${api_url}/incomes/user/${userId}/label/${actualLabelId}`; // **FIX for Issue 2: use actualLabelId**

    console.log('Sending payload:', payload);
    console.log('To endpoint:', endpoint);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Income creation response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create income. Server response:', errorData);
        throw new Error(errorData.message || 'Failed to create income');
      }

      console.log('Income successfully created!');
      navigation.goBack();
    } catch (err: any) {
      console.error('Error during income creation:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };
  const [show, setShow] = useState(false);
  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    console.log('Date changed to:', currentDate.toLocaleDateString());
  };

  const showDatepicker = () => {
    setShow(true);
    console.log('Showing date picker.');
  };

  return (
    <BackgroundLayout title="Add Income">
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
          placeholder="Select Category"
          value={category}
          onChange={(item) => {
            setCategory(item.value);
            fetchLabels(item.value);
            console.log('Category selected:', item.label, item.value);
          }}
          renderItem={renderCategoryItem}
        />

        <Text style={incomeStyles.label}>Label</Text>

        <View style={{ marginTop: 10 }}>
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
                  setLabel(item.value.toString());
                  console.log(
                    'Label selected from dropdown:',
                    item.label,
                    item.value
                  );
                }}
                renderItem={renderLabelItem}
              />
            </View>
          ) : (
            <Dropdown
              style={dropdownStyles.dropdownDisabled}
              selectedTextStyle={dropdownStyles.selectedTextStyle}
              iconStyle={dropdownStyles.iconStyle}
              placeholder="Select Label"
              data={[]}
              disable
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

        <Text style={incomeStyles.label}>Date</Text>
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
            mode="date"
            is24Hour={true}
            onChange={onChange}
            maximumDate={new Date()}
          />
        )}

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}
        >
          <Text style={incomeStyles.label}>Recurring?</Text>
          <Switch value={isRecurring} onValueChange={setIsRecurring} />
        </View>

        {isRecurring && (
          <View style={{ marginTop: 10 }}>
            <Text style={incomeStyles.label}>Frequency</Text>
            <Dropdown
              style={dropdownStyles.dropdown}
              selectedTextStyle={dropdownStyles.selectedTextStyle}
              iconStyle={dropdownStyles.iconStyle}
              data={frequencyOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Frequency"
              value={frequency}
              onChange={(item) => {
                setFrequency(item.value);
                console.log('Frequency selected:', item.label, item.value);
              }}
            />
          </View>
        )}

        {!!error && <Text style={{ color: 'red' }}>{error}</Text>}

        <TouchableOpacity style={incomeStyles.saveButton} onPress={handleSave}>
          <Text style={incomeStyles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </BottomSheet>
    </BackgroundLayout>
  );
}
