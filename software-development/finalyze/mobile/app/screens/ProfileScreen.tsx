import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { styles } from '../styles/profile.styles';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet from '../components/BottomSheet';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);

  const api_url = process.env.EXPO_PUBLIC_API_URL;

  const fetchPoints = async () => {
    if (!user?.id) {
      console.warn('[XP] No user ID available, skipping XP fetch');
      return;
    }

    try {
      const res = await fetch(`${api_url}/gamification/user/${user.id}/points`);
      const data = await res.json();
      if (typeof data === 'number') {
        setPoints(data);
      } else if (data && typeof data.points === 'number') {
        setPoints(data.points);
      } else {
        console.warn('[XP] Unexpected response format:', data);
      }
    } catch (error) {
      console.error('[XP] Failed to fetch points:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPoints();
    }, [user])
  );

  useEffect(() => {
    const loadImage = async () => {
      if (!user?.email) return;
      const uri = await AsyncStorage.getItem(`profileImage_${user.email}`);
      if (uri) setProfileImage(uri);
    };

    loadImage();
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && user?.email) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem(`profileImage_${user.email}`, uri);
    }
  };

  const [editableUser, setEditableUser] = useState({
    name: user?.name || '',
    mobileNumber: String(user?.mobileNumber || ''),
    birthdate: user?.birthdate || '',
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        ...editableUser,
        mobileNumber: parseInt(editableUser.mobileNumber, 10),
      });
      Alert.alert('Profile updated');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch {
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  return (
    <BottomSheet>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>Profile</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.levelInfoContainer}>
            <Text style={styles.levelText}>Level</Text>
            <Text style={styles.xpPoints}>{points} XP</Text>
          </View>
        </View>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.input}>{user?.email || 'N/A'}</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={editableUser.name}
          onChangeText={(text) =>
            setEditableUser({ ...editableUser, name: text })
          }
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={editableUser.mobileNumber}
          onChangeText={(text) =>
            setEditableUser({ ...editableUser, mobileNumber: text })
          }
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={editableUser.birthdate}
          onChangeText={(text) =>
            setEditableUser({ ...editableUser, birthdate: text })
          }
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </BottomSheet>
  );
}
