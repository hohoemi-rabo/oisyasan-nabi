# 12. 地域交通サービス

**ステータス**: pending
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

- [ ] `app/(tabs)/transport.tsx`
- [ ] 自治体フィルター（プロフィール初期値）
- [ ] 種別フィルター（`route_bus` / `demand` / `taxi` / `welfare_taxi` / `shuttle`）
- [ ] バリアフリーフィルター
- [ ] `components/transport/transport-card.tsx`
- [ ] `app/transport/[id].tsx`（詳細画面）
- [ ] 「電話で予約」「Web で予約」ボタン（`lib/linking.ts` 活用）
- [ ] 病院詳細への「この地域の通院サービス」セクション組み込み（08 と連携）
- [ ] 病院が `shuttle_bus=true` の場合、その病院の送迎バス情報を最上部に表示するロジック
- [ ] ローカルキャッシュ（`oishasan-navi:transport-cache`）からの読み込み
- [ ] `locales/ja.json` の `transport.*` キー

## 留意事項

- バス時刻表は遅延取得（REQUIREMENTS.md §7.1）。詳細画面を開いた時のみ取得し、`bus_routes` / `bus_stops` / `bus_timetables` をフェッチ。
- 病院詳細での絞り込みは `transport_services.service_area` 配列に病院の `city` が含まれるかで判定。
