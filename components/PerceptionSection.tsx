import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MasteryRank, masteryBonus } from '../types/character';

// Types stricts pour les props
interface Perception {
    mastery: MasteryRank;
    bonusEquip: number;
}
interface PerceptionSectionProps {
    niveau: number;
    statSAG: number;
    perception: Perception;
    onChange: (change: Partial<Perception>) => void;
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

export function PerceptionSection({
    niveau,
    statSAG,
    perception,
    onChange,
    onRoll
}: PerceptionSectionProps) {
    const widths = {
        label: 110, carac: 78, maitrise: 34, equip: 38, total: 46, roll: 32
    };
    const { mastery, bonusEquip } = perception;
    // On vérifie bien que mastery est un MasteryRank valide
    const safeMastery: MasteryRank = masteryRanks.includes(mastery) ? mastery : "inexpérimenté";
    const modif = statSAG + masteryBonus[safeMastery] + niveau + bonusEquip;

    const cycleMastery = (current: MasteryRank) => {
        const idx = masteryRanks.indexOf(current);
        return masteryRanks[(idx + 1) % masteryRanks.length];
    };

    return (
        <View>
            <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { width: widths.label, textAlign: 'left' }]}>Perception</Text>
                <Text style={[styles.headerCell, { width: widths.carac }]}>Carac</Text>
                <Text style={[styles.headerCell, { width: widths.maitrise }]}>Mait</Text>
                <Text style={[styles.headerCell, { width: widths.equip }]}>Éq</Text>
                <Text style={[styles.headerCell, { width: widths.total }]}>Tot</Text>
                <Text style={[styles.headerCell, { width: widths.roll }]}></Text>
            </View>
            <View style={styles.lineRow}>
                <Text style={[styles.cell, styles.labelCell, { width: widths.label }]} numberOfLines={1}>Perception</Text>
                <Text style={[styles.cell, { width: widths.carac }]} numberOfLines={1}>
                    (SAG : {statSAG >= 0 ? `+${statSAG}` : statSAG})
                </Text>
                <TouchableOpacity
                    style={[
                        styles.colMaîtriseBtn,
                        { width: widths.maitrise, backgroundColor: masteryColors[safeMastery], borderColor: masteryColors[safeMastery] }
                    ]}
                    onPress={() => onChange({ mastery: cycleMastery(safeMastery) })}
                >
                    <Text style={[styles.colMaîtriseText, { color: masteryTextColors[safeMastery] }]}>
                        {masteryAbbr[safeMastery]}
                    </Text>
                </TouchableOpacity>
                <View style={[styles.colEquipBox, { width: widths.equip }]}>
                    <Text style={styles.equipBtn} onPress={() => onChange({ bonusEquip: bonusEquip - 1 })}>-</Text>
                    <Text style={styles.equipVal}>{bonusEquip}</Text>
                    <Text style={styles.equipBtn} onPress={() => onChange({ bonusEquip: bonusEquip + 1 })}>+</Text>
                </View>
                <Text style={[styles.cell, { width: widths.total, textAlign: 'center', fontWeight: 'bold' }]}>{modif >= 0 ? `+${modif}` : modif}</Text>
                <TouchableOpacity style={{ width: widths.roll, alignItems: 'center' }} onPress={() => onRoll("Perception", modif)}>
                    <Text style={styles.colRoll}>🎲</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const H_MARGIN = 5;

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

export default PerceptionSection;
