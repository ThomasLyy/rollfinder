// Fichier: components/ThemedText.tsx (Exemple Corrigé)

import { Text, type TextProps, StyleSheet } from 'react-native';
import { useSettings } from '@/context/SettingsContext'; // <<< IMPORTER useSettings
import { AppTheme } from '@/constants/Themes'; // Importer AppTheme pour typer

export type ThemedTextProps = TextProps & {
  // Plus besoin de light/darkColor props ici
  type?: 'default' | 'title' | 'link' | 'secondary' | 'card' | 'button' | 'buttonAccent' | 'critSuccess' | 'critFailure'; // Adapte/Ajoute des types si nécessaire
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // Récupérer le thème COMPLET depuis le contexte
  const { theme }: { theme: AppTheme } = useSettings(); // <<< Utiliser useSettings

  // Déterminer la couleur en fonction du type et du thème actif
  let color: string;
  switch (type) {
    case 'title':
      color = theme.colors.primary; // Ou une couleur spécifique pour les titres ?
      break;
    case 'link':
      color = theme.colors.primary;
      break;
    case 'secondary':
       // Tu peux choisir une couleur spécifique ou la couleur texte de base
       // color = theme.colors.secondary; // Exemple
       color = theme.colors.text; // Ou simplement la couleur texte normale
      break;
    case 'card':
      color = theme.colors.cardText;
      break;
    case 'button':
      color = theme.colors.buttonText;
      break;
    case 'buttonAccent':
      color = theme.colors.buttonAccentText;
      break;
    case 'critSuccess':
      color = theme.colors.critSuccessText;
      break;
    case 'critFailure':
      color = theme.colors.critFailureText;
      break;
    case 'default':
    default:
      color = theme.colors.text;
  }

  // Déterminer la police en fonction du type et du thème actif
  let fontFamily: string | undefined;
  switch (type) {
    case 'title':
      fontFamily = theme.fonts.title; // Utilise la police titre du thème
      break;
    default:
      fontFamily = theme.fonts.body; // Utilise la police corps du thème
  }

  return (
    <Text
      style={[
        { color },
        fontFamily ? { fontFamily } : {}, // Applique la police si définie
        // styles.defaultFont, // Si tu as des styles par défaut
        style
      ]}
      {...rest}
    />
  );
}

// const styles = StyleSheet.create({ ... }); // Styles si besoin