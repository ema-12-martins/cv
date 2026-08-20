import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type TabSwitcherProps = {
  activeTab: 'incomes' | 'expenses';
  setActiveTab: (tab: 'incomes' | 'expenses') => void;
};

export default function TabSwitcher({
  activeTab,
  setActiveTab,
}: TabSwitcherProps) {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'incomes'
            ? styles.activeTabButton
            : styles.inactiveTabButton,
          activeTab === 'incomes' && styles.activeTabScale,
        ]}
        onPress={() => setActiveTab('incomes')}
      >
        <Text
          style={
            activeTab === 'incomes'
              ? styles.activeTabText
              : styles.inactiveTabText
          }
        >
          Incomes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'expenses'
            ? styles.activeTabButton
            : styles.inactiveTabButton,
          activeTab === 'expenses' && styles.activeTabScale,
        ]}
        onPress={() => setActiveTab('expenses')}
      >
        <Text
          style={
            activeTab === 'expenses'
              ? styles.activeTabText
              : styles.inactiveTabText
          }
        >
          Expenses
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#CAD3FF', // lighter purple
    borderRadius: 15,
    width: 350,
    height: 50,
    paddingHorizontal: 10,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButton: {
    width: 90,
    height: 35,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#7067CF', // darker purple
  },
  inactiveTabButton: {
    backgroundColor: '#A6A9F8', // lighter purple
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inactiveTabText: {
    color: 'white',
    fontSize: 14,
  },
  activeTabScale: {
    transform: [{ scale: 1.1 }],
  },
});
