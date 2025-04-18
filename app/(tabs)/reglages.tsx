// Fichier: app/reglages.tsx

import React, { useMemo } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Switch,
    StyleSheet,
    ScrollView,
    Platform,
    StyleProp, // Assure-toi que ceux-ci sont importés si tu utilises le filtre
    ViewStyle,
    TextStyle
} from 'react-native';
import { useSettings } from '../../context/SettingsContext'; // Ajuste chemin
import { ThemeName, AppThemes, AppTheme } from '../../constants/Themes'; // Ajuste chemin

export default function ReglagesScreen() {
  // Récupère les valeurs et fonctions du contexte
    const { themeName, setThemeName, isSoundEnabled, setIsSoundEnabled, theme } = useSettings();

    // Liste des thèmes disponibles
    const availableThemes: ThemeName[] = ['tavern', 'lightModern', 'darkModern'];

    // Fonction pour obtenir un nom lisible
    const getThemeDisplayName = (name: ThemeName): string => {
        switch (name) {
            case 'tavern': return 'Taverne Médiévale';
            case 'lightModern': return 'Moderne Clair';
            case 'darkModern': return 'Moderne Sombre';
        }
    };

    // --- Styles Dynamiques (pour cette page) ---
    // Utilise useMemo pour recalculer seulement si le thème change
    const dynamicStyles = useMemo(() => {
        return StyleSheet.create({
            safeArea: { backgroundColor: theme.colors.background },
            pageTitle: { color: theme.colors.text, fontFamily: theme.fonts.title || undefined },
            section: {
                backgroundColor: theme.colors.card, // Fond de carte pour la section
                borderColor: theme.colors.border, // Bordure themée
            },
            sectionTitle: {
                color: theme.colors.text,
                fontFamily: theme.fonts.title || undefined,
                borderBottomColor: theme.colors.border, // Bordure sous-titre themée
            },
            optionLabel: {
                color: theme.colors.text,
                fontFamily: theme.fonts.body || undefined,
            },
        });
    }, [theme, isSoundEnabled]); // Dépend aussi de isSoundEnabled pour le thumbColor

    return (
        <SafeAreaView style={[styles.safeAreaBase, dynamicStyles.safeArea]}>
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={[styles.pageTitle, dynamicStyles.pageTitle]}>
            Réglages
            </Text>

            {/* Section Thème */}
            <View style={[styles.sectionBase, dynamicStyles.section]}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Thème Visuel
            </Text>
                {availableThemes.map((name) => {
                    const isActive = themeName === name;
                    const buttonTheme = AppThemes[name];

                    const rawButtonStyle = [
                    styles.themeButton,
                    { backgroundColor: buttonTheme.colors.card, borderColor: buttonTheme.colors.border },
                    isActive && { borderColor: theme.colors.primary, borderWidth: 2 }
                    ];
                    // Filtrage appliqué au style du bouton
                    const buttonStyle = rawButtonStyle.filter(Boolean) as StyleProp<ViewStyle>;

                    const rawTextStyle = [
                    styles.themeButtonText,
                    { color: buttonTheme.colors.cardText },
                    isActive && { fontWeight: 'bold', color: theme.colors.primary }
                    ];
                    // Filtrage appliqué au style du texte
                    const textStyle = rawTextStyle.filter(Boolean) as StyleProp<TextStyle>;

                    return (
                    <TouchableOpacity
                        key={name}
                        style={buttonStyle} // Utilise le style filtré
                        onPress={() => setThemeName(name)}
                        disabled={isActive}
                    >
                        <Text style={textStyle}>{getThemeDisplayName(name)}</Text> {/* Utilise le style filtré */}
                    </TouchableOpacity>
                    );
                })}
            </View>

            {/* Section Son */}
            <View style={[styles.sectionBase, dynamicStyles.section]}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Son
            </Text>
            <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, dynamicStyles.optionLabel]}>
                Son des dés activé
                </Text>
                <Switch
                // Applique les couleurs directement ici
                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                    thumbColor={Platform.OS === 'android' ? (isSoundEnabled ? theme.colors.primary : theme.colors.card) : undefined} // Thumb color spécifique Android si besoin
                    ios_backgroundColor={theme.colors.border}
                    onValueChange={setIsSoundEnabled}
                    value={isSoundEnabled}
                />
            </View>
            </View>

        </ScrollView>
        </SafeAreaView>
    );
}

// --- Styles Statiques (Mise en page principalement) ---
const styles = StyleSheet.create({
    safeAreaBase: { flex: 1 },
    scrollContainer: { padding: 20, paddingBottom: 40 }, // Ajout padding bas
    pageTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    sectionBase: { marginBottom: 20, borderRadius: 8, borderWidth: 1, padding: 15 }, // Style de base pour les sections
    sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15, borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 10 },
    themeButton: { paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, marginBottom: 10, alignItems: 'center' },
    themeButtonText: { fontSize: 16 },
    optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    optionLabel: { fontSize: 16, flexShrink: 1, marginRight: 10 },
});