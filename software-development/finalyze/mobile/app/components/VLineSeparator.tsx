import React from 'react';
import { View } from 'react-native';

export default function VLineSeparator() {
  return (
    <View
      style={{
        borderRightColor: '#ccc',
        borderRightWidth: 1,
        marginHorizontal: 25,
        height: '100%',
        alignSelf: 'center',
      }}
    />
  );
}
