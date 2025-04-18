// Fichier: app/_layout.tsx

import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Importe tes composants UI et le contexte/thème
import { HapticTab } from '@/components/HapticTab';      // Adapte si chemin différent
import TabBarBackground from '@/components/ui/TabBarBackground'; // Adapte si chemin différent
import { SettingsProvider, useSettings } from '../../context/SettingsContext'; // Importe le Provider ET le Hook - Adapte le chemin

// Empêche le masquage auto du splash screen
SplashScreen.preventAutoHideAsync();

// Composant interne pour pouvoir utiliser le hook useSettings DANS le Provider
function InnerLayout() {
  // Récupère le thème depuis le contexte
  const { theme } = useSettings();

  // Chargement des polices (gardé ici)
  const [fontsLoaded, fontError] = useFonts({
    'MedievalSharp': require('../../assets/fonts/MedievalSharp-Regular.ttf'),
    'Lora': require('../../assets/fonts/Lora-Regular.ttf'),
    'Lora-Bold': require('../../assets/fonts/Lora-Bold.ttf'),
    'Lora-Italic': require('../../assets/fonts/Lora-Italic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Attend le chargement des polices
  }

  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: { position: 'absolute', backgroundColor: theme.colors.card, borderTopWidth: 0 }, // Ajout borderTopWidth: 0
            default: { backgroundColor: theme.colors.card, borderTopWidth: 0, elevation: 0 }, // Ajout borderTopWidth/elevation 0
          }),
          tabBarShowLabel: false,
          tabBarItemStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 5,
          },
        }}>

        {/* Onglet Accueil */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Roll',
            // Utilise l'icône personnalisée
              tabBarIcon: ({ color, focused }) => (
                <Image
                  source={require('../../assets/images/dice_d20_icon.png')}
                  style={[
                      styles.tabIcon, // Applique la taille de base (à définir dans StyleSheet)
                      { tintColor: color, opacity: focused ? 1 : 0.6 } // Applique la couleur active/inactive à l'image
                    ]}
                  resizeMode="contain" // Assure que l'image s'adapte sans distorsion
                />
              ),
          }}
        />

        {/* Onglet Tests */}
        <Tabs.Screen
          name="checks"
          options={{
            title: 'Test',
            // Utilise l'icône personnalisée
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require('../../assets/images/magnifying_glass_icon.png')}
                style={[
                  styles.tabIcon, // Applique la taille de base (à définir dans StyleSheet)
                  { tintColor: color, opacity: focused ? 1 : 0.6 } // Applique la couleur active/inactive à l'image
                ]}
                resizeMode="contain" // Assure que l'image s'adapte sans distorsion
              />
            ),
          }}
        />

        {/* Onglet Personnages */}
        <Tabs.Screen
          name="personnages"
          options={{
            title: 'Personnage',
            // Utilise l'icône personnalisée
              tabBarIcon: ({ color, focused }) => (
                <Image
                  source={require('../../assets/images/child_kid_icon.png')}
                  style={[
                      styles.tabIcon, // Applique la taille de base (à définir dans StyleSheet)
                      { tintColor: color, opacity: focused ? 1 : 0.6 } // Applique la couleur active/inactive à l'image
                    ]}
                  resizeMode="contain" // Assure que l'image s'adapte sans distorsion
                />
              ),
          }}
        />

        {/* Onglet Réglages */}
        <Tabs.Screen
          name="reglages"
          options={{
            title: 'Réglages',
            // Utilise l'icône personnalisée
              tabBarIcon: ({ color, focused }) => (
                <Image
                  source={require('../../assets/images/gears_settings_icon.png')}
                  style={[
                      styles.tabIcon, // Applique la taille de base (à définir dans StyleSheet)
                      { tintColor: color, opacity: focused ? 1 : 0.6 } // Applique la couleur active/inactive à l'image
                    ]}
                  resizeMode="contain" // Assure que l'image s'adapte sans distorsion
                />
              ),
          }}
        />

      </Tabs>
  );
}


// Layout Principal qui fournit le contexte
export default function TabLayout() {
  return (
    // Enveloppe l'InnerLayout avec le SettingsProvider
    <SettingsProvider>
      <InnerLayout />
    </SettingsProvider>
  );
}

// Style pour les icônes
const styles = StyleSheet.create({
  tabIcon: {
    width: 26,  // Taille typique pour une icône d'onglet
    height: 26, // Ajuste selon tes préférences et la taille de tes images
  }
});