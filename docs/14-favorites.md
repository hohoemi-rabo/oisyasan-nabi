# 14. かかりつけ医

**ステータス**: pending
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

- [ ] `useFavoritesStore`（Zustand + AsyncStorage）：`favorites: Favorite[]`、`add(hospitalId)`、`remove(id)`、`reorder(fromIndex, toIndex)`、`isFavorite(hospitalId)`
- [ ] 型定義 `Favorite = { id: string; hospitalId: string; sortOrder: number; createdAt: number }`
- [ ] 5 件上限チェック（add 時にエラートースト）
- [ ] `app/settings/favorites.tsx`：`react-native-draggable-flatlist` でドラッグ並び替え + スワイプ削除（`react-native-gesture-handler` の `Swipeable`）
- [ ] 病院詳細（08）からの登録/解除ボタン挙動
- [ ] スコアリング連携（10）：`hospitalScoring.ts` 内で `useFavoritesStore.getState()` を参照
- [ ] 空状態の表示
- [ ] `locales/ja.json` の `favorites.*` キー

## 留意事項

- ドラッグ並び替え後は `sortOrder` を再採番して保存（再描画時の安定性のため）。
- `react-native-draggable-flatlist` を `npx expo install` で追加。Reanimated v4 互換版を確認。
- 5 件上限のテキストは i18n キー化。
