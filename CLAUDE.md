# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## プロジェクトの状態

Phase 1 MVP「お医者さんナビ」（南信地域向け医療機関ナビ Android アプリ）の実装フェーズ。

- **基盤チケット 01・02・03 は done**（プロジェクトスケルトン、i18n 基盤、Cloudflare Workers AI プロキシ）。`src/` 配下のディレクトリ、NativeWind v4、Zustand ストア、Supabase クライアント、`t()` 関数、`workers/` サブプロジェクトはすべて使える状態。
- これから着手するのは機能チケット 05〜14 と横断系 15（ローカルキャッシュ）。依存関係は `docs/00-INDEX.md`。
- 03 の Workers は **コードのみ完成**、本番デプロイ（Rate Limiting namespace 確定 → `wrangler secret put GEMINI_API_KEY` → `wrangler deploy` → URL を `.env.local` に登録）は手動で残っている。詳細は `workers/README.md`。
- `app/(tabs)/index.tsx` は ticket 06 が本実装する想定のプレースホルダ。`npm run reset-project` スクリプトは使わない（手動で残置整理済み）。

## ルールの所在（context 節約のための分割）

常時必要な要点はこのファイル、その他は `.claude/rules/` 配下にあり、対象ファイルを開いた時だけ自動的に読み込まれます（`paths` フロントマターで scoping）。

| ルール | 自動読込のトリガー | 内容 |
| ------ | ------------------ | ---- |
| `.claude/rules/expo-sdk-54.md` | `**/*.ts(x)`・`app.json`・`eas.json`・`package.json`・`tsconfig.json`・`babel.config.*`・`metro.config.*` を開いた時 | SDK 54 ランタイム前提、Expo Router、Asset 管理、`expo-file-system` 新 API、EAS Build / Update、依存追加ルール、アーキテクチャ要点（パスエイリアス・テーマ集中管理） |
| `.claude/rules/project-policy.md` | `app/**`・`src/**`・`components/**`・`hooks/**`・`constants/**`・`docs/**/*.md`・`REQUIREMENTS.md` を開いた時 | Android 限定スコープ、採用スタック（実装済み）、Supabase / Workers 方針、`t()` 経路、アクセシビリティ、セキュリティ、命名規約 |
| `.claude/rules/workers.md` | `workers/**` を開いた時 | Cloudflare Workers ランタイム前提、Hono + zod 構成、`ALL_DEPARTMENTS` の同期ルール、プライバシー（ログ抑制）、CORS / レート制限、`wrangler` 操作 |
| `docs/00-INDEX.md`（必要時に手動参照） | 機能着手時 | チケット一覧と依存関係 |
| `REQUIREMENTS.md`（必要時に手動参照） | 仕様詳細を見たい時 | 一次仕様書（956 行） |

新しい横断ルールを足す時は `.claude/rules/` に `paths` 付きで追加し、本表も更新してください。短い「常時必要なメタ情報」だけここに残し、量が増えそうな話題は rule に切り出す方針です。

## よく使うコマンド

| 用途 | コマンド |
| --- | --- |
| 依存インストール（アプリ本体） | `npm install` |
| 開発サーバー起動（Metro） | `npm start` または `npx expo start` |
| Android で起動 | `npm run android` |
| Web で起動 | `npm run web` |
| Lint | `npm run lint` |
| 型チェック | `npx tsc --noEmit` |
| 互換性チェック | `npx expo install --check` / `npx expo-doctor` |
| 依存追加（アプリ本体） | `npx expo install <pkg>` |
| Workers 依存インストール | `cd workers && npm install` |
| Workers ローカル開発 | `cd workers && npm run dev`（`http://127.0.0.1:8787`） |
| Workers 本番デプロイ | `cd workers && npm run deploy` |
| Workers Secrets 設定 | `cd workers && npm run secret:gemini` |

テスト用のスクリプトは未設定です。導入する場合は `package.json` に `jest-expo` 等の構成を追加してください。

## 開発チケット（`docs/`）

機能ごとの実装チケットを `docs/00-INDEX.md` 〜 `docs/17-eas-build-and-playstore.md` に分割しています。新しい機能に着手する前に、必ず該当チケットを開いて「ステータス」と「Todo」を更新しながら進めてください。

- チケットの一次ソースは `REQUIREMENTS.md`、`docs/` 配下はスコープと進捗管理に特化したサマリです。
- チケットの追加・改廃時は `docs/00-INDEX.md` の表とリンクを同期更新してください。
- **Todo の表記ルール**:
  - 未着手は `- [ ]`、完了したら `- [×]` に書き換える（`x` ではなく `×`＝全角バツ／U+00D7）。
  - 要件追加が発生した場合は `- [ ]` で追記してから着手。
  - 用済みの Todo は削除せず `- [×]` で履歴を残す。
- **チケット冒頭の「ステータス」行**は `pending → in_progress → done` で更新します。
- 横断的な依存（依存追加、ディレクトリ整備、i18n キー）は基盤系チケット（01〜03、15）に集約し、機能チケットからはそちらを参照してください。

## 開発の進め方メモ

- 個人開発リポジトリ。グローバルルール通り `main` へ直接コミットし、ブランチは切らない。
- コミットメッセージは Conventional Commits（`feat:` / `fix:` / `docs:` / `refactor:` / `test:` / `chore:`）を英語で。
- 新しい依存追加は **必ず `npx expo install <pkg>`**。詳細は `.claude/rules/expo-sdk-54.md` の「依存追加・バージョン管理」を参照。
