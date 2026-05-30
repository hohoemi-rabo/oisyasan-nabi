# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## プロジェクトの状態

Phase 1 MVP「お医者さんナビ」（南信地域向け医療機関ナビ Android アプリ）の実装フェーズ。

- **完了チケット**: 01（基盤）・02（i18n）・03（Workers AI、コードのみ）・04（Web 管理画面、別リポで完了済み）・05（オンボーディング）・06（ホーム + 5 タブ）・07（条件検索）・08（病院詳細）・09（症状アンケート）・10（AI 結果、追加質問チャットのみ見送り）・11（緊急時ガイド + 月次カレンダー）・12（地域交通サービス）・13（プロフィール + 設定タブ）。5 タブすべて本実装。設定タブからプロフィール編集・アプリ情報・データ初期化・かかりつけ医（導線のみ）へ。
- **残り**: 14（かかりつけ一覧）・15（ローカルキャッシュ）・16（検索ログ拡張）・17（EAS / Play Store）。10 の追加質問チャット（`/api/follow-up` UI）と 12 のバス時刻表（`bus_*` データ投入後）、利用規約/プライバシー URL（`settings/about.tsx`、17 で確定）は後続で対応。依存関係は `docs/00-INDEX.md`。
- 03 の Workers は **コードのみ完成**、本番デプロイ（Rate Limiting namespace 確定 → `wrangler secret put GEMINI_API_KEY` → `wrangler deploy` → URL を `.env.local` に登録）は手動で残っている。詳細は `workers/README.md`。
- ticket 07 以降のプレースホルダ画面（`/symptoms/questionnaire`・`(tabs)/{emergency,transport,settings}`・`/hospital/[id]`→既に本実装済み）は `src/components/common/screen-placeholder.tsx` でラベルだけ表示。`router.push` の Typed Routes 解決のため後続チケット着手前から存在させる方針。
- `npm run reset-project` スクリプトは使わない（手動で残置整理済み）。

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
| バンドル疎通確認（チケット完了時） | `npx expo start --port 8082` を背景起動 → `curl 'http://localhost:8082/node_modules/expo-router/entry.bundle?platform=android&dev=true&minify=false'` で `HTTP 200` を確認 → `pkill -f "expo start --port 8082"` |
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
- **チケット完了の判定基準** = tsc / lint / expo-doctor / 上記「バンドル疎通確認」が 4 つとも通る。`expo-doctor` と `tsc` は `babel.config.js` を読まないので、Metro バンドルが通ることまで確認しないと「ビルドが落ちる潜在バグ」を見落とす（ticket 01 で `babel-preset-expo` 依存登録漏れが ticket 05 着手まで発覚しなかった事例あり）。
