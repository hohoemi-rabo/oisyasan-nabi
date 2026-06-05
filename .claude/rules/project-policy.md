---
paths:
  - "app/**"
  - "src/**"
  - "components/**"
  - "hooks/**"
  - "constants/**"
  - "docs/**/*.md"
  - "REQUIREMENTS.md"
---

# プロジェクト固有ポリシー（お医者さんナビ Phase 1）

REQUIREMENTS.md の全文は一次ソースとして必ず保持してください。本ファイルは実装時に絶対に外せない方針だけを抽出したサマリです。両者で齟齬が出た場合は REQUIREMENTS.md を正とします。

## スコープ・対象

- **配布対象は Android のみ**（Google Play 配布、EAS Build / EAS Update）。iOS スクリプトはテンプレートの名残で、新規実装の対象外。
- **認証なし**。プロフィール・かかりつけ医・キャッシュは AsyncStorage にローカル保存（個人情報のサーバー保存は行わない）。
- **既存 Web サービス「病院ナビ南信」とは別系統のアプリ**。ターゲットはシニア層 + リニア移住者・在住外国人・短期滞在者へ拡張。

## 採用スタック（ticket 01〜03 で導入済み）

導入時は Expo SDK 54 と互換のあるバージョンを **必ず `npx expo install` でピン留め**してください。

- **NativeWind v4 + Tailwind v3** でスタイリング（`global.css`・`tailwind.config.js`・`babel.config.js`・`metro.config.js` 設定済み）
- **立体的医療UI のデザインシステム**（`DESIGN-GUIDELINES.md` 準拠、全画面適用済み）:
  - 画面背景は `bg-bg`（#EEF3F8、純白にしない）、カード面は `bg-surface`、境界は `border-line`、文字は `text-ink-{900..300}`（`tailwind.config.js` の追加トークン）。ブランド各色（teal/blue/red/green/amber/pink/purple）は Tailwind 既定がガイドライン hex とほぼ一致するため使い分ける。
  - **影は className 不可** → `src/constants/shadows.ts`（`shadows.card`/`sm`/`lift`・`coloredShadow(hex)`）を inline `style` で適用。カードは原則 `style={shadows.card}` + `bg-surface` + `rounded-[18px]` + `border-line`。
  - **グラデは `expo-linear-gradient`**。ヒーロー3種は `src/components/common/hero-button.tsx`（`heroGradients` teal/blue/red + カラー影）、119 も赤グラデ。
  - **診療科タグ/アクセントは `src/constants/dept-colors.ts`**（`deptTagColor`/`deptAccentColor`）で色分け。状態は色のみに依存しない（`StatusPill` はドット+文字、`UrgencyBadge` はアイコン+文字）。
  - **アイコンは Ionicons（`@expo/vector-icons`）に統一。絵文字は使用禁止**（タブ・行・ボタン全て Ionicons）。**選択/トグル状態の色は teal**（FilterChip と統一）。
  - フォントは OS 標準（Noto Sans JP は一度入れたが撤去済み。weight は `font-bold`/`font-black` 等で指定）。
- **Zustand** で状態管理。persist 系：個人データ（`profile-store`・`favorites-store`・`search-conditions-store`）と、ローカルキャッシュ（`hospitals-store`・`transport-services-store`・`emergency-rotations-store`、ticket 15 で persist + 24h TTL + `hasHydrated` + `load(force?)` を付与済み）。**`questionnaire-store` は永続化しない**（症状アンケートは毎回まっさらで開始する方針。ホームの「症状から探す」押下で `clearDraft()`、`hasHydrated` は常に true のダミー）。キャッシュの鮮度判定は `src/lib/cache.ts` の `isFresh`、起動/復帰/手動の最新化は `src/hooks/use-cache-sync.ts`
- **`@react-native-async-storage/async-storage`** でローカルキャッシュ・プロフィール・かかりつけ医
- **`@supabase/supabase-js`** クライアントは `src/lib/supabase.ts`（Anon Key + RLS 前提、サービスロールはアプリに渡さない）
- **`expo-localization` + `i18n-js`** で多言語化。`import { t } from '@/src/i18n'` か `useT()` フック。`TranslationKey` 型は `src/locales/ja.json` から自動派生（再帰型）。
- **`date-fns`**・**`react-native-calendars`**（救急ローテのカレンダー UI）
- **`@react-native-community/netinfo`**（オフライン検知）
- React Query は **Phase 1 では入れない**（AsyncStorage キャッシュ + 必要時再フェッチで十分）

## 通信・データ

- **Supabase は既存プロジェクト `byouin-nabi` を共有**（病院マスタ・スケジュール・交通サービス等）。アプリは SELECT のみ。
- `.mcp.json` で Supabase MCP サーバーが構成されている（`.gitignore` 済み）。スキーマ変更前に `list_tables` で既存構造を確認してから `apply_migration`。
- **`list_tables` の `rows` フィールドは `pg_class.reltuples` の統計情報で、ANALYZE 直後でないと 0 や古い値を返す**。行数を確かめたい時は `execute_sql` で `SELECT COUNT(*) FROM ...` を実行すること。実例: `hospitals` が `rows: 0` と出たが実際は 110 行だった（2026-05-27 確認）。
- **AI 判定は Cloudflare Workers 経由で Gemini API を呼び出す**。Gemini の API キーをクライアントに置かない。アプリは `src/lib/ai-worker.ts` の `fetchAiRecommend` / `fetchFollowUp` のみを使う（Gemini SDK を直接 import しない）。Workers 側で全失敗系を 200 + `source: 'fallback'` に集約しているので、アプリは HTTP エラーではなく `source` を見て UI 切替する。Workers の実装と運用ルールは `workers/README.md` と `.claude/rules/workers.md` を参照。
- **ローカルキャッシュは 24h TTL**。AsyncStorage キーは `oishasan-navi:` プレフィックスで統一。

## i18n

- **Phase 1 でも構造を最初から組み込む**（Phase 1 は日本語のみだが Phase 2 で英語追加）。
- **UI 文字列はハードコード禁止**。すべて `t('key')` 経由で取得する。キーは階層構造（`onboarding.welcome.title`・`emergency.duty_doctor.label` 等）。
- 新しい文字列を足す時は `locales/ja.json` を同時に更新する。`locales/en.json` は Phase 1 は空 or 構造コピーで OK。
- 既存 namespace: `common` / `home` / `tabs` / `onboarding` / `search` / `hospital`（埋め済）、`symptoms` / `emergency` / `transport` / `settings`（空、後続チケットで埋める）。
- 補間は `t('hospital.favorite.limitReached', { limit: 5 })` のように i18n-js の `{{name}}` 構文で。

## Zustand 状態管理パターン

- **セレクタの形に注意**: 単一フィールド `useStore((s) => s.x)` は安全、複合オブジェクト `useStore((s) => ({a, b}))` は **必ず `useShallow` でラップ**（`import { useShallow } from 'zustand/react/shallow'`）。複合セレクタを素で書くと毎レンダー新参照 → "The result of getSnapshot should be cached" + 無限ループで画面が即落ちる（ticket 07 で発生し修正済み）。
- **`persist` 使用時のフリッカ対策**: `hasHydrated: boolean` フィールド + `setHasHydrated` セッターを足し、`onRehydrateStorage: () => (state) => state?.setHasHydrated(true)` でハイドレ完了をマーク。ガード判定（例: `if (!hasHydrated) return null`）と `SplashScreen.hideAsync` 呼び出しは `hasHydrated` を待ってから。`partialize` で `hasHydrated` 自身は永続化対象から除外。
- **キャッシュストアの API**: `{ data, loadedAt, isLoading, error, hasHydrated, load(force?), setHasHydrated }` の shape。`load()` は hydrate 前 / 鮮度内（`isFresh`）は no-op、`force` で強制再取得。成功時のみ `data`+`loadedAt` 上書き、失敗時は `error` のみ（キャッシュ継続）。新しいキャッシュ対象を足す時もこの shape を踏襲し `use-cache-sync.ts` の `loadAll`/`refreshAllCaches` に追加する（`hospitals-store` 参照）。

## ルーティング

- 動的ルートを `router.push` する前に **実体ファイルを置く**（`/symptoms/questionnaire` や `/hospital/[id]` 等）。Typed Routes が型エラーで止めるので、後続チケット担当の画面でも本ティケット側で `ScreenPlaceholder` を作っておく方針。
- タブ間遷移は `router.push('/<route>')`（`(tabs)` グループ名は URL に出ない）。
- 1 度きりのスタック切離しは `router.replace('/(tabs)')`（オンボーディング完了等）。
- **`(tabs)` の外にあるスタック画面（`symptoms`/`search`/`hospital`/`transport`/`emergency`/`settings`）はタブバーが出ない**。戻る導線が「前画面に戻る」だけだと深いと帰りづらいので、終端的な結果画面には「ホーム」導線を置く。実装は `router.replace('/(tabs)')`、文言は `common.home`（「ホーム」）/ `common.backHome`（「ホームに戻る」）を共用。ネイティブヘッダーの画面（`search/results` 等）は `Stack.Screen` の `headerRight`、自前ヘッダーの画面（`symptoms/results` 等）はヘッダー右 + 下部ボタンに配置済み。

## アクセシビリティ・UX

- タップ領域は最小 48 × 48 dp。
- ボタンはアイコン + ラベル（アイコンのみ禁止）。
- 緊急度などの状態表示は **色だけに依存しない**（バッジ色 + テキスト + アイコンの併用）。
- すべてのインタラクティブ要素に `accessibilityLabel`。
- 文字サイズは OS の文字サイズ設定には追従させず、デザイン上の階層で固定指定。

## セキュリティ・プライバシー

- 公開可: `EXPO_PUBLIC_SUPABASE_URL`・`EXPO_PUBLIC_SUPABASE_ANON_KEY`・`EXPO_PUBLIC_AI_WORKER_URL`。
- 非公開（Workers Secrets）: `GEMINI_API_KEY`。
- `search_logs` への INSERT は匿名のみ（個人特定情報を含めない）。fire-and-forget で UI を阻害しない。
- データ削除手段は設定画面の「データ初期化」ボタン（AsyncStorage 全削除）。

## 命名規約

- ファイル名: `kebab-case`（例: `hospital-card.tsx`）
- コンポーネント名: `PascalCase`（例: `HospitalCard`）
- 関数・変数: `camelCase`
- 定数: `UPPER_SNAKE_CASE`
- AsyncStorage キー: `oishasan-navi:` プレフィックス
