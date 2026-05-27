# 00. チケット一覧（INDEX）

「お医者さんナビ」Phase 1 MVP を機能単位に分割したチケット集。実装着手前に必ず該当チケットを開き、Todo を更新しながら進めること。詳細仕様は常に `REQUIREMENTS.md` を一次ソースとし、本ファイル群は実装スコープと進捗管理に特化する。

## 運用ルール

- 各チケットは先頭にファイル番号と件名を持つ Markdown。
- Todo は `- [ ]`（未着手）／`- [×]`（完了）で管理する（詳細は `CLAUDE.md` 参照）。
- 作業着手時はチケット冒頭の「ステータス」行を `pending → in_progress → done` で更新する。
- 横断的な変更（依存追加・ディレクトリ作成等）は基盤系チケット（01〜03）に集約し、機能チケットから参照する。

## 依存関係（ざっくり）

```
01 project-setup
   ├─ 02 i18n-foundation
   ├─ 15 local-cache-and-offline
   └─ 05 onboarding ── 06 home-and-tab-navigation ─┬─ 07 condition-search ── 08 hospital-detail
                                                   ├─ 09 symptoms-questionnaire ── 10 symptoms-ai-result
                                                   ├─ 11 emergency-guide-and-calendar
                                                   ├─ 12 transport-services
                                                   └─ 13 profile-settings ── 14 favorites
03 cloudflare-workers-ai-proxy ── 10 symptoms-ai-result
04 web-admin-emergency-rotations ── 11 emergency-guide-and-calendar
16 anonymous-search-logs（07 / 10 から呼び出される）
17 eas-build-and-playstore（最後にまとめる、プライバシーポリシーを含む）
```

## チケット

| #  | ファイル | 概要 |
| -- | -------- | ---- |
| 01 | [01-project-setup.md](./01-project-setup.md) | Expo SDK 54 プロジェクト基盤・依存追加・ディレクトリ整備・Supabase/Zustand 初期化 |
| 02 | [02-i18n-foundation.md](./02-i18n-foundation.md) | `expo-localization` + `i18n-js` セットアップ、`locales/ja.json` 完備、`en.json` 雛形 |
| 03 | [03-cloudflare-workers-ai-proxy.md](./03-cloudflare-workers-ai-proxy.md) | Gemini API プロキシ Workers（`/api/ai-recommend`、`/api/follow-up`） |
| 04 | [04-web-admin-emergency-rotations.md](./04-web-admin-emergency-rotations.md) | 既存 Web 側に `emergency_rotations` テーブル + 管理画面を追加（並行作業） |
| 05 | [05-onboarding.md](./05-onboarding.md) | 初回起動時オンボーディング 4 ステップ（年齢層・居住エリア・移動補助） |
| 06 | [06-home-and-tab-navigation.md](./06-home-and-tab-navigation.md) | ボトムタブ構造、ホーム画面の 3 大ボタン + 通院ショートカット |
| 07 | [07-condition-search.md](./07-condition-search.md) | 条件検索画面・診療科/市町村/設備フィルター・結果一覧 |
| 08 | [08-hospital-detail.md](./08-hospital-detail.md) | 病院詳細画面・電話/Googleマップ起動・診療時間テーブル・通院サービス連携 |
| 09 | [09-symptoms-questionnaire.md](./09-symptoms-questionnaire.md) | 症状アンケート（ステップ形式・途中保存） |
| 10 | [10-symptoms-ai-result.md](./10-symptoms-ai-result.md) | AI 結果画面・緊急度バッジ・病院スコアリング・フォールバック |
| 11 | [11-emergency-guide-and-calendar.md](./11-emergency-guide-and-calendar.md) | 緊急時ガイド・今日の当番医・月次カレンダー・救急対応病院 |
| 12 | [12-transport-services.md](./12-transport-services.md) | 地域交通サービス一覧・詳細・病院詳細からの導線 |
| 13 | [13-profile-settings.md](./13-profile-settings.md) | 設定タブ・プロフィール編集・アプリ情報・データ初期化 |
| 14 | [14-favorites.md](./14-favorites.md) | かかりつけ医（最大 5 件、ドラッグ並び替え、スワイプ削除） |
| 15 | [15-local-cache-and-offline.md](./15-local-cache-and-offline.md) | AsyncStorage キャッシュ戦略・24h 更新チェック・オフライン挙動 |
| 16 | [16-anonymous-search-logs.md](./16-anonymous-search-logs.md) | `search_logs` への匿名 INSERT（symptom / search） |
| 17 | [17-eas-build-and-playstore.md](./17-eas-build-and-playstore.md) | `eas.json` 整備・Play Store 提出・アイコン・プライバシーポリシー |
