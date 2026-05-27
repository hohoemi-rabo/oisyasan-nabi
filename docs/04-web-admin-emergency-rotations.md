# 04. 既存 Web 側: emergency_rotations テーブル + 管理画面

**ステータス**: pending
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

- [ ] マイグレーション `20260526_create_emergency_rotations_table` を作成し、REQUIREMENTS.md §4.2 の SQL を適用
- [ ] インデックス 3 本（`duty_date` / `rotation_type+duty_date` / `source_month`）を作成
- [ ] RLS 有効化と `Public can read emergency_rotations` ポリシー
- [ ] `/admin/emergency-rotations` UI 実装（既存 hospitals 管理画面と同じ構造を流用）
- [ ] CSV/Excel パーサ（REQUIREMENTS.md §4.2.1 のテンプレートに対応）
- [ ] 「夜間急患診療所の月次自動生成」ボタン（施設情報 + 月を指定して 30〜31 日分を一括 INSERT）
- [ ] `source_month` で絞り込んだ月単位削除ボタン
- [ ] 5 月（または当月）の予定表データを投入
- [ ] アプリ側（`11-emergency-guide-and-calendar.md`）に「投入完了」を共有

## 留意事項

- このチケットは既存 Web リポでの作業で、本アプリリポの変更は発生しない。完了の検証は `select * from emergency_rotations where source_month = '...'` でレコードがあること。
- アプリ側のキャッシュ戦略（前月+当月+次月）に合わせて、最低 3 ヶ月分のデータがあるとデモが安定する。
- Phase 2 で PDF パース / Web スクレイピングによる自動更新を予定（このチケットでは対応しない）。
