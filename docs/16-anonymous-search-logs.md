# 16. 匿名検索ログ

**ステータス**: done
**関連要件**: REQUIREMENTS.md §8
**依存**: 01
**ブロックする**: 07（条件検索結果表示時に記録）・10（AI 結果表示時に記録）

## 目的

Web 版と共通の `search_logs` テーブルに匿名ログを INSERT する。改善分析用で、個人特定情報は含めない。

## 完了条件 (DoD)

- `lib/logSearch.ts` に `logSymptom(payload)` / `logSearch(conditions)` のヘルパーがある。
- AI 結果表示時に `log_type: 'symptom'` で INSERT される。
- 条件検索結果表示時に `log_type: 'search'` で INSERT される。
- 個人特定可能なフィールド（自由記述 `memo` の生テキスト等）は送らない or マスクする。
- 失敗してもアプリの動作には影響しない（fire-and-forget、エラーはサイレント）。

## Todo

- [×] `src/lib/search-log.ts` の実装（ファイル名は命名規約に従い `search-log.ts`。doc の `logSearch.ts` とは別名）。private `insertLog` + `logSearch(conditions, area)` + `logSymptom(draft, profile)`
- [×] `area` 列にプロフィールの `residentialArea` を渡す
- [×] 個人特定リスクのあるフィールドの除外ポリシー決定 → **`memo` は完全除外**（マスクではなく送らない）。プロフィール（年齢層・移動補助）も search_data に含めず、symptom は `{location,duration,symptoms,lumpSize,conditions,medicine}` のみ
- [×] `app/symptoms/results.tsx`（10）からの呼び出し → `logSymptom(draftNow, profileNow)`（AI への request は memo を含むが、ログには渡さない）
- [×] `app/search/results.tsx`（07）からの呼び出し → `logSearch(conditions, area)`
- [×] 失敗時のサイレントログ（payload を出さない静的 `console.warn('[search-log] insert failed')`、UI には一切出さない）

## 留意事項

- ログ INSERT は非同期 fire-and-forget。`await` しないことで UI を阻害しない。
- 重複ログを防ぐため、同じセッションで同じ結果ページを再表示しても 1 回だけ送るかどうかは要 UX 判断。本要件では「結果表示時」のみで、再フェッチ時のみ送る仕様で良い。
- Phase 1 では `route` / `outing` は未使用。
- **確認済み（Supabase MCP）**: `search_logs` の RLS は anon/authenticated が INSERT 可（`with_check: true`）、SELECT は service_role のみ。クライアントは書けるが読めないためログの秘匿性が担保される。列は `log_type` / `search_data(jsonb)` / `area` / `created_at`。
