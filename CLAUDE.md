# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## プロジェクトの状態

`create-expo-app` テンプレート初期状態 → これから `REQUIREMENTS.md` の Phase 1 MVP「お医者さんナビ」（南信地域向け医療機関ナビ Android アプリ）を実装するフェーズです。テンプレートのサンプルファイル（`app/(tabs)/index.tsx`・`explore.tsx`・`HelloWave` 等）は機能実装時に置き換える前提。`npm run reset-project` でテンプレートを `app-example/` に退避できます。

## ルールの所在（context 節約のための分割）

常時必要な要点はこのファイル、その他は `.claude/rules/` 配下にあり、対象ファイルを開いた時だけ自動的に読み込まれます（`paths` フロントマターで scoping）。

| ルール | 自動読込のトリガー | 内容 |
| ------ | ------------------ | ---- |
| `.claude/rules/expo-sdk-54.md` | `**/*.ts(x)`・`app.json`・`eas.json`・`package.json`・`tsconfig.json`・`babel.config.*`・`metro.config.*` を開いた時 | SDK 54 ランタイム前提、Expo Router、Asset 管理、`expo-file-system` 新 API、EAS Build / Update、依存追加ルール、アーキテクチャ要点（パスエイリアス・テーマ集中管理） |
| `.claude/rules/project-policy.md` | `app/**`・`src/**`・`components/**`・`hooks/**`・`constants/**`・`docs/**/*.md`・`REQUIREMENTS.md` を開いた時 | Android 限定スコープ、採用スタック、Supabase / Workers 方針、i18n 規約、アクセシビリティ、セキュリティ、命名規約 |
| `docs/00-INDEX.md`（必要時に手動参照） | 機能着手時 | チケット一覧と依存関係 |
| `REQUIREMENTS.md`（必要時に手動参照） | 仕様詳細を見たい時 | 一次仕様書（956 行） |

新しい横断ルールを足す時は `.claude/rules/` に `paths` 付きで追加し、本表も更新してください。短い「常時必要なメタ情報」だけここに残し、量が増えそうな話題は rule に切り出す方針です。

## よく使うコマンド

| 用途 | コマンド |
| --- | --- |
| 依存インストール | `npm install` |
| 開発サーバー起動（Metro） | `npm start` または `npx expo start` |
| Android で起動 | `npm run android` |
| Web で起動 | `npm run web` |
| Lint | `npm run lint` |
| テンプレート退避 | `npm run reset-project` |

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
