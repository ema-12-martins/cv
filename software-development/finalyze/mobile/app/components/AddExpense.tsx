import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AddExpense() {
  const [expenseCategory, setExpenseCategory] = useState('Food');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseLabel, setExpenseLabel] = useState('');
  const [expensePriority, setExpensePriority] = useState('2');
  const [expenseFrequency, setExpenseFrequency] = useState('once');
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (date: Date) => {
    setExpenseDate(date);
    setShowDatePicker(false);
  };

  const savePressed = () => {
    const expenseData = {
      labelId: 1,
      userId: 1,
      value: parseFloat(expenseAmount),
      occurrenceDate: expenseDate.toISOString().split('T')[0],
      insertionDate: new Date().toISOString().split('T')[0],
    };

    fetch('http://192.168.1.69:8080/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Expense saved successfully: ');
      })
      .catch((error) => {
        console.error('Error saving expense:', error);
      });
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true); // Abre o picker de data
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date:</Text>

      <View style={styles.datePickerContainer}>
        <Text style={styles.dateText}>{expenseDate.toLocaleDateString()}</Text>
        <TouchableOpacity onPress={showDatePickerHandler}>
          <Image
            source={require('./../assets/calendar.png')}
            style={styles.calendarIcon}
          />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={expenseDate}
        onConfirm={handleDateChange}
        onCancel={() => setShowDatePicker(false)}
      />

      <Text style={styles.label}>Category:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={expenseCategory}
          onValueChange={(itemValue) => setExpenseCategory(itemValue)}
          style={styles.pickerWrapperInside}
        >
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Sports" value="Sports" />
          <Picker.Item label="Incomes" value="Incomes" />
          <Picker.Item label="Health" value="Health" />
          <Picker.Item label="Fixed" value="Fixed" />
        </Picker>
      </View>

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        value={expenseAmount}
        onChangeText={setExpenseAmount}
        placeholder="Enter amount separated by '.'"
        placeholderTextColor="#5f5f5f"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Label:</Text>
      <TextInput
        style={styles.input}
        value={expenseLabel}
        onChangeText={setExpenseLabel}
        placeholder="Enter a label"
        placeholderTextColor="#5f5f5f"
        keyboardType="default"
      />

      <Text style={styles.label}>Priority:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={expensePriority}
          onValueChange={(itemValue) => setExpensePriority(itemValue)}
          style={styles.pickerWrapperInside}
        >
          <Picker.Item label="Not Important" value="1" />
          <Picker.Item label="Slightly Important" value="2" />
          <Picker.Item label="Important" value="3" />
          <Picker.Item label="Very Important" value="4" />
          <Picker.Item label="Crucial/Essential" value="5" />
        </Picker>
      </View>

      <Text style={styles.label}>Frequency:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={expenseFrequency}
          onValueChange={(itemValue) => setExpenseFrequency(itemValue)}
          style={styles.pickerWrapperInside}
        >
          <Picker.Item label="Once" value="once" />
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Annually" value="annually" />
        </Picker>
      </View>

      <View style={styles.button}>
        <TouchableOpacity style={styles.buttonStyle} onPress={savePressed}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    width: '80%',
    textAlign: 'left',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
    height: '6%',
    borderRadius: 10,
    backgroundColor: '#CAD3FF',
  },
  dateText: {
    fontSize: 16,
    marginRight: 156,
    marginLeft: 4,
  },
  calendarIcon: {
    width: 30,
    height: 30,
  },
  pickerWrapper: {
    height: 40,
    borderColor: '#CAD3FF',
    width: '80%',
    paddingHorizontal: 8,
    backgroundColor: '#CAD3FF',
    marginBottom: 20,
    borderRadius: 10,
  },
  pickerWrapperInside: {
    marginTop: -7,
    marginLeft: -18,
  },
  input: {
    height: 40,
    borderColor: '#CAD3FF',
    width: '80%',
    paddingHorizontal: 8,
    backgroundColor: '#CAD3FF',
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    width: '60%',
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonStyle: {
    height: 40,
    backgroundColor: '#7067CF',
    paddingHorizontal: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
