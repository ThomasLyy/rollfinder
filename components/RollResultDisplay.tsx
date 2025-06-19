import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    result?: {
        total: number;
        rolls: { value: number; sides: number }[];
        modifier?: number;
        formula?: string;
        label?: string;
    } | null;
}

export const RollResultDisplay: React.FC<Props> = ({ result }) => {
    if (!result) return (
        <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucun lancer effectué</Text>
        </View>
    );

    // Groupe les résultats par type de dé
    const rollsByDie: Record<number, number[]> = {};
    result.rolls.forEach(r => {
        if (!rollsByDie[r.sides]) rollsByDie[r.sides] = [];
        rollsByDie[r.sides].push(r.value);
    });

    // Crée la formule affichée (ex : 2d8 + 1d10 + 5)
    const dicePart = Object.entries(rollsByDie)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([sides, arr]) => `${arr.length}d${sides}`)
        .join(' + ');

    const modif = result.modifier || 0;
    const formula = dicePart + (modif ? (modif > 0 ? ` + ${modif}` : ` - ${-modif}`) : '');

    return (
        <View style={styles.root}>
        <Text style={styles.title}>
            Résultat total : <Text style={styles.total}>{result.total}</Text>
        </Text>
        <Text style={styles.formula}>{formula}</Text>
        <View style={{ marginTop: 4, alignSelf: 'center', width: '100%' }}>
            {Object.entries(rollsByDie).sort((a, b) => Number(a[0]) - Number(b[0])).map(([sides, values]) => (
            <Text key={sides} style={styles.decompLine}>
                d{sides} : [<Text style={styles.diceValues}>{values.join(', ')}</Text>]
            </Text>
            ))}
            {modif !== 0 && (
            <Text style={styles.modifLine}>
                Modificateur : <Text style={styles.modifValue}>{modif > 0 ? `+${modif}` : modif}</Text>
            </Text>
            )}
        </View>
        {result.label && (
            <Text style={styles.label}>{result.label}</Text>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        width: '100%',
        paddingVertical: 8,
    },
    title: {
        fontWeight: '700',
        fontSize: 18,
        color: '#1e293b',
        textAlign: 'center',
    },
    total: {
        fontWeight: '800',
        fontSize: 20,
        color: '#2563eb',
    },
    formula: {
        fontSize: 15,
        color: '#334155',
        marginTop: 8,
        marginBottom: 2,
        textAlign: 'center',
        fontStyle: 'italic',
        letterSpacing: 0.2,
    },
    decompLine: {
        fontSize: 14,
        color: '#475569',
        marginBottom: 2,
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
        letterSpacing: 0.1,
    },
    diceValues: {
        color: '#64748b',
        fontWeight: '500',
    },
    modifLine: {
        color: '#e11d48',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
        textAlign: 'center',
    },
    modifValue: {
        color: '#e11d48',
        fontWeight: '700',
    },
    label: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 3,
        textAlign: 'center',
    },
    empty: {
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic',
    }
});

export default RollResultDisplay;
