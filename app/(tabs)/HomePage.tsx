import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDiceRoller } from '../../hooks/useDiceRoller';
import { DiceType } from '../../types/dice';
import { DiceSelector } from '../../components/DiceSelector';
import { ModifierStepper } from '../../components/ModifierStepper';
import { RollResultDisplay } from '../../components/RollResultDisplay';
import RollHistorySection from '../../components/RollHistorySection';
import AnimatedButtonFeedback from '../../components/ui/AnimatedButtonFeedback';

export default function HomeScreen() {
  const {
    diceQuantities,
    setDiceQuantity,
    modifier,
    setModifier,
    rollDice,
    rollResult,
    history,
    resetDice,
    clearHistory,
  } = useDiceRoller();

  // Lancer dés
  const handleRoll = () => {
    const hasDice = Object.values(diceQuantities).some(qty => qty > 0);
    if (!hasDice) return;
    rollDice(modifier);
  };

  const handleDiceQuantityChange = (sides: number, qty: number) => {
    if ([4, 6, 8, 10, 12, 20, 100].includes(sides)) {
      setDiceQuantity(sides as DiceType, qty);
    }
  };

  // Limiter l’historique à 10 entrées
  const historyToDisplay = history.slice(0, 10);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Lancer de dés</Text>

      {/* Carte centrale pour la sélection */}
      <View style={styles.card}>
        <DiceSelector
          quantities={diceQuantities}
          onChange={handleDiceQuantityChange}
          onReset={resetDice}
        />
        <ModifierStepper
          value={modifier}
          onChange={setModifier}
        />
      </View>

      <AnimatedButtonFeedback
        onPress={resetDice}
        style={styles.actionButton}
      >
        <Text style={styles.actionButtonText}>Réinitialiser la sélection</Text>
      </AnimatedButtonFeedback>

      <AnimatedButtonFeedback
        onPress={handleRoll}
        style={[styles.actionButton, styles.rollButton]}
      >
        <Text style={styles.rollButtonText}>Lancer les dés</Text>
      </AnimatedButtonFeedback>

      <View style={styles.card}>
        <RollResultDisplay result={rollResult} />
        <View style={styles.divider} />
        <RollHistorySection history={history.slice(0, 10)} onClear={clearHistory} />
      </View>
    </ScrollView>
  );
}

const CARD_WIDTH = 420; // élargi
const CARD_PERCENT = "95%";

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    minHeight: '100%',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 18,
    width: CARD_PERCENT,
    maxWidth: CARD_WIDTH,
    alignSelf: 'center',
    shadowColor: "#334155",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#e11d48',
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'center',
    width: CARD_PERCENT,
    maxWidth: CARD_WIDTH,
    paddingVertical: 14,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  rollButton: {
    backgroundColor: '#2563eb',
    marginBottom: 20,
  },
  rollButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    width: '110%',
    marginVertical: 18,
    alignSelf: 'center',
    borderRadius: 2,
  },
});
