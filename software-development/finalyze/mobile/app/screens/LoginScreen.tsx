import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/auth.styles';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import BackgroundLayout from '../components/BackgroundContainer';
import BottomSheet from '../components/BottomSheet';

import { LogBox } from 'react-native';

// Ignore all log notifications (warnings)
LogBox.ignoreAllLogs();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigation.replace('IncomeInsertion');
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  // TODO MAKE TRANSITION HAPPEN ONLY ON BOTTOMSCREEN COMPONENT, WHICH IS REUSED BETWEEN LOGIN/REGISTER SCREENS (MAYBE?)
  const handleSignupNavigation = () => {
    navigation.replace('Signup');
  };

  const handleForgotPassword = () => {};

  return (
    <BackgroundLayout
      title="Welcome"
      showBackButton={false}
      showTrophyButton={false}
      showBellButton={false}
    >
      <BottomSheet>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* TODO MAYBE MAKE BUTTONS AND TEXT INPUT BE REUSABLE COMPONENTS */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="password1234"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View
          style={{
            marginVertical: 50,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        ></View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignupNavigation}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </BackgroundLayout>
  );
}
