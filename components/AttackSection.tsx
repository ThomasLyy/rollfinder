import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MasteryRank, masteryBonus, Attack, StatKey } from '../types/character';

interface AttackSectionProps {
    attacks: Record<string, Attack>;
    onChange: (key: string, value: Partial<Attack>) => void;
    onRoll: (label: string, modif: number) => void;
    niveau?: number;
    stats?: Record<StatKey, number>;
}

const masteryRanks: MasteryRank[] = ["inexpérimenté", "qualifié", "expert", "maître", "légendaire"];
const masteryAbbr: Record<MasteryRank, string> = {
    "inexpérimenté": "I", "qualifié": "Q", "expert": "E", "maître": "M", "légendaire": "L"
};
const masteryColors: Record<MasteryRank, string> = {
    "inexpérimenté": "#f1f5f9",
    "qualifié": "#bae6fd",
    "expert": "#38bdf8",
    "maître": "#0ea5e9",
    "légendaire": "#0369a1"
};
const masteryTextColors: Record<MasteryRank, string> = {
    "inexpérimenté": "#334155",
    "qualifié": "#0e7490",
    "expert": "#0e7490",
    "maître": "#fff",
    "légendaire": "#fff"
};

const statOptions: StatKey[] = ["FOR", "DEX"];
const statLabels: Record<StatKey, string> = {
    FOR: "FOR",
    DEX: "DEX",
    CON: "CON",
    INT: "INT",
    SAG: "SAG",
    CHA: "CHA"
};


const attackList = [
    { key: 'first', label: "Attaque 1" },
    { key: 'second', label: "Attaque 2" },
    { key: 'third', label: "Attaque 3" },
    { key: 'fourth', label: "Attaque 4" },
    { key: 'fifth', label: "Attaque 5" },
    { key: 'sixth', label: "Attaque 6" }
];

export function AttackSection({
    attacks,
    onChange,
    onRoll,
    niveau = 1,
    stats = { FOR: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0 }
}: AttackSectionProps) {
    const widths = {
        label: 110,
        stat: 46,
        maitrise: 34,
        equip: 38,
        total: 46,
        roll: 32
    };

    const cycleMastery = (current: MasteryRank) => {
        const idx = masteryRanks.indexOf(current);
        return masteryRanks[(idx + 1) % masteryRanks.length];
    };

    const cycleStat = (current: StatKey): StatKey => {
        const idx = statOptions.indexOf(current);
        return statOptions[(idx + 1) % statOptions.length];
    };

    return (
        <View>
            <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { width: widths.label, textAlign: 'left' }]}>Type</Text>
                <Text style={[styles.headerCell, { width: widths.stat }]}>Stat</Text>
                <Text style={[styles.headerCell, { width: widths.maitrise }]}>Mait</Text>
                <Text style={[styles.headerCell, { width: widths.equip }]}>Éq</Text>
                <Text style={[styles.headerCell, { width: widths.total }]}>Tot</Text>
                <Text style={[styles.headerCell, { width: widths.roll }]}></Text>
            </View>
            {attackList.map(({ key, label }) => {
                const atk: Attack = attacks[key] ?? { stat: "FOR", mastery: "inexpérimenté", bonusEquip: 0 };
                const mastery: MasteryRank = masteryRanks.includes(atk.mastery) ? atk.mastery : "inexpérimenté";
                const stat: StatKey = statOptions.includes(atk.stat) ? atk.stat : "FOR";
                const equip = Number.isFinite(atk.bonusEquip) ? atk.bonusEquip : 0;
                const caracVal = Number.isFinite(stats[stat]) ? stats[stat] : 0;
                const modif = caracVal + masteryBonus[mastery] + equip + niveau;
                return (
                    <View key={key} style={styles.lineRow}>
                        <Text style={[styles.cell, styles.labelCell, { width: widths.label }]} numberOfLines={1}>{label}</Text>
                        <TouchableOpacity
                            style={[
                                styles.colStatBtn,
                                { width: widths.stat, backgroundColor: "#e0e7ef", borderColor: "#bae6fd" }
                            ]}
                            onPress={() => onChange(key, { ...atk, stat: cycleStat(stat) })}
                        >
                            <Text style={styles.colStatText}>{statLabels[stat]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.colMaîtriseBtn,
                                {
                                    width: widths.maitrise,
                                    backgroundColor: masteryColors[mastery],
                                    borderColor: masteryColors[mastery]
                                }
                            ]}
                            onPress={() => onChange(key, { ...atk, mastery: cycleMastery(mastery) })}
                        >
                            <Text style={[styles.colMaîtriseText, { color: masteryTextColors[mastery] }]}>
                                {masteryAbbr[mastery]}
                            </Text>
                        </TouchableOpacity>
                        <View style={[styles.colEquipBox, { width: widths.equip }]}>
                            <Text style={styles.equipBtn} onPress={() => onChange(key, { ...atk, bonusEquip: equip - 1 })}>-</Text>
                            <Text style={styles.equipVal}>{equip}</Text>
                            <Text style={styles.equipBtn} onPress={() => onChange(key, { ...atk, bonusEquip: equip + 1 })}>+</Text>
                        </View>
                        <Text style={[styles.cell, { width: widths.total, textAlign: 'center', fontWeight: 'bold' }]}>{modif >= 0 ? `+${modif}` : modif}</Text>
                        <TouchableOpacity style={{ width: widths.roll, alignItems: 'center' }} onPress={() => onRoll(label, modif)}>
                            <Text style={styles.colRoll}>🎲</Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tableHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 1,
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 2,
        minHeight: 26
    },
    headerCell: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#64748b',
        textAlign: 'center',
        marginHorizontal: 5,
    },
    lineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 29,
        maxHeight: 32,
        borderBottomWidth: 0.4,
        borderColor: '#f3f4f6'
    },
    cell: {
        fontSize: 13,
        textAlign: 'center',
        color: '#222',
        height: 26,
        textAlignVertical: 'center',
        marginHorizontal: 5, // espacement horizontal pour lisibilité
    },
    labelCell: {
        textAlign: 'left',
        fontWeight: 'bold',
        paddingRight: 3,
        marginHorizontal: 5,
    },
    colStatBtn: {
        height: 22,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 2,
        marginHorizontal: 5
    },
    colStatText: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#0e7490',
        textAlign: 'center',
        width: '100%'
    },
    colMaîtriseBtn: {
        height: 22,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 2,
        marginHorizontal: 5
    },
    colMaîtriseText: {
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
        width: '100%'
    },
    colEquipBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
    },
    equipBtn: { fontSize: 13, width: 14, textAlign: 'center', color: '#888' },
    equipVal: { width: 12, textAlign: 'center', fontSize: 13 },
    colRoll: { textAlign: 'center', fontSize: 17, marginHorizontal: 5 },
});

export default AttackSection;
