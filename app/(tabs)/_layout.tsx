import { Redirect, Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { t } from '@/src/i18n';
import { useProfileStore } from '@/src/stores/profile-store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const onboarded = useProfileStore((s) => s.onboarded);

  if (!hasHydrated) return null;
  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.tabLabel'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      {/* TODO(ticket-06+): add symptoms / emergency / transport / settings tabs */}
    </Tabs>
  );
}
