# お医者さんナビ — 要件定義書

**プロジェクト名**: お医者さんナビ（仮称）
**バージョン**: Phase 1 MVP
**作成日**: 2026年5月26日
**対象プラットフォーム**: Android（Expo）
**関連プロジェクト**: 病院ナビ南信（Webサービス、既存運用中）

---

## 1. プロジェクト概要

### 1.1 ミッション

南信地域（飯田市・下伊那郡）における医療機関の情報アクセスを、**スマートフォンに最適化された形**で提供する。既存の Web サービス「病院ナビ南信」のスマホ版として、より直感的で持ち歩きやすい体験を実現する。

### 1.2 ターゲットユーザー

Web サービスのターゲット（シニア層）から**幅広い新規定住層**へ拡張する。

| 層                                   | 想定ニーズ                                                                                     |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **リニア中央新幹線開通による移住者** | 飯田・下伊那の医療事情を知らない。土地勘がない。どの病院が何科か、どこにあるかゼロから知りたい |
| **在住外国人**                       | 言語の壁、文化の違い。診療科の判断が難しい。緊急時の対応が不安（Phase 2 で英語対応予定）       |
| **既存の地域住民（含シニア）**       | 既存 Web のユーザー層。引き続き使える分かりやすい UI                                           |
| **観光客・短期滞在者**               | 体調を崩した時の頼り先                                                                         |

### 1.3 既存 Web サービスとの主な違い

| 項目                          | Web 版（病院ナビ南信）             | アプリ版（お医者さんナビ）                                                  |
| ----------------------------- | ---------------------------------- | --------------------------------------------------------------------------- |
| プラットフォーム              | Next.js PWA                        | Expo（Android）                                                             |
| ターゲット                    | シニア層中心                       | リニア移住者・外国人・既存住民                                              |
| 認証                          | Supabase Auth（メール+PW）         | なし（ローカル保存）                                                        |
| お出かけナビ                  | あり                               | **なし**（削除）                                                            |
| ルート検索（アプリ内3ルート） | あり                               | **なし**（Phase 2 から復活）。Phase 1 は OS の Google マップを起動          |
| 地図表示                      | アプリ内（@react-google-maps/api） | **なし**。Google マップアプリを起動                                         |
| 受診履歴                      | あり                               | **なし**（削除）                                                            |
| 救急対応病院ローテーション    | なし                               | **新規実装**（月次ローテ表対応）                                            |
| 多言語対応                    | なし                               | Phase 1 は日本語のみ。**i18n 構造を最初から組み込む**（Phase 2 で英語追加） |
| データキャッシュ              | Service Worker                     | AsyncStorage + 24時間ごと更新チェック                                       |

### 1.4 主要機能一覧

| #   | 機能                     | 概要                                                                                           |
| --- | ------------------------ | ---------------------------------------------------------------------------------------------- |
| 1   | オンボーディング         | 初回起動時の簡単な設定ウィザード（年齢層・居住エリア・移動補助）                               |
| 2   | 症状アンケート → AI 判定 | アンケート → Cloudflare Workers 経由で Gemini API → 緊急度判定 + 推奨診療科 + 病院リスト       |
| 3   | 条件検索                 | 診療科・市町村・キーワード・設備フィルター                                                     |
| 4   | 病院詳細                 | 基本情報・診療時間・かかりつけ医登録・地図アプリ起動・電話発信                                 |
| 5   | 緊急時ガイド             | 119 番ボタン + **今日の当番医（休日当番）** + 月次カレンダー + 応急処置 + 救急対応病院         |
| 6   | 地域交通サービス         | 送迎バス・デマンド・タクシー・福祉タクシー・路線バス。タブで一覧、病院詳細にも該当地域分を表示 |
| 7   | プロフィール（設定）     | 年齢層・居住エリア・移動補助（ローカル保存、AI 判定の精度向上に使用）                          |
| 8   | かかりつけ医             | 最大 5 件、並び替え可（ローカル保存）                                                          |

---

## 2. 技術スタック

### 2.1 フロントエンド

| カテゴリ              | 技術                                                  | 用途                                                 |
| --------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| フレームワーク        | **Expo SDK 53+**                                      | React Native ベース                                  |
| 言語                  | **TypeScript**                                        | `strict: true`                                       |
| ナビゲーション        | **Expo Router**（File-based routing）                 | 画面遷移                                             |
| UI ライブラリ         | **NativeWind**（Tailwind CSS for RN）                 | スタイリング                                         |
| 状態管理              | **Zustand**                                           | グローバル状態（プロフィール、かかりつけ医、UI設定） |
| ローカル保存          | **`@react-native-async-storage/async-storage`**       | プロフィール・かかりつけ医・キャッシュ               |
| HTTP クライアント     | **Fetch API**（Supabase JS SDK）                      | バックエンド通信                                     |
| Supabase クライアント | **`@supabase/supabase-js`**                           | DB アクセス（Anon Key のみ、RLS で保護）             |
| 多言語化              | **`expo-localization` + `i18n-js`**                   | Phase 1 は日本語のみだが構造を準備                   |
| アイコン              | **`@expo/vector-icons`**（Ionicons / Material Icons） | UI アイコン                                          |
| 日付処理              | **`date-fns`**                                        | カレンダー表示・営業中判定                           |
| Linking               | **`expo-linking`**                                    | Google マップ起動・電話発信                          |
| カレンダー UI         | **`react-native-calendars`**                          | 救急ローテのカレンダー表示                           |

### 2.2 バックエンド

| カテゴリ     | 技術                                   | 用途                                                           |
| ------------ | -------------------------------------- | -------------------------------------------------------------- |
| DB / Auth    | **既存 Supabase（`byouin-nabi`）共有** | 病院マスタ・スケジュール・交通サービスを共有                   |
| 新規テーブル | `emergency_rotations`（Web 側で実装）  | 救急ローテーション                                             |
| AI プロキシ  | **Cloudflare Workers**                 | Gemini API キーの秘匿、`/api/symptoms/ai-recommend` 相当の処理 |
| AI モデル    | **Gemini 3.1 flash-lite-preview**      | 緊急度判定 + 推奨診療科                                        |

### 2.3 配布・運用

| 項目           | 内容                                                       |
| -------------- | ---------------------------------------------------------- |
| 配布           | **Google Play Store**                                      |
| ビルド         | **EAS Build**（Expo Application Services）                 |
| アップデート   | **EAS Update**（Over-the-Air、軽微な修正用）               |
| アナリティクス | Phase 1 は導入しない（匿名検索ログのみ Supabase 側で記録） |

---

## 3. 機能仕様

### 3.1 オンボーディング（初回起動時）

**目的**: アプリの基本設定を初回に済ませる。スキップ可能。

**画面構成**:

| ステップ | 内容                                                       | 必須/任意          |
| -------- | ---------------------------------------------------------- | ------------------ |
| 1        | アプリ説明（南信地域の病院検索アプリです） + 開始ボタン    | 任意（スキップ可） |
| 2        | 年齢層を選択（`under39` / `40to64` / `65to74` / `over75`） | 任意               |
| 3        | 居住エリア（14 自治体から選択 + 「区域外」）               | 任意               |
| 4        | 移動補助（`none` / `cane` / `wheelchair`）                 | 任意               |
| 5        | 完了 → ホームへ                                            | -                  |

**実装ポイント**:

- 全ステップ「あとで設定」ボタンを表示
- 設定値は `useProfileStore`（Zustand）に保存 → AsyncStorage に永続化
- 既に完了済みフラグ（`onboardingCompleted: true`）を AsyncStorage に保存。次回起動時はスキップ
- 各画面のテキストは i18n キー化（`onboarding.step1.title` 等）

**遷移後**: ホーム画面（`/`）へ。

### 3.2 ホーム画面（`/`）

**画面構成**:

```
┌────────────────────────────────┐
│  お医者さんナビ                │
│  南信地域の病院検索            │
├────────────────────────────────┤
│  🩺 症状から病院を探す        │  ← 大ボタン
│  （緊急度もAIが判定）          │
├────────────────────────────────┤
│  🔍 条件で病院を探す           │  ← 大ボタン
│  （診療科・市町村）            │
├────────────────────────────────┤
│  🚨 緊急時・休日当番医         │  ← 大ボタン
├────────────────────────────────┤
│  📍 今日の通院サービス        │  ← 小ボタン（現在地・選択エリアの交通）
└────────────────────────────────┘
   [ホーム][探す][緊急][設定]   ← ボトムナビ
```

**ボトムナビ（タブ）**:

- ホーム
- 病院を探す（症状 / 条件検索の入口）
- 緊急時（緊急ガイド + 当番医 + 119）
- 通院（地域交通サービス一覧）
- 設定（プロフィール + かかりつけ医）

### 3.3 症状アンケート → AI 判定（`/symptoms/*`）

#### 3.3.1 アンケート画面（`/symptoms/questionnaire`）

Web 版と同じ入力項目を踏襲。**スマホで指タップしやすい大きなチェックボックス**で実装。

| フィールド   | 入力                                                                           | 必須   |
| ------------ | ------------------------------------------------------------------------------ | ------ |
| `location`   | 部位（複数選択）: のど/むね/おなか/あし/うで/あたま/かお/せなか/こし/その他    | ◯      |
| `duration`   | 期間: 今日/2-3日前/1週間前/2週間前/1ヶ月以上前                                 | ◯      |
| `symptoms`   | 症状（複数選択）: 痛い/しこり/かゆい/赤い・はれ/熱/せき/息苦しい/めまい/その他 | ◯      |
| `lumpSize`   | しこり選択時のみ表示。サイズ                                                   | 条件付 |
| `conditions` | 持病（複数選択）                                                               | 任意   |
| `medicine`   | 服薬有無                                                                       | 任意   |
| `memo`       | 自由記述                                                                       | 任意   |

**実装ポイント**:

- 1 画面 1 質問のステップ形式（モバイル UX）。プログレスバー表示
- 各ステップで AsyncStorage に保存（途中離脱対応）
- 完了 → `/symptoms/results` へ遷移

#### 3.3.2 結果画面（`/symptoms/results`）

**処理フロー**:

```
1. プロフィール（年齢層・居住エリア・移動補助）を取得
2. アンケート結果 + プロフィールを Cloudflare Workers に POST
3. Workers 内で Gemini API 呼び出し（5秒タイムアウト）
4. レスポンス受信 → UI 表示
5. 並行して条件マッチする病院をローカルキャッシュから抽出
6. 匿名検索ログを Supabase に記録（type: 'symptom'）
```

**表示構成**（上から）:

1. **緊急度バッジ**（最上部・目立つ位置）
   - `emergency`（赤、すぐ受診）/ `soon`（黄、数日以内）/ `watch`（緑、様子見）
   - 判定理由 + アドバイス + 免責事項
2. **推奨される診療科**（折りたたみ、デフォルト開）
3. **症状まとめ**（折りたたみ、デフォルト閉）
   - テンプレートベースの症状説明文（病院受付で見せられる）
   - 「画像として保存」ボタン（`react-native-view-shot` で実装）
4. **追加質問チャット**（「もっと詳しく調べる」）
   - Workers 経由で Gemini に 2-3 問の追加質問を生成させ、回答後に再判定
5. **おすすめ病院リスト**
   - 推奨診療科に対応する病院（スコアリング順、ローカルキャッシュから）
   - 各カードに「電話」「地図で開く」「詳細」ボタン

**フォールバック**:

- Workers 失敗時はルールベース判定にフォールバック
- フォールバック内容: `lib/fallbackUrgency.ts` 相当をアプリ内に実装
- ユーザーには「現在 AI が利用できないため、簡易判定で表示しています」と通知

#### 3.3.3 病院スコアリング（ローカル実装）

Web 版の `hospitalScoring.ts` をアプリ内ロジックとして移植。

| 加点項目                     | 点数 |
| ---------------------------- | ---- |
| 推奨診療科に一致             | +100 |
| かかりつけ医に登録済み       | +50  |
| 救急対応（emergency 時のみ） | +40  |
| 現在営業中                   | +30  |

営業中判定は `hospital_schedules`（ローカルキャッシュ）から現在時刻で計算。

### 3.4 条件検索（`/search`）

**入力**:

- キーワード（病院名）
- 診療科チェックボックス（20 科）
- 市町村チェックボックス（14 自治体）
- 設備フィルター：バリアフリー / 駐車場 / 救急対応

**結果画面**（`/search/results`）:

- 病院カード一覧（スクロール）
- 各カードに病院名・診療科ハイライト・住所・営業中バッジ
- タップで詳細へ

**実装ポイント**:

- 検索条件は AsyncStorage に保存（「前回の検索条件」を再現可能に）
- フィルタリングはローカルキャッシュ上で実行（オフラインでも動作）
- 匿名検索ログを Supabase に記録（type: 'search'）

### 3.5 病院詳細（`/hospital/[id]`）

**表示**:

1. 病院名・診療科タグ
2. 基本情報（住所・電話・営業時間）
3. **アクションボタン群**:
   - 「電話をかける」→ `Linking.openURL('tel:...')`
   - 「Google マップで開く」→ `Linking.openURL('google.navigation:q=...&mode=d')`（座標があれば座標、なければ住所で）
   - 「Web サイトを開く」→ `Linking.openURL(websiteUrl)`
4. 診療時間テーブル（曜日 × 午前/午後）
5. 設備バッジ（バリアフリー / 駐車場 / 救急対応 / 送迎バス / オンライン診療）
6. **この地域の通院サービス**（`transport_services` を該当市町村で絞り込み表示。3.7 参照）
7. **かかりつけ医に登録ボタン**（最大 5 件まで。既登録なら「解除」表示）
8. 備考

**実装ポイント**:

- 病院 ID は uuid。データは原則ローカルキャッシュから取得。詳細表示時に最新を取りに行く動作はオプション
- メタデータ表示（OG タグ等）はアプリでは不要

### 3.6 緊急時ガイド（`/emergency`）

**画面構成**（タブナビゲーション内に統合）:

```
┌────────────────────────────────┐
│         🚨 119 番に電話        │  ← 巨大ボタン、最上部
├────────────────────────────────┤
│  今日の休日当番医（5/26 日）   │  ← セクション
│  ・内科: 健和会病院 23-3115    │
│  ・小児科: 健和会病院 23-3115  │
│  ・外科: 健和会病院 23-3115    │
│  ・産婦人科: 飯田市立病院      │
│  ・歯科: しまだ歯科クリニック  │
│  ・薬局: かなえひまわり薬局 他 │
├────────────────────────────────┤
│  [今月のカレンダーを見る]      │  ← 大ボタン
├────────────────────────────────┤
│  夜間急患診療所（365日対応）   │
│  TEL: 0265-23-3636             │
│  夜間 19:00-22:00              │
├────────────────────────────────┤
│  📋 応急処置の基本             │
│  （4 ステップの解説）          │
├────────────────────────────────┤
│  救急対応病院一覧              │
│  （emergency_available=true）  │
└────────────────────────────────┘
```

**実装ポイント**:

- 「今日の当番医」セクションは `emergency_rotations` テーブルから `duty_date = TODAY` を取得
- 平日の場合は休日当番医セクションは「本日は平日のため、休日当番医はありません」と表示し、夜間急患診療所のみ強調
- 当番医セクション内の電話番号は全て `tel:` リンク化
- オフライン時もローカルキャッシュ（24時間以内）から表示できる

#### 3.6.1 月次カレンダー画面（`/emergency/calendar`）

- `react-native-calendars` でカレンダー UI
- 各日付に「当番医あり」マーカー（休日のみ）
- 日付タップ → その日の当番医一覧をモーダル/ボトムシートで表示
- 月切り替え可能（前月・次月）
- 現在月以外は「未登録」表示の可能性あり

### 3.7 地域交通サービス（`/transport`）

**目的**: 通院手段（送迎バス・デマンド・タクシー・福祉タクシー・路線バス）を見つけられる。

#### 3.7.1 一覧画面（タブから直接）

**表示**:

- 自治体フィルター（デフォルトはプロフィールの居住エリア）
- 種別フィルター（`route_bus` / `demand` / `taxi` / `welfare_taxi` / `shuttle`）
- バリアフリーフィルター（`wheelchair_accessible`）
- 各カードに：サービス名・運営者・種別バッジ・対応エリア・電話/予約ボタン

#### 3.7.2 病院詳細からの導線

- 病院詳細画面に「この地域の通院サービス」セクション
- その病院の `city` を `transport_services.service_area` に含むサービスを抽出
- 病院が `shuttle_bus=true` なら、その病院の送迎バス情報を最上部に表示

#### 3.7.3 詳細画面（`/transport/[id]`）

- サービス概要・運営者・対応エリア
- 予約方法（電話 / Web / アプリ / 不要）と予約期限
- 料金情報
- バリアフリー対応
- 「電話で予約」「Web で予約」ボタン

### 3.8 プロフィール（`/settings`）

**目的**: AI 症状判定の精度向上と、UI の個人化。**認証なしのローカル保存**。

**フィールド**（オンボーディングと同じ）:

- 年齢層（`under39` / `40to64` / `65to74` / `over75`）
- 居住エリア（14 自治体 + 区域外）
- 移動補助（`none` / `cane` / `wheelchair`）

**設定タブの他項目**:

- かかりつけ医一覧（3.9）
- アプリ情報（バージョン・利用規約・プライバシーポリシー）
- データ初期化ボタン（AsyncStorage 全削除）

**実装**:

- `useProfileStore`（Zustand + AsyncStorage 永続化）
- フィールド変更時は即保存
- 言語切替は Phase 1 で日本語固定のため非表示（Phase 2 で追加）

### 3.9 かかりつけ医（`/settings/favorites`）

**仕様**:

- 最大 5 件、ローカル保存（`hospital_id` の配列 + `sort_order`）
- ドラッグ&ドロップで並び替え（`react-native-draggable-flatlist`）
- 病院詳細画面の「かかりつけ医に登録」ボタンと連動
- リストタップ → 病院詳細へ
- 削除はスワイプ削除

**実装**:

- `useFavoritesStore`（Zustand + AsyncStorage 永続化）
- データ構造: `{ id: string; hospitalId: string; sortOrder: number; createdAt: number }[]`

---

## 4. データベース設計

### 4.1 既存テーブル利用方針

**既存 Supabase プロジェクト `byouin-nabi` をそのまま共有**。アプリは以下のテーブルを **SELECT のみ**で利用する（RLS 公開 SELECT 経由）。

| テーブル                                      | 用途                         | 取得頻度                             |
| --------------------------------------------- | ---------------------------- | ------------------------------------ |
| `hospitals`                                   | 病院マスタ                   | 24時間ごと一括（ローカルキャッシュ） |
| `hospital_schedules`                          | 曜日別診療時間               | hospitals と同時取得                 |
| `transport_services`                          | 交通サービス                 | 24時間ごと一括                       |
| `bus_routes` / `bus_stops` / `bus_timetables` | バス系（必要時のみ）         | 遅延取得                             |
| `facilities`                                  | お出かけ施設                 | **使わない**（お出かけナビ非対応）   |
| `emergency_rotations`                         | **新規**。救急ローテーション | 月次取得 + 24時間ごとチェック        |
| `search_logs`                                 | 匿名検索ログ INSERT 専用     | リアルタイム                         |

**アプリ側で使わないテーブル**:

- `profiles` / `favorite_facilities` / `search_history` / `visit_reminders` / `family_links`（認証なしのためアクセス不要）
- `facilities`（お出かけナビ非対応）

### 4.2 新規テーブル：`emergency_rotations`

休日当番医・夜間急患診療所のローテーションを管理する新規テーブル。**Web アプリ側で管理画面を追加実装**してデータ投入する。

```sql
CREATE TABLE emergency_rotations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  duty_date       date NOT NULL,                       -- 当番日（例: 2026-06-07）
  rotation_type   text NOT NULL CHECK (rotation_type IN (
                    'night_emergency',                 -- 夜間急患診療所（365日固定）
                    'duty_doctor',                     -- 休日当番医
                    'duty_dentist',                    -- 休日当番歯科
                    'duty_pharmacy'                    -- 休日当番薬局
                  )),
  area            text NOT NULL,                       -- '飯田地区' / '阿南地区' 等
  department      text,                                -- '内科' / '小児科' / '外科' / '産婦人科' / '歯科' / NULL（薬局・夜間急患）
  hospital_id     uuid REFERENCES hospitals(id) ON DELETE SET NULL,  -- 既存病院マスタとの紐付け（任意）
  facility_name   text NOT NULL,                       -- 表示用施設名（hospitals に無い施設もあるため必須）
  phone           text NOT NULL,                       -- 電話番号
  start_time      time NOT NULL,                       -- 例: 09:00:00
  end_time        time NOT NULL,                       -- 例: 18:00:00
  note            text,                                -- '11時までの電話予約者のみ' 等
  source_month    text NOT NULL,                       -- '2026-06' 形式（インポート単位の管理用）
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_emergency_rotations_duty_date ON emergency_rotations(duty_date);
CREATE INDEX idx_emergency_rotations_type_date ON emergency_rotations(rotation_type, duty_date);
CREATE INDEX idx_emergency_rotations_source_month ON emergency_rotations(source_month);

-- RLS
ALTER TABLE emergency_rotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read emergency_rotations"
  ON emergency_rotations FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE は service_role 経由のみ（管理画面から）
```

**運用ルール**:

- 「飯伊地区包括医療協議会」発行の月次予定表を、毎月 Web 管理画面から CSV/Excel 一括インポート
- 1 ヶ月で全レコードを更新
- **夜間急患診療所（365 日対応）**: 毎月の運用で 30〜31 日分の `night_emergency` レコードを自動生成（同じ施設情報を全日付分）
- Phase 2 で自動更新（PDF / Web スクレイピング）を予定
- 過去データは保持（履歴として残す）

#### 4.2.1 CSV インポート用テンプレート

```csv
duty_date,rotation_type,area,department,facility_name,phone,start_time,end_time,note
2026-06-07,duty_doctor,飯田地区,内科,源田内科医院,0265-24-1550,09:00,18:00,
2026-06-07,duty_doctor,飯田地区,小児科,健和会病院,0265-23-3115,09:00,18:00,
2026-06-07,duty_doctor,飯田地区,外科,慶友整形外科,0265-52-1152,09:00,18:00,
2026-06-07,duty_doctor,飯田地区,産婦人科,飯田市立病院,0265-21-1255,09:00,12:00,
2026-06-07,duty_dentist,飯田地区,歯科,いずみ歯科クリニック（鼎）,0265-53-4182,09:00,12:00,11時までの電話予約者のみ
2026-06-07,duty_pharmacy,飯田地区,,おおみやのサンピア薬局,0265-49-8151,09:00,18:00,
...
```

**夜間急患診療所の生成**:

- 管理画面に「夜間急患診療所の月次自動生成」ボタンを設置
- 月と施設情報を指定すると、その月の全日付分をバッチ INSERT する

### 4.3 ローカルストレージ（AsyncStorage）

| キー                                      | 内容                                   | 形式                                               |
| ----------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| `oishasan-navi:onboarding-completed`      | オンボーディング完了フラグ             | `boolean`                                          |
| `oishasan-navi:profile`                   | プロフィール                           | `{ ageGroup, area, mobilityAid }`                  |
| `oishasan-navi:favorites`                 | かかりつけ医                           | `{ id, hospitalId, sortOrder, createdAt }[]`       |
| `oishasan-navi:hospitals-cache`           | 病院マスタキャッシュ                   | `{ data: Hospital[], fetchedAt: number }`          |
| `oishasan-navi:schedules-cache`           | 診療時間キャッシュ                     | `{ data: HospitalSchedule[], fetchedAt: number }`  |
| `oishasan-navi:transport-cache`           | 交通サービスキャッシュ                 | `{ data: TransportService[], fetchedAt: number }`  |
| `oishasan-navi:emergency-rotations-cache` | 救急ローテキャッシュ（前月+当月+次月） | `{ data: EmergencyRotation[], fetchedAt: number }` |
| `oishasan-navi:questionnaire-draft`       | アンケート途中保存                     | `Partial<QuestionnaireData>`                       |
| `oishasan-navi:last-search-conditions`    | 前回の検索条件                         | `SearchConditions`                                 |
| `oishasan-navi:language`                  | 言語設定（Phase 2 用に予約）           | `'ja' \| 'en'`                                     |

---

## 5. API 設計

### 5.1 Supabase 直接アクセス

`@supabase/supabase-js` の Anon Key で直接 SELECT。すべて RLS の公開ポリシーに依存。

**例: 病院一覧取得**

```typescript
const { data, error } = await supabase
  .from("hospitals")
  .select(
    `
    id, name, category, address, tel, city,
    opening_hours, google_map_url, website, note,
    latitude, longitude,
    parking, parking_capacity, barrier_free, emergency_available,
    shuttle_bus, shuttle_bus_info, online_consultation,
    schedules:hospital_schedules(*)
  `,
  )
  .order("name");
```

**例: 今日の当番医取得**

```typescript
const today = format(new Date(), "yyyy-MM-dd");
const { data } = await supabase
  .from("emergency_rotations")
  .select("*")
  .eq("duty_date", today)
  .order("rotation_type")
  .order("department");
```

**例: 匿名検索ログ INSERT**

```typescript
await supabase
  .from('search_logs')
  .insert({
    log_type: 'symptom',
    search_data: { ... },
    area: profile.area,
  });
```

### 5.2 Cloudflare Workers（Gemini プロキシ）

**用途**: Gemini API キーを秘匿しつつ、AI 症状判定・追加質問生成を行う。

**エンドポイント案**:

| メソッド | パス                | 用途                                                             |
| -------- | ------------------- | ---------------------------------------------------------------- |
| `POST`   | `/api/ai-recommend` | 緊急度判定 + 推奨診療科（5秒タイムアウト、失敗時フォールバック） |
| `POST`   | `/api/follow-up`    | 追加質問 2-3 問生成（10秒タイムアウト）                          |

**リクエスト例（`/api/ai-recommend`）**:

```json
{
  "location": ["むね", "せなか"],
  "duration": "今日",
  "symptoms": ["痛い", "息苦しい"],
  "conditions": ["血圧・心臓"],
  "medicine": true,
  "memo": "朝から痛い",
  "profile": {
    "ageGroup": "65to74",
    "area": "飯田市",
    "mobilityAid": "none"
  },
  "followUpAnswers": null
}
```

**レスポンス例**:

```json
{
  "urgency": "emergency",
  "urgency_reason": "胸の痛みと息苦しさは緊急性が高い症状です。",
  "recommended_departments": ["内科", "循環器科"],
  "department_reason": "心臓系の疾患が疑われるため。",
  "advice": "すぐに 119 番に通報するか、救急対応病院に直行してください。",
  "disclaimer": "※この判定は医療診断ではありません。最終的な判断は医師にご相談ください。",
  "source": "ai"
}
```

**実装ポイント**:

- 既存 Web の `/api/symptoms/ai-recommend` のロジックをそのまま Workers に移植
- 環境変数で `GEMINI_API_KEY` を管理（Cloudflare Workers Secrets）
- CORS は Expo アプリのみ許可（開発時は localhost も許可）
- レート制限：IP ベース、1 分間 30 リクエスト
- 失敗時は `source: 'fallback'` を返し、アプリ側でルールベース判定を実行

**フォールバックロジック（アプリ内）**:

- `lib/fallbackUrgency.ts` を移植
- 部位 → 診療科マッピング（`lib/departmentMapping.ts`）も移植

---

## 6. UI/UX 設計

### 6.1 デザイン方針

**新ターゲット（リニア移住者・外国人・既存住民）に最適化**:

- シンプル、ミニマル、モダン。Web のシニア特化デザインからアップデート
- 「初見の人」が直感的に分かる動線（テキストよりアイコンと色で誘導）
- 地域名（飯田地区、阿南地区など）には**短い説明や地図サムネ**を添える
- 多言語対応を前提とした**文字列の i18n キー化**（Phase 1 で日本語のみだが構造は完備）

### 6.2 ナビゲーション構造（Expo Router）

```
app/
├── _layout.tsx                 # ルートレイアウト（i18n Provider, Theme, etc）
├── onboarding/
│   ├── _layout.tsx
│   ├── index.tsx               # ウェルカム
│   ├── age.tsx                 # 年齢層
│   ├── area.tsx                # 居住エリア
│   └── mobility.tsx            # 移動補助
├── (tabs)/
│   ├── _layout.tsx             # ボトムタブ定義
│   ├── index.tsx               # ホーム
│   ├── search.tsx              # 病院を探す（症状/条件の入口）
│   ├── emergency.tsx           # 緊急時
│   ├── transport.tsx           # 通院
│   └── settings.tsx            # 設定
├── symptoms/
│   ├── questionnaire.tsx       # アンケート（ステップ形式）
│   └── results.tsx             # AI 結果
├── search/
│   └── results.tsx             # 条件検索結果
├── hospital/
│   └── [id].tsx                # 病院詳細
├── transport/
│   └── [id].tsx                # 交通サービス詳細
├── emergency/
│   └── calendar.tsx            # 月次カレンダー
└── settings/
    ├── profile.tsx             # プロフィール編集
    ├── favorites.tsx           # かかりつけ医
    └── about.tsx               # アプリ情報
```

### 6.3 アクセシビリティ

| 項目               | 基準                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------ |
| フォントサイズ     | デフォルト 16px、見出し系は適切に階層化（OS の文字サイズ設定には追従しない固定指定） |
| タップ領域         | 最小 48 × 48 dp                                                                      |
| コントラスト比     | WCAG AA 以上                                                                         |
| ボタン             | アイコン + ラベル（アイコンのみ禁止）                                                |
| 色だけに依存しない | 緊急度はバッジ色 + テキスト + アイコンで表現                                         |
| スクリーンリーダー | `accessibilityLabel` を全インタラクティブ要素に設定                                  |

### 6.4 多言語対応の準備（Phase 1 では日本語のみ）

**Phase 1 でやること**:

- すべての UI 文字列を `t('key')` 経由で取得する構造にする
- `locales/ja.json` を完備
- `locales/en.json` を**空ファイルとして用意**（Phase 2 で埋める）
- `expo-localization` で端末言語を検出する仕組みは入れるが、Phase 1 では強制的に `ja` を使う

**Phase 2 でやること**:

- `locales/en.json` を埋める
- 設定画面に言語切替を追加
- DB の病院名・住所等の多言語化方針を決定（カラム追加 or 翻訳 API）

---

## 7. ローカルキャッシュ・オフライン戦略

### 7.1 キャッシュ対象と更新頻度

| データ                              | 取得タイミング         | 有効期限                    |
| ----------------------------------- | ---------------------- | --------------------------- |
| 病院マスタ（hospitals + schedules） | 初回起動 / 24 時間ごと | 24 時間                     |
| 交通サービス（transport_services）  | 初回起動 / 24 時間ごと | 24 時間                     |
| 救急ローテ（emergency_rotations）   | 初回起動 / 24 時間ごと | 24 時間（前月+当月+次月分） |
| バス時刻表                          | 詳細表示時に遅延取得   | 24 時間                     |

**更新チェックタイミング**:

- アプリ起動時
- フォアグラウンド復帰時（バックグラウンドから 1 時間以上経過した場合）
- ユーザーが手動で「データを更新」ボタンを押した時（設定画面）

**更新方式**:

- バックグラウンドで非同期 fetch
- 失敗してもキャッシュを使い続ける
- 成功時のみ AsyncStorage を上書き

### 7.2 オフライン時の挙動

| 機能               | オフライン動作                                                      |
| ------------------ | ------------------------------------------------------------------- |
| ホーム画面         | ◯（静的）                                                           |
| 病院検索（条件）   | ◯（ローカルキャッシュで検索）                                       |
| 病院詳細           | ◯（ローカルキャッシュ）                                             |
| 症状アンケート入力 | ◯（途中保存可）                                                     |
| AI 判定            | ✕（オンライン必須。エラー表示し、ルールベースフォールバックを提案） |
| 緊急時ガイド       | ◯（24 時間以内のキャッシュなら表示）                                |
| 119 番ボタン       | ◯（電話発信は OS 機能）                                             |
| 地域交通サービス   | ◯                                                                   |
| 通院サービス詳細   | ◯                                                                   |
| Google マップ起動  | ◯（OS 側に任せる）                                                  |

**実装ポイント**:

- ネットワーク状態は `@react-native-community/netinfo` で監視
- オフライン時は画面上部に「オフライン中」バッジを表示
- AI 判定画面でオフライン時は「AI が使えない時の簡易判定で表示」と注釈

---

## 8. 匿名検索ログ

Web 版と同じ `search_logs` テーブルに INSERT する。個人情報は含まない。

| `log_type` | 記録タイミング                                 | `search_data` の内容                 |
| ---------- | ---------------------------------------------- | ------------------------------------ |
| `symptom`  | AI 結果ページ表示時                            | アンケート全項目（個人特定情報除く） |
| `search`   | 条件検索結果表示時                             | 検索条件                             |
| `route`    | （Phase 1 では未使用）                         | -                                    |
| `outing`   | （Phase 1 では未使用、お出かけナビ削除のため） | -                                    |

`area` カラムにはプロフィールの `area`（居住エリア）を記録（任意）。

---

## 9. セキュリティ・プライバシー

### 9.1 個人情報

- **収集しない**: 氏名・メールアドレス・電話番号・位置情報の常時取得
- **ローカルのみ保持**: プロフィール情報（年齢層・居住エリア・移動補助）、かかりつけ医、検索条件
- **匿名で送信**: AI 症状判定時のプロフィール情報（IP は Cloudflare 側でログ）、検索ログ

### 9.2 環境変数

| 変数                            | 用途                              | 公開可否                      |
| ------------------------------- | --------------------------------- | ----------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Supabase URL                      | 公開（Anon Key 前提）         |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key                 | 公開（RLS で保護）            |
| `EXPO_PUBLIC_AI_WORKER_URL`     | Cloudflare Workers エンドポイント | 公開                          |
| `GEMINI_API_KEY`（Workers 側）  | Gemini API キー                   | **非公開**（Workers Secrets） |

### 9.3 通信

- 全通信 HTTPS
- Supabase 直接アクセスは RLS の公開 SELECT ポリシーに依存
- Cloudflare Workers 側で CORS / レート制限を実装

### 9.4 プライバシーポリシー（必須）

Play Store 公開には必須。以下を含む文章を作成し、設定画面からリンク。

- 収集する情報の一覧
- 匿名ログの利用目的
- 第三者提供の有無（Gemini API 経由でアンケート情報が Google に渡る点を明記）
- データ削除方法（アプリ初期化）

---

## 10. 配布

### 10.1 Play Store

| 項目                   | 内容                                                               |
| ---------------------- | ------------------------------------------------------------------ |
| アプリ名               | お医者さんナビ                                                     |
| パッケージ ID          | `com.hohoemilab.oishasan_navi`（仮）                               |
| 対象 OS                | Android 7.0 (API 24) 以上                                          |
| カテゴリ               | 医療 / Medical                                                     |
| 必要な権限             | インターネット、電話発信（暗黙的）、外部アプリ起動                 |
| 想定スクリーンショット | ホーム / 症状結果 / 緊急時ガイド / 病院詳細 / 通院サービス（5 枚） |

### 10.2 アプリアイコン・スプラッシュ

- メインカラー：青系（既存 Web の `#1e40af` をベースに、より親しみやすい青に調整）
- アイコン：聴診器 + 矢印（道案内のイメージ）
- スプラッシュ：シンプルにロゴのみ

### 10.3 EAS Build / Update

- **EAS Build**: ストア提出用ビルド（Production プロファイル）
- **EAS Update**: 軽微なバグ修正・文言修正・i18n 更新を OTA 配信

---

## 11. フェーズ分け

### Phase 1（MVP、本要件定義書のスコープ）

- ✅ オンボーディング
- ✅ ホーム画面
- ✅ 症状アンケート + AI 判定（Cloudflare Workers 経由）
- ✅ 条件検索
- ✅ 病院詳細
- ✅ 緊急時ガイド + 当番医カレンダー
- ✅ 地域交通サービス
- ✅ プロフィール（ローカル）
- ✅ かかりつけ医（ローカル、最大 5 件）
- ✅ 病院データのローカルキャッシュ
- ✅ 匿名検索ログ
- ✅ 救急ローテーション DB（Web 側で管理画面追加）
- ✅ 多言語対応の構造準備（日本語のみ実装）
- ✅ Play Store 公開

### Phase 2

- 🔮 英語対応（`locales/en.json` 完成 + 言語切替）
- 🔮 アプリ内ルート検索（Google Directions API、3 ルート表示）
- 🔮 アプリ内地図表示（`react-native-maps`）
- 🔮 救急ローテーションの自動更新（PDF パースまたは Web スクレイピング）
- 🔮 プッシュ通知（緊急情報・お知らせ）
- 🔮 受診履歴（要 Supabase Anonymous Auth 検討）

### Phase 3（将来構想）

- 🔮 iOS 対応
- 🔮 中国語・韓国語・ベトナム語等の追加多言語化
- 🔮 病院の口コミ・評価機能
- 🔮 オンライン診療予約連携
- 🔮 マイナンバーカード連携（保険証情報）

---

## 12. 開発ルール（Claude Code 向け）

### 12.1 ディレクトリ構成

```
oishasan-navi/
├── app/                        # Expo Router（画面）
├── src/
│   ├── components/             # 再利用コンポーネント
│   │   ├── common/             # Button, Card, Badge, etc
│   │   ├── hospital/           # HospitalCard, ScheduleTable, etc
│   │   ├── symptoms/           # QuestionStep, UrgencyBadge, etc
│   │   ├── emergency/          # DutyDoctorList, CalendarView, etc
│   │   └── transport/          # TransportCard, BookingButton, etc
│   ├── stores/                 # Zustand
│   │   ├── profileStore.ts
│   │   ├── favoritesStore.ts
│   │   └── questionnaireStore.ts
│   ├── lib/
│   │   ├── supabase.ts             # Supabase クライアント
│   │   ├── aiWorker.ts             # Cloudflare Workers クライアント
│   │   ├── cache.ts                # AsyncStorage キャッシュ管理
│   │   ├── hospitalScoring.ts      # スコアリング（Web 移植）
│   │   ├── fallbackUrgency.ts      # ルールベース判定（Web 移植）
│   │   ├── departmentMapping.ts    # 部位 → 診療科（Web 移植）
│   │   ├── linking.ts              # 電話・地図起動ユーティリティ
│   │   └── isCurrentlyOpen.ts      # 営業中判定（Web 移植）
│   ├── types/                  # 型定義
│   ├── locales/
│   │   ├── ja.json             # 日本語（完備）
│   │   └── en.json             # 英語（Phase 2 で埋める、Phase 1 は空でも可）
│   ├── i18n/
│   │   └── index.ts            # i18n-js セットアップ
│   └── constants/
│       ├── departments.ts      # 20 診療科
│       ├── cities.ts           # 14 自治体
│       └── colors.ts           # カラーパレット
├── assets/                     # 画像・フォント
├── app.json                    # Expo 設定
├── eas.json                    # EAS Build 設定
├── tsconfig.json
├── package.json
├── REQUIREMENTS.md             # 本ドキュメント
└── CLAUDE.md                   # Claude Code 用ガイド
```

### 12.2 命名規約

- ファイル名: `kebab-case`（例: `hospital-card.tsx`）
- コンポーネント名: `PascalCase`（例: `HospitalCard`）
- 関数・変数: `camelCase`
- 定数: `UPPER_SNAKE_CASE`
- AsyncStorage キー: `oishasan-navi:` プレフィックス

### 12.3 状態管理ルール

- グローバル状態は Zustand
- ローカル状態は `useState`
- サーバー状態（Supabase）は AsyncStorage キャッシュ + 必要に応じて再フェッチ
- Phase 1 では React Query は導入しない（シンプル維持）

### 12.4 i18n ルール

- **絶対にハードコードしない**。すべての UI 文字列は `t('key')` 経由
- キーは階層構造（`onboarding.welcome.title`、`emergency.duty_doctor.label` 等）
- 開発中に新しい文字列を足す時は、必ず `ja.json` を同時に更新

---

## 13. 既存 Web アプリへの追加実装

本アプリの開発と並行して、既存 Web アプリ「病院ナビ南信」に以下を追加実装する必要がある。

### 13.1 救急ローテーション管理画面

- 画面パス: `/admin/emergency-rotations`
- 機能:
  - 月別一覧表示
  - CSV/Excel 一括インポート（既存の hospitals インポートと同じ構造）
  - 1 件編集・削除
  - 夜間急患診療所の月次自動生成ボタン（施設情報と月を指定して 30〜31 日分を一括 INSERT）
  - 月単位の全削除ボタン（`source_month` で絞り込み）

### 13.2 マイグレーション

- `20260526_create_emergency_rotations_table` を作成し、本ドキュメント 4.2 の SQL を適用
- RLS ポリシー追加（public SELECT、service_role その他）

### 13.3 既存 Web の緊急時ガイド画面

- 既存 `/emergency` ページにも当番医セクションを追加する（一貫性のため）
- ただし Web 側の改修は本アプリリリース後でも可

---

## 14. 想定スケジュール（参考）

| フェーズ                  | 工数目安     | 内容                                                    |
| ------------------------- | ------------ | ------------------------------------------------------- |
| 環境構築                  | 1 日         | Expo プロジェクト作成、Supabase 接続、i18n セットアップ |
| Cloudflare Workers        | 1 日         | Gemini プロキシ実装、デプロイ                           |
| Web 側追加実装            | 2 日         | `emergency_rotations` テーブル + 管理画面 + データ投入  |
| オンボーディング + 設定   | 1 日         | プロフィール、設定画面                                  |
| ホーム + ボトムナビ       | 1 日         | ナビゲーション構造、ホーム画面                          |
| 条件検索 + 病院詳細       | 2 日         | 検索 UI、詳細画面、Linking                              |
| 症状アンケート + AI 結果  | 3 日         | アンケートステップ、AI 連携、フォールバック             |
| 緊急時ガイド + カレンダー | 2 日         | 当番医表示、月次カレンダー                              |
| 地域交通サービス          | 2 日         | 一覧、詳細、病院連携                                    |
| かかりつけ医              | 1 日         | 登録、並び替え、削除                                    |
| ローカルキャッシュ        | 1 日         | AsyncStorage 戦略、オフライン対応                       |
| テスト + 微調整           | 2 日         | 実機検証、文言調整                                      |
| Play Store 提出           | 1 日         | アイコン・スクショ・プライバシーポリシー                |
| **合計**                  | **約 20 日** |                                                         |

---

## 15. 関連ドキュメント

- **`Implementation-Spec.md`** — 既存 Web の実装仕様
- **`Database-Schema.md`** — 既存 DB スキーマ
- **`hospitals_2026-05-26.csv`** — 病院マスタの現状データ
- **`CLAUDE.md`** — Claude Code 用プロジェクトガイド（別途作成）

---

## 16. 確認事項（未決定）

- [ ] アプリの正式名称（仮称「お医者さんナビ」のまま進めるか、ローンチ前に再検討）
- [ ] アプリアイコンのデザイン
- [ ] プライバシーポリシーの本文
- [ ] Cloudflare Workers のドメイン（`oishasan-navi-ai.workers.dev` 等）
- [ ] Google Play Developer アカウントの準備（年 25 ドル）
- [ ] EAS Build の有料プラン要否（Phase 1 は無料プランの月間ビルド数で足りる見込み）

---

**以上**
