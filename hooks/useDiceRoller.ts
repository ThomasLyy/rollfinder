import { useState } from 'react';
import { DetailedRoll, RollResult, HistoryEntry } from '../types/dice';

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;
type DiceQuantities = Partial<Record<DiceType, number>>;

const diceTypes: DiceType[] = [4, 6, 8, 10, 12, 20, 100];

export function useDiceRoller() {
    const [modifier, setModifier] = useState<number>(0);
    const [diceQuantities, setDiceQuantities] = useState<DiceQuantities>({});
    const [rollResult, setRollResult] = useState<RollResult | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [agile, setAgile] = useState<boolean>(false);
    const [balayage, setBalayage] = useState<boolean>(false);

    const setDiceQuantity = (sides: DiceType, qty: number) => {
        setDiceQuantities(prev => ({ ...prev, [sides]: Math.max(0, qty) }));
    };

    function rollDice(finalModifier: number) {
        const rolls: DetailedRoll[] = [];
        let total = 0;
        let formula = '';
        diceTypes.forEach(sides => {
            const qty = diceQuantities[sides] ?? 0;
            if (qty > 0) {
                for (let i = 0; i < qty; i++) {
                    const value = Math.floor(Math.random() * sides) + 1;
                    rolls.push({ value, sides });
                    total += value;
                }
                formula += `${qty}d${sides} `;
            }
        });
        total += finalModifier;
        if (finalModifier !== 0) formula += (finalModifier > 0 ? '+' : '') + finalModifier;
        formula = formula.trim() || '—';

        const result: RollResult = { total, rolls, modifier: finalModifier, formula };
        setRollResult(result);

        const entry: HistoryEntry = {
            id: Date.now().toString(),
            formula,
            total,
            rolls,
            modifier: finalModifier,
            timestamp: Date.now(),
            isNew: true
        };
        setHistory(prev => [entry, ...prev.slice(0, 19)]);
    }

    function clearHistory() {
        setHistory([]);
    }


    function attack(number: 1 | 2 | 3) {
        let malus = 0;
        if (number === 2) malus = agile ? -4 : -5;
        if (number === 3) malus = agile ? -8 : -10;
        if (balayage && number > 1) malus += 1;
        rollDice(modifier + malus);
    }

    function resetDice() {
        setDiceQuantities({});
        setModifier(0);
        setAgile(false);
        setBalayage(false);
        setRollResult(null);
    }

    return {
        diceQuantities,
        setDiceQuantity,
        modifier,
        setModifier,
        rollDice,
        rollResult,
        history,
        clearHistory,
        resetDice,
        agile,
        setAgile,
        balayage,
        setBalayage,
        attack
    };
}
