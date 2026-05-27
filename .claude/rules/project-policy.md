---
paths:
  - "app/**"
  - "src/**"
  - "components/**"
  - "hooks/**"
  - "constants/**"
  - "docs/**/*.md"
  - "REQUIREMENTS.md"
---

# プロジェクト固有ポリシー（お医者さんナビ Phase 1）

REQUIREMENTS.md の全文は一次ソースとして必ず保持してください。本ファイルは実装時に絶対に外せない方針だけを抽出したサマリです。両者で齟齬が出た場合は REQUIREMENTS.md を正とします。

## スコープ・対象

- **配布対象は Android のみ**（Google Play 配布、EAS Build / EAS Update）。iOS スクリプトはテンプレートの名残で、新規実装の対象外。
- **認証なし**。プロフィール・かかりつけ医・キャッシュは AsyncStorage にローカル保存（個人情報のサーバー保存は行わない）。
- **既存 Web サービス「病院ナビ南信」とは別系統のアプリ**。ターゲットはシニア層 + リニア移住者・在住外国人・短期滞在者へ拡張。

## 採用スタック（追加予定）

導入時は Expo SDK 54 と互換のあるバージョンを **必ず `npx expo install` でピン留め**してください。

- **NativeWind**（Tailwind CSS for RN）でスタイリング
- **Zustand** + AsyncStorage 永続化ミドルウェアでグローバル状態
- **`@react-native-async-storage/async-storage`** でローカルキャッシュ・プロフィール・かかりつけ医
- **`@supabase/supabase-js`**（Anon Key + RLS 前提、サービスロールはアプリに渡さない）
- **`expo-localization` + `i18n-js`** で多言語化（Phase 1 は日本語のみだが構造は完備）
- **`date-fns`**・**`react-native-calendars`**（救急ローテのカレンダー UI）
- **`@react-native-community/netinfo`**（オフライン検知）
- React Query は **Phase 1 では入れない**（AsyncStorage キャッシュ + 必要時再フェッチで十分）

## 通信・データ

- **Supabase は既存プロジェクト `byouin-nabi` を共有**（病院マスタ・スケジュール・交通サービス等）。アプリは SELECT のみ。
- `.mcp.json` で Supabase MCP サーバーが構成されている（`.gitignore` 済み）。スキーマ変更前に `list_tables` で既存構造を確認してから `apply_migration`。
- **`list_tables` の `rows` フィールドは `pg_class.reltuples` の統計情報で、ANALYZE 直後でないと 0 や古い値を返す**。行数を確かめたい時は `execute_sql` で `SELECT COUNT(*) FROM ...` を実行すること。実例: `hospitals` が `rows: 0` と出たが実際は 110 行だった（2026-05-27 確認）。
- **AI 判定は Cloudflare Workers 経由で Gemini API を呼び出す**。Gemini の API キーをクライアントに置かない。失敗時はアプリ内ルールベース（`lib/fallbackUrgency.ts`）にフォールバック。
- **ローカルキャッシュは 24h TTL**。AsyncStorage キーは `oishasan-navi:` プレフィックスで統一。

## i18n

- **Phase 1 でも構造を最初から組み込む**（Phase 1 は日本語のみだが Phase 2 で英語追加）。
- **UI 文字列はハードコード禁止**。すべて `t('key')` 経由で取得する。キーは階層構造（`onboarding.welcome.title`・`emergency.duty_doctor.label` 等）。
- 新しい文字列を足す時は `locales/ja.json` を同時に更新する。`locales/en.json` は Phase 1 は空 or 構造コピーで OK。

## アクセシビリティ・UX

- タップ領域は最小 48 × 48 dp。
- ボタンはアイコン + ラベル（アイコンのみ禁止）。
- 緊急度などの状態表示は **色だけに依存しない**（バッジ色 + テキスト + アイコンの併用）。
- すべてのインタラクティブ要素に `accessibilityLabel`。
- 文字サイズは OS の文字サイズ設定には追従させず、デザイン上の階層で固定指定。

## セキュリティ・プライバシー

- 公開可: `EXPO_PUBLIC_SUPABASE_URL`・`EXPO_PUBLIC_SUPABASE_ANON_KEY`・`EXPO_PUBLIC_AI_WORKER_URL`。
- 非公開（Workers Secrets）: `GEMINI_API_KEY`。
- `search_logs` への INSERT は匿名のみ（個人特定情報を含めない）。fire-and-forget で UI を阻害しない。
- データ削除手段は設定画面の「データ初期化」ボタン（AsyncStorage 全削除）。

## 命名規約

- ファイル名: `kebab-case`（例: `hospital-card.tsx`）
- コンポーネント名: `PascalCase`（例: `HospitalCard`）
- 関数・変数: `camelCase`
- 定数: `UPPER_SNAKE_CASE`
- AsyncStorage キー: `oishasan-navi:` プレフィックス
