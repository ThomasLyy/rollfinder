import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Animated } from 'react-native';
import { StatsSection } from '../../components/StatsSection';
import { SkillsSection } from '../../components/SkillsSection';
import { SavesSection } from '../../components/SavesSection';
import { PerceptionSection } from '../../components/PerceptionSection';
import CharacterRollHistorySection from '../../components/CharacterRollHistorySection';
import AttackSection from '../../components/AttackSection';
import { masteryBonus, MasteryRank, StatKey, Attack } from "../../types/character";
import { makeCharacterRollHistoryEntry } from "../../utils/rollLogger";
import AnimatedButtonFeedback from '../../components/ui/AnimatedButtonFeedback';

// TYPES
type Stats = Record<StatKey, number>;
type Perception = { mastery: MasteryRank; bonusEquip: number };
type AttackState = Record<string, Attack>;

const initialStats: Stats = { FOR: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0 };
const initialAttacks: AttackState = {
  first:   { stat: "FOR", mastery: "inexpérimenté", bonusEquip: 0 },
  second:  { stat: "FOR", mastery: "inexpérimenté", bonusEquip: 0 },
  third:   { stat: "FOR", mastery: "inexpérimenté", bonusEquip: 0 },
  fourth:  { stat: "FOR", mastery: "inexpérimenté", bonusEquip: 0 },
  fifth:   { stat: "FOR", mastery: "inexpérimenté", bonusEquip: 0 },
  sixth:   { stat: "FOR", mastery: "inexpérimenté", bonusEquip: 0 },
};

export default function CharacterPage() {
  const [niveau, setNiveau] = useState<number>(1);
  const [stats, setStats] = useState<Stats>({ ...initialStats });
  const [perception, setPerception] = useState<Perception>({ mastery: "inexpérimenté", bonusEquip: 0 });
  const [saves, setSaves] = useState<Record<string, any>>({});
  const [skills, setSkills] = useState<Record<string, any>>({});
  const [charHistory, setCharHistory] = useState<any[]>([]);
  const [attacks, setAttacks] = useState<AttackState>({ ...initialAttacks });

  // Toast
  const [toast, setToast] = useState<{ message: string, visible: boolean } | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Double confirmation reset
  const [resetConfirm, setResetConfirm] = useState(false);
  const resetTimeout = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 280, useNativeDriver: true })
    ]).start(() => setToast(null));
  };

  const handleCharacterRoll = (label: string, modif: number) => {
    const die = Math.floor(Math.random() * 20) + 1;
    const total = die + modif;
    showToast(`${label} : 🎲 d20 = ${die}  | Modif : ${modif >= 0 ? '+' : ''}${modif}  | Total : ${total}`);
    setCharHistory(h => [
      makeCharacterRollHistoryEntry(label, die, modif, total),
      ...h.slice(0, 9)
    ]);
  };

  const handleResetRequest = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      showToast("Appuie à nouveau pour confirmer la réinitialisation.");
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
      resetTimeout.current = setTimeout(() => setResetConfirm(false), 3000) as unknown as NodeJS.Timeout;
    } else {
      setResetConfirm(false);
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
      setNiveau(1);
      setStats({ ...initialStats });
      setPerception({ mastery: "inexpérimenté", bonusEquip: 0 });
      setSaves({});
      setSkills({});
      setCharHistory([]);
      setAttacks({ ...initialAttacks });
      showToast("Feuille de personnage réinitialisée !");
    }
  };

  // Helper pour StatsSection (évite le bug de signature)
  const handleStatChange = (key: StatKey, value: number) => {
    setStats(s => ({ ...s, [key]: value }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f9ff' }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Fiche de personnage</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Fiche personnage</Text>
          <StatsSection
            niveau={niveau}
            onNiveauChange={setNiveau}
            stats={stats}
            onStatChange={(k, v) => setStats(s => ({ ...s, [k]: v }))}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Perception</Text>
          <PerceptionSection
            niveau={niveau}
            statSAG={stats.SAG}
            perception={perception}
            onChange={val => setPerception(p => ({ ...p, ...val }))}
            onRoll={() => {
              const modif = (stats.SAG ?? 0) + masteryBonus[perception.mastery] + niveau + (perception.bonusEquip ?? 0);
              handleCharacterRoll("Perception", modif);
            }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Jets de sauvegarde</Text>
          <SavesSection
            niveau={niveau}
            stats={stats}
            saves={saves}
            onChange={(key, val) => setSaves(s => ({ ...s, [key]: { ...s[key], ...val } }))}
            onRoll={(label, modif) => handleCharacterRoll(label, modif)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Compétences</Text>
          <SkillsSection
            niveau={niveau}
            stats={stats}
            skills={skills}
            onChange={(key, val) => setSkills(s => ({ ...s, [key]: { ...s[key], ...val } }))}
            onRoll={(label, modif) => handleCharacterRoll(label, modif)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Attaque</Text>
          <AttackSection
            attacks={attacks}
            onChange={(key, val) => setAttacks(a => ({ ...a, [key]: { ...a[key], ...val } }))}
            onRoll={(label, modif) => handleCharacterRoll(label, modif)}
            niveau={niveau}
            stats={{ FOR: stats.FOR, DEX: stats.DEX, CON: stats.CON, INT: stats.INT, SAG: stats.SAG, CHA: stats.CHA }}
          />
        </View>

        <View style={styles.card}>
          <CharacterRollHistorySection
            history={charHistory}
            onClear={() => {
              setCharHistory([]);
              showToast("Historique vidé.");
            }}
          />
          <AnimatedButtonFeedback
            onPress={handleResetRequest}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Réinitialiser la feuille</Text>
          </AnimatedButtonFeedback>
        </View>
      </ScrollView>
      {/* Toast maison */}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              opacity: toastAnim,
              transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }]
            }
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const CARD_WIDTH = 420;
const CARD_PERCENT = "95%";

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#f0f9ff',
    minHeight: '100%',
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
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 18,
    width: CARD_PERCENT,
    maxWidth: CARD_WIDTH,
    alignSelf: 'center',
    shadowColor: "#334155",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'stretch',
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 10,
    color: '#2563eb',
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  resetButton: {
    backgroundColor: '#e11d48',
    borderRadius: 12,
    marginTop: 10,
    alignSelf: 'center',
    width: '90%',
    maxWidth: CARD_WIDTH - 32,
    paddingVertical: 14,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 150,
    zIndex: 99,
  },
  toastText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
});
