import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Props {
    value: number;
    onChange: (newValue: number) => void;
}

export const ModifierStepper: React.FC<Props> = ({ value, onChange }) => (
    <View style={styles.container}>
        <Text style={styles.sectionTitle}>Modificateur</Text>
        <View style={styles.counter}>
        <Pressable style={styles.button} onPress={() => onChange(value - 1)}>
            <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Text style={styles.value}>{value > 0 ? '+' : ''}{value}</Text>
        <Pressable style={styles.button} onPress={() => onChange(value + 1)}>
            <Text style={styles.buttonText}>+</Text>
        </Pressable>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { alignItems: 'center', marginVertical: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
    counter: { flexDirection: 'row', alignItems: 'center' },
    button: {
        backgroundColor: '#dde',
        borderRadius: 16,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    buttonText: { fontSize: 18, fontWeight: 'bold' },
    value: { fontWeight: 'bold', fontSize: 16, minWidth: 24, textAlign: 'center' },
});
