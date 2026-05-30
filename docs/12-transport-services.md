# 12. 地域交通サービス

**ステータス**: done
**関連要件**: REQUIREMENTS.md §3.7
**依存**: 01・02・06・08（病院詳細からの導線）・15
**ブロックする**: なし

## 目的

送迎バス・デマンド・タクシー・福祉タクシー・路線バスを、自治体・種別・バリアフリーでフィルタして提示する。病院詳細からも該当地域分を表示し、通院手段の発見を促す。

## 完了条件 (DoD)

- `app/(tabs)/transport.tsx` で交通サービス一覧が表示される。
- 自治体フィルター（デフォルトはプロフィールの `area`）・種別フィルター（5 種）・バリアフリーフィルターが動作する。
- 各カードに電話/予約ボタン。
- `app/transport/[id].tsx` で詳細表示（運営者・対応エリア・予約方法・料金・バリアフリー）。
- 病院詳細画面（チケット 08）に「この地域の通院サービス」セクションが組み込まれている。

## Todo

- [×] `app/(tabs)/transport.tsx`（単一画面でフィルタ + 一覧、`ScrollView`）
- [×] 自治体フィルター（プロフィール初期値。local `useState`、`CITIES` chip）
- [×] 種別フィルター（`route_bus` / `demand` / `taxi` / `welfare_taxi` / `shuttle`、`src/constants/transport.ts` の `SERVICE_TYPES`）
- [×] バリアフリーフィルター（`wheelchair_accessible`）
- [×] `components/transport/transport-card.tsx`
- [×] `app/transport/[id].tsx`（詳細画面）+ `app/transport/_layout.tsx` + root `_layout.tsx` に transport stack 登録
- [×] 「電話で予約」「Web で予約」ボタン（`lib/linking.ts` の `callPhone`/`openWebsite`）
- [×] 病院詳細への「この地域の通院サービス」セクション組み込み（**ticket 08 で実装済み**。本チケットでカードタップ → `/transport/[id]` 詳細への導線を追加）
- [×] 病院が `shuttle_bus=true` の場合の送迎バス情報最上部表示（**ticket 08 の `transport-section.tsx` で実装済み**）
- [×] ローカルキャッシュからの読み込み（`useTransportServicesStore`。persist 永続化は ticket 15 で被せる）
- [×] `locales/ja.json` の `transport.*` キー（種別ラベルは既存 `hospital.transport.serviceTypes.*` を再利用）

## 留意事項

- バス時刻表は遅延取得（REQUIREMENTS.md §7.1）。→ **`bus_routes` / `bus_stops` / `bus_timetables` は現状 0 行のため、時刻表 UI は本チケットでは対象外**（データ投入後に追加実装）。
- オフライン永続（24h TTL）は ticket 15 で `transport-services-store` に persist を被せる前提（現状はメモリ常駐）。
- 病院詳細での絞り込みは `transport_services.service_area` 配列に病院の `city` が含まれるかで判定。
