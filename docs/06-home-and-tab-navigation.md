# 06. ホーム画面 + ボトムタブナビゲーション

**ステータス**: pending
**関連要件**: REQUIREMENTS.md §3.2 / §6.2
**依存**: 01・02・05
**ブロックする**: 07・09・11・12・13

## 目的

5 タブ構成（ホーム / 探す / 緊急 / 通院 / 設定）のボトムナビを確立し、ホーム画面に主要 3 機能への大ボタンを配置する。

## 完了条件 (DoD)

- `app/(tabs)/_layout.tsx` が以下 5 タブを定義し、テンプレートの 2 タブから差し替わっている。
  - ホーム（`index`）／探す（`search`）／緊急（`emergency`）／通院（`transport`）／設定（`settings`）
- ホーム画面に 3 大ボタン（症状検索 / 条件検索 / 緊急時）+ 通院ショートカット小ボタンが配置されている。
- 各タブのアイコンは `@expo/vector-icons` または `IconSymbol` 経由。タップ領域 48dp 以上。
- ヘッダー色・タブバー色は `constants/colors.ts` 経由。

## Todo

- [ ] `app/(tabs)/_layout.tsx` を 5 タブ構成に書き換える
- [ ] `app/(tabs)/index.tsx`（ホーム）：タイトル + サブタイトル + 3 大ボタン + 通院ショートカット
- [ ] `app/(tabs)/search.tsx`（探すタブの入口。条件検索画面または症状検索/条件検索の選択画面）
- [ ] `app/(tabs)/emergency.tsx`（緊急時タブの入口、実装は 11）
- [ ] `app/(tabs)/transport.tsx`（通院タブ入口、実装は 12）
- [ ] `app/(tabs)/settings.tsx`（設定タブ入口、実装は 13）
- [ ] テンプレートの `explore.tsx` を削除
- [ ] 「症状から病院を探す」ボタン → `router.push('/symptoms/questionnaire')`
- [ ] 「条件で病院を探す」ボタン → `router.push('/(tabs)/search')`（または別画面）
- [ ] 「緊急時・休日当番医」ボタン → `router.push('/(tabs)/emergency')`
- [ ] 「今日の通院サービス」ショートカット → `router.push('/(tabs)/transport')`
- [ ] `locales/ja.json` に `home.*` / `tabs.*` キーを追加
- [ ] オフラインバッジ表示用の枠を `app/_layout.tsx` 上部に確保（実装本体は 15）

## 留意事項

- タブのラベルは i18n キー経由。
- 「症状から探す」と「条件で探す」を別々の大ボタンにするか、「探す」タブ内で 2 択にするかは UI 検討事項。REQUIREMENTS.md §3.2 の図に従い、ホームでは別々のボタンとする。
- React Compiler 有効のため、ボタンコンポーネントの手動メモ化は不要。
