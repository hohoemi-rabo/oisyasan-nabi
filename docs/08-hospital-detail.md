# 08. 病院詳細

**ステータス**: done
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

- [×] `app/hospital/[id].tsx` を作成し `useLocalSearchParams` で id 取得
- [×] ローカルキャッシュ（`useHospitalsStore`）から該当病院を取得するセレクタ（`data.find((h) => h.id === id)`、キャッシュ未ロード時は `load()` トリガ）
- [×] 病院名・診療科タグ・基本情報のレイアウト（営業中バッジ含む）
- [×] `lib/linking.ts`：`callPhone(tel)` / `openGoogleMaps({ latitude, longitude, address, googleMapUrl })` / `openWebsite(url)` ユーティリティ
- [×] 電話ボタン → `Linking.openURL('tel:数字のみ')`
- [×] Google マップボタン → 座標があれば `google.navigation:q=lat,lng&mode=d` → `geo:` フォールバック → `google_map_url` → 住所での `google.com/maps/search` の順
- [×] Web サイトボタン → `Linking.openURL(websiteUrl)`（URL 未登録時は非表示）
- [×] 診療時間テーブル `src/components/hospital/schedule-table.tsx`
- [×] 設備バッジ `src/components/hospital/facility-badges.tsx`
- [×] かかりつけ医登録/解除ボタン（`useFavoritesStore`、最大 5 件で Alert 通知、`expo-haptics` で軽い振動）
- [×] 「この地域の通院サービス」セクション `src/components/hospital/transport-section.tsx`（`shuttle_bus=true` なら送迎バス情報を最上部）
- [×] 備考表示（`hospital.note` があれば）
- [×] `locales/ja.json` の `hospital.*` キー

## 実装メモ

### ファイル構成

```
src/
├── lib/
│   ├── linking.ts                # callPhone / openGoogleMaps / openWebsite
│   └── format-time.ts            # "HH:MM:SS" → "HH:MM"、"00:00" は空
├── types/transport.ts            # TransportService 型
├── stores/transport-services-store.ts  # persist なし、ticket 15 で被せる
└── components/hospital/
    ├── schedule-table.tsx        # 曜日 × 午前/午後 7 行テーブル
    ├── facility-badges.tsx       # 5 種、true のものだけ表示
    └── transport-section.tsx     # service_area.includes(city) でフィルタ

app/hospital/[id].tsx             # 詳細画面本実装
```

### Google マップ起動のフォールバックチェーン

1. 座標 (`latitude && longitude`) あり → `google.navigation:q=lat,lng&mode=d`（Android ナビ起動）
2. 上記が `canOpenURL` で開けない → `geo:lat,lng?q=lat,lng`（汎用 geo スキーム）
3. 座標なし → `google_map_url`（DB に保存された Google Maps URL）
4. それもなし → `https://www.google.com/maps/search/?api=1&query={address}`（住所検索）

REQUIREMENTS.md §3.5「座標があれば座標、なければ住所」を満たしつつ、`google_map_url` を補助として活用。

### かかりつけ医のフィードバック

`useFavoritesStore.add()` の `{ ok, reason }` で:
- `ok: true` → `Haptics.impactAsync(Medium)`
- `reason: 'limit'` → `Alert.alert(t('hospital.favorite.limitReached', { limit: 5 }))`
- `reason: 'duplicate'` → 同じ病院では発生しない（既登録なら remove ルート）

トーストは Phase 1 では入れず OS 標準 Alert で。`/settings/favorites` 実装（ticket 14）以降に磨き込み候補。

### 通院サービスの表示ルール

- `useTransportServicesStore` が 21 件を 1 度ロード
- `service_area.includes(hospital.city)` でその病院の市町村に対応するサービスのみ抽出
- `hospital.shuttle_bus=true` の場合は最上部に「病院送迎バス」ブロック（`shuttle_bus_info` テキスト）を別途表示
- 該当 0 件 + 送迎バスなし → セクションごと非表示（UI 散らかし防止）

### 既知の挙動

- キャッシュ未ロード時の直接アクセス → `load()` を実行して全件取得後に find
- `expo-haptics` は Android で動作、Web/iOS はフォーカス外
- `formatTime` は `00:00` を空文字に正規化（Web 移植の挙動を保存）

### 検証結果

- `tsc --noEmit` / `npm run lint` / `expo-doctor` 18/18 ✓
- Metro Android バンドル HTTP 200（10.6 MB、ticket 07 比 +44 KB）

## 留意事項

- 病院 ID は uuid。型は `string` で扱う。
- Google マップ起動の URL スキームは Android 前提で `google.navigation:` を使う。失敗時は `geo:` にフォールバック実装済み。
- かかりつけ登録のトーストは `expo-haptics` で軽く振動（Light: 解除、Medium: 登録）。
- 実機での総合動作確認は ticket 10 着手時のパスで実施予定。本ティケットは静的検証 + バンドル成功で完了。
