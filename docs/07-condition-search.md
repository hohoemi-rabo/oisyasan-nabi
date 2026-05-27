# 07. 条件検索

**ステータス**: pending
**関連要件**: REQUIREMENTS.md §3.4
**依存**: 01・02・06・15（キャッシュ）・16（検索ログ）
**ブロックする**: 08（結果カードから詳細へ遷移するため、画面遷移先として必要）

## 目的

診療科・市町村・キーワード・設備フィルターで病院を絞り込む。フィルタリングはローカルキャッシュ上で実行し、オフラインでも動作させる。前回の検索条件を保存して再現可能にする。

## 完了条件 (DoD)

- 検索フォーム（キーワード + 診療科 20 科 + 市町村 14 自治体 + 設備 3 種）が動作する。
- 結果画面 `/search/results` で病院カードが一覧表示され、各カードに営業中バッジ・診療科ハイライト・住所が出る。
- 検索条件は AsyncStorage（`oishasan-navi:last-search-conditions`）に保存され、次回開いた時に復元される。
- 検索実行時に `search_logs` へ `log_type: 'search'` で INSERT される（16 と統合）。

## Todo

- [ ] `app/(tabs)/search.tsx` を検索フォーム入口にする（または別ファイル `app/search/index.tsx`）
- [ ] `app/search/results.tsx` を作成
- [ ] 診療科チェックボックスコンポーネント（`constants/departments.ts` を利用）
- [ ] 市町村チェックボックスコンポーネント（`constants/cities.ts`）
- [ ] 設備フィルター（バリアフリー / 駐車場 / 救急対応）
- [ ] キーワード入力（病院名の部分一致）
- [ ] `lib/searchHospitals.ts`：ローカルキャッシュ上の `Hospital[]` に対するフィルタリングロジック
- [ ] `lib/isCurrentlyOpen.ts`（Web 移植、営業中判定）
- [ ] 結果カードコンポーネント `components/hospital/hospital-card.tsx`
- [ ] 「前回の検索条件を復元」起動時の挙動
- [ ] `search_logs` への INSERT（チケット 16 と連携）
- [ ] `locales/ja.json` の `search.*` キー
- [ ] 0 件時のエンプティステート

## 留意事項

- 検索は同期処理でも問題ない規模（病院数は数百件）。ただし `useMemo` は React Compiler に任せる。
- 設備フィルターは AND 条件（全部満たす）で実装。
- 結果カードからのナビゲーションは `router.push({ pathname: '/hospital/[id]', params: { id } })`。
