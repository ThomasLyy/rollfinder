import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const diceTypes = [4, 6, 8, 10, 12, 20, 100];

interface Props {
    quantities: Partial<Record<number, number>>;
    onChange: (sides: number, qty: number) => void;
    onReset: () => void;
}

export const DiceSelector: React.FC<Props> = ({ quantities, onChange, onReset }) => (
    <View style={styles.container}>
        <Text style={styles.sectionTitle}>Sélection de dés</Text>
        <View style={styles.grid}>
        {diceTypes.map((sides) => {
            const value = quantities[sides] || 0;
            const isActive = value > 0;
            return (
            <View
                key={sides}
                style={[styles.cell, isActive && styles.cellActive]}
            >
                <Text style={styles.label}>{`d${sides}`}</Text>
                <View style={styles.counterRow}>
                <Pressable
                    onPress={() => onChange(sides, value - 1)}
                    style={[styles.button, value <= 0 && styles.buttonDisabled]}
                    disabled={value <= 0}
                >
                    <Text style={styles.buttonText}>-</Text>
                </Pressable>
                <Text style={styles.value}>{value}</Text>
                <Pressable
                    onPress={() => onChange(sides, value + 1)}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>+</Text>
                </Pressable>
                </View>
            </View>
            );
        })}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { width: '100%', alignItems: 'center', marginVertical: 8 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
    cell: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 6,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#ececec',
        minWidth: 60,
        minHeight: 72,
        borderWidth: 2,
        borderColor: '#ececec',
    },
    cellActive: {
        backgroundColor: '#d6f5e6',
        borderColor: '#46b877',
    },
    label: { fontWeight: 'bold', fontSize: 15 },
    counterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    button: {
        backgroundColor: '#dde',
        borderRadius: 16,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2,
    },
    buttonDisabled: { backgroundColor: '#eee', opacity: 0.6 },
    buttonText: { fontSize: 18, fontWeight: 'bold' },
    value: { fontWeight: 'bold', fontSize: 16, minWidth: 18, textAlign: 'center' },
    resetBtn: {
        marginTop: 10,
        paddingVertical: 6,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: '#e88',
    },
    resetBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
