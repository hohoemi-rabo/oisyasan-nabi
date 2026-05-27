# 10. 症状アンケート → AI 結果画面

**ステータス**: pending
**関連要件**: REQUIREMENTS.md §3.3.2 / §3.3.3 / §5.2 / §7.2
**依存**: 03・09・15（キャッシュ）・16（ログ）
**ブロックする**: なし

## 目的

アンケート結果 + プロフィールを Workers に POST し、Gemini の判定（緊急度・推奨診療科・アドバイス）を表示する。失敗時はアプリ内ルールベースにフォールバック。並行して、推奨診療科に対応する病院をローカルキャッシュからスコアリングしてリスト表示する。

## 完了条件 (DoD)

- `/symptoms/results` 表示時に Workers `/api/ai-recommend` を 5 秒タイムアウトで呼ぶ。
- 緊急度バッジ（emergency 赤 / soon 黄 / watch 緑）が最上部に出る。色だけでなくアイコン + テキストも併用（アクセシビリティ要件）。
- 推奨診療科・症状まとめ・追加質問チャットの折りたたみセクションが表示される。
- 推奨診療科に該当する病院がスコアリング順で並ぶ（`hospitalScoring.ts`）。
- Workers 失敗時はルールベース判定で表示し、「現在 AI が利用できないため、簡易判定で表示しています」と通知。
- `search_logs` に `log_type: 'symptom'` で INSERT される（16 連携）。

## Todo

- [ ] `app/symptoms/results.tsx`
- [ ] `lib/aiWorker.ts`：`fetchAiRecommend(payload)` の実装。`AbortController` で 5 秒タイムアウト
- [ ] Workers レスポンスの zod スキーマ検証
- [ ] `lib/fallbackUrgency.ts` を Web から移植
- [ ] `lib/departmentMapping.ts` を Web から移植（部位 → 診療科）
- [ ] `lib/hospitalScoring.ts` を Web から移植（推奨診療科一致 +100 / かかりつけ +50 / 救急 +40 / 営業中 +30）
- [ ] 緊急度バッジ `components/symptoms/urgency-badge.tsx`（色 + アイコン + テキスト）
- [ ] 推奨診療科セクション（デフォルト開）
- [ ] 症状まとめ + 「画像として保存」ボタン（`react-native-view-shot` を導入）
- [ ] 追加質問チャットセクション（`/api/follow-up` を叩いて 2-3 問取得 → 再判定）
- [ ] おすすめ病院リスト（スコアリング順）
- [ ] フォールバック通知バナー
- [ ] `search_logs` INSERT（16 連携）
- [ ] `locales/ja.json` の `symptoms.result.*` キー

## 留意事項

- 緊急度バッジは色覚多様性に配慮し、色のみに依存しない（アイコン + ラベル併用）。
- 画像保存機能はバージョン互換性に注意（`react-native-view-shot` の SDK 54 対応版を確認）。
- 追加質問チャットはオプション機能。Phase 1 で実装余力がなければ後回し可。
- ローカルキャッシュが空（初回 + オフライン）の場合は「病院データを取得できませんでした」エンプティ表示。
