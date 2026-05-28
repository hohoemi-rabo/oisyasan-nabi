# 03. Cloudflare Workers AI プロキシ

**ステータス**: done（コード完成・デプロイは手動ステップ残）
**関連要件**: REQUIREMENTS.md §2.2 / §5.2 / §3.3.2
**依存**: なし（アプリ実装と並行可能）
**ブロックする**: 10

## 目的

Gemini API キーをクライアントに置かないため、Cloudflare Workers にプロキシを建てる。アプリは Workers のエンドポイントのみを叩く構造にする。既存 Web の `/api/symptoms/ai-recommend` のロジックを Workers 用に移植する。

## 完了条件 (DoD)

- 公開エンドポイント 2 つ（`/api/ai-recommend`・`/api/follow-up`）が稼働している。
- Gemini 3.1 flash-lite-preview を呼び出し、REQUIREMENTS.md §5.2 のリクエスト/レスポンス形式に準拠している。
- `GEMINI_API_KEY` は Workers Secrets に格納（コミット禁止）。
- CORS は本アプリの origin のみ許可（dev 用 `http://localhost:8081` 等も含む）。
- レート制限：IP ベースで 1 分 30 リクエスト。
- 失敗時は `source: 'fallback'` を返す。アプリ側はこれを見てルールベースに切り替える。

## Todo

- [×] Cloudflare Workers プロジェクトを本リポの `workers/` サブディレクトリに作成（ユーザー判断で確定）
- [×] `wrangler.toml` を作成し、`GEMINI_API_KEY` を Secrets で受け取る構造に（実 secret 設定はデプロイ時に `wrangler secret put`）
- [×] `/api/ai-recommend` ハンドラ：5 秒タイムアウト、Gemini 呼び出し、zod 整形、CORS 経由
- [×] `/api/follow-up` ハンドラ：10 秒タイムアウト、2-3 問の追加質問生成
- [×] レート制限ミドルウェア（Cloudflare Workers Rate Limiting バインディング、KV/DO 不要）
- [×] 既存 Web の `lib/symptoms/*` 相当（部位→診療科マッピング、プロンプトテンプレート、フォールバック緊急度判定）を Workers に移植
- [×] エラー時は `{ source: 'fallback', ... }` を返却するフォールバック整備（Gemini 未設定・タイムアウト・スキーマ違反の全経路で共通）
- [ ] デプロイ後の URL を `.env.local` の `EXPO_PUBLIC_AI_WORKER_URL` に登録（手動・ユーザー作業）
- [×] `src/lib/ai-worker.ts`（アプリ側）から呼び出すクライアントを実装（型 + 関数のみ。UI 統合は ticket 10）

## 実装メモ

- **配置**: `workers/` サブディレクトリ。独立 `package.json` / `tsconfig.json` / `wrangler.toml`。Expo 本体のビルドからは分離。
- **フレームワーク**: Hono + `@hono/zod-validator`
- **Gemini**: `@google/generative-ai`、`responseMimeType: 'application/json'`、`Promise.race` でタイムアウト
- **CORS**: `http://localhost:8081`（Metro）/ `http://localhost:19006`（web preview）/ `https://expo.dev` / `https://exp.host` + Origin なし（Expo native fetch 用）
- **レート制限**: `wrangler.toml` の `RATE_LIMITER` バインディング（`limit: 30 / period: 60s`）。`cf-connecting-ip` 単位。
- **プライバシー**: `observability.enabled = false`、エラー時もリクエスト本文を出力しない
- **20 科のソース・オブ・トゥルース**: `workers/src/master-data.ts` の `ALL_DEPARTMENTS` が canonical。アプリ側 `src/constants/departments.ts` の `DEPARTMENTS` と完全一致を維持（ticket 01 で導入したリストは Web 版に揃え直し）。
- **アプリ側クライアント**: `src/lib/ai-worker.ts` の `fetchAiRecommend` / `fetchFollowUp`。`AbortController` で 8 秒タイムアウト（Workers の 5 秒 + ネットワーク往復）。
- **未完了タスク（手動）**:
  1. Cloudflare ダッシュボードで Rate Limiting binding namespace を作成、`wrangler.toml` の `namespace_id = "1001"` を実値に
  2. `cd workers && npm run secret:gemini`（実値入力）
  3. `npm run deploy` → 表示 URL を `.env.local` の `EXPO_PUBLIC_AI_WORKER_URL` に追記
  4. 本番 curl で疎通確認（`/`、`/api/ai-recommend`、レート制限）

## 留意事項

- 既存 Web の Next.js API ルートをそのまま流用するのではなく、**Workers ランタイムで動く形にリライト**する（Edge Runtime の制約に注意）。
- Gemini レスポンスのスキーマ検証は `aiRecommendCoreSchema.safeParse` で実装。未準拠ならフォールバックに自動切替。
- 個人情報を含むフィールド（自由記述 `memo` 等）は Workers のログに残さない設定（`observability.enabled = false` + エラー時もクラス名のみログ）。
- Gemini モデル名 `gemini-3.1-flash-lite-preview` は既存 Web で採用済み。API 未対応のエラーが出る場合は `workers/src/gemini.ts` の `GEMINI_MODEL` を最新版に差し替え。
