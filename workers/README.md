# oisyasan-navi-ai (Cloudflare Workers)

Phase 1 MVP の症状判定 (`/api/ai-recommend`) と追加質問生成 (`/api/follow-up`) を行うプロキシ。Gemini API キーを Workers Secrets に格納してクライアントから秘匿する。

## 仕様の出典

- `../REQUIREMENTS.md` §5.2 / §3.3.2
- `../docs/03-cloudflare-workers-ai-proxy.md`

## エンドポイント

| メソッド | パス | 概要 | タイムアウト |
| --- | --- | --- | --- |
| GET  | `/`                  | ヘルスチェック | – |
| POST | `/api/ai-recommend`  | 緊急度判定 + 推奨診療科 | 5 秒 |
| POST | `/api/follow-up`     | 追加質問 2〜3 問生成 | 10 秒 |

`/api/ai-recommend` は失敗系をすべて 200 + `source: "fallback"` で返却する（アプリ側は HTTP エラーではなく `source` を見て分岐）。`/api/follow-up` も失敗時は `{ "questions": [] }` を返す。

## ローカル開発

1. `npm install`
2. `cp .dev.vars.example .dev.vars` し、`GEMINI_API_KEY` を実値で埋める（gitignore 済み）
3. `npm run dev` → `http://127.0.0.1:8787`
4. 動作確認:
   ```bash
   curl http://127.0.0.1:8787
   # => {"ok":true,"service":"oisyasan-navi-ai"}

   curl -X POST http://127.0.0.1:8787/api/ai-recommend \
     -H 'Content-Type: application/json' \
     -d '{
       "location": ["むね"],
       "duration": "今日",
       "symptoms": ["息苦しい"],
       "conditions": [],
       "medicine": null,
       "memo": "",
       "profile": {"ageGroup": "65to74", "area": "飯田市"}
     }'
   ```
5. `npm run typecheck` で型チェック

## デプロイ

1. Cloudflare ダッシュボードで Rate Limiting binding の namespace を作成し、`wrangler.toml` の `namespace_id` を実値に更新（仮値 `"1001"`）
2. 本番 Secret 設定: `npm run secret:gemini`（実値入力）
3. `npm run deploy` → 表示された `*.workers.dev` URL を本リポ直下の `.env.local` の `EXPO_PUBLIC_AI_WORKER_URL` に書き込む

## Secrets / 環境変数

| 名前 | 用途 | 設定方法 |
| --- | --- | --- |
| `GEMINI_API_KEY` | Gemini API（必須） | `wrangler secret put GEMINI_API_KEY`、ローカルは `.dev.vars` |

## レート制限

`/api/*` 全体に対し IP ベース 1 分 30 リクエスト。`cf-connecting-ip` ヘッダをキーに `wrangler.toml` の `RATE_LIMITER` バインディングで制御。

## プライバシー / ロギング

- `wrangler.toml` で `observability.enabled = false`（リクエスト本文を Workers ログに残さない）
- アプリ側コードでもエラー時にステータスと例外クラス名のみログし、`memo` などの自由記述は出力しない

## 構成

```
workers/
├── src/
│   ├── index.ts             # Hono app: CORS + rate limit + routes
│   ├── prompts.ts           # SYSTEM_PROMPT / FOLLOW_UP_PROMPT + builder
│   ├── master-data.ts       # ALL_DEPARTMENTS（canonical 20 科）
│   ├── department-mapping.ts # 部位→診療科マッピング
│   ├── fallback-urgency.ts  # ルールベース緊急度判定
│   ├── schemas.ts           # zod 入出力スキーマ + 推論型
│   └── gemini.ts            # Gemini クライアント + timeout
├── package.json
├── tsconfig.json
├── wrangler.toml
├── .dev.vars.example        # Secrets テンプレート
└── .gitignore
```

## 重要: ALL_DEPARTMENTS のソース・オブ・トゥルース

`src/master-data.ts` の `ALL_DEPARTMENTS` はアプリ側 (`../src/constants/departments.ts`) の `DEPARTMENTS` と **必ず同じ順序・同じ値** で保つ。Workers のプロンプトに焼き込んでいるため、AI が返した診療科名でアプリがフィルタする際にズレると検索結果が空になる。変更時は両ファイルを同じ PR で更新すること。

## CORS

許可 Origin:

- `http://localhost:8081`（Expo Metro）
- `http://localhost:19006`（Expo web preview）
- `https://expo.dev` / `https://exp.host`
- Origin ヘッダなし（Expo native fetch はヘッダを送らないため許可）

本番のカスタムドメインを Expo で使う場合は `src/index.ts` の `ALLOWED_ORIGINS` に追加。
