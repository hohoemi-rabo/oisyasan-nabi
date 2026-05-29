# 07. 条件検索

**ステータス**: done
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

- [×] `app/(tabs)/search.tsx` を検索フォーム入口にする（プレースホルダから本実装に置換）
- [×] `app/search/results.tsx` を作成
- [×] 診療科チェックボックスコンポーネント（`FilterChip` を 20 科で展開、`src/constants/departments.ts` 利用）
- [×] 市町村チェックボックスコンポーネント（14 自治体 + 「区域外」を `FilterChip` で展開）
- [×] 設備フィルター（バリアフリー / 駐車場 / 救急対応）— インライン Pressable トグル
- [×] キーワード入力（病院名の部分一致）— `TextInput`
- [×] `lib/searchHospitals.ts`：ローカル `Hospital[]` に対するフィルタリングロジック（`src/lib/search-hospitals.ts`）
- [×] `lib/isCurrentlyOpen.ts`（Web 移植、`src/lib/is-currently-open.ts`、Date.getDay() + 分換算）
- [×] 結果カードコンポーネント `src/components/hospital/hospital-card.tsx`（営業中バッジ + 診療科ハイライト + 住所、最大 4 タグ + "+N"）
- [×] 「前回の検索条件を復元」起動時の挙動（`useSearchConditionsStore` の persist + hasHydrated）
- [×] `search_logs` への INSERT（`src/lib/search-log.ts` の `logSearch('search', conditions, area)` を `/search/results` マウント時に fire-and-forget）
- [×] `locales/ja.json` の `search.*` キー（title / keyword / departments / cities / facilities / submit / clear / results.*）
- [×] 0 件時のエンプティステート（メッセージ + 「条件を変更する」→ `router.back()`）

## 実装メモ

### データロード戦略（ticket 15 への引き継ぎ）

- `useHospitalsStore`（Zustand、persist なし）が `/search/results` マウント時に Supabase から 110 件 + 紐づく schedules を 1 回ロード。
- 現状はアプリ再起動で再フェッチ（オフライン初回は空表示 + 再試行）。
- ticket 15 で `persist` + `loadedAt` ベースの 24h TTL を上に被せる前提。`HospitalsState` の API（`data` / `loadedAt` / `isLoading` / `error` / `load()`）は変えずに済む形にしてある。

### 検索ログ送信（ticket 16 への引き継ぎ）

- `src/lib/search-log.ts` の `logSearch(logType, searchData, area?)` を直接呼ぶ実装。`supabase.from('search_logs').insert(...)` を fire-and-forget でラップ。
- RLS は anon に INSERT 許可（MCP で確認: `Anon and authenticated can insert search_logs`）。SELECT は admin のみで、アプリ側からは見えない。
- ticket 16 が拡張ラッパ（バッチ送信 / 重複防止 / 端末識別の匿名化など）を入れる場合、本関数は移行用シグネチャをそのまま維持。

### 20 科 vs DB 70+ カテゴリの乖離

- `hospital.category` は DB 上 70+ 種類（"美容皮膚科" / "呼吸器科" / "アレルギー科" / "心臓血管外科" 等）。
- canonical 20 科（`src/constants/departments.ts` = `workers/src/master-data.ts` ALL_DEPARTMENTS）と完全一致 array overlap でフィルタするため、"美容皮膚科" しか持たない病院は「皮膚科」チェックではヒットしない（既知制約）。
- Phase 2 で normalization テーブル（例: 細分化カテゴリ → 内包する canonical 科のマッピング）を検討。

### ファイル構成

```
src/
├── types/hospital.ts                 # Hospital, HospitalSchedule, SearchConditions, EMPTY_CONDITIONS
├── lib/
│   ├── is-currently-open.ts          # Date.getDay() + 分換算で営業中判定
│   ├── search-hospitals.ts           # 純粋関数フィルタ
│   └── search-log.ts                 # fire-and-forget INSERT
├── stores/
│   ├── hospitals-store.ts            # 110 件 + schedules を 1 度ロード（persist なし）
│   └── search-conditions-store.ts    # persist あり、hasHydrated + setter 群
└── components/
    ├── common/filter-chip.tsx        # 診療科・市町村の複数選択チップ
    └── hospital/hospital-card.tsx    # 結果カード（営業中バッジ + 診療科ハイライト）

app/
├── (tabs)/search.tsx                 # 検索フォーム（本実装）
├── search/
│   ├── _layout.tsx                   # Stack（headerShown: true）
│   └── results.tsx                   # FlatList + ローディング/エラー/エンプティ
└── hospital/
    ├── _layout.tsx                   # Stack
    └── [id].tsx                      # ticket 08 のプレースホルダ
```

### 結果画面の状態遷移

- `isLoading && data.length === 0` → スピナー + "読み込み中…"
- `error` → エラー文 + "再試行" ボタン
- `results.length === 0` → エンプティ + "条件を変更する"（戻る）
- それ以外 → `<FlatList>` で `<HospitalCard>` 列挙、ヘッダー `{count}件見つかりました`

### 検証結果

- `tsc --noEmit` / `npm run lint` / `expo-doctor` 18/18 ✓
- Metro Android バンドル HTTP 200（10.6 MB、検索ロジック分で前回比 +1.2 MB）
- Supabase MCP で実機検索後の `search_logs` 確認は実機検証フェーズに委譲

## 留意事項

- 検索は同期処理でも問題ない規模（病院数は 110 件）。React Compiler 有効なので `useMemo` も任せる方針だが、`results` の派生だけは依存が明確かつ大きいので明示 `useMemo`。
- 設備フィルターは AND 条件（全部満たす）で実装。
- 結果カードからのナビゲーションは `router.push({ pathname: '/hospital/[id]', params: { id } })`。
- 実機での文言・タップ感の確認は ticket 10 着手時の総合検証パスで実施。本ティケットは静的検証 + バンドル成功で完了。
