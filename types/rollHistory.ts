export type RollHistoryEntry = {
    time: string;             // Heure du lancer
    label?: string;           // Intitulé du jet (optionnel)
    dice?: { type: number; results: number[] }[]; // Dés lancés (ex: [{type:8, results:[5,3]}])
    modifier?: number;        // Modificateur additionnel (optionnel)
    total: number;            // Total final
    detail?: string;          // Champ de détail texte optionnel (pour surcharger l’affichage)
};

// Type d'entrée pour CharacterRollHistorySection (jets fiche personnage)
export type CharacterRollHistoryEntry = {
    time: string;
    label?: string;       // Compétence, sauvegarde ou perception
    die: number;          // Résultat du d20
    modif?: number;       // Modificateur éventuel
    total: number;        // Total
};
