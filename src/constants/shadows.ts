import { Platform, type ViewStyle } from 'react-native';

// 立体感の核（DESIGN-GUIDELINES.md §3）。className では表現できないため inline style で適用。
// iOS は2層相当のやわらかい影、Android は elevation で近似。

export const shadows = {
  // 小：サブカード・リスト項目
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    default: {},
  }),
  // 標準：病院カード・情報カード（最も使う）
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
    },
    android: { elevation: 4 },
    default: {},
  }),
  // 強：モーダル・浮かせたい要素
  lift: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;

// カラー影（ヒーローボタンが「光って浮く」演出）。Android は elevation のみ（色は付かない）。
export function coloredShadow(hex: string): ViewStyle {
  return (
    Platform.select<ViewStyle>({
      ios: {
        shadowColor: hex,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.36,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
      default: {},
    }) ?? {}
  );
}
