# 15. ローカルキャッシュ + オフライン戦略

**ステータス**: pending
**関連要件**: REQUIREMENTS.md §4.3 / §7
**依存**: 01
**ブロックする**: 07・08・10・11・12（キャッシュ無しでは検索が動かない）

## 目的

病院マスタ・診療時間・交通サービス・救急ローテーションを AsyncStorage に 24h キャッシュし、起動・フォアグラウンド復帰・手動更新のタイミングで最新化する。オフラインでも主要機能を提供する。

## 完了条件 (DoD)

- `lib/cache.ts` に汎用キャッシュ管理（`get<T>(key)` / `set<T>(key, data)` / `isFresh(key, ttlMs)`）が実装されている。
- 初回起動時に hospitals / schedules / transport / emergency_rotations を一括取得しキャッシュ。
- 24 時間経過 or フォアグラウンド復帰（バックグラウンド 1h+）で再取得をバックグラウンド実行。
- 失敗時はキャッシュを使い続け、ユーザーには静かにエラーログのみ。
- `@react-native-community/netinfo` でオフライン検知。オフライン中はヘッダーバーに「オフライン中」バッジ。
- 設定画面に「データを更新」ボタン（手動更新）。

## Todo

- [ ] `lib/cache.ts`：型安全な get/set + `fetchedAt` 比較で 24h TTL 判定
- [ ] `lib/fetchHospitals.ts`：hospitals + schedules を JOIN クエリで取得
- [ ] `lib/fetchTransport.ts`
- [ ] `lib/fetchEmergencyRotations.ts`：前月+当月+次月の `source_month` で取得
- [ ] アプリ起動時の一括フェッチを `app/_layout.tsx` で実行（SplashScreen 表示中に完了させる戦略 or 非同期にして空 UI 表示）
- [ ] `AppState` 監視でフォアグラウンド復帰検知 → 1h 経過なら再フェッチ
- [ ] NetInfo 監視 → オフライン中はバッジ表示
- [ ] 設定画面の「データを更新」ボタン
- [ ] エラー時の挙動：トースト or サイレント（要件に合わせて選択）

## 留意事項

- 初回起動時のフェッチが失敗するとアプリが空っぽになる。フォールバック（バンドル同梱の最小データセット）も検討余地。
- AsyncStorage は同期 API ではないので、`useEffect` で読んで Zustand に流す。
- `expo-file-system` の `File` を使って巨大 JSON をディスク保存する選択肢もある（病院数が数千件超になれば検討）。
