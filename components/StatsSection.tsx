import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type StatKey = "FOR" | "DEX" | "CON" | "INT" | "SAG" | "CHA";
type Stats = Record<StatKey, number>;

type StatsSectionProps = {
    niveau: number;
    onNiveauChange: (n: number) => void;
    stats: Stats;
    onStatChange: (key: StatKey, value: number) => void;
};


const caracLabels: { key: StatKey; label: string }[] = [
    { key: "FOR", label: "Force" },
    { key: "DEX", label: "Dextérité" },
    { key: "CON", label: "Constitution" },
    { key: "INT", label: "Intelligence" },
    { key: "SAG", label: "Sagesse" },
    { key: "CHA", label: "Charisme" },
];

const H_MARGIN = 5;

export function StatsSection({ niveau, stats, onNiveauChange, onStatChange }: StatsSectionProps) {
    const widths = { label: 110, stepper: 90 };

    return (
        <View>
            <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { width: widths.label, textAlign: 'left' }]}>Caractéristique</Text>
                <Text style={[styles.headerCell, { width: widths.stepper }]}>Valeur</Text>
            </View>
            <View style={styles.lineRow}>
                <Text style={[styles.cell, styles.labelCell, { width: widths.label }]} numberOfLines={1}>Niveau</Text>
                <View style={[styles.statStepper, { width: widths.stepper }]}>
                    <Text style={styles.stepBtn} onPress={() => onNiveauChange(Math.max(niveau - 1, 1))}>-</Text>
                    <Text style={styles.statValue}>{niveau}</Text>
                    <Text style={styles.stepBtn} onPress={() => onNiveauChange(Math.min(niveau + 1, 20))}>+</Text>
                </View>
            </View>
            {caracLabels.map(({ key, label }) => (
                <View key={key} style={styles.lineRow}>
                    <Text style={[styles.cell, styles.labelCell, { width: widths.label }]} numberOfLines={1}>{label}</Text>
                    <View style={[styles.statStepper, { width: widths.stepper }]}>
                        <Text style={styles.stepBtn} onPress={() => onStatChange(key, Math.max(stats[key] - 1, -5))}>-</Text>
                        <Text style={styles.statValue}>{stats[key]}</Text>
                        <Text style={styles.stepBtn} onPress={() => onStatChange(key, Math.min(stats[key] + 1, 5))}>+</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    tableHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 1, borderBottomWidth: 1, borderColor: '#e5e7eb', marginBottom: 2, minHeight: 26 },
    headerCell: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: '#64748b', marginHorizontal: H_MARGIN },
    lineRow: { flexDirection: 'row', alignItems: 'center', minHeight: 29, maxHeight: 32, borderBottomWidth: 0.4, borderColor: '#f3f4f6' },
    cell: { fontSize: 13, textAlign: 'center', color: '#222', height: 26, textAlignVertical: 'center', marginHorizontal: H_MARGIN },
    labelCell: { textAlign: 'left', fontWeight: 'bold', paddingRight: 3, marginHorizontal: H_MARGIN },
    statStepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: H_MARGIN },
    stepBtn: { fontSize: 13, width: 14, textAlign: 'center', color: '#888' },
    statValue: { width: 15, textAlign: 'center', fontSize: 13 },
});

export default StatsSection;
