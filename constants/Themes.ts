// Fichier: constants/Themes.ts

// Interface pour les polices d'un thème
export interface ThemeFonts {
  title: string | undefined; // Nom de la police pour les titres (undefined = système)
  body: string | undefined;  // Nom de la police pour le corps (undefined = système)
}

// Interface combinant couleurs et polices pour un thème complet
export interface AppTheme {
    name: 'tavern' | 'lightModern' | 'darkModern'; // Nom du thème
    colors: ThemeColors;
    fonts: ThemeFonts;
}

export interface ThemeColors {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
    card: string;
    cardText: string;
    buttonText: string;
    buttonAccentText: string;
    critSuccessBg: string;
    critSuccessBorder: string;
    critSuccessText: string; // Ajouté
    critFailureBg: string;
    critFailureBorder: string;
    critFailureText: string; // Ajouté

    // NOUVELLES clés pour les fonds des dés sélectionnés
    d4bg: string;
    d6bg: string;
    d8bg: string;
    d10bg: string;
    d12bg: string;
    d20bg: string;
    d100bg: string;
    // Optionnel: ajoute d4text, d6text... si la couleur du texte doit aussi changer
}

// --- Définition des Thèmes ---

// Thème 1: Taverne Médiévale Sombre
const tavernTheme: AppTheme = {
    name: 'tavern',
    colors: {
    background: '#3B2F2F',        // Brun bois très sombre
    text: '#F5F5DC',              // Beige clair (parchemin)
    primary: '#DAA520',           // Goldenrod (accent principal)
    secondary: '#B8860B',         // DarkGoldenrod (alternative)
    border: '#5C4033',            // Identique au fond
    card: '#5C4033',              // Brun "SaddleBrown" pour fonds de section/cartes
    cardText: '#F5F5DC',          // Texte clair sur les cartes
    buttonText: '#F5F5DC',        // Texte clair sur boutons sombres
    buttonAccentText: '#3B2F2F',  // Texte très sombre sur accent doré
    critSuccessBg: '#FFF9C4',
    critSuccessBorder: '#FFD700',
    critSuccessText: '#3E2723', // Brun très foncé pour texte sur fond clair doré
    critFailureBg: '#8B0000',
    critFailureBorder: '#E57373',
    critFailureText: '#FFFFFF', // Texte blanc sur fond rouge sombre
    
    // Couleurs spécifiques aux dés pour le thème Taverne (EXEMPLES, à ajuster !)
    d4bg: '#8B4513',  // Brun-rouge (SaddleBrown)
    d6bg: '#556B2F',  // Vert Olive Foncé
    d8bg: '#4682B4',  // Bleu Acier
    d10bg: '#B8860B', // Or Sombre
    d12bg: '#8A2BE2', // Violet Foncé (BlueViolet) - peut-être trop vif? -> #483D8B DarkSlateBlue?
    d20bg: '#008080', // Teal / Turquoise Foncé
    d100bg: '#708090', // Gris Ardoise (SlateGray)
    },

    fonts: {
        title: 'MedievalSharp',       // Police personnalisée pour les titres
        body: 'Lora',              // Police système pour le corps
    },
};

// Thème 2: Moderne Clair
const lightModernTheme: AppTheme = {
    name: 'lightModern',
    colors: {
    background: '#FFFFFF',        // Blanc
    text: '#121212',              // Noir/Gris très foncé
    primary: '#007AFF',           // Bleu iOS standard
    secondary: '#5AC8FA',         // Bleu clair iOS
    border: '#D1D1D6',            // Gris clair pour bordures
    card: '#F2F2F7',              // Gris très clair pour cartes/sections
    cardText: '#121212',          // Texte foncé sur cartes claires
    buttonText: '#121212',        // Texte foncé sur boutons clairs
    buttonAccentText: '#FFFFFF',  // Texte blanc sur accent bleu
    critSuccessBg: '#E8F5E9',     // Fond vert très pâle
    critSuccessBorder: '#4CAF50', // Bordure verte standard
    critSuccessText: '#1B5E20',   // Texte vert foncé pour contraster
    critFailureBg: '#FFEBEE',     // Fond rouge très pâle
    critFailureBorder: '#F44336', // Bordure rouge vif standard
    critFailureText: '#B71C1C',   // Texte rouge foncé pour contraster
    
    // Couleurs spécifiques aux dés
    d4bg: '#ffdddd',
    d6bg: '#ddffdd',
    d8bg: '#ddddff',
    d10bg: '#ffffdd',
    d12bg: '#ffddff',
    d20bg: '#ddffff',
    d100bg: '#eeeeee',
    },

    fonts: {
        title: undefined,             // Police système
        body: undefined,              // Police système
    },
};

// Thème 3: Moderne Sombre
const darkModernTheme: AppTheme = {
    name: 'darkModern',
    colors: {
    background: '#121212',        // Presque noir
    text: '#E1E1E1',              // Gris très clair
    primary: '#0A84FF',           // Bleu iOS mode sombre
    secondary: '#64D2FF',         // Bleu clair iOS mode sombre
    border: '#38383A',            // Gris foncé pour bordures
    card: '#1C1C1E',              // Gris très foncé pour cartes/sections
    cardText: '#E1E1E1',          // Texte clair sur cartes sombres
    buttonText: '#E1E1E1',        // Texte clair sur boutons sombres
    buttonAccentText: '#FFFFFF',  // Texte blanc sur accent bleu
    critSuccessBg: '#1B5E20',     // Fond vert foncé mais distinct du fond noir
    critSuccessBorder: '#66BB6A', // Bordure verte plus claire pour contraster
    critSuccessText: '#FFFFFF',   // Texte blanc pour haute lisibilité
    critFailureBg: '#B71C1C',     // Fond rouge sombre mais distinct du fond noir
    critFailureBorder: '#EF9A9A', // Bordure rouge pâle pour contraster
    critFailureText: '#FFFFFF',   // Texte blanc pour haute lisibilité
    
    // Couleurs spécifiques aux dés
    d4bg: '#B71C1C',  // Rouge sombre
    d6bg: '#1B5E20',  // Vert foncé
    d8bg: '#0D47A1',  // Bleu foncé
    d10bg: '#F57F17', // Orange foncé
    d12bg: '#4A148C', // Violet foncé
    d20bg: '#004D40', // Teal très foncé
    d100bg: '#37474F', // Bleu gris foncé
    },

    fonts: {
        title: undefined,             // Police système
        body: undefined,              // Police système
    },
};

// Objet exportant tous les thèmes par leur nom
export const AppThemes = {
    tavern: tavernTheme,
    lightModern: lightModernTheme,
    darkModern: darkModernTheme,
};

// Type pour les noms de thèmes valides
export type ThemeName = keyof typeof AppThemes;

// Thème par défaut
export const defaultThemeName: ThemeName = 'tavern'; // Ou 'lightModern' si tu préfères