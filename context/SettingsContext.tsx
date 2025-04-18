// Fichier: context/SettingsContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppTheme, AppThemes, defaultThemeName, ThemeName } from '../constants/Themes';

// --- Constantes pour le stockage ---
const THEME_STORAGE_KEY = '@MyApp:themeName';
const SOUND_STORAGE_KEY = '@MyApp:soundEnabled';

// --- Interface pour la valeur du contexte ---
interface SettingsContextProps {
    themeName: ThemeName;
    setThemeName: (name: ThemeName) => void;
    theme: AppTheme;
    isSoundEnabled: boolean;
    setIsSoundEnabled: (enabled: boolean) => void;
}

// --- Création du Contexte ---
// Utilise le defaultThemeName ('tavern') importé
const defaultContextValue: SettingsContextProps = {
    themeName: defaultThemeName,
    setThemeName: () => console.warn('setThemeName called outside of SettingsProvider'),
    theme: AppThemes[defaultThemeName],
    isSoundEnabled: true,
    setIsSoundEnabled: () => console.warn('setIsSoundEnabled called outside of SettingsProvider'),
};
const SettingsContext = createContext<SettingsContextProps>(defaultContextValue);

// --- Provider Component ---
interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    // Initialise avec le defaultThemeName importé ('tavern')
    const [themeName, setThemeState] = useState<ThemeName>(defaultThemeName);
    const [isSoundEnabled, setSoundEnabledState] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedThemeName = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
                const storedSoundEnabled = await AsyncStorage.getItem(SOUND_STORAGE_KEY);

                if (storedThemeName && AppThemes[storedThemeName]) {
                    setThemeState(storedThemeName);
                } else {
                    setThemeState(defaultThemeName); // Fallback au défaut importé
                }

                if (storedSoundEnabled !== null) {
                    setSoundEnabledState(storedSoundEnabled === 'true');
                } else {
                    setSoundEnabledState(true); // Son activé par défaut
                }
            } catch (e) {
                console.error("Failed to load settings from storage", e);
                setThemeState(defaultThemeName);
                setSoundEnabledState(true);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    // Sauvegarde du thème
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(THEME_STORAGE_KEY, themeName)
                .catch(e => console.error("Failed to save theme setting", e));
        }
    }, [themeName, isLoading]);

    // Sauvegarde du son
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(SOUND_STORAGE_KEY, String(isSoundEnabled))
            .catch(e => console.error("Failed to save sound setting", e));
    }
    }, [isSoundEnabled, isLoading]);


    const handleSetThemeName = (name: ThemeName) => {
        if (AppThemes[name]) {
            setThemeState(name);
        } else {
            console.warn(`Attempted to set invalid theme name: ${name}`);
        }
    };

    const handleSetIsSoundEnabled = (enabled: boolean) => {
        setSoundEnabledState(enabled);
    };

    // Récupère l'objet thème complet basé sur le nom actuel
    const theme = AppThemes[themeName] || AppThemes[defaultThemeName];

    const contextValue: SettingsContextProps = {
        themeName,
        setThemeName: handleSetThemeName,
        theme,
        isSoundEnabled,
        setIsSoundEnabled: handleSetIsSoundEnabled,
    };

    if (isLoading) {
        return null;
    }

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
};

// --- Hook Personnalisé ---
export const useSettings = (): SettingsContextProps => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};