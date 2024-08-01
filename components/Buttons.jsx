import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../utils/Colors'

export default function Buttons({ onPress, title, style }) {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 0,
    },
    text: {
        color: Colors.secondaryText,
        fontSize: 16,
    },
})