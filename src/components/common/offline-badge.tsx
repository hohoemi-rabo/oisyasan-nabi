import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { t } from '@/src/i18n';

// オフライン中のみヘッダー位置にバッジを表示。レイアウトを押し下げないよう絶対配置。
export function OfflineBadge() {
  const net = useNetInfo();
  const insets = useSafeAreaInsets();

  if (net.isConnected !== false) return null;

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top, zIndex: 50 }}
      className="items-center">
      <View className="flex-row items-center bg-ink-900 px-3 py-1 rounded-b-lg">
        <Ionicons name="cloud-offline" size={13} color="#fff" />
        <Text className="ml-1 text-xs font-bold text-white">{t('common.offline')}</Text>
      </View>
    </View>
  );
}
