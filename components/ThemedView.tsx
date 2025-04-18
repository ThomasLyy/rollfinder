import { View, type ViewProps, StyleSheet } from 'react-native';
import { useSettings } from '@/context/SettingsContext'; // <<< IMPORTER useSettings
import { AppTheme } from '@/constants/Themes'; // Importer AppTheme pour typer

export type ThemedViewProps = ViewProps & {
  // Plus besoin de light/darkColor props ici
  type?: 'default' | 'card' | 'primary' | 'secondary'; // Ajoute des types si nécessaire (par ex. pour un fond coloré)
};

export function ThemedView({ style, type = 'default', ...otherProps }: ThemedViewProps) {
  // Récupérer le thème COMPLET depuis le contexte
  const { theme }: { theme: AppTheme } = useSettings(); // <<< Utiliser useSettings

  // Déterminer la couleur de fond en fonction du type et du thème actif
  let backgroundColor: string;
  switch (type) {
    case 'card':
      backgroundColor = theme.colors.card; // Couleur de fond des cartes
      break;
    case 'primary':
      backgroundColor = theme.colors.primary; // Couleur de fond primaire
      break;
    case 'secondary':
      backgroundColor = theme.colors.secondary; // Couleur de fond secondaire
      break;
    case 'default':
    default:
      backgroundColor = theme.colors.background; // Couleur de fond par défaut
  }

  // Optionnel: Déterminer une couleur de bordure si nécessaire
  // let borderColor: string | undefined;
  // switch (type) {
  //   case 'card':
  //     borderColor = theme.colors.border; // Bordure pour les cartes?
  //     break;
  //   // ... autres cas
  // }

  return (
    <View
      style={[
        { backgroundColor },
        // borderColor ? { borderColor: borderColor, borderWidth: StyleSheet.hairlineWidth } : {}, // Appliquer la bordure si définie
        style, // Styles passés en props par-dessus
      ]}
      {...otherProps}
    />
  );
}