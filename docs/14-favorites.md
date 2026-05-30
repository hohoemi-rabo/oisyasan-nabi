# 14. かかりつけ医

**ステータス**: done
**関連要件**: REQUIREMENTS.md §3.9
**依存**: 01・02・08・13
**ブロックする**: なし

## 目的

最大 5 件のかかりつけ医をローカル保存し、ドラッグ&ドロップで並び替え、スワイプで削除できるようにする。病院詳細から登録/解除する。AI 結果のスコアリング（10）にも影響する。

## 完了条件 (DoD)

- `app/settings/favorites.tsx` で登録済みかかりつけ医が並び替え順で表示される。
- ドラッグで並び替え、スワイプで削除ができる。
- 病院詳細（08）の「かかりつけ医に登録」ボタンが、未登録なら追加、登録済みなら解除する。5 件上限。
- `hospitalScoring.ts`（10）で `+50` 加算ロジックがかかりつけ医を参照する。
- データは `oishasan-navi:favorites` に永続化される。

## Todo

- [×] `useFavoritesStore`（Zustand + AsyncStorage）：`items: Favorite[]`、`add(hospitalId)→{ok,reason}`、`remove(hospitalId)`、`reorder(hospitalIds[])`、`reset`（**先行チケットで実装済み**。`reorder` は id 配列方式、`isFavorite` はインライン `.some()`）
- [×] 型定義 `Favorite = { id; hospitalId; sortOrder; createdAt }`（実装済み）
- [×] 5 件上限チェック（`add` の `{ok,reason:'limit'}` + 病院詳細で `Alert`、`FAVORITES_LIMIT=5`）
- [×] `app/settings/favorites.tsx`：**上下ボタンで並び替え + 確認 Alert 付き削除ボタン**（`react-native-draggable-flatlist` は Reanimated v4.1 と非互換リスクのため不採用＝新規依存ゼロ・シニア向けに発見性が高い）
- [×] 病院詳細（08）からの登録/解除ボタン挙動（**先行実装済み**）
- [×] スコアリング連携（10）：`hospital-scoring.ts` が `favoriteIds` を参照、`results.tsx` が `useFavoritesStore` から Set 構築（**先行実装済み**）
- [×] 空状態の表示（登録なし + 病院詳細から登録できるヒント）
- [×] `locales/ja.json` の `favorites.*` キー（新規 namespace。病院詳細側は既存 `hospital.favorite.*`）
- [×] `src/components/settings/favorite-row.tsx`（1 行 UI：名前/市町村 + ↑↓🗑）

## 留意事項

- 並び替え後は `reorder(hospitalIds)` が `sortOrder` を再採番して保存（store 実装済み）。
- **`react-native-draggable-flatlist` は不採用**: 本プロジェクトは Reanimated v4.1（worklets 分離）で、同ライブラリは Reanimated 2/3 向けのため非互換リスクが高い。代わりに**上下ボタン + 削除ボタン**を採用（新規依存ゼロ、`GestureHandlerRootView` ラップ不要、シニア層に発見性が高くアクセシブル）。将来ドラッグ UX が必要なら Reanimated v4 対応の `react-native-reorderable-list` を検討。
- 5 件上限・各操作テキストは i18n キー化済み。
