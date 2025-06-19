import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface HistoryEntry {
    timestamp: number; // ms since epoch
    total: number;
    rolls: { value: number; sides: number }[];
    modifier: number;
    formula?: string;
    label?: string;
}

interface Props {
    history: HistoryEntry[];
    onClear: () => void;
}

const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const RollHistorySection: React.FC<Props> = ({ history, onClear }) => {
    if (!history.length) {
        return (
        <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun lancer enregistré.</Text>
        </View>
        );
    }

    return (
        <View style={styles.root}>
        <View style={styles.headerRow}>
            <Text style={styles.title}>Historique des lancers</Text>
            <TouchableOpacity onPress={onClear}>
            <Text style={styles.clearBtn}>Vider</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={history}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => <HistoryEntryDisplay entry={item} />}
            style={{ width: '100%', marginTop: 10 }}
            scrollEnabled={false} // tout s'affiche, c'est la ScrollView parent qui scrolle
        />
        </View>
    );
};

const HistoryEntryDisplay = ({ entry }: { entry: HistoryEntry }) => {
    // Groupe les résultats par type de dé
    const rollsByDie: Record<number, number[]> = {};
    entry.rolls.forEach(r => {
        if (!rollsByDie[r.sides]) rollsByDie[r.sides] = [];
        rollsByDie[r.sides].push(r.value);
    });

    const dicePart = Object.entries(rollsByDie)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([sides, arr]) => `${arr.length}d${sides}`)
        .join(' + ');

    const modif = entry.modifier ?? 0;
    const formula = dicePart + (modif ? (modif > 0 ? ` + ${modif}` : ` - ${-modif}`) : '');

    return (
        <View style={styles.entryBox}>
        <View style={styles.entryHeader}>
            <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
            {entry.label && <Text style={styles.entryLabel}>{entry.label}</Text>}
            <Text style={styles.entryTotal}>Total : {entry.total}</Text>
        </View>
        <Text style={styles.entryFormula}>{formula}</Text>
        {Object.entries(rollsByDie).sort((a, b) => Number(a[0]) - Number(b[0])).map(([sides, values]) => (
            <Text key={sides} style={styles.entryDecomp}>
            d{sides} : [<Text style={styles.entryDiceVals}>{values.join(', ')}</Text>]
            </Text>
        ))}
        {modif !== 0 && (
        <Text style={styles.entryModif}>
            Modificateur : <Text style={styles.entryModifVal}>{modif > 0 ? `+${modif}` : modif}</Text>
        </Text>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    clearBtn: {
        color: '#e11d48',
        fontWeight: '700',
        fontSize: 13,
        padding: 3,
    },
    entryBox: {
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
        padding: 10,
        marginBottom: 8,
        marginTop: 0,
        shadowColor: "#334155",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    entryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    entryTime: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: '500',
        marginRight: 6,
    },
    entryLabel: {
        color: '#0891b2',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 6,
    },
    entryTotal: {
        color: '#2563eb',
        fontWeight: '800',
        fontSize: 13,
        marginLeft: 'auto',
    },
    entryFormula: {
        fontSize: 14,
        color: '#334155',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 1,
    },
    entryDecomp: {
        fontSize: 13,
        color: '#475569',
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
    },
    entryDiceVals: {
        color: '#64748b',
        fontWeight: '500',
    },
    entryModif: {
        color: '#e11d48',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 0,
    },
    entryModifVal: {
        color: '#e11d48',
        fontWeight: '700',
    },
    empty: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic',
    },
});

export default RollHistorySection;
