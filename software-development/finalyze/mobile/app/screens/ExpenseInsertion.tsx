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
import dayjs from 'dayjs';

function generateLast6months(dataStr: string) {
  const data = new Date(dataStr);
  const months = [];

  for (let i = 1; i <= 6; i++) {
    const dataClone = new Date(data);
    dataClone.setMonth(dataClone.getMonth() - i);
    const year = dataClone.getFullYear();
    const month = String(dataClone.getMonth() + 1).padStart(2, '0');
    months.push([year.toString(), month]);
  }

  return months;
}

type SavingsTarget = {
  id: number;
  userId: number;
  name: string;
  amount: number;
  byDate: string;
  priority: number;
  active: boolean;
};

export default function ExpenseInsertionScreen() {
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
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [savingsTarget, setSavingsTarget] = useState<SavingsTarget | null>(
    null
  );
  const [amountSaved, setAmountSaved] = useState<number>(0);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const categoryData = [
    { label: 'Food', value: '1' },
    { label: 'Transport', value: '2' },
    { label: 'Health', value: '3' },
    { label: 'Groceries', value: '4' },
    { label: 'Rent', value: '5' },
    { label: 'Gifts', value: '6' },
    { label: 'Savings', value: '7' },
    { label: 'Entertainment', value: '8' },
  ];

  const frequencyOptions = [
    { label: 'Daily', value: 'DAILY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Yearly', value: 'YEARLY' },
  ];

  const renderCategoryItem = (item: { label: string; value: string }) => {
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

  const renderLabelItem = (item: { label: string; value: number }) => {
    return (
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
  };

  const fetchLabels = (selectedCategory: string) => {
    setError('');
    fetch(
      `${api_url}/expense-labels/user/${userId}/category/${selectedCategory}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        const transformedData = data.map(
          (item: { name: string; id: number }) => ({
            label: item.name,
            value: item.id,
          })
        );
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
      return;
    }

    let labelId = label;
    const labelExists = labelData.some(
      (item) => item.value.toString() === label
    );

    if (!labelExists) {
      try {
        const res = await fetch(
          `${api_url}/expense-labels/user/${userId}/category/${category}`,
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
    };

    try {
      const response = await fetch(
        `${api_url}/expenses/user/${userId}/label/${labelId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create expense');
      }

      await response.json();
      navigation.goBack();

      const actualDate = new Date().toISOString().split('T')[0];
      const months = generateLast6months(actualDate);

      let total = 0;
      let month_with_registers = 0;
      let categoryName = '';

      for (let i = 0; i < months.length; i++) {
        const [year, month] = months[i];
        const response = await fetch(
          `${api_url}/expenses/summary/user/category`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              year: parseInt(year),
              month: parseInt(month),
              categoryId: category,
            }),
          }
        );

        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          const gasto = json[0].total;
          categoryName = json[0].categoryName;
          total += gasto;
          month_with_registers += 1;
        }
      }

      const med = month_with_registers > 0 ? total / month_with_registers : 0;
      const [curYear, curMonth] = actualDate.split('-');

      const currentMonthResponse = await fetch(
        `${api_url}/expenses/summary/user/category`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            year: parseInt(curYear),
            month: parseInt(curMonth),
            categoryId: category,
          }),
        }
      );

      const currentMonthJson = await currentMonthResponse.json();
      let this_month = 0;
      if (Array.isArray(currentMonthJson) && currentMonthJson.length > 0) {
        this_month = currentMonthJson[0].total;
      }

      if (this_month > med && med > 0 && category !== '7') {
        const formattedDate = dayjs().toISOString();
        await fetch(`${api_url}/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            notificationDate: formattedDate,
            title: 'Keep your goal in mind!',
            text: `You are spending too much in ${categoryName} compared to the last 6 months.`,
          }),
        });
        NotificationEventEmitter.emit('refreshUnreadCount');
      }

      if (category === '7') {
        const lastPercentageLevel = await fetch(
          `${api_url}/user/${userId}/lastPercentage`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const actualLevelPoints = await lastPercentageLevel.json();
        console.log('✔️ Fetched lastPercentage:', actualLevelPoints);

        const savingsResponse = await fetch(
          `${api_url}/savings-target/highest-priority?userId=${userId}`
        );
        const savingsData: SavingsTarget = await savingsResponse.json();
        console.log('✔️ Fetched savings target:', savingsData.amount);
        setSavingsTarget(savingsData);

        const totalSavedResponse = await fetch(
          `${api_url}/expenses/total/user/${userId}/category/Savings`
        );
        const totalSaved: number = await totalSavedResponse.json();
        console.log('✔️ Fetched total saved:', totalSaved);
        setAmountSaved(totalSaved);

        let percentage = 0;
        if (savingsData?.amount > 0) {
          percentage = (totalSaved / savingsData.amount) * 100;
        }
        console.log('📊 Calculated raw percentage:', percentage);

        if (percentage < 25) {
          percentage = 0;
        } else if (percentage < 50) {
          percentage = 25;
        } else if (percentage < 75) {
          percentage = 50;
        } else if (percentage < 100) {
          percentage = 75;
        } else {
          percentage = 100;
        }
        console.log('🎯 Mapped percentage level:', percentage);

        if (percentage !== actualLevelPoints) {
          const advancedLevels = percentage / 25 - actualLevelPoints / 25;
          const points = advancedLevels * 100;
          const formattedDate = dayjs().toISOString();

          console.log(
            `🏆 User advanced ${advancedLevels} level(s), earning ${points} XP`
          );

          await fetch(`${api_url}/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              notificationDate: formattedDate,
              title: 'Well done!',
              text: `Your progress is above ${percentage}%, so you've won ${points} XP!`,
            }),
          });
          console.log('📩 Notification sent');

          NotificationEventEmitter.emit('refreshUnreadCount');

          await fetch(`${api_url}/user/${userId}/lastPercentage`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lastPercentage: percentage }),
          });
          console.log('🔄 Updated lastPercentage');

          await fetch(`${api_url}/gamification/user/${userId}/points`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ points: points }),
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <BackgroundLayout title="Add Expense">
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
              onChange={(item) => setFrequency(item.value)}
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
