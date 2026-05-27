# 13. プロフィール + 設定タブ

**ステータス**: pending
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

- [ ] `app/(tabs)/settings.tsx`（メニュー一覧）
- [ ] `app/settings/profile.tsx`（プロフィール編集）
- [ ] `app/settings/about.tsx`（アプリ情報、`expo-constants` の `Constants.expoConfig?.version` を表示）
- [ ] データ初期化処理 `lib/resetAppData.ts`（AsyncStorage 全削除 + アプリ再起動 or ホームへ）
- [ ] 利用規約・プライバシーポリシーリンク（外部 URL or `expo-web-browser`）
- [ ] `locales/ja.json` の `settings.*` キー
- [ ] かかりつけ医画面は別チケット 14 で実装、ここからは導線のみ

## 留意事項

- データ初期化は破壊的操作なのでダイアログ二段階確認推奨。
- プライバシーポリシーは Play Store 必須。本文の確定は 17 で扱う。
- フィールド変更はデバウンスではなく即時保存で OK（フィールド数が少なく頻度も低い）。
