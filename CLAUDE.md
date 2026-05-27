# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## プロジェクトの状態

このリポジトリは `create-expo-app` で生成されたテンプレートのままです。`REQUIREMENTS.md` に Phase 1 MVP「お医者さんナビ」（南信地域向け医療機関ナビ Android アプリ）の詳細な要件定義があり、これから本実装が始まります。新規実装に着手する前に `REQUIREMENTS.md` を参照してください。テンプレートに含まれる `app/(tabs)/index.tsx`・`app/(tabs)/explore.tsx`・`app/modal.tsx`・`components/hello-wave.tsx`・`components/parallax-scroll-view.tsx` などはサンプルであり、機能実装時に置き換える前提です。`npm run reset-project` を実行するとテンプレートを `app-example/` に退避し、空の `app/` を作り直せます。

## よく使うコマンド

| 用途 | コマンド |
| --- | --- |
| 依存インストール | `npm install` |
| 開発サーバー起動（Metro） | `npm start` または `npx expo start` |
| Android で起動 | `npm run android` |
| iOS で起動 | `npm run ios`（参考用。配布対象は Android のみ） |
| Web で起動 | `npm run web` |
| Lint | `npm run lint`（`expo lint` = ESLint 9 + `eslint-config-expo` の flat config） |
| テンプレートを退避して空 app/ を作る | `npm run reset-project` |

テスト用のスクリプトは未設定です。導入する場合は `package.json` の `scripts` と合わせて Jest（`jest-expo`）等の構成を追加してください。

## アーキテクチャ要点

- **Expo SDK 54 / React Native 0.81 / React 19 / TypeScript 5.9（strict）**。`AGENTS.md` の指示通り、コードを書く前に <https://docs.expo.dev/versions/v54.0.0/> の該当 API を必ず確認してください。SDK 54 では既存の知識が古い可能性があります。
- **New Architecture 有効**（`app.json` の `newArchEnabled: true`）。Reanimated v4・`react-native-worklets` 前提で書きます。
- **React Compiler 有効**（`app.json` の `experiments.reactCompiler: true`）。手動の `useMemo` / `useCallback` は基本不要。明示的にメモ化が必要な根拠がある時だけ追加してください。
- **Typed Routes 有効**（`experiments.typedRoutes: true`）。`expo-router` の `href` は文字列リテラルから自動的に型付けされます。新しいルートを追加したら型が再生成されるよう dev server を再起動してください。
- **ルーティングは Expo Router の file-based routing**。エントリーポイントは `package.json` の `"main": "expo-router/entry"`。
  - `app/_layout.tsx` がルートの Stack。`(tabs)` を anchor として宣言し、`modal` を `presentation: 'modal'` で開く構成。
  - `app/(tabs)/_layout.tsx` がボトムタブ。タブボタンは `HapticTab` で触覚フィードバック、アイコンは `IconSymbol`（iOS は SF Symbols / Android・Web は Material Icons へのマップ）。
- **パスエイリアス `@/*` → リポジトリ直下**（`tsconfig.json`）。`@/components/...`・`@/hooks/...`・`@/constants/...` を優先し、相対パスを混在させないでください。
- **テーマ／配色**は `constants/theme.ts` の `Colors` と `hooks/use-color-scheme.ts`（Web 用は `.web.ts` で分岐）、`hooks/use-theme-color.ts`、`components/themed-text.tsx`・`themed-view.tsx` で集中管理。色やフォントは直書きせず Themed 系コンポーネント／フックを通します。

## REQUIREMENTS.md に書かれた実装方針（要点）

実装に入る前に `REQUIREMENTS.md` 全文を確認してください。特に外せない方針は以下です。

- **対象は Android のみ**（Google Play 配布、EAS Build / EAS Update）。iOS スクリプトはテンプレートの名残です。
- **追加予定のスタック**: NativeWind、Zustand、`@react-native-async-storage/async-storage`、`@supabase/supabase-js`（Anon Key + RLS 前提）、`expo-localization` + `i18n-js`、`date-fns`、`react-native-calendars`。導入時は Expo SDK 54 と互換のあるバージョンを `npx expo install` で固定してください。
- **AI 判定は Cloudflare Workers 経由で Gemini API を呼び出す**。Gemini の API キーをクライアントに置かないこと。
- **i18n は Phase 1 でも構造を最初から組み込む**（Phase 1 は日本語のみだが Phase 2 で英語追加）。文字列はキー化して定義します。
- **個人情報のサーバー保存は行わない**。プロフィール・かかりつけ医・キャッシュは AsyncStorage に保存。
- **Supabase は既存プロジェクト `byouin-nabi` を共有**（病院マスタ・スケジュール・交通サービス等）。`.mcp.json` で Supabase MCP サーバーが構成されています。スキーマ変更前に `list_tables` で既存構造を確認してから `apply_migration` を使ってください。

## Expo SDK 54 ベストプラクティス

context7 MCP（`/expo/expo` の `sdk-54` ブランチ）で公式ドキュメントを参照しながら抽出した、本プロジェクトに直接効く要点です。コード生成前に同 MCP で当該 API の最新版を必ず再確認してください。

### SDK 54 のハイライト（前提として把握しておく）

- React 19.1 / React Native 0.81.5 / Hermes 既定 / New Architecture 既定。**SDK 52 以降は New Arch がデフォルト ON**。`newArchEnabled: false` で意図的に無効化されていない限り、Reanimated v4 と worklets v0.5 を前提に書きます。
- `expo-file-system` が **新クラスベース API（`File` / `Directory` / `Paths`）にリプレース**。`/next` サブパスは廃止され通常パスに統合されました。レガシー API（`FileSystem.readAsStringAsync` 等）は互換ブリッジ目的のみ。新規実装では下記「`expo-file-system`」項を参照。
- `expo-sqlite` で**拡張ローダブル**（例: `sqlite-vec` がプリバンドル）。AI 判定ログ等のローカルベクトル検索が必要になれば `db.loadExtensionAsync('sqlite-vec')` で利用可。
- `expo-splash-screen` の**新 API**が標準。`app.json` の plugin 設定で完結し、ネイティブコードに手を入れる必要なし（ベアプロジェクト化した場合の旧 `MainActivity` への `SplashScreen.show()` 直書きは撤去）。
- `expo/fetch` がストリーミング対応の標準 fetch として推奨。SSE 受信や AI レスポンスのストリームに使えます。

### React Compiler

- `app.json` の `experiments.reactCompiler: true` で有効化済み。**手動の `useMemo` / `useCallback` / `React.memo` は原則書かない**（コンパイラが自動最適化）。書く時は「コンパイラがバイパスする確証があり、計測で効果が確認できた」場合だけ、理由をコメントとして残してください。
- 副作用フックの依存配列は React 19 の規約に合わせて正確に。コンパイラは正しい依存があってこそ最適化できます。

### New Architecture / Reanimated v4

- すべてのアニメーションは Reanimated v4 + `react-native-worklets` で書きます。`Animated`（旧 API）の新規利用は避け、既存テンプレートの `HelloWave` 等を真似て `useSharedValue` + `useAnimatedStyle` + `withTiming/withSpring` パターンを使ってください。
- ネイティブモジュールに JSI 経由で同期アクセスする系（`react-native-mmkv` 等）を採用する場合も New Arch 対応版をインストールします（`npx expo install` で互換版に固定）。

### Expo Router（file-based routing）

- ファイル配置がそのままルートツリーになります。`app/_layout.tsx` がルートの `Stack`、`app/(tabs)/_layout.tsx` がタブグループ。`(group)` は URL に出ないグルーピング、`[param]` は動的セグメント、`[...slug]` はキャッチオール。
- **ナビゲーション**は宣言的（`<Link href="/path">`）を基本に、必要時のみ命令的（`import { router } from 'expo-router'; router.push('/symptoms')`）。`router.replace` / `router.back` / `router.navigate({ pathname, params })` を使い分けます。
- **動的ルートの params 取得は `useLocalSearchParams`** を既定にしてください。`useGlobalSearchParams` は親スタック画面でも最新の URL params を購読し続けるため、再レンダーが想定外に増えます。受診履歴等の詳細画面では `useLocalSearchParams` で十分です。
- **モーダル**は親レイアウトの `<Stack.Screen name="..." options={{ presentation: 'modal' }} />` で宣言。既に root の `app/_layout.tsx` がこの形になっているので、緊急ガイドやかかりつけ医追加など割り込み UI はこのパターンに合わせます。
- **deep link 安定化**には `unstable_settings` の `anchor` / `initialRouteName` を使い、深い URL から開いても起点画面（タブ等）が必ずスタックに入るようにします。例: `app/(tabs)/feed/_layout.tsx` で `export const unstable_settings = { initialRouteName: 'index' }`。
- **Typed Routes 有効**につき、`href` は型チェック対象です。ルート追加・リネーム後は dev server を再起動して `expo-env.d.ts` の再生成を促してください（このファイルは gitignore 済み）。
- `redirect` プロパティや `<Redirect href="..." />` で認証ゲートを表現できます。本プロジェクトはサーバー認証なしですが、オンボーディング未完了時の `/onboarding` への送りに使えます。

### Asset 管理（画像・フォント・スプラッシュ）

- 画像は **`expo-image` の `<Image>`** を使う（`react-native` の `Image` ではなく）。`contentFit`（`cover` / `contain` / `fill`）と `cachePolicy`（既定 `disk`、頻繁に差し替わる遠隔資産は `memory-disk`）を明示します。ローカル PNG は `require('@/assets/...')`、リモートは `{ uri: ... }`。
- フォントは `expo-font` の `useFonts` で読み込み、`expo-splash-screen` の `SplashScreen.preventAutoHideAsync()` → 読み込み完了後に `SplashScreen.hideAsync()` する標準パターン。`app.json` の `expo-splash-screen` plugin 設定（既にあり）でアイコン・背景色を制御します。
- アイコンは既に同梱の `@expo/vector-icons` を使用。iOS では `IconSymbol`（SF Symbols）にフォールバックする構成が `components/ui/icon-symbol.*.tsx` で実装されています。

### `expo-file-system`（新 API）

```ts
import { File, Directory, Paths } from 'expo-file-system';

const file = new File(Paths.document, 'hospitals-cache.json');
if (!file.exists) file.create();
file.write(JSON.stringify(data));
const text = file.text();
```

- AsyncStorage に向かないサイズ（病院マスタの JSON キャッシュ等）は `Paths.document` または `Paths.cache` に書き出します。`Paths.cache` は OS によって随時消える可能性がある前提で。
- ダウンロードは `await File.downloadFileAsync(url, destination)`。レガシー `FileSystem.downloadAsync` は新規実装で使わないでください。
- ストリーミング受信は `import { fetch } from 'expo/fetch'` → `await response.bytes()` → `file.write(bytes)`。

### EAS Build / EAS Update（配布パイプライン）

- `eas-cli` はグローバルではなく `npx eas-cli ...` で十分。`eas.json` を作る際は **`development` / `preview` / `production` の 3 プロファイル**を基本に、共通設定を `base` に切り出して `extends` で継承する形にします（参考: 公式 `eas-json` ページ）。
- 環境変数は **EAS サーバー側に環境（development / preview / production）として登録** → `eas.json` の各プロファイルで `"environment": "production"` のように参照する方式を推奨（Anon Key・Cloudflare Workers の URL 等をクライアントに焼き込まない）。
- OTA は EAS Update。ネイティブを含まない軽微な修正（文言・i18n キー・診療科リスト等）は OTA で配信可能。ネイティブモジュール追加時は必ず再ビルドが必要です。

### 開発時の確認手順

- 新規 API を使う前に context7 MCP で `/expo/expo/__branch__sdk-54` を参照（一般 web 検索より優先）。書きかけのコードを SDK 53 以前の知識で埋めない。
- `npx expo install --check` で依存バージョンの不整合を検出できます。`expo-doctor` も SDK 54 互換チェックに有用です。
- パッケージ追加時は **必ず `npx expo install <pkg>`**。`npm install` 直叩きは非互換バージョンが入ります。

## 開発の進め方メモ

- 個人開発リポジトリです。グローバルルール通り `main` へ直接コミットし、ブランチは切りません。
- コミットメッセージは Conventional Commits（`feat:` / `fix:` / `docs:` / `refactor:` / `test:` / `chore:`）を英語で。
- 新しい依存関係を追加するときは必ず `npx expo install <pkg>` を使い、SDK 54 互換版にピン留めします。`npm install` で直接入れると非互換バージョンが入ることがあります。
