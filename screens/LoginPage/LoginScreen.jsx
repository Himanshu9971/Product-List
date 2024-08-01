import { View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import Buttons from '../../components/Buttons';
import Colors from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn, setUserData } from '../../ReduxStore/ReduxSlice';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    setEmail('');
    setPassword('');
    setErrors({ email: '', password: '' });
  }, []);

  const validateInput = () => {
    let isValid = true;
    const newErrors = { ...errors };
    if (!email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validateInput()) {
      try {
        const storedData = await AsyncStorage.getItem('signUpForm');
        if (storedData) {
          const { email: storedEmail, password: storedPassword, userName, mobileNumber } = JSON.parse(storedData);

          if (email === storedEmail && password === storedPassword) {
            dispatch(setIsLoggedIn(true));
            dispatch(setUserData({ email: storedEmail, userName, mobileNumber }));
            navigation.navigate('Home');
          } else {
            setErrors({ ...errors, password: 'Incorrect email or password.' });
          }
        } else {
          setErrors({ ...errors, password: 'No user found. Please sign up first.' });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors({ ...errors, password: 'An error occurred while logging in.' });
      }
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        error={errors.email}
      />
      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
        error={errors.password}
      />
      <Buttons
        onPress={handleLogin}
        title="Login"
        style={{
          width: '100%',
          backgroundColor: Colors.buttonSecondary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.primaryColor,
  },
});
