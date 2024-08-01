import { View, Text, StyleSheet, TextInput } from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';

export default function InputField({ 
  label, 
  value, 
  onChangeText, 
  secureTextEntry, 
  placeholder, 
  error, 
  placeholderTextColor = Colors.placeholderColor 
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        accessibilityLabel={label}
        accessibilityHint={`Enter your ${label.toLowerCase()}`}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
    paddingHorizontal: 20,
    height: 45,
    borderRadius: 8,
  },
  inputError: {
    borderColor: Colors.errorColor,
  },
  error: {
    color: Colors.errorColor,
    marginTop: 5,
  },
});
