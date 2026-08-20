import React from 'react';
import { View } from 'react-native';

export default function LineSeparator() {
  return (
    <View
      style={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 10,
        width: '80%',
      }}
    />
  );
}
