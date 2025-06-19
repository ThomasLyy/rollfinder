export interface DetailedRoll { value: number; sides: number; }
export interface RollResult { total: number; rolls: DetailedRoll[]; }

export type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

export interface DetailedRoll {
    value: number;
    sides: number;
}

export interface RollResult {
    total: number;
    rolls: DetailedRoll[];
    modifier: number;
    formula: string;
}

export interface HistoryEntry {
    id: string;
    formula: string;
    total: number;
    rolls: DetailedRoll[];
    modifier: number;
    timestamp: number;
    isNew: boolean;
}