// Fichier: app/index.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button, // Remplacé par AnimatedButtonFeedback dans le JSX
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  ViewStyle,
  StyleProp,
  TextStyle
} from 'react-native';
import { Audio } from 'expo-av';
import { AppTheme, ThemeColors } from '../../constants/Themes'; // Chemin ajusté par l'utilisateur
import { useSettings } from '../../context/SettingsContext'; // Chemin ajusté par l'utilisateur

// --- Interfaces de Données ---
interface DetailedRoll { value: number; sides: number; }
interface RollResult { total: number; rolls: DetailedRoll[]; }
interface HistoryEntry { id: string; formula: string; total: number; rolls: DetailedRoll[]; timestamp: number; isNew?: boolean; }

// --- Composant Réutilisable : Bouton avec Feedback Animé ---
// Applique un effet d'échelle sur appui.
interface AnimatedButtonFeedbackProps { onPress?: () => void; style?: object | object[]; disabled?: boolean; children: React.ReactNode; }
const AnimatedButtonFeedback: React.FC<AnimatedButtonFeedbackProps> = ({ onPress, style, disabled, children }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const onPressIn = () => { Animated.spring(scaleValue, { toValue: 0.85, useNativeDriver: true, friction: 7 }).start(); };
  const onPressOut = () => { Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 7 }).start(); };
  return (
    <TouchableOpacity onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1} disabled={disabled} >
      <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

// --- Composant Principal de l'Écran ---
export default function HomeScreen() {
  // --- États ---
  const [modifier, setModifier] = useState<number>(0);
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [diceQuantities, setDiceQuantities] = useState<{ [sides: number]: number }>({});

  // --- Contexte et Thème ---
  const { theme, isSoundEnabled } = useSettings();

  // --- Références pour Animations ---
  const resultFadeAnim = useRef(new Animated.Value(0)).current;
  const resultScaleAnim = useRef(new Animated.Value(0.95)).current;

  // --- Constantes ---
  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  // --- Styles Dynamiques (dépendants du thème) ---
  // Calculés une seule fois si le thème ne change pas grâce à useMemo
  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      // --- Styles généraux ---
      container: {
        backgroundColor: theme.colors.background,
      },
      text: { // Style de texte par défaut (peut être appliqué largement)
        color: theme.colors.text,
        fontFamily: theme.fonts.body || undefined,
      },
      title: { // Style spécifique titre principal
        color: theme.colors.text,
        fontFamily: theme.fonts.title || undefined,
      },
      sectionTitle: { // Style titres de section
        color: theme.colors.text,
        fontFamily: theme.fonts.title || undefined,
      },
      historyTitle: { // Style titre historique
        color: theme.colors.text,
        fontFamily: theme.fonts.title || undefined,
      },
      label: { // Style labels simples
        color: theme.colors.text,
        fontFamily: theme.fonts.body || undefined,
      },
      stepperValue: { // Style valeur modificateur
        color: theme.colors.text,
      },

      // --- Styles boutons +/- Stepper ---
      stepperButton: {
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
      },
      stepperButtonText: {
        color: theme.colors.cardText,
        fontFamily: theme.fonts.body || undefined, // Police corps appliquée
      },

      // --- Styles boutons d'action principaux ---
      buttonPrimary: { // Bouton "Lancer !"
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary, // Assure une bordure de même couleur
      },
      buttonPrimaryText: { // Texte du bouton "Lancer !"
        color: theme.colors.buttonAccentText,
        fontFamily: theme.fonts.body || undefined, // Police corps appliquée
      },
      buttonSecondary: { // Bouton "Réinitialiser"
        backgroundColor: 'transparent',
        borderColor: theme.colors.border,
        borderWidth: 1,
      },
      buttonSecondaryText: { // Texte du bouton "Réinitialiser"
        color: theme.colors.text,
        fontFamily: theme.fonts.body || undefined, // Police corps appliquée
      },

      // --- Styles pour les sections "carte" ---
      cardBackground: { // Fond et bordure génériques pour les cartes
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
      },
      cardText: { // Texte générique sur fond carte
        color: theme.colors.cardText
      },
      summaryText: { // Texte spécifique récapitulatif
        color: theme.colors.cardText,
        fontFamily: theme.fonts.body || undefined,
      },
      resultTotalLabel: { // Texte spécifique label "Total :"
        color: theme.colors.cardText,
        opacity: 0.9
      },
      resultTotalText: { // Texte spécifique valeur totale résultat
        color: theme.colors.primary // Couleur accent
      },
      resultModifierText: { // Texte spécifique modificateur résultat
        color: theme.colors.cardText,
        opacity: 0.8
      },
      historyFormula: { // Texte spécifique formule historique
        color: theme.colors.cardText
      },
      historyTotal: { // Texte spécifique total historique
        color: theme.colors.cardText
      },
      historyRollDetail: { // Texte spécifique détails dés historique
        color: theme.colors.cardText,
        opacity: 0.7
      },

      // --- Styles liés à la sélection/état ---
      diceItemSelectedBorder: { // Bordure pour dés sélectionnés
        borderColor: theme.colors.border
      },
      historyEntryNewBackground: { // Fond surbrillance historique
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.primary,
        opacity: 0.8
      },
      historySectionBorder: { // Bordure supérieure section historique
        borderColor: theme.colors.border
      },
    });
  }, [theme]); // Dépendance au thème

  // --- Effets ---
  // Chargement/déchargement du son
  useEffect(() => {
    let soundObject: Audio.Sound | null = null;
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/dice-roll.mp3'));
        soundObject = sound;
        setSound(soundObject);
      } catch (error) {
        console.error('Failed to load sound', error);
      }
    }
    loadSound();
    return () => {
      soundObject?.unloadAsync();
    };
  }, []);

  // Animation des résultats (fondu+échelle)
  useEffect(() => {
    if (rollResult) {
      Animated.parallel([
        Animated.timing(resultFadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(resultScaleAnim, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true })
      ]).start();
    } else {
      resultFadeAnim.setValue(0);
      resultScaleAnim.setValue(0.95);
    }
  }, [rollResult, resultFadeAnim, resultScaleAnim]);

  // Timeout pour surbrillance de l'historique
  useEffect(() => {
    if (history.length > 0 && history[0].isNew) {
      const entryIdToClear = history[0].id;
      const timer = setTimeout(() => {
        setHistory(prevHistory => prevHistory.map(entry => entry.id === entryIdToClear ? { ...entry, isNew: false } : entry));
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [history]);

  // --- Handlers ---
  const handleIncrementQuantity = (sides: number) => { setDiceQuantities(prev => ({ ...prev, [sides]: (prev[sides] || 0) + 1 })); };
  const handleDecrementQuantity = (sides: number) => { setDiceQuantities(prev => { const current = prev[sides] || 0; return current <= 0 ? prev : { ...prev, [sides]: current - 1 }; }); };
  const handleIncrementModifier = () => { setModifier(prev => prev + 1); };
  const handleDecrementModifier = () => { setModifier(prev => prev - 1); };

  // Réinitialise les sélections
  const handleClear = () => {
    setDiceQuantities({});
    setModifier(0);
    setRollResult(null);
  };

  // Gère le lancer de dés et la mise à jour de l'historique
  const handleRoll = async () => {
    const allDetailedRolls: DetailedRoll[] = [];
    const formulaParts: string[] = [];
    Object.keys(diceQuantities).map(Number).sort((a, b) => a - b).forEach(sides => {
      const quantity = diceQuantities[sides];
      if (quantity > 0) {
        formulaParts.push(`${quantity}d${sides}`);
        for (let i = 0; i < quantity; i++) {
          allDetailedRolls.push({ value: Math.floor(Math.random() * sides) + 1, sides: sides });
        }
      }
    });

    if (formulaParts.length === 0 && modifier === 0) {
      Alert.alert("Action impossible", "Veuillez sélectionner des dés ou définir un modificateur.");
      return;
    }

    const sumOfRolls = allDetailedRolls.reduce((sum, roll) => sum + roll.value, 0);
    const total = sumOfRolls + modifier;
    const result: RollResult = { total, rolls: allDetailedRolls };

    setRollResult(result); // Déclenche l'animation

    // Joue le son si activé dans le contexte et si le son est chargé
    if (isSoundEnabled && sound) {
      try { await sound.replayAsync(); } catch (error) { console.error('Failed to play sound', error); }
    }

    // Construit la formule pour l'historique
    let formulaString = formulaParts.join(' + ');
    if (modifier > 0) formulaString = formulaParts.length > 0 ? `${formulaString} + ${modifier}` : `+${modifier}`;
    else if (modifier < 0) formulaString = formulaParts.length > 0 ? `${formulaString} - ${Math.abs(modifier)}` : `${modifier}`;
    if (!formulaString && modifier === 0) formulaString = "N/A";

    // Crée l'entrée d'historique
    const newEntry: HistoryEntry = {
      id: Date.now().toString() + Math.random().toString(),
      formula: formulaString,
      total: result.total,
      rolls: result.rolls,
      timestamp: Date.now(),
      isNew: true
    };

    // Met à jour l'historique
    setHistory(prev => [newEntry, ...prev.map(e => e.isNew ? { ...e, isNew: false } : e)].slice(0, 5));
  };

  // --- Rendu JSX ---
  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer} keyboardShouldPersistTaps="handled">

        <Text style={[styles.title, dynamicStyles.title]}>Rollfinder</Text>

        {/* Section: Sélection Dés (avec surbrillance themée par dé) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Sélection des Dés :</Text>
          <View style={styles.fixedSteppersContainer}>
            {diceTypes.map((sides) => {
              const currentQuantity = diceQuantities[sides] || 0;
              const isSelected = currentQuantity > 0;

              // Construit la clé pour la couleur de fond du thème (ex: 'd6bg')
              const bgThemeKey = `d${sides}bg` as keyof ThemeColors;
              // Optionnel: clé pour la couleur du texte si définie dans le thème
              // const textThemeKey = `d${sides}text` as keyof ThemeColors;

              // Style de base pour l'item
              const itemStyle: StyleProp<ViewStyle> = [styles.diceStepperItem];
              // Style de base pour le label
              const labelStyle: StyleProp<TextStyle> = [styles.diceStepperLabel, dynamicStyles.text];

              // Si le dé est sélectionné...
              if (isSelected) {
                // Ajoute le fond spécifique du thème et une bordure
                itemStyle.push({
                  backgroundColor: theme.colors[bgThemeKey] || theme.colors.card, // Utilise la couleur du dé ou 'card' par défaut
                  borderColor: theme.colors.border, // Bordure standard du thème
                  borderWidth: 1,
                });
                // Optionnel: ajuste la couleur du texte pour le contraste si défini dans le thème
                // if (theme.colors[textThemeKey]) {
                //   labelStyle.push({ color: theme.colors[textThemeKey] });
                // } else {
                     // Si pas de couleur texte spécifique, s'assurer du contraste (ex: texte clair sur fond sombre)
                     // Peut-être utiliser theme.colors.cardText par défaut pour les items sélectionnés?
                     labelStyle.push({ color: theme.colors.cardText }); // Exemple
                // }
              }

              return (
                <View key={sides} style={itemStyle.filter(Boolean)}>
                  {/* Applique le style de label potentiellement modifié */}
                  <Text style={labelStyle.filter(Boolean)}>{currentQuantity} x d{sides}</Text>
                  <View style={styles.diceStepperButtonRow}>
                    <AnimatedButtonFeedback style={[styles.stepperButton, dynamicStyles.stepperButton]} onPress={() => handleDecrementQuantity(sides)} disabled={currentQuantity <= 0}>
                      <Text style={[styles.stepperButtonText, dynamicStyles.stepperButtonText]}>-</Text>
                    </AnimatedButtonFeedback>
                    <AnimatedButtonFeedback style={[styles.stepperButton, dynamicStyles.stepperButton]} onPress={() => handleIncrementQuantity(sides)}>
                      <Text style={[styles.stepperButtonText, dynamicStyles.stepperButtonText]}>+</Text>
                    </AnimatedButtonFeedback>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Section: Récapitulatif */}
        {(Object.values(diceQuantities).some(qty => qty > 0) || modifier !== 0) && (
          // Applique le fond "carte" dynamique
          <View style={[styles.summaryContainer, dynamicStyles.cardBackground]}>
            <Text style={[styles.summaryText, dynamicStyles.summaryText]}>
              À lancer : {Object.keys(diceQuantities).map(Number).sort((a, b) => a - b).filter(s => diceQuantities[s] > 0).map(s => `${diceQuantities[s]}d${s}`).join(' + ') + (modifier !== 0 ? (modifier > 0 ? (Object.values(diceQuantities).some(q => q > 0) ? ` + ${modifier}` : `+${modifier}`) : ` - ${Math.abs(modifier)}`) : '')}
            </Text>
          </View>
        )}

        {/* Section: Modificateur */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Modificateur :</Text>
          <View style={styles.stepperContainer}>
            <AnimatedButtonFeedback style={[styles.stepperButton, dynamicStyles.stepperButton]} onPress={handleDecrementModifier}>
              <Text style={[styles.stepperButtonText, dynamicStyles.stepperButtonText]}>-</Text>
            </AnimatedButtonFeedback>
            <Text style={[styles.stepperValue, dynamicStyles.stepperValue]}>{modifier >= 0 ? `+${modifier}` : modifier}</Text>
            <AnimatedButtonFeedback style={[styles.stepperButton, dynamicStyles.stepperButton]} onPress={handleIncrementModifier}>
              <Text style={[styles.stepperButtonText, dynamicStyles.stepperButtonText]}>+</Text>
            </AnimatedButtonFeedback>
          </View>
        </View>

        {/* Section: Boutons d'Action */}
        <View style={styles.actionButtonsContainer}>
          <View style={{ marginBottom: 10 }}>
            <AnimatedButtonFeedback style={[styles.actionButtonBase, dynamicStyles.buttonPrimary]} onPress={handleRoll}>
              <Text style={[styles.actionButtonTextBase, dynamicStyles.buttonPrimaryText]}>Lancer !</Text>
            </AnimatedButtonFeedback>
          </View>
          <AnimatedButtonFeedback style={[styles.actionButtonBase, dynamicStyles.buttonSecondary]} onPress={handleClear}>
            <Text style={[styles.actionButtonTextBase, dynamicStyles.buttonSecondaryText]}>Réinitialiser</Text>
          </AnimatedButtonFeedback>
        </View>

        {/* Section: Affichage des Résultats */}
        {rollResult && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Résultat du Lancer :</Text>
            {/* Applique le fond "carte" et l'animation */}
            <Animated.View style={[styles.resultsSection, dynamicStyles.cardBackground, { opacity: resultFadeAnim, transform: [{ scale: resultScaleAnim }] }]}>
              <Text style={[styles.resultTotalLabel, dynamicStyles.resultTotalLabel]}>Total :</Text>
              <Text style={[styles.resultTotalText, dynamicStyles.resultTotalText]}>{rollResult.total}</Text>
              <View style={styles.detailedRollsContainer}>
                {/* Mapping des dés individuels avec gestion des crits */}
                {rollResult.rolls.map((roll, index) => {
                  const isD20 = roll.sides === 20;
                  const isCritSuccess = isD20 && roll.value === 20;
                  const isCritFailure = isD20 && roll.value === 1;

                  const bgThemeKey = `d${roll.sides}bg` as keyof ThemeColors;

                  // Style de base pour l'item et le texte
                  const baseItemStyle = styles.detailedRollItem;
                  const baseTextStyle = styles.detailedRollText;

                  // Styles spécifiques au thème/critique
                  let specificViewStyle: ViewStyle = {};
                  let specificTextStyle: TextStyle = { color: theme.colors.cardText }; // Texte par défaut sur fond coloré

                  if (isCritSuccess) {
                    specificViewStyle = {
                      backgroundColor: theme.colors.critSuccessBg,
                      borderColor: theme.colors.critSuccessBorder,
                      borderWidth: 2, // Bordure plus épaisse
                      // Effet Glow (iOS)
                      shadowColor: theme.colors.primary, // Ombre couleur accent
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 6,
                      shadowOpacity: 0.8,
                      // Effet Glow (Android)
                      elevation: 8, // Augmente l'élévation
                    };
                    specificTextStyle = {
                      color: theme.colors.critSuccessText, // Couleur texte du thème
                      fontWeight: 'bold', // Garde ou augmente ('900')
                    };
                  } else if (isCritFailure) {
                    specificViewStyle = {
                      backgroundColor: theme.colors.critFailureBg,
                      borderColor: theme.colors.critFailureBorder,
                      borderWidth: 2, // Bordure plus épaisse
                      // Effet Glow (iOS) - Rouge (utiliser une couleur rouge du thème?)
                      shadowColor: '#ff0000', // Ou theme.colors.error ?
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 5,
                      shadowOpacity: 0.7,
                       // Effet Glow (Android)
                      elevation: 6,
                    };
                    specificTextStyle = {
                      color: theme.colors.critFailureText, // Couleur texte du thème
                      fontWeight: 'bold',
                    };
                  } else {
                    // Dé non-critique: utilise la couleur du thème pour ce type de dé
                    specificViewStyle = {
                      backgroundColor: theme.colors[bgThemeKey] || theme.colors.card,
                      borderColor: theme.colors.border, // Bordure standard quand sélectionné dans les résultats ? Ou pas de bordure?
                      // borderWidth: 1, // Optionnel: ajouter une bordure standard ici aussi?
                    };
                    // Le texte utilise la couleur cardText par défaut définie ci-dessus
                  }

                  // Combine les styles
                  const viewStyle = [baseItemStyle, specificViewStyle];
                  const textStyle = [baseTextStyle, specificTextStyle];

                  return (
                    <View key={index} style={viewStyle.filter(Boolean) as StyleProp<ViewStyle>}>
                      <Text style={textStyle.filter(Boolean) as StyleProp<TextStyle>}>{`d${roll.sides}: ${roll.value}`}</Text>
                    </View>
                  );
                })}
              </View>
              {modifier !== 0 && ( <Text style={[styles.resultModifierText, dynamicStyles.resultModifierText]}>Modificateur appliqué : {modifier > 0 ? '+' : ''}{modifier}</Text> )}
            </Animated.View>
          </View>
        )}

        {/* Section: Historique */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={[styles.historyTitle, dynamicStyles.historyTitle]}>Historique récent :</Text>
            {history.map((entry) => (
               // Applique le fond "carte" et la surbrillance themée si nouvelle
              <View key={entry.id} style={[styles.historyEntry, dynamicStyles.cardBackground, entry.isNew && dynamicStyles.historyEntryNewBackground]}>
                <Text style={[styles.historyFormula, dynamicStyles.historyFormula]}>{entry.formula} =</Text>
                <Text style={[styles.historyTotal, dynamicStyles.historyTotal]}>{entry.total}</Text>
                <View style={styles.historyRollsContainer}>
                  {entry.rolls.map((roll, index) => ( <Text key={index} style={[styles.historyRollDetail, dynamicStyles.historyRollDetail]}>d{roll.sides}:{roll.value}</Text> ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Fonction Utilitaire : Couleur de fond par type de dé ---
const getDieColorStyle = (sides: number): ViewStyle => {
  // Note: Cette fonction utilise toujours les couleurs pastel.
  // Pour un theming complet, il faudrait l'adapter ou utiliser une autre approche
  // (ex: bordure colorée sur fond themé, icônes, etc.)
  switch (sides) {
    case 4: return { backgroundColor: '#ffdddd' }; case 6: return { backgroundColor: '#ddffdd' }; case 8: return { backgroundColor: '#ddddff' }; case 10: return { backgroundColor: '#ffffdd' }; case 12: return { backgroundColor: '#ffddff' }; case 20: return { backgroundColor: '#ddffff' }; case 100: return { backgroundColor: '#eeeeee' }; default: return { backgroundColor: '#f5f5f5' };
  }
};

// --- Styles Statiques (Mise en page principalement) ---
const styles = StyleSheet.create({
  // Styles généraux
  container: { flex: 1 },
  scrollContentContainer: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 5 },

  // Styles Steppers
  fixedSteppersContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  diceStepperItem: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4, marginBottom: 15, width: '30%', borderRadius: 6, borderWidth: 1, borderColor: 'transparent' },
  diceItemSelectedBorder: { borderWidth: 1 /* borderColor géré par dynamicStyles */ },
  diceStepperLabel: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  diceStepperButtonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 4 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  stepperButton: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5, borderWidth: 1, marginHorizontal: 5 /* bg/border gérés par dynamicStyles */ },
  stepperButtonText: { fontSize: 18, fontWeight: 'bold', /* color géré par dynamicStyles */ },
  stepperValue: { fontSize: 20, fontWeight: 'bold', minWidth: 60, textAlign: 'center', marginHorizontal: 15, paddingVertical: 10 },

  // Style Récapitulatif
  summaryContainer: { marginTop: 5, marginBottom: 15, padding: 10, borderRadius: 5, borderWidth: 1 /* bg/border gérés par dynamicStyles */ },
  summaryText: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },

  // Styles Boutons d'Action (Base pour layout/texte)
  actionButtonsContainer: { marginTop: 20, marginBottom: 10 },
  actionButtonBase: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionButtonTextBase: { fontSize: 16, fontWeight: 'bold' },

  // Styles Section Résultats
  resultsSection: { padding: 15, borderRadius: 8, borderWidth: 1 /* bg/border gérés par dynamicStyles */ },
  resultTotalLabel: { fontSize: 16, textAlign: 'center', marginBottom: 5 },
  resultTotalText: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  detailedRollsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 },
  detailedRollItem: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, borderWidth: 1, margin: 3 /* bg/border gérés par getDieColorStyle ou crits */ },
  detailedRollText: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  resultModifierText: { fontSize: 14, textAlign: 'center', fontStyle: 'italic', marginTop: 5 },

  // Styles Critiques D20 (gardés statiques, vérifier contraste avec thèmes)
  critSuccessView: { backgroundColor: '#FFF9C4', borderColor: '#FFD700' },
  critSuccessText: { color: '#4E342E', fontWeight: 'bold' },
  critFailureView: { backgroundColor: '#B71C1C', borderColor: '#E57373' },
  critFailureText: { color: '#FFFFFF', fontWeight: 'bold' },

  // Styles Section Historique
  historySection: { marginTop: 25, paddingTop: 15, borderTopWidth: 1 /* borderColor géré par dynamicStyles.cardBackground ? ou theme.colors.border? */ },
  historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  historyEntry: { padding: 10, borderRadius: 5, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 /* bg/border gérés par dynamicStyles */ },
  historyEntryNew: { /* Style géré par dynamicStyles.historyEntryNewBackground */ },
  historyFormula: { fontSize: 14, fontWeight: 'bold', flex: 2 },
  historyTotal: { fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  historyRollsContainer: { flex: 3, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end' },
  historyRollDetail: { fontSize: 11, fontStyle: 'italic', marginLeft: 4 },
});