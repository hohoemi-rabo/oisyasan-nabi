import '../global.css';
import '@/src/i18n';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { OfflineBadge } from '@/src/components/common/offline-badge';
import { useProfileStore } from '@/src/stores/profile-store';

SplashScreen.preventAutoHideAsync().catch(() => {
  // already hidden
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hasHydrated = useProfileStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync().catch(() => {
        // already hidden
      });
    }
  }, [hasHydrated]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <OfflineBadge />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="symptoms" options={{ headerShown: false }} />
          <Stack.Screen name="emergency" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ headerShown: false }} />
          <Stack.Screen name="hospital" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
