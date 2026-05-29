# 05. オンボーディング

**ステータス**: done
**関連要件**: REQUIREMENTS.md §3.1
**依存**: 01・02
**ブロックする**: 06（初回起動の遷移先がホームになるため）

## 目的

初回起動時に簡易な設定ウィザード（年齢層・居住エリア・移動補助）を表示し、AI 症状判定の精度向上とパーソナライズに使えるプロフィールを取得する。すべて任意・スキップ可能。

## 完了条件 (DoD)

- 初回起動時に `/onboarding` から自動的に開始する。
- 4 ステップ（ウェルカム → 年齢層 → 居住エリア → 移動補助）が動作し、各ステップに「あとで設定」ボタンがある。
- 完了 or スキップで `onboardingCompleted: true` が AsyncStorage に保存され、以降のセッションでは表示されない。
- 設定値は `useProfileStore` 経由で AsyncStorage に永続化される。
- すべての文言は `t('onboarding.*')` 経由で日本語化されている。

## Todo

- [×] `app/onboarding/_layout.tsx`（Stack、ヘッダー非表示・各画面で SafeAreaView + 自前ヘッダー）
- [×] `app/onboarding/index.tsx`（ウェルカム + 「はじめる」大ボタン）
- [×] `app/onboarding/age.tsx`（年齢層 4 択）
- [×] `app/onboarding/area.tsx`（14 自治体 + 区域外）
- [×] `app/onboarding/mobility.tsx`（移動補助 3 択）
- [×] 各ステップ右上に「あとで設定」（`completeOnboarding()` + `router.replace('/(tabs)')`）
- [×] プログレスインジケーター 4 ステップ（`src/components/common/onboarding-progress.tsx`、welcome 画面は省略しステップ 2〜4 で表示）
- [×] `useProfileStore` の `setAgeGroup` / `setArea` / `setMobilityAid` + `completeOnboarding` を実装
- [×] AsyncStorage キーはストア統合（`oishasan-navi:profile` 内に `onboarded` boolean。仕様の別キー `onboarding-completed` は採用せず、後述の実装メモ参照）
- [×] ルート判定: `app/(tabs)/_layout.tsx` の冒頭で `<Redirect href="/onboarding" />` ガード。`app/_layout.tsx` 側は `hasHydrated` 待機で SplashScreen を維持しフラッシュ防止
- [×] `locales/ja.json` に `onboarding.*` キーを追加（welcome / age / area / mobility / common 5 namespace）
- [×] アクセシビリティ: タップ領域は `min-h-[44px]` または `[56px]`、各 `Pressable` に `accessibilityRole="button"` + `accessibilityLabel`、プログレスは `accessibilityRole="progressbar"`

## 実装メモ

### `onboarded` フラグの統合

REQUIREMENTS.md §4.3 では `oishasan-navi:onboarding-completed` を独立キーで想定していたが、`useProfileStore`（`src/stores/profile-store.ts`）が同等の `onboarded: boolean` フィールドを既に持つため、AsyncStorage キーを増やさず統合した。`oishasan-navi:profile` の JSON 内に `onboarded` を保持。仕様の趣旨「次回起動でスキップ」は保たれる。

### ハイドレーション完了フラグ

Zustand `persist` の非同期ハイドレーションがガード判定より遅れて入ると一瞬「未オンボーディング」と誤判定されフラッシュする。これを防ぐため `hasHydrated: boolean` + `setHasHydrated()` をストアに追加し、`persist` の `onRehydrateStorage` で起動時に `true` をセット。`app/(tabs)/_layout.tsx` で `!hasHydrated` の間は `null` を返し、`app/_layout.tsx` で `SplashScreen.hideAsync()` も `hasHydrated` を待ってから呼ぶ。

### 構成

```
app/onboarding/
├── _layout.tsx       # Stack（headerShown: false）
├── index.tsx         # Welcome（プログレスなし、開始ボタン）
├── age.tsx           # 年齢層 4 択
├── area.tsx          # 14 自治体 + 区域外
└── mobility.tsx      # 移動補助 3 択

src/components/common/
├── onboarding-progress.tsx  # 4 ドット進捗バー
└── onboarding-option.tsx    # 大きなタップ領域の選択行
```

### 遷移ルール

- ステップ間: `router.push('/onboarding/<next>')`
- 最終ステップ完了 / 各ステップの「あとで設定」: `completeOnboarding()` → `router.replace('/(tabs)')`（オンボーディングスタックを切り離す）
- 値はステップ進むたびに setter で永続化（途中離脱しても保存済み）

## 留意事項

- スキップしても後で `/settings/profile` から編集できるよう、ストアの初期値は空でも問題ない設計にする（ticket 13 で `/settings/profile` を実装予定）。
- ステップ間の遷移は `router.push`、最終完了で `router.replace('/(tabs)')` してオンボーディングスタックを切り離す。
- リダイレクトは `<Redirect href="/onboarding" />` を使うと型安全（Typed Routes）。
- 実機での動作確認は ticket 06（ホーム本実装）着手時にあわせて。本ティケットでは静的チェックとバンドル成功（Metro `index.bundle` で HTTP 200 / 9.4MB）で完了とした。
