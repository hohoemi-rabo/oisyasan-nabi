# 04. 既存 Web 側: emergency_rotations テーブル + 管理画面

**ステータス**: done
**関連要件**: REQUIREMENTS.md §4.2 / §13
**依存**: なし（既存 Web リポでの作業）
**ブロックする**: 11（アプリ側の当番医表示はデータが入っていることが前提）

## 目的

休日当番医・夜間急患診療所のローテーションを管理する `emergency_rotations` テーブルを Supabase（既存プロジェクト `byouin-nabi`）に追加し、Web 管理画面から月次データを投入できるようにする。本アプリは SELECT するだけだが、データ供給がなければ機能不全になるため Phase 1 のクリティカルパス。

## 完了条件 (DoD)

- Supabase 上に `emergency_rotations` テーブルが作成され、RLS 公開 SELECT ポリシーが有効。
- 既存 Web に `/admin/emergency-rotations` が追加され、CSV/Excel 一括インポート・1 件編集・削除・夜間急患診療所の月次自動生成が動作する。
- 当月分の実データ（飯伊地区包括医療協議会の予定表）が最低 1 ヶ月入っている。

## Todo

- [×] マイグレーション `20260526_create_emergency_rotations_table` を作成し、REQUIREMENTS.md §4.2 の SQL を適用（Supabase MCP `execute_sql` で既存スキーマを確認、全カラム一致）
- [×] インデックス 3 本（`duty_date` / `rotation_type+duty_date` / `source_month`）を作成（+ ボーナス `hospital_id` インデックス。`pg_indexes` で確認済み）
- [×] RLS 有効化と `Public can read emergency_rotations` ポリシー（anon + authenticated に対し SELECT `USING (true)`。`pg_policies` で確認済み）
- [×] `/admin/emergency-rotations` UI 実装（`byouin-nabi/src/app/admin/emergency-rotations/{page,new/page,[id]/edit/page,import/page,generate-night/page}.tsx` の 5 ページ。既存 hospitals 管理画面と同じ構造を流用）
- [×] CSV/Excel パーサ（REQUIREMENTS.md §4.2.1 のテンプレートに対応。`papaparse` + `xlsx` を使う `importEmergencyRotations()` を `byouin-nabi/src/app/admin/actions.ts:614-` に実装）
- [×] 「夜間急患診療所の月次自動生成」ボタン（`generate-night` ページ + `generateNightEmergencyRotations()` `actions.ts:766-861`。デフォルト: 飯田市休日夜間急患診療所 / 0265-23-3636 / 夜間 19:00-22:00 毎日 + 昼間 09:00-12:30 日曜・祝日）
- [×] `source_month` で絞り込んだ月単位削除ボタン（`deleteRotationsByMonth()` `actions.ts:556-574`）
- [×] 5 月（または当月）の予定表データを投入（2026-06 が 38 行: duty_doctor 21 / duty_dentist 4 / duty_pharmacy 13）
- [×] アプリ側（`11-emergency-guide-and-calendar.md`）に「投入完了」を共有（本ファイル「実装メモ」セクションを参照すること、と引き継ぎ）

## 実装メモ

### Web 側完成済みファイル（参照のみ・本リポでは編集しない）

| 種別 | パス |
| --- | --- |
| 一覧 + 月切替 | `byouin-nabi/src/app/admin/emergency-rotations/page.tsx` |
| 新規登録 | `byouin-nabi/src/app/admin/emergency-rotations/new/page.tsx` |
| 1 件編集 | `byouin-nabi/src/app/admin/emergency-rotations/[id]/edit/page.tsx` |
| CSV/Excel インポート | `byouin-nabi/src/app/admin/emergency-rotations/import/page.tsx` |
| 夜間急患月次生成 | `byouin-nabi/src/app/admin/emergency-rotations/generate-night/page.tsx` |
| クライアントコンポーネント | `byouin-nabi/src/components/Admin/EmergencyRotationListClient.tsx`、`NightEmergencyGenerateForm.tsx` |
| サーバアクション 8 関数 | `byouin-nabi/src/app/admin/actions.ts:502-861`（create / update / delete / getEmergencyRotationsByMonth / getAvailableSourceMonths / importEmergencyRotations / generateNightEmergencyRotations / deleteRotationsByMonth） |
| 型 | `byouin-nabi/src/types/emergency-rotation.ts` |

### Web 側の auth

`/admin/*` は cookie 認証（`admin-auth=true`）。`byouin-nabi/middleware.ts` で middleware ガード + 各サーバアクションで `verifyAdminAuth()`。データ投入は管理者がブラウザから操作する運用。

### 残る運用タスク（実装ではなく定期作業）

| タスク | 担当 | タイミング |
| --- | --- | --- |
| 当月の `night_emergency` 月次生成（30〜31 日分） | ユーザー（Web 管理画面の「🌙 夜間急患の月次生成」ボタン） | 月初。2026-06 はまだ未生成（0 件）。ticket 11 着手前に必ず生成すること |
| 翌月 / 前月の `duty_doctor` / `duty_dentist` / `duty_pharmacy` を CSV インポート | ユーザー（「📥 CSV インポート」） | 飯伊地区包括医療協議会の月次予定表が出たら |
| 月単位削除（古い月の整理） | ユーザー（一覧画面の月単位削除） | 必要に応じて。過去データは履歴として保持してよい |

アプリ側のキャッシュは前月+当月+次月（REQUIREMENTS.md §7.1）。デモ安定のため 3 ヶ月分のデータがあると望ましい。

### データ状態確認用クエリ（ticket 11 着手前に必ず実行）

```sql
-- 月別 × 種別の件数
SELECT source_month, rotation_type, COUNT(*) AS n
FROM emergency_rotations
GROUP BY 1, 2
ORDER BY 1, 2;

-- 今月の night_emergency が入っているか
SELECT COUNT(*) FROM emergency_rotations
WHERE rotation_type = 'night_emergency'
  AND source_month = to_char(CURRENT_DATE, 'YYYY-MM');
```

## 留意事項

- このチケットは既存 Web リポでの作業で、本アプリリポの変更は発生しない。完了の検証は `select * from emergency_rotations where source_month = '...'` でレコードがあること。
- アプリ側のキャッシュ戦略（前月+当月+次月）に合わせて、最低 3 ヶ月分のデータがあるとデモが安定する。
- Phase 2 で PDF パース / Web スクレイピングによる自動更新を予定（このチケットでは対応しない）。
