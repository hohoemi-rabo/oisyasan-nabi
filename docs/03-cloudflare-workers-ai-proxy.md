# 03. Cloudflare Workers AI プロキシ

**ステータス**: pending
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

- [ ] Cloudflare Workers プロジェクトを別リポ or サブディレクトリで作成（要件: 既存 Web リポ or 新規 `oishasan-navi-ai` を判断）
- [ ] `wrangler.toml` を作成し、`GEMINI_API_KEY` を Secrets に登録
- [ ] `/api/ai-recommend` ハンドラ：5 秒タイムアウト、Gemini 呼び出し、JSON 整形、CORS ヘッダ
- [ ] `/api/follow-up` ハンドラ：10 秒タイムアウト、2-3 問の追加質問生成
- [ ] レート制限ミドルウェア（Workers KV or Durable Objects）
- [ ] 既存 Web の `lib/symptoms/*` 相当（部位→診療科マッピング、プロンプトテンプレート）を Workers に移植
- [ ] エラー時は `{ source: 'fallback', urgency_reason: '...' }` を返却するフォールバック整備
- [ ] デプロイ後の URL を `.env.local` の `EXPO_PUBLIC_AI_WORKER_URL` に登録
- [ ] `lib/aiWorker.ts`（アプリ側）から呼び出してエンドツーエンドで疎通確認

## 留意事項

- 既存 Web の Next.js API ルートをそのまま流用するのではなく、**Workers ランタイムで動く形にリライト**する（Edge Runtime の制約に注意）。
- Gemini レスポンスのスキーマ検証（zod 等）を入れて、想定外の JSON が来た場合も 500 ではなく fallback で返す。
- 個人情報を含むフィールド（自由記述 `memo` 等）は Workers のログに残さない設定にする。
