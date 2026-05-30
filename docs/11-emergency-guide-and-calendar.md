# 11. 緊急時ガイド + 月次カレンダー

**ステータス**: done
**関連要件**: REQUIREMENTS.md §3.6 / §3.6.1
**依存**: 01・02・04（DB 投入完了）・06・15
**ブロックする**: なし

## 目的

119 番ボタン・今日の休日当番医・夜間急患診療所・応急処置の基本・救急対応病院一覧を 1 画面で提供する。月次カレンダーで休日当番医を日付ごとに確認できる。

## 完了条件 (DoD)

- `app/(tabs)/emergency.tsx` に 119 ボタン（巨大、最上部）+ 今日の当番医 + 月次カレンダーへのボタン + 夜間急患診療所案内 + 応急処置 + 救急対応病院一覧が表示される。
- 平日は「本日は平日のため、休日当番医はありません」と表示し、夜間急患診療所を強調。
- `app/emergency/calendar.tsx` で `react-native-calendars` の月次表示。休日に「当番医あり」マーカー。日付タップで当番医一覧モーダル/ボトムシート。
- 当番医セクション内の電話番号はすべて `tel:` リンク化。
- オフラインでも 24 時間以内のキャッシュから表示できる。

## Todo

- [×] `app/(tabs)/emergency.tsx` レイアウト
- [×] 119 巨大ボタン → `Linking.openURL('tel:119')`（`emergency-call-button.tsx`）
- [×] `lib/emergency-rotations.ts`：今日 / 月の当番医を取得するロジック（`getRotationsForDate` / `getDutyDateKeys` / `groupByType` / `isWeekend` / `todayKey`）
- [×] `components/emergency/duty-doctor-list.tsx`：当番医セクション（種別・診療科・施設名・電話・備考、全番号 `tel:` リンク化）
- [×] 平日判定ロジック（**データ駆動 + 土日のみ**で確定。当番有無は当日データ基準、文言は `getDay()` の土日判定。祝日ライブラリは導入せず）
- [×] 夜間急患診療所カード（毎日固定表示・静的。DB に `night_emergency` 行が無いため）
- [×] 応急処置の基本（4 ステップ、静的 i18n コンテンツ）
- [×] 救急対応病院一覧（`hospitals.emergency_available = true` でフィルタ、`HospitalCard` 再利用）
- [×] `app/emergency/calendar.tsx`（+ `app/emergency/_layout.tsx`、root `_layout.tsx` に emergency stack 登録）
- [×] `react-native-calendars` の `markedDates` に当番医ありの日付をマーク（`LocaleConfig` で日本語化）
- [×] 日付タップ → RN 標準 `Modal`（`day-detail-modal.tsx`）で当日の当番医一覧
- [×] 月切り替え（`enableSwipeMonths`。全件ロード済みのためフェッチ不要）
- [×] `locales/ja.json` の `emergency.*` キー

## 留意事項

- 当番医データの取得は AsyncStorage キャッシュ（`oishasan-navi:emergency-rotations-cache`）を一次ソースに、バックグラウンドで最新化（15 と連携）。→ 現状は `emergency-rotations-store` をメモリ常駐パターン（`{data,loadedAt,isLoading,error,load}`）で実装。**真のオフライン永続（24h TTL persist）は ticket 15 でこの store に被せる**。テーブルが小さい（〜38 行）ため全件ロード + クライアント側日付フィルタ。
- **データ実態（2026-05 時点）**: `emergency_rotations` は 2026-06 の日曜のみ（飯田/阿南地区）。`night_emergency` 行は 0 件のため夜間急患診療所は静的カード。デモで当番医を見るにはカレンダーで 6/7・14・21・28 をタップ。
- カレンダーのロケールは日本語に切り替える（`LocaleConfig.locales['ja'] = ...`）。
- 応急処置は静的コンテンツのため i18n キー経由でテキスト化、画像は最小限。
