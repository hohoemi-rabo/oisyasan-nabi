# 15. ローカルキャッシュ + オフライン戦略

**ステータス**: done
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

- [×] `lib/cache.ts`：`CACHE_TTL_MS`/`FOREGROUND_REFRESH_MS`/`isFresh(loadedAt, ttl)`（get/set は zustand persist が担当＝重複実装せず）
- [×] hospitals + schedules の JOIN クエリ取得は既存 `hospitals-store.load()` に集約（別 `fetchX.ts` は作らず DRY 維持）
- [×] transport は `transport-services-store.load()`
- [×] 前月+当月+次月の `source_month` フィルタを `emergency-rotations-store.load()` に追加（`date-fns`）
- [×] アプリ起動時の一括フェッチ：`useCacheSync()`（root `_layout.tsx` にマウント）が全 hydrate 後に isFresh ガード付きで初回ロード（splash はブロックせず非同期）
- [×] `AppState` 監視でフォアグラウンド復帰検知 → 1h 経過なら `load(true)`（`useCacheSync` 内）
- [×] NetInfo 監視 → オフライン中はバッジ表示（`offline-badge.tsx` を `useNetInfo` で実装、絶対配置トップバー）
- [×] 設定画面の「データを更新」ボタン（`refreshAllCaches()` → 完了/失敗 Alert）
- [×] エラー時の挙動：自動更新はサイレント（error ログのみ・キャッシュ継続）、手動更新は結果 Alert

## 留意事項

- 初回起動時のフェッチが失敗するとアプリが空っぽになる。フォールバック（バンドル同梱の最小データセット）は未実装（将来検討）。各画面は error/empty 表示で対応。
- AsyncStorage は非同期 API。**zustand persist + `hasHydrated`** で復元し、`load()` は hydrate 前は no-op（キャッシュ復元前にネットワークしない＝オフライン優先）。
- **構造採用**: `lib/cache.ts` は TTL 判定のみ（get/set は zustand persist `createJSONStorage(AsyncStorage)`）。fetch は各 store `load(force?)` に集約（別 `fetchX.ts` 不要）。schedules は別キーにせず hospitals に JOIN して `oishasan-navi:hospitals-cache` に保存。キャッシュキー: `hospitals-cache`/`transport-cache`/`emergency-rotations-cache`。
- データ初期化（ticket 13）はキャッシュを消さない（公開データ・自動再取得されるため、消去対象は個人データの 4 store のみ）。
- `expo-file-system` の `File` で巨大 JSON をディスク保存する選択肢は将来検討（現状 110 件程度なので AsyncStorage で十分）。
