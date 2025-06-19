export type MasteryRank = "inexpérimenté" | "qualifié" | "expert" | "maître" | "légendaire";

export type StatKey = "FOR" | "DEX" | "CON" | "INT" | "SAG" | "CHA";

export type Attack = {
    stat: StatKey;               // Stat utilisée (FOR ou DEX)
    mastery: MasteryRank;        // Degré de maîtrise
    bonusEquip: number;          // Bonus d'équipement
};

export const masteryBonus: Record<MasteryRank, number> = {
    "inexpérimenté": 0,
    "qualifié": 2,
    "expert": 4,
    "maître": 6,
    "légendaire": 8,
};

export const skillList = [
    { key: "acrobaties", label: "Acrobaties", carac: "DEX" },
    { key: "arcanes", label: "Arcanes", carac: "INT" },
    { key: "artisanat", label: "Artisanat", carac: "INT" },
    { key: "athletisme", label: "Athlétisme", carac: "FOR" },
    { key: "lore1", label: "Connaissances 1", carac: "INT" },
    { key: "lore2", label: "Connaissances 2", carac: "INT" },
    { key: "diplomatie", label: "Diplomatie", carac: "CHA" },
    { key: "discretion", label: "Discrétion", carac: "DEX" },
    { key: "duperie", label: "Duperie", carac: "CHA" },
    { key: "intimidation", label: "Intimidation", carac: "CHA" },
    { key: "medecine", label: "Médecine", carac: "SAG" },
    { key: "nature", label: "Nature", carac: "SAG" },
    { key: "occultisme", label: "Occultisme", carac: "INT" },
    { key: "religion", label: "Religion", carac: "SAG" },
    { key: "representation", label: "Représentation", carac: "CHA" },
    { key: "societe", label: "Société", carac: "INT" },
    { key: "survie", label: "Survie", carac: "SAG" },
    { key: "vol", label: "Vol", carac: "DEX" }
];

export const savesList = [
    { key: "vigueur", label: "Vigueur", carac: "CON" },
    { key: "reflexes", label: "Réflexes", carac: "DEX" },
    { key: "volonte", label: "Volonté", carac: "SAG" },
];
