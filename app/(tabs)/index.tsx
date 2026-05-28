import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-neutral-900">お医者さんナビ</Text>
      <Text className="mt-2 text-base text-neutral-500">セットアップ完了（ticket 06 で本実装）</Text>
    </View>
  );
}
