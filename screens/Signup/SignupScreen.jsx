import { View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import Buttons from '../../components/Buttons';
import Colors from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setSignUpForm, clearSignUpForm } from '../../ReduxStore/ReduxSlice';

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const signUpForm = useSelector((state) => state.signUpForm);

  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
  });

  useEffect(() => {
    dispatch(clearSignUpForm());
    setErrors({
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNumber: '',
    });
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    dispatch(setSignUpForm({ [field]: value }));
    validateField(field, { ...signUpForm, [field]: value });
  };

  const validateField = (field, form) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'userName':
        newErrors.userName = form.userName ? '' : 'User name is required.';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        newErrors.email = form.email
          ? emailRegex.test(form.email)
            ? ''
            : 'Invalid email format.'
          : 'Email is required.';
        break;
      case 'password':
        newErrors.password = form.password ? '' : 'Password is required.';
        break;
      case 'confirmPassword':
        newErrors.confirmPassword = form.confirmPassword
          ? form.password === form.confirmPassword
            ? ''
            : 'Passwords do not match.'
          : 'Confirm password is required.';
        break;
      case 'mobileNumber':
        newErrors.mobileNumber = form.mobileNumber
          ? form.mobileNumber.length >= 10
            ? ''
            : 'Mobile number must be at least 10 digits.'
          : 'Mobile number is required.';
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(signUpForm).forEach((field) => {
      if (!signUpForm[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`;
        isValid = false;
      }
    });

    if (signUpForm.password !== signUpForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      try {
        const userData = {
          email: signUpForm.email,
          password: signUpForm.password,
          userName: signUpForm.userName,
          mobileNumber: signUpForm.mobileNumber,
        };
        await AsyncStorage.setItem('signUpForm', JSON.stringify(userData));
        navigation.navigate('Login');
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        label="User Name"
        value={signUpForm.userName}
        onChangeText={(value) => handleInputChange('userName', value)}
        placeholder="Enter your user name"
        error={errors.userName}
      />
      <InputField
        label="Email"
        value={signUpForm.email}
        onChangeText={(value) => handleInputChange('email', value)}
        placeholder="Enter your email"
        error={errors.email}
      />
      <InputField
        label="Password"
        value={signUpForm.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
        placeholder="Enter your password"
        error={errors.password}
      />
      <InputField
        label="Confirm Password"
        value={signUpForm.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry
        placeholder="Confirm your password"
        error={errors.confirmPassword}
      />
      <InputField
        label="Mobile Number"
        value={signUpForm.mobileNumber}
        onChangeText={(value) => handleInputChange('mobileNumber', value)}
        placeholder="Enter your mobile number"
        error={errors.mobileNumber}
      />
      <Buttons
        onPress={handleSignUp}
        title="Sign Up"
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
