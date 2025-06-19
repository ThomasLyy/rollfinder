import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { savesList, MasteryRank, masteryBonus } from '../types/character';

type Save = { mastery: MasteryRank; bonusEquip: number };
type Saves = Record<string, Save>;
interface SavesSectionProps {
    niveau: number;
    stats: Record<string, number>;
    saves: Saves;
    onChange: (key: string, value: Partial<Save>) => void;
    onRoll: (label: string, modif: number) => void;
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

const H_MARGIN = 5;

export function SavesSection({ niveau, stats, saves, onChange, onRoll }: SavesSectionProps) {
    const widths = { label: 110, carac: 78, maitrise: 34, equip: 38, total: 46, roll: 32 };

    const cycleMastery = (current: MasteryRank): MasteryRank => {
        const idx = masteryRanks.indexOf(current);
        return masteryRanks[(idx + 1) % masteryRanks.length];
    };

    return (
        <View>
            <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { width: widths.label, textAlign: 'left' }]}>Type</Text>
                <Text style={[styles.headerCell, { width: widths.carac }]}>Carac</Text>
                <Text style={[styles.headerCell, { width: widths.maitrise }]}>Mait</Text>
                <Text style={[styles.headerCell, { width: widths.equip }]}>Éq</Text>
                <Text style={[styles.headerCell, { width: widths.total }]}>Tot</Text>
                <Text style={[styles.headerCell, { width: widths.roll }]}></Text>
            </View>
            {savesList.map(({ key, label, carac }) => {
                const save = saves[key] ?? { mastery: "inexpérimenté", bonusEquip: 0 };
                const mastery: MasteryRank = masteryRanks.includes(save.mastery) ? save.mastery : "inexpérimenté";
                const equip = Number.isFinite(save.bonusEquip) ? save.bonusEquip : 0;
                const caracVal = Number.isFinite(stats[carac]) ? stats[carac] : 0;
                const modif = caracVal + masteryBonus[mastery] + niveau + equip;
                return (
                    <View key={key} style={styles.lineRow}>
                        <Text style={[styles.cell, styles.labelCell, { width: widths.label }]} numberOfLines={1}>{label}</Text>
                        <Text style={[styles.cell, { width: widths.carac }]} numberOfLines={1}>
                            ({carac} : {caracVal >= 0 ? `+${caracVal}` : caracVal})
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.colMaîtriseBtn,
                                { width: widths.maitrise, backgroundColor: masteryColors[mastery], borderColor: masteryColors[mastery] }
                            ]}
                            onPress={() => onChange(key, { mastery: cycleMastery(mastery) })}
                        >
                            <Text style={[styles.colMaîtriseText, { color: masteryTextColors[mastery] }]}>
                                {masteryAbbr[mastery]}
                            </Text>
                        </TouchableOpacity>
                        <View style={[styles.colEquipBox, { width: widths.equip }]}>
                            <Text style={styles.equipBtn} onPress={() => onChange(key, { bonusEquip: equip - 1 })}>-</Text>
                            <Text style={styles.equipVal}>{equip}</Text>
                            <Text style={styles.equipBtn} onPress={() => onChange(key, { bonusEquip: equip + 1 })}>+</Text>
                        </View>
                        <Text style={[styles.cell, { width: widths.total, textAlign: 'center', fontWeight: 'bold' }]}>{modif >= 0 ? `+${modif}` : modif}</Text>
                        <TouchableOpacity style={{ width: widths.roll }} onPress={() => onRoll(label, modif)}>
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
        flexDirection: 'row', alignItems: 'center', paddingBottom: 1,
        borderBottomWidth: 1, borderColor: '#e5e7eb', marginBottom: 2, minHeight: 26
    },
    headerCell: {
        fontSize: 13, fontWeight: 'bold', color: '#64748b', textAlign: 'center', marginHorizontal: H_MARGIN
    },
    lineRow: {
        flexDirection: 'row', alignItems: 'center', minHeight: 29, maxHeight: 32,
        borderBottomWidth: 0.4, borderColor: '#f3f4f6'
    },
    cell: { fontSize: 13, textAlign: 'center', color: '#222', height: 26, textAlignVertical: 'center' },
    labelCell: { textAlign: 'left', fontWeight: 'bold', paddingRight: 3, marginHorizontal: H_MARGIN },
    colMaîtriseBtn: { height: 22, borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, paddingHorizontal: 2, marginHorizontal: H_MARGIN },
    colMaîtriseText: { fontWeight: 'bold', fontSize: 13, textAlign: 'center', width: '100%' },
    colEquipBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: H_MARGIN },
    equipBtn: { fontSize: 13, width: 14, textAlign: 'center', color: '#888' },
    equipVal: { width: 15, textAlign: 'center', fontSize: 13 },
    colRoll: { textAlign: 'center', fontSize: 17, marginHorizontal: H_MARGIN },
});

export default SavesSection;
