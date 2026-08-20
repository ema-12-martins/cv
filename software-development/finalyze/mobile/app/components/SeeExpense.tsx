import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

// Definindo a interface Expense
interface Expense {
  labelId: number;
  userId: number;
  value: number;
  occurrenceDate: string;
  insertionDate: string;
}

export default function SeeExpense() {
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    // Requisição GET para obter os dados da despesa
    fetch('http://192.168.1.69:8080/api/expenses/1')
      .then((response) => response.json())
      .then((data) => setExpense(data))
      .catch((error) => {
        console.error('Error getting expense:', error);
      });
  }, []);

  const SeeExpense = () => {
    // Requisição POST para adicionar uma nova despesa
    fetch('http://192.168.1.69:8080/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        labelId: 1,
        userId: 1,
        value: 25.5,
        occurrenceDate: '2025-04-09',
        insertionDate: '2025-04-10',
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Response:', data))
      .catch((error) => console.error('Error:', error));
  };

  const editPressed = () => {
    alert('Edit was pressed!');
  };

  const deletePressed = () => {
    alert('Delete was pressed!');
  };

  return (
    <View style={styles.container}>
      {expense ? (
        <>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.input}>{expense.occurrenceDate}</Text>

          <Text style={styles.label}>Category:</Text>
          <Text style={styles.input}>{expense.labelId}</Text>

          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.input}>{expense.value}</Text>

          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.input}>{expense.userId}</Text>

          <Text style={styles.label}>Insertion Date:</Text>
          <Text style={styles.input}>{expense.insertionDate}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}

      <View style={styles.button}>
        <TouchableOpacity style={styles.buttonStyle} onPress={editPressed}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.button}>
        <TouchableOpacity style={styles.buttonStyle} onPress={deletePressed}>
          <Text style={styles.buttonText}>Delete</Text>
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
  input: {
    height: 40,
    borderColor: '#CAD3FF',
    width: '80%',
    paddingHorizontal: 8,
    backgroundColor: '#CAD3FF',
    marginBottom: 20,
    borderRadius: 10,
    paddingTop: 10,
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
