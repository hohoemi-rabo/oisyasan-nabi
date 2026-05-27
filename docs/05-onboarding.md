# 05. オンボーディング

**ステータス**: pending
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

- [ ] `app/onboarding/_layout.tsx`（Stack、ヘッダーシンプル）
- [ ] `app/onboarding/index.tsx`（ウェルカム + 開始ボタン）
- [ ] `app/onboarding/age.tsx`（年齢層 4 択）
- [ ] `app/onboarding/area.tsx`（14 自治体 + 区域外）
- [ ] `app/onboarding/mobility.tsx`（移動補助 3 択）
- [ ] 各ステップ右上に「あとで設定」（= `/` へ遷移しつつ `onboardingCompleted` を立てる）
- [ ] プログレスインジケーター（4 ステップ）
- [ ] `useProfileStore` の `setAgeGroup` / `setArea` / `setMobilityAid` を実装
- [ ] AsyncStorage キー `oishasan-navi:onboarding-completed` の読み書き
- [ ] ルート判定: `app/_layout.tsx` または `app/index.tsx` で未完了なら `/onboarding` にリダイレクト
- [ ] `locales/ja.json` に `onboarding.*` キーを追加
- [ ] アクセシビリティ: タップ領域 48dp 以上、`accessibilityLabel` 付与

## 留意事項

- スキップしても後で `/settings/profile` から編集できるよう、ストアの初期値は空でも問題ない設計にする。
- ステップ間の遷移は `router.push`、最終完了で `router.replace('/')` してオンボーディングスタックを切り離す。
- リダイレクトは `<Redirect href="/onboarding" />` を使うと型安全（Typed Routes）。
