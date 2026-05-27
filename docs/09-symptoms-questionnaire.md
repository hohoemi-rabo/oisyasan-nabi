# 09. 症状アンケート（ステップ形式）

**ステータス**: pending
**関連要件**: REQUIREMENTS.md §3.3.1
**依存**: 01・02・06
**ブロックする**: 10

## 目的

部位・期間・症状・しこりサイズ・持病・服薬・自由記述を、1 画面 1 質問のステップ形式で取得する。途中離脱しても再開できるよう、各ステップで AsyncStorage に保存する。

## 完了条件 (DoD)

- `/symptoms/questionnaire` で 1 質問 1 画面のステップ UI が動く。
- 全ステップにプログレスバー、戻るボタン、次へボタンがある。
- 「しこり」を選択した時のみ `lumpSize` ステップが表示される条件分岐が機能する。
- 入力は `useQuestionnaireStore` 経由でステップごとに AsyncStorage に保存される（`oishasan-navi:questionnaire-draft`）。
- 完了 → `router.push('/symptoms/results')`。

## Todo

- [ ] `app/symptoms/questionnaire.tsx` を作成（内部ステート or サブルートで複数ステップを管理）
- [ ] ステップ定義：location → duration → symptoms → (lumpSize) → conditions → medicine → memo → confirm
- [ ] 大きなチェックボックスコンポーネント `components/symptoms/big-checkbox.tsx`（最小 48dp）
- [ ] 複数選択 / 単一選択 / 自由記述 / トグルの 4 種を共通化
- [ ] `useQuestionnaireStore`（Zustand + AsyncStorage 永続化）：各フィールドのセッターと「下書きクリア」アクション
- [ ] プログレスバーコンポーネント
- [ ] 「しこり」選択時の `lumpSize` ステップ条件分岐
- [ ] 戻るボタンで前ステップ、最初のステップで戻るとアンケート開始確認モーダル
- [ ] confirm ステップで入力サマリーを表示し、「AI で判定する」ボタン
- [ ] `locales/ja.json` の `symptoms.questionnaire.*` キー

## 留意事項

- 入力を最大限拾えるよう、`symptoms` `location` は複数選択（最低 1 つ必須）。
- アンケート途中で別タブに移っても下書きが残り、戻ってきたら同じステップから再開できるようにする。`router` の state ではなく Zustand に持たせる。
- 完了後に下書きをクリアするかどうかは UX 検討。リトライ容易性のために `/symptoms/results` 表示まで残し、結果画面でリセットする方が無難。
