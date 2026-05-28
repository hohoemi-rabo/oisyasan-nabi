# 02. 多言語化（i18n）基盤

**ステータス**: done
**関連要件**: REQUIREMENTS.md §6.4 / §12.4
**依存**: 01
**ブロックする**: ほぼ全ての画面系チケット（05〜14、各画面で `t()` を使うため）

## 目的

Phase 1 は日本語のみだが、Phase 2 で英語追加できる構造を最初から組み込む。ハードコードされた文字列を一切残さず、`t('key')` 経由のみで UI を組む状態にする。

## 完了条件 (DoD)

- `src/i18n/index.ts` で `i18n-js` が初期化され、`expo-localization` で端末ロケールを検出している。Phase 1 は強制的に `ja` を使う実装でも、検出ロジックは存在する。
- `src/locales/ja.json` が機能チケット側で文言を埋めやすいキー階層で初期化されている（`onboarding`・`home`・`search`・`hospital`・`symptoms`・`emergency`・`transport`・`settings`・`common` 等の名前空間）。
- `src/locales/en.json` を空オブジェクト（または `ja.json` の構造だけコピー）として用意。
- `app/_layout.tsx` が起動時に i18n 初期化を待ってから子をマウントする。
- 型補完が効くよう、`t()` のキーを TypeScript の型としてユニオン化する仕組みを入れる（簡易でも可）。

## Todo

- [×] `npx expo install expo-localization` と `npx expo install i18n-js`（プロジェクト規約に従い `npx expo install` で統一）
- [×] `src/i18n/index.ts` で `I18n` インスタンスを作り、`expo-localization.getLocales()` の先頭を検出、`enableFallback: true` / `defaultLocale: 'ja'`、Phase 1 は `i18n.locale = 'ja'` で固定
- [×] `src/locales/ja.json`・`src/locales/en.json` を作成し、`common`/`home` の最低限キー + 9 namespace の枠を用意
- [×] `src/i18n/use-t.ts` で `useT` フックを提供（`t` も `index.ts` から直接 export、両方使える）
- [×] `ja.json` のキーから再帰型 `DottedKeys` で `TranslationKey` ユニオンを生成（外部スクリプト不要、保存と同時に追従）
- [×] `app/_layout.tsx` で `import '@/src/i18n'` の副作用初期化（i18n-js は同期初期化のため Provider 不要）
- [×] サンプル画面 `app/(tabs)/index.tsx` と `app/(tabs)/_layout.tsx` を `t('home.title')` 等で書き換えて動作確認

## 留意事項

- DB から取得する病院名・住所等の多言語化は Phase 2 で検討（カラム追加 or 翻訳 API）。Phase 1 では DB の値は無加工で表示する。
- 言語切替 UI は Phase 1 では非表示にする。設定画面の枠組みだけ用意する場合は `13-profile-settings.md` で扱う。
- 日付フォーマットは `date-fns` の `format` + `ja` ロケールに統一する（実装は表示する機能チケットで）。
- 検出ロケール (`getLocales()[0]?.languageCode`) は Phase 1 では未使用（`void` で参照のみ）。Phase 2 で `i18n.locale` に流す前提のフックを残してある。
- 実機での文言表示確認は ticket 06（ホーム本実装）着手時にまとめて行う。本チケットでは `tsc --noEmit` / `expo-doctor` / `npm run lint` の合格をもって完了。
