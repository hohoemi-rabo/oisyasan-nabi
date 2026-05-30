---
paths:
  - "workers/**"
---

# Cloudflare Workers サブプロジェクト（`workers/`）

Phase 1 MVP の AI プロキシ（ticket 03）。Expo 本体とは独立した `package.json` / `tsconfig.json` / `wrangler.toml` を持ち、ビルドもデプロイも別系統。**Node でも React Native でもなく、V8 isolate ベースの Workers ランタイム**で動く前提を常に意識すること。詳細手順は `workers/README.md`。

## ランタイムとスタック

- **ランタイム**: Cloudflare Workers（`compatibility_flags = ["nodejs_compat"]` 有効）
- **フレームワーク**: Hono 4 系（`hono`、`hono/cors`、`@hono/zod-validator`）
- **バリデーション**: `zod` 3 系（入出力・Gemini レスポンスの両方）
- **AI クライアント**: `@google/generative-ai`（`responseMimeType: 'application/json'` で JSON 強制、`Promise.race` でタイムアウト）
- **TypeScript**: `verbatimModuleSyntax: true` / `strict: true`。型は `@cloudflare/workers-types`。
- **エントリ**: `src/index.ts`。`export default app`（Hono インスタンス）を Workers ランタイムが拾う。

## モジュール構成（kebab-case 統一）

```
workers/src/
├── index.ts              # Hono app + CORS + rate limit + routes
├── prompts.ts            # SYSTEM_PROMPT / FOLLOW_UP_PROMPT + builder
├── master-data.ts        # ALL_DEPARTMENTS（canonical 20 科）
├── department-mapping.ts # 部位→診療科マッピング
├── fallback-urgency.ts   # ルールベース緊急度判定
├── schemas.ts            # zod schema + 推論型
└── gemini.ts             # Gemini SDK ラッパ + timeout
```

ファイル追加時も kebab-case を維持。

## ALL_DEPARTMENTS の Single Source of Truth

`workers/src/master-data.ts` の `ALL_DEPARTMENTS` が **canonical**。アプリ側 `src/constants/departments.ts` の `DEPARTMENTS` と **完全一致**（順序・値）を保つ。理由:

- Workers がプロンプトで「以下の 20 科から選択」と AI に強制している
- アプリは AI 返却の `recommended_departments` で病院をフィルタする
- ズレると検索結果が空になる

変更時は **両方のファイルを同じコミットで** 更新すること。

## ルーティング規約

すべて 200 系で返却し、エラーは `source: 'fallback'` か空配列でグレースフルに表現する。`/api/ai-recommend` の 200 + `source: 'fallback'` がアプリ側の唯一のフォールバック合図 → アプリは HTTP エラーに依存しない。

| ルート | 失敗時の挙動 |
| --- | --- |
| `GET /` | 通常は 200 `{"ok": true, ...}`（疎通確認） |
| `POST /api/ai-recommend` | Gemini 未設定 / タイムアウト / スキーマ違反 → 200 + `buildFallback()` で `source: 'fallback'` |
| `POST /api/follow-up` | 失敗時は 200 + `{ questions: [] }` |

レート制限超過のみ 429 + `Retry-After: 60`。zod 入力バリデーション失敗は `zValidator` がデフォルトで 400 を返す（アプリ側はリクエスト形式を保証する責務）。

## CORS

許可 Origin リスト（`src/index.ts` の `ALLOWED_ORIGINS`）:

- `http://localhost:8081`（Expo Metro）
- `http://localhost:19006`（Expo web preview）
- `https://expo.dev` / `https://exp.host`
- **Origin ヘッダなし** も許可（Expo native fetch はヘッダを送らないため）

本番のカスタムドメインを使う場合は `ALLOWED_ORIGINS` に追加。

## レート制限

`wrangler.toml` の Cloudflare ネイティブ Rate Limiting binding `RATE_LIMITER`（`limit: 30 / period: 60s`）を `cf-connecting-ip` キーで使用。KV / Durable Objects は使わない。`namespace_id` は Cloudflare ダッシュボードで作成・確定する（仮値 `"1001"` のまま本番デプロイしない）。

## プライバシー / ロギング

- `wrangler.toml` の `[observability]` は **`enabled = false`**。リクエスト本文（特に `memo` の自由記述）が Workers ログに残らないようにする。
- コード側のエラーログは `console.warn(\`<route> error: ${err.name}\`)` 程度に抑制。**リクエスト本文・Gemini レスポンス本文を絶対に出力しない**。
- 個人情報を含み得る箇所:
  - `memo`（症状の自由記述）
  - `profile.area`（居住自治体）
  - `followUpAnswers[].answer`（自由入力の場合）

## Secrets / 環境変数

- 本番 Secret: `wrangler secret put GEMINI_API_KEY`
- ローカル開発: `workers/.dev.vars`（`.dev.vars.example` をコピーして実値）。`.dev.vars` は `workers/.gitignore` で除外済み。
- `c.env.GEMINI_API_KEY` 経由でアクセス（Hono の `Bindings` ジェネリクスに型あり）

## デプロイ運用

- ローカル: `npm run dev`（`wrangler dev`、`http://127.0.0.1:8787`）
- デプロイ: `npm run deploy`（`wrangler deploy`）
- 型チェック: `npm run typecheck`（`tsc --noEmit`）
- デプロイ後の URL は本リポ直下の `.env.local` の `EXPO_PUBLIC_AI_WORKER_URL` に登録（アプリ側 `src/lib/ai-worker.ts` がここを参照）

## 依存追加

- 通常の `npm install <pkg>`（`npx expo install` は使わない、ここは Expo 管理下ではない）
- ただし New Architecture / RN とは無関係なので、安定版を選ぶ。`@cloudflare/workers-types` のバージョンは `wrangler` と整合する版を使う。

## Gemini モデル名 / thinking 設定

`workers/src/gemini.ts` の `GEMINI_MODEL`。現在は **`gemini-3.5-flash`**（本番デプロイ済み・`source:'ai'` で実応答確認済み）。API 側で未対応エラーが出る場合はこの 1 行のみ別モデルに差し替え可能。プロンプト構造は変えなくて良い。

**重要（モデル変更時に必須・再発しやすい罠）**: `gemini-2.5/3.x flash` 系は既定で **thinking（思考）が有効**で、思考トークンが `maxOutputTokens` を食い尽くし JSON が途中で切れる → `finishReason=MAX_TOKENS` → パース失敗 → `source:'fallback'` になる（実測: 思考が 899 トークン消費し本文 86 トークンで切れた）。これを防ぐため `generateJson` の `generationConfig` に **`thinkingConfig: { thinkingBudget: 0 }`** を入れて thinking を無効化している（応答も ~2.5s に高速化）。**別の thinking 対応モデルへ変える時もこの設定は必ず残すこと**。SDK 0.21 の `GenerationConfig` 型に `thinkingConfig` が無いため、`generationConfig` を変数に切り出してから `getGenerativeModel` に渡している（インライン literal だと excess-property エラー）。

デプロイ状況: Workers は Cloudflare に本番デプロイ済み（URL は本リポ `.env.local` の `EXPO_PUBLIC_AI_WORKER_URL`）。`GEMINI_API_KEY` は Workers Secret に設定済み、Rate Limiter の `namespace_id="1001"` のまま稼働。再デプロイは `cd workers && npm run deploy`。
