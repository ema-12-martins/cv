import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { floatingMenuStyles as styles } from '../styles/floatingMenu.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onIncome: () => void;
  onExpense: () => void;
  onSaving: () => void;
  onListSaving: () => void;
}

export default function FloatingActionMenu({
  visible,
  onClose,
  onIncome,
  onExpense,
  onSaving,
  onListSaving,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const [showInternalModal, setShowInternalModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowInternalModal(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 50,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowInternalModal(false);
      });
    }
  }, [visible]);

  if (!showInternalModal) return null;

  return (
    <Modal
      transparent
      visible={showInternalModal}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            styles.menu,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <TouchableOpacity style={styles.button} onPress={onIncome}>
            <Text style={styles.text}>Insert Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onExpense}>
            <Text style={styles.text}>Insert Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSaving}>
            <Text style={styles.text}>Insert saving objective</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onListSaving}>
            <Text style={styles.text}>List of saving objectives</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
