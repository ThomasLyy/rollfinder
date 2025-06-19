
import { RollHistoryEntry, CharacterRollHistoryEntry } from '../types/rollHistory';

// Pour générer un roll "générique"
export function makeRollHistoryEntry(label: string, dice: { type: number, results: number[] }[], modifier: number, total: number, detail?: string): RollHistoryEntry {
    return {
        time: new Date().toLocaleTimeString(),
        label,
        dice,
        modifier,
        total,
        ...(detail ? { detail } : {})
    };
}

// Pour un roll "personnage" classique (d20)
export function makeCharacterRollHistoryEntry(label: string, die: number, modif: number, total: number): CharacterRollHistoryEntry {
    return {
        time: new Date().toLocaleTimeString(),
        label,
        die,
        modif,
        total
    };
}
