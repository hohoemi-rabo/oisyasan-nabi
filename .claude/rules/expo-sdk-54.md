---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
  - "app.json"
  - "app.config.*"
  - "eas.json"
  - "package.json"
  - "tsconfig.json"
  - "babel.config.*"
  - "metro.config.*"
---

# Expo SDK 54 + 本プロジェクトのアーキテクチャ規約

コードを書く前に `AGENTS.md` の指示通り <https://docs.expo.dev/versions/v54.0.0/> または context7 MCP（`/expo/expo/__branch__sdk-54`）で当該 API の最新版を確認してください。SDK 54 では既存の知識が古い可能性があります。

## ランタイム前提

- **Expo SDK 54 / React Native 0.81 / React 19.1 / TypeScript 5.9（strict）** / Hermes 既定。
- **New Architecture 既定 ON**（`app.json` の `newArchEnabled: true`）。Reanimated v4・`react-native-worklets` v0.5 前提でアニメーションを書く。
- **React Compiler 有効**（`experiments.reactCompiler: true`）。手動の `useMemo` / `useCallback` / `React.memo` は原則書かない（コンパイラが自動最適化）。書く時は計測で効果が確認できた根拠をコメントに残す。副作用フックの依存配列は React 19 規約に合わせて正確に。
- **Typed Routes 有効**（`experiments.typedRoutes: true`）。`expo-router` の `href` は型チェック対象。ルート追加・リネーム後は dev server を再起動して `expo-env.d.ts` を再生成（gitignore 済み）。

## ルーティング（Expo Router）

- エントリーポイント `package.json` の `"main": "expo-router/entry"`。`app/` ディレクトリがそのままルートツリー。
- 規約: `(group)` は URL に出ないグルーピング、`[param]` は動的セグメント、`[...slug]` はキャッチオール。
- ナビゲーションは宣言的（`<Link href="/path">`）を基本に、必要時のみ命令的（`import { router } from 'expo-router'; router.push('/symptoms')`）。`router.replace` / `router.back` / `router.navigate({ pathname, params })` を使い分ける。
- **動的ルートの params 取得は `useLocalSearchParams` を既定にする**。`useGlobalSearchParams` は親スタック画面でも最新の URL params を購読し続けるため、再レンダーが想定外に増える。
- **モーダル**は親レイアウトの `<Stack.Screen name="..." options={{ presentation: 'modal' }} />` で宣言。
- **deep link 安定化**には `unstable_settings` の `anchor` / `initialRouteName` を使う。深い URL から開いても起点画面が必ずスタックに入るようにする。
- 認証ゲート / オンボーディング未完了の送り出しは `<Redirect href="..." />` か `redirect` prop。

## ディレクトリ・パスエイリアス

- パスエイリアス `@/*` → リポジトリ直下（`tsconfig.json`）。`@/components/...`・`@/hooks/...`・`@/constants/...` を優先し、相対パスを混在させない。
- `src/` 配下の構成（チケット 01 で整備）: `components/`・`stores/`（Zustand）・`lib/`・`types/`・`constants/`・`locales/`・`i18n/`。
- テーマ／配色は `constants/theme.ts` の `Colors` と `hooks/use-color-scheme.ts`（Web 用は `.web.ts` で分岐）、`hooks/use-theme-color.ts`、`components/themed-text.tsx`・`themed-view.tsx` で集中管理。色やフォントは直書きせず Themed 系コンポーネント／フックを通す。

## SDK 54 のハイライト（API 選定）

- **`expo-file-system` は新クラスベース API（`File` / `Directory` / `Paths`）**。`/next` サブパスは廃止され通常パスに統合。レガシー API（`FileSystem.readAsStringAsync` 等）は互換ブリッジ目的のみ。

  ```ts
  import { File, Directory, Paths } from 'expo-file-system';
  const file = new File(Paths.document, 'hospitals-cache.json');
  if (!file.exists) file.create();
  file.write(JSON.stringify(data));
  ```

  ダウンロードは `await File.downloadFileAsync(url, destination)`。ストリーミング受信は `import { fetch } from 'expo/fetch'` → `await response.bytes()` → `file.write(bytes)`。
- **`expo-sqlite` で拡張ローダブル**（例: `sqlite-vec` がプリバンドル）。`db.loadExtensionAsync('sqlite-vec')` でローカルベクトル検索が可。
- **`expo-splash-screen` の新 API**が標準。`app.json` の plugin 設定で完結し、ネイティブコードに手を入れる必要なし。
- **`expo/fetch`** がストリーミング対応の標準 fetch として推奨。AI ストリーム受信や SSE に。

## Asset 管理

- 画像は **`expo-image` の `<Image>`** を使う（`react-native` の `Image` ではなく）。`contentFit`（`cover` / `contain` / `fill`）と `cachePolicy`（既定 `disk`、頻繁に差し替わる遠隔資産は `memory-disk`）を明示。ローカル PNG は `require('@/assets/...')`、リモートは `{ uri }`。
- フォントは `expo-font` の `useFonts` で読み込み、`SplashScreen.preventAutoHideAsync()` → 読み込み完了後に `SplashScreen.hideAsync()` する標準パターン。
- アイコンは `@expo/vector-icons` を使用。iOS では `IconSymbol`（SF Symbols）にフォールバックする構成が `components/ui/icon-symbol.*.tsx` に実装済み。

## EAS Build / EAS Update

- `eas-cli` はグローバルではなく `npx eas-cli ...` で十分。`eas.json` は **`development` / `preview` / `production` の 3 プロファイル**を `base` から `extends` で継承する形にする。
- 環境変数は **EAS サーバー側に環境（development / preview / production）として登録** → `eas.json` の各プロファイルで `"environment": "production"` のように参照（Anon Key・Cloudflare Workers の URL 等をクライアントに焼き込まない）。
- OTA は EAS Update。ネイティブを含まない軽微な修正（文言・i18n キー・診療科リスト等）は OTA 配信可。ネイティブモジュール追加時は再ビルド必須。

## 依存追加・バージョン管理

- **依存追加は必ず `npx expo install <pkg>`**。`npm install` 直叩きは SDK 54 非互換版を引きやすい。
- `npx expo install --check` で依存バージョンの不整合を検出。`expo-doctor` も SDK 54 互換チェックに有用。
- ネイティブモジュールを含むパッケージは New Architecture 対応版を選択（Reanimated v4・worklets v0.5 互換）。
