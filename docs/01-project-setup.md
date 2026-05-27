# 01. プロジェクト基盤セットアップ

**ステータス**: pending
**関連要件**: REQUIREMENTS.md §2.1 / §6.2 / §12.1 / §12.2 / §12.3
**依存**: なし（最初に着手）
**ブロックする**: 02・05・06・15

## 目的

Expo SDK 54 のテンプレート状態から、本アプリのディレクトリ構造・状態管理・Supabase クライアント・基本依存関係を整える。ここで一度きちんと土台を作っておけば、以降の機能チケットが迷いなく着地できる。

## 完了条件 (DoD)

- `npx expo install` で SDK 54 互換版をピン留めした依存が `package.json` に反映されている。
- `src/` 配下に `components/`・`stores/`・`lib/`・`types/`・`constants/` のスケルトンが存在する（README または各 `.gitkeep` で説明）。
- `lib/supabase.ts` で Anon Key + URL の `createClient` が完了し、最小 SELECT が成功する。
- `app/_layout.tsx` でテーマ・SafeArea・SplashScreen 制御の標準パターンが組み込まれている。
- `app/(tabs)/index.tsx` 等のサンプルは削除または最低限のプレースホルダに置換。

## Todo

- [ ] テンプレート（`HelloWave`・`ParallaxScrollView` 等）を削除または `app-example/` に退避（`npm run reset-project` の使用可否を判断）
- [ ] `src/` ディレクトリを作成し、`components/common`・`components/hospital`・`components/symptoms`・`components/emergency`・`components/transport`・`stores`・`lib`・`types`・`constants`・`locales`・`i18n` の構造を作る
- [ ] `tsconfig.json` のパスエイリアスに `@/src/*` を追加する（既存 `@/*` と併用）
- [ ] 依存追加: `npx expo install nativewind tailwindcss @react-native-async-storage/async-storage @supabase/supabase-js zustand date-fns react-native-calendars @react-native-community/netinfo`
- [ ] NativeWind v4 のセットアップ（`tailwind.config.js`・`global.css`・`babel.config.js` または `metro.config.js`）
- [ ] `lib/supabase.ts` を実装し、`EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` を読み込む
- [ ] `.env.example` を追加（実値は `.env.local` に置き、`.gitignore` 確認）
- [ ] `constants/departments.ts`（20 診療科）・`constants/cities.ts`（14 自治体）・`constants/colors.ts` を作る
- [ ] `stores/profileStore.ts`・`stores/favoritesStore.ts`・`stores/questionnaireStore.ts` の Zustand スケルトンを作成（AsyncStorage 永続化ミドルウェア込み）
- [ ] `app/_layout.tsx` を本プロジェクト用に書き換え（`expo-splash-screen.preventAutoHideAsync`、`useFonts`、i18n Provider、Theme）
- [ ] `expo-doctor` / `npx expo install --check` で互換性を確認

## 留意事項

- 依存追加は **必ず `npx expo install`**。`npm install` 直叩きは SDK 54 非互換版を引きやすい。
- NativeWind v4 は React Native 0.81 / New Architecture と組み合わせる際にビルド設定が変わるので、公式手順を逐次確認する。
- AsyncStorage キーは `oishasan-navi:` プレフィックスで統一（REQUIREMENTS.md §4.3）。
