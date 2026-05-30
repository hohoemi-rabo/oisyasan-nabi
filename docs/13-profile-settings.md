# 13. プロフィール + 設定タブ

**ステータス**: done
**関連要件**: REQUIREMENTS.md §3.8
**依存**: 01・02・05・06
**ブロックする**: 14（かかりつけ医画面は設定タブ内に配置）

## 目的

設定タブにプロフィール編集・かかりつけ医・アプリ情報・データ初期化を集約する。プロフィールはローカル保存のみ（認証なし）。

## 完了条件 (DoD)

- `app/(tabs)/settings.tsx` から、プロフィール編集・かかりつけ医・アプリ情報・データ初期化に遷移できる。
- `app/settings/profile.tsx` で年齢層・居住エリア・移動補助を編集できる。即時反映 + AsyncStorage 保存。
- `app/settings/about.tsx` でアプリバージョン・利用規約・プライバシーポリシーへのリンクが表示される。
- データ初期化ボタンで AsyncStorage 全クリア（確認ダイアログ付き）。
- 言語切替 UI は Phase 1 では非表示（コードコメント or feature flag で 02 に予約）。

## Todo

- [×] `app/(tabs)/settings.tsx`（メニュー一覧、`SettingsRow`）
- [×] `app/settings/profile.tsx`（プロフィール編集。`OnboardingOption` 再利用・選択即 setter 保存）+ `app/settings/_layout.tsx` + root `_layout.tsx` に settings stack 登録
- [×] `app/settings/about.tsx`（`Constants.expoConfig?.version` 表示）
- [×] データ初期化処理 `src/lib/reset-app-data.ts`（profile/favorites/search-conditions/questionnaire の 4 persist store を reset → `router.replace('/onboarding')`）
- [×] 利用規約・プライバシーポリシーリンク（`expo-web-browser` の `openBrowserAsync`。URL は ticket 17 確定まで空 → 「準備中」Alert）
- [×] `locales/ja.json` の `settings.*` キー
- [×] かかりつけ医画面は別チケット 14（`app/settings/favorites.tsx` を `ScreenPlaceholder` で先置き、導線のみ）

## 留意事項

- データ初期化は破壊的操作なのでダイアログ二段階確認推奨。
- プライバシーポリシーは Play Store 必須。本文の確定は 17 で扱う。→ `app/settings/about.tsx` の `TERMS_URL`/`PRIVACY_URL` を空のまま置き、未設定時は「準備中」Alert。ticket 17 で URL を入れるだけで有効化される。
- データ初期化は二段階確認 Alert を実装。メモリ常駐 stores（hospitals/transport/emergency）は個人情報を含まないリモートキャッシュのため対象外（再フェッチで復元）。
- フィールド変更はデバウンスではなく即時保存で OK（フィールド数が少なく頻度も低い）。
