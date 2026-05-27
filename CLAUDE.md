# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## プロジェクトの状態

このリポジトリは `create-expo-app` で生成されたテンプレートのままです。`REQUIREMENTS.md` に Phase 1 MVP「お医者さんナビ」（南信地域向け医療機関ナビ Android アプリ）の詳細な要件定義があり、これから本実装が始まります。新規実装に着手する前に `REQUIREMENTS.md` を参照してください。テンプレートに含まれる `app/(tabs)/index.tsx`・`app/(tabs)/explore.tsx`・`app/modal.tsx`・`components/hello-wave.tsx`・`components/parallax-scroll-view.tsx` などはサンプルであり、機能実装時に置き換える前提です。`npm run reset-project` を実行するとテンプレートを `app-example/` に退避し、空の `app/` を作り直せます。

## よく使うコマンド

| 用途 | コマンド |
| --- | --- |
| 依存インストール | `npm install` |
| 開発サーバー起動（Metro） | `npm start` または `npx expo start` |
| Android で起動 | `npm run android` |
| iOS で起動 | `npm run ios`（参考用。配布対象は Android のみ） |
| Web で起動 | `npm run web` |
| Lint | `npm run lint`（`expo lint` = ESLint 9 + `eslint-config-expo` の flat config） |
| テンプレートを退避して空 app/ を作る | `npm run reset-project` |

テスト用のスクリプトは未設定です。導入する場合は `package.json` の `scripts` と合わせて Jest（`jest-expo`）等の構成を追加してください。

## アーキテクチャ要点

- **Expo SDK 54 / React Native 0.81 / React 19 / TypeScript 5.9（strict）**。`AGENTS.md` の指示通り、コードを書く前に <https://docs.expo.dev/versions/v54.0.0/> の該当 API を必ず確認してください。SDK 54 では既存の知識が古い可能性があります。
- **New Architecture 有効**（`app.json` の `newArchEnabled: true`）。Reanimated v4・`react-native-worklets` 前提で書きます。
- **React Compiler 有効**（`app.json` の `experiments.reactCompiler: true`）。手動の `useMemo` / `useCallback` は基本不要。明示的にメモ化が必要な根拠がある時だけ追加してください。
- **Typed Routes 有効**（`experiments.typedRoutes: true`）。`expo-router` の `href` は文字列リテラルから自動的に型付けされます。新しいルートを追加したら型が再生成されるよう dev server を再起動してください。
- **ルーティングは Expo Router の file-based routing**。エントリーポイントは `package.json` の `"main": "expo-router/entry"`。
  - `app/_layout.tsx` がルートの Stack。`(tabs)` を anchor として宣言し、`modal` を `presentation: 'modal'` で開く構成。
  - `app/(tabs)/_layout.tsx` がボトムタブ。タブボタンは `HapticTab` で触覚フィードバック、アイコンは `IconSymbol`（iOS は SF Symbols / Android・Web は Material Icons へのマップ）。
- **パスエイリアス `@/*` → リポジトリ直下**（`tsconfig.json`）。`@/components/...`・`@/hooks/...`・`@/constants/...` を優先し、相対パスを混在させないでください。
- **テーマ／配色**は `constants/theme.ts` の `Colors` と `hooks/use-color-scheme.ts`（Web 用は `.web.ts` で分岐）、`hooks/use-theme-color.ts`、`components/themed-text.tsx`・`themed-view.tsx` で集中管理。色やフォントは直書きせず Themed 系コンポーネント／フックを通します。

## REQUIREMENTS.md に書かれた実装方針（要点）

実装に入る前に `REQUIREMENTS.md` 全文を確認してください。特に外せない方針は以下です。

- **対象は Android のみ**（Google Play 配布、EAS Build / EAS Update）。iOS スクリプトはテンプレートの名残です。
- **追加予定のスタック**: NativeWind、Zustand、`@react-native-async-storage/async-storage`、`@supabase/supabase-js`（Anon Key + RLS 前提）、`expo-localization` + `i18n-js`、`date-fns`、`react-native-calendars`。導入時は Expo SDK 54 と互換のあるバージョンを `npx expo install` で固定してください。
- **AI 判定は Cloudflare Workers 経由で Gemini API を呼び出す**。Gemini の API キーをクライアントに置かないこと。
- **i18n は Phase 1 でも構造を最初から組み込む**（Phase 1 は日本語のみだが Phase 2 で英語追加）。文字列はキー化して定義します。
- **個人情報のサーバー保存は行わない**。プロフィール・かかりつけ医・キャッシュは AsyncStorage に保存。
- **Supabase は既存プロジェクト `byouin-nabi` を共有**（病院マスタ・スケジュール・交通サービス等）。`.mcp.json` で Supabase MCP サーバーが構成されています。スキーマ変更前に `list_tables` で既存構造を確認してから `apply_migration` を使ってください。

## 開発の進め方メモ

- 個人開発リポジトリです。グローバルルール通り `main` へ直接コミットし、ブランチは切りません。
- コミットメッセージは Conventional Commits（`feat:` / `fix:` / `docs:` / `refactor:` / `test:` / `chore:`）を英語で。
- 新しい依存関係を追加するときは必ず `npx expo install <pkg>` を使い、SDK 54 互換版にピン留めします。`npm install` で直接入れると非互換バージョンが入ることがあります。
