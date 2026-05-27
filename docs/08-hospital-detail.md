# 08. 病院詳細

**ステータス**: pending
**関連要件**: REQUIREMENTS.md §3.5 / §3.7.2
**依存**: 01・02・07 or 10 or 11（呼び出し元）・12（通院サービス連携セクション）・14（かかりつけ登録）
**ブロックする**: なし（葉ノード）

## 目的

特定の病院の全情報を 1 画面で見せ、電話発信・Google マップ起動・Web サイト表示・かかりつけ医登録のアクションを提供する。地域交通サービスへのリンクも統合する。

## 完了条件 (DoD)

- `app/hospital/[id].tsx` が動的ルートとして実装され、`useLocalSearchParams<{ id: string }>()` で取得した ID で病院情報を表示する。
- 4 アクションボタン（電話・Google マップ・Web サイト・かかりつけ登録/解除）が動作する。
- 診療時間テーブル（曜日 × 午前/午後）が表示される。
- 設備バッジ（バリアフリー / 駐車場 / 救急対応 / 送迎バス / オンライン診療）が条件に応じて出る。
- 「この地域の通院サービス」セクションが表示され、該当市町村の `transport_services` を一覧する（12 と連携）。

## Todo

- [ ] `app/hospital/[id].tsx` を作成し `useLocalSearchParams` で id 取得
- [ ] ローカルキャッシュ（`hospitals-cache`）から該当病院を取得するセレクタ
- [ ] 病院名・診療科タグ・基本情報のレイアウト
- [ ] `lib/linking.ts`：`callPhone(tel)` / `openGoogleMaps({ latitude, longitude, address })` / `openWebsite(url)` ユーティリティ
- [ ] 電話ボタン → `Linking.openURL('tel:0265-...')`
- [ ] Google マップボタン → 座標があれば `google.navigation:q=lat,lng&mode=d`、なければ住所
- [ ] Web サイトボタン → `Linking.openURL(websiteUrl)`（URL 未登録時は非表示）
- [ ] 診療時間テーブル `components/hospital/schedule-table.tsx`
- [ ] 設備バッジ `components/hospital/facility-badges.tsx`
- [ ] かかりつけ医登録/解除ボタン（チケット 14 連携、最大 5 件チェック）
- [ ] 「この地域の通院サービス」セクション（チケット 12 連携、`shuttle_bus=true` なら送迎バス情報を最上部）
- [ ] 備考表示
- [ ] `locales/ja.json` の `hospital.*` キー

## 留意事項

- 病院 ID は uuid。型は `string` で扱う。
- Google マップ起動の URL スキームは Android 前提で `google.navigation:` を使う。失敗した場合は `geo:` にフォールバック検討。
- かかりつけ登録のトーストは `expo-haptics` で軽く震わせると UX 向上。
