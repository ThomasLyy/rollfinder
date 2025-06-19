import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="HomePage" options={{ title: "Accueil" }} />
      <Tabs.Screen name="CharacterPage" options={{ title: "Personnage" }} />
    </Tabs>
  );
}
