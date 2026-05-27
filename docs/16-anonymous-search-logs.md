# 16. 匿名検索ログ

**ステータス**: pending
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

- [ ] `lib/logSearch.ts` の実装
- [ ] `area` カラムにはプロフィールの `area` を渡す（任意）
- [ ] 個人特定リスクのあるフィールドの除外ポリシー決定（`memo` を含めるか、文字数制限するか）
- [ ] `app/symptoms/results.tsx`（10）からの呼び出し
- [ ] `app/search/results.tsx`（07）からの呼び出し
- [ ] 失敗時のサイレントログ（`console.warn` に留める）

## 留意事項

- ログ INSERT は非同期 fire-and-forget。`await` しないことで UI を阻害しない。
- 重複ログを防ぐため、同じセッションで同じ結果ページを再表示しても 1 回だけ送るかどうかは要 UX 判断。本要件では「結果表示時」のみで、再フェッチ時のみ送る仕様で良い。
- Phase 1 では `route` / `outing` は未使用。
