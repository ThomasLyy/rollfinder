import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface HistoryEntry {
    timestamp: number;
    label: string;
    die: number;
    modif: number;
    total: number;
}

interface Props {
    history: HistoryEntry[];
    onClear?: () => void;
}

const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const CharacterRollHistorySection: React.FC<Props> = ({ history, onClear }) => {
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
            {onClear && (
            <TouchableOpacity onPress={onClear}>
                <Text style={styles.clearBtn}>Vider</Text>
            </TouchableOpacity>
            )}
        </View>
        <FlatList
            data={history.slice(0, 10)}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => <HistoryEntryDisplay entry={item} />}
            style={{ width: '100%', marginTop: 10 }}
            scrollEnabled={false}
        />
        </View>
    );
};

const HistoryEntryDisplay = ({ entry }: { entry: HistoryEntry }) => (
    <View style={styles.entryBox}>
        <View style={styles.entryHeader}>
        <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
        <Text style={styles.entryLabel}>{entry.label}</Text>
        <Text style={styles.entryTotal}>Total : {entry.total}</Text>
        </View>
        <Text style={styles.entryFormula}>
            d20 : {entry.die}
            {entry.modif !== 0 && (
                <Text>
                {"  |  Modif : "}
                    <Text style={styles.entryModifVal}>
                        {entry.modif > 0 ? `+${entry.modif}` : entry.modif}
                    </Text>
                </Text>
            )}
        </Text>
    </View>
);

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

export default CharacterRollHistorySection;
