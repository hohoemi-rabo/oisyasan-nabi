# 10. 症状アンケート → AI 結果画面

**ステータス**: done（追加質問チャットのみ見送り）
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

- [×] `app/symptoms/results.tsx`
- [×] `lib/ai-worker.ts`：`fetchAiRecommend(payload)`（既存）。`postJson` を `timeoutMs` 引数化し recommend=5s / follow-up=10s に
- [×] Workers レスポンスのスキーマ検証（Workers 側で zod 検証済み・全失敗系を 200 + `source:'fallback'` に集約。アプリは throw / `source` の両方でフォールバック表示）
- [×] `src/lib/fallback-urgency.ts` を移植（症状値はアンケートのカノニカル値に整合。Workers 側定数も同期）
- [×] `src/lib/department-mapping.ts` を移植（部位 → 診療科。Workers 側定数も同期）
- [×] `src/lib/hospital-scoring.ts` を移植（推奨診療科一致 +100 / かかりつけ +50 / 救急 +40 / 営業中 +30、`isCurrentlyOpen` 再利用）
- [×] 緊急度バッジ `components/symptoms/urgency-badge.tsx`（背景色 + 絵文字 + ラベルテキスト併用）
- [×] 推奨診療科セクション（`collapsible-section.tsx`、デフォルト開）
- [×] 症状まとめ + 「画像として保存」ボタン（`react-native-view-shot` + `expo-media-library` 導入、`save-result-image.ts`）
- [ ] 追加質問チャットセクション（`/api/follow-up`）※ ticket 10 では見送り（任意機能）。後続チケットで対応
- [×] おすすめ病院リスト（スコアリング順、`result-hospital-card.tsx` に電話/地図/詳細ボタン）
- [×] フォールバック通知バナー
- [×] `search_logs` INSERT（既存 `logSearch('symptom', …)` を結果表示時に fire-and-forget）
- [×] `locales/ja.json` の `symptoms.result.*` キー

## 留意事項

- 緊急度バッジは色覚多様性に配慮し、色のみに依存しない（アイコン + ラベル併用）。
- 画像保存機能はバージョン互換性に注意（`react-native-view-shot` の SDK 54 対応版を確認）。
- 追加質問チャットはオプション機能。Phase 1 で実装余力がなければ後回し可。→ **ticket 10 では見送り**（コア + 画像保存を優先）。`/api/follow-up` を叩く `fetchFollowUp` は実装済みなので、後続チケットで UI を足すだけで有効化できる。
- ローカルキャッシュが空（初回 + オフライン）の場合は「病院データを取得できませんでした」エンプティ表示。
- **画像保存はネイティブモジュール**（`react-native-view-shot` 4.0.3 / `expo-media-library` ~18.2.1、`app.json` に plugin 追加・要写真権限）。Metro/Web バンドルや tsc/lint/doctor は通るが、実キャプチャ + 端末保存の挙動確認は dev client / EAS ビルド（ticket 17）まで持ち越し。
- AI 呼び出しはマウント時に 1 度だけ（`ranRef`）。下書きは結果表示後もクリアしない（リトライ容易性）。新規開始はアンケート先頭の「戻る → 中止」で `clearDraft`。
