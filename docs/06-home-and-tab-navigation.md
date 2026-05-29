# 06. ホーム画面 + ボトムタブナビゲーション

**ステータス**: done
**関連要件**: REQUIREMENTS.md §3.2 / §6.2
**依存**: 01・02・05
**ブロックする**: 07・09・11・12・13

## 目的

5 タブ構成（ホーム / 探す / 緊急 / 通院 / 設定）のボトムナビを確立し、ホーム画面に主要 3 機能への大ボタンを配置する。

## 完了条件 (DoD)

- `app/(tabs)/_layout.tsx` が以下 5 タブを定義し、テンプレートの 2 タブから差し替わっている。
  - ホーム（`index`）／探す（`search`）／緊急（`emergency`）／通院（`transport`）／設定（`settings`）
- ホーム画面に 3 大ボタン（症状検索 / 条件検索 / 緊急時）+ 通院ショートカット小ボタンが配置されている。
- 各タブのアイコンは `@expo/vector-icons` または `IconSymbol` 経由。タップ領域 48dp 以上。
- ヘッダー色・タブバー色は `constants/colors.ts` 経由。

## Todo

- [×] `app/(tabs)/_layout.tsx` を 5 タブ構成に書き換える（5 つの `Tabs.Screen` を `t('tabs.*')` で命名、`IconSymbol` でアイコン指定）
- [×] `app/(tabs)/index.tsx`（ホーム）：タイトル + サブタイトル + 3 大ボタン + 通院ショートカット
- [×] `app/(tabs)/search.tsx`（プレースホルダ、本実装は ticket 07）
- [×] `app/(tabs)/emergency.tsx`（プレースホルダ、本実装は ticket 11）
- [×] `app/(tabs)/transport.tsx`（プレースホルダ、本実装は ticket 12）
- [×] `app/(tabs)/settings.tsx`（プレースホルダ、本実装は ticket 13）
- [×] テンプレートの `explore.tsx` を削除（ticket 01 で実施済み）
- [×] 「症状から病院を探す」ボタン → `router.push('/symptoms/questionnaire')`（プレースホルダルート `app/symptoms/{_layout,questionnaire}.tsx` も同時に作成）
- [×] 「条件で病院を探す」ボタン → `router.push('/search')`（タブ切替）
- [×] 「緊急時・休日当番医」ボタン → `router.push('/emergency')`（タブ切替）
- [×] 「今日の通院サービス」ショートカット → `router.push('/transport')`（タブ切替）
- [×] `locales/ja.json` に `home.*` を再構築（symptoms/search/emergency/transport/placeholder）+ `tabs.*` を新設
- [×] オフラインバッジ表示用の枠を `app/_layout.tsx` 上部に確保（`<OfflineBadge />` を `return null` で配置、実装本体は ticket 15）

## 実装メモ

### 5 タブ構成

`app/(tabs)/_layout.tsx` で 5 つの `Tabs.Screen` を定義。アイコン名（SF Symbol → Material Icons マップ）:

| タブ | SF Symbol 名 | Material Icons |
| --- | --- | --- |
| home | `house.fill` | `home` |
| search | `magnifyingglass` | `search` |
| emergency | `cross.case.fill` | `emergency` |
| transport | `bus.fill` | `directions-bus` |
| settings | `gearshape.fill` | `settings` |

ticket 06 で `components/ui/icon-symbol.tsx` の `MAPPING` に 4 エントリ（`magnifyingglass` / `cross.case.fill` / `bus.fill` / `gearshape.fill` / `stethoscope`）を追加。`IconSymbolName` 型を `export type` で外出しし、`home-action-button.tsx` が参照。

### ホーム画面の構成

`SafeAreaView edges={['top']}` + `ScrollView` で縦並び:
- ヘッダー: タイトル（3xl bold）+ サブタイトル（sm gray）
- 3 大ボタン（`HomeActionButton` を 3 回呼ぶ）
- 通院ショートカット行（薄背景の白カード、右に chevron）

3 大ボタンの色割り（`src/constants/colors.ts` の `BrandColors`）:
- 症状から（AI）: `BrandColors.primary` `#0a7ea4`（teal）
- 条件で（フィルタ）: `BrandColors.info` `#2563eb`（blue）
- 緊急時: `BrandColors.emergency` `#d92d20`（red）

通院ショートカットのアイコン背景: `BrandColors.success` `#16a34a`。

### 共通 UI コンポーネント

- `src/components/common/home-action-button.tsx`: 96dp 高さの色付き大ボタン。左にアイコン円、右にタイトル + サブタイトル（任意）。`accessibilityRole="button"` + `accessibilityLabel=title`。
- `src/components/common/screen-placeholder.tsx`: `t('home.placeholder', { ticket: 'NN' })` で「ticket NN で本実装」と表示する中央配置のプレースホルダ。4 タブ + symptoms の計 5 ファイルから再利用。
- `src/components/common/offline-badge.tsx`: 現状 `return null`。ticket 15 で `@react-native-community/netinfo` 連携の実装を入れる。`app/_layout.tsx` の `<ThemeProvider>` 内、`<Stack>` の直前に常駐。

### Typed Routes と症状ルート

`/symptoms/questionnaire` への遷移は Typed Routes で型チェックされるため、実体ファイル `app/symptoms/_layout.tsx`（Stack）+ `app/symptoms/questionnaire.tsx`（プレースホルダ）を本ティケットで作成。ticket 09 が中身を差し替える。

### i18n キーの変更点

- 削除: `home.setupComplete`、`home.tabLabel`
- 追加: `home.subtitle`、`home.symptoms.{title,subtitle}`、`home.search.{title,subtitle}`、`home.emergency.title`、`home.transport.title`、`home.placeholder`、`tabs.{home,search,emergency,transport,settings}`
- 補間: `t('home.placeholder', { ticket: '07' })` で `{{ticket}}` を埋める

### オフラインバッジの位置

`<ThemeProvider>` 直下、`<Stack>` の前。SafeAreaProvider 内で動くので各画面の SafeArea inset とは独立。現状 `null` なのでレイアウト影響なし。

## 留意事項

- タブのラベルは i18n キー経由。
- 「症状から探す」と「条件で探す」を別々の大ボタンにするか、「探す」タブ内で 2 択にするかは UI 検討事項。REQUIREMENTS.md §3.2 の図に従い、ホームでは別々のボタンとする。
- React Compiler 有効のため、ボタンコンポーネントの手動メモ化は不要。
- 実機での動作確認は ticket 10 着手時の総合検証で実施。本ティケットは静的検証（tsc / lint / expo-doctor 18/18）+ Metro バンドル HTTP 200（9.4 MB）で完了とした。
