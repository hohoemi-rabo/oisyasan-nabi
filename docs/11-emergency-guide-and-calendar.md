# 11. 緊急時ガイド + 月次カレンダー

**ステータス**: pending
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

- [ ] `app/(tabs)/emergency.tsx` レイアウト
- [ ] 119 巨大ボタン → `Linking.openURL('tel:119')`
- [ ] `lib/emergencyRotations.ts`：今日 / 月の当番医を取得するロジック
- [ ] `components/emergency/duty-doctor-list.tsx`：当番医セクション（種別・診療科・施設名・電話・備考）
- [ ] 平日判定ロジック（土日祝の判定。日本の祝日は `@holiday-jp/holiday_jp` 等を検討、または手動定義）
- [ ] 夜間急患診療所カード（毎日固定表示）
- [ ] 応急処置の基本（4 ステップ、静的コンテンツ）
- [ ] 救急対応病院一覧（`hospitals.emergency_available = true` でフィルタ）
- [ ] `app/emergency/calendar.tsx`
- [ ] `react-native-calendars` の `markedDates` に当番医ありの日付をマーク
- [ ] 日付タップ → モーダル / ボトムシートで `EmergencyDayDetail`
- [ ] 月切り替え（前月・次月）。前月+当月+次月分のキャッシュを参照
- [ ] `locales/ja.json` の `emergency.*` キー

## 留意事項

- 当番医データの取得は AsyncStorage キャッシュ（`oishasan-navi:emergency-rotations-cache`）を一次ソースに、バックグラウンドで最新化（15 と連携）。
- カレンダーのロケールは日本語に切り替える（`LocaleConfig.locales['ja'] = ...`）。
- 応急処置は静的コンテンツのため i18n キー経由でテキスト化、画像は最小限。
