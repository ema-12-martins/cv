import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CategoryIcon from './CategoryIcon';
import { trackingStyles } from '../styles/tracking.styles';
import DetailsPopUp from './DetailsPopUp';

type TrackingEntryProps = {
  id: number;
  value: number;
  label: string;
  category: string;
  occurrenceDate: string;
  type: string;
};

export default function TrackingEntry({
  id,
  value,
  label,
  category,
  occurrenceDate,
  type,
}: TrackingEntryProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLongPress = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <View>
      <Pressable
        onLongPress={handleLongPress}
        style={trackingStyles.trackingEntryContainer}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={trackingStyles.trackingEntryIconContainer}>
            <CategoryIcon category={category} />
          </View>
          <View style={trackingStyles.trackingEntryInfoContainer}>
            <Text style={trackingStyles.categoryText}> {category} </Text>
            {label !== 'None' && (
              <Text style={trackingStyles.labelText}> {label} </Text>
            )}
          </View>
        </View>

        <View style={trackingStyles.trackingEntryValueContainer}>
          <Text style={trackingStyles.valueText}>
            {type === 'income' ? '+' : '-'}
            {value}€
          </Text>
          <Text style={trackingStyles.dateText}>{occurrenceDate}</Text>
        </View>
      </Pressable>

      <DetailsPopUp
        menuVisible={menuVisible}
        closeMenu={closeMenu}
        id={id}
        value={value}
        label={label}
        category={category}
        occurrenceDate={occurrenceDate}
        type={type}
      />
    </View>
  );
}
