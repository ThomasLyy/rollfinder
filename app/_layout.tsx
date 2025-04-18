import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SettingsProvider, useSettings } from '@/context/SettingsContext'; // Vérifie le chemin

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'MedievalSharp': require('@/assets/fonts/MedievalSharp-Regular.ttf'),
    'Lora': require('@/assets/fonts/Lora-Regular.ttf'),
    'Lora-Bold': require('@/assets/fonts/Lora-Bold.ttf'),
    'Lora-Italic': require('@/assets/fonts/Lora-Italic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SettingsProvider>
      <ThemedApp />
    </SettingsProvider>
  );
}

function ThemedApp() {
  const { themeName, theme } = useSettings();
  const colorScheme = themeName.includes('dark') ? 'dark' : 'light'; // Ou theme.name.includes('dark')
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  const mergedNavigationTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,

    },
  };

  return (
    <ThemeProvider value={mergedNavigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}