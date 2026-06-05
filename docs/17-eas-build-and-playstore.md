# 17. EAS Build / Update + Play Store 提出

**ステータス**: in_progress（ビルド不要の準備＝eas.json・android.package・規約/ポリシー草案 まで完了。実ビルド/提出は残り）
**関連要件**: REQUIREMENTS.md §9 / §10 / §16
**依存**: 全機能チケット（最終工程）
**ブロックする**: なし

## 目的

`eas.json` を整備し、Play Store 提出可能な production AAB を生成する。OTA 用の Update チャネルを準備する。アイコン・スクリーンショット・プライバシーポリシーを揃える。

## 完了条件 (DoD)

- `eas.json` に `development` / `preview` / `production` の 3 プロファイルがあり、`base` で共通化されている。
- `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` / `EXPO_PUBLIC_AI_WORKER_URL` が EAS の各 environment に登録されている。
- `eas build --profile production --platform android` が成功し、AAB が出力される。
- Play Store Console にアプリが作成され、内部テスト or クローズドテストにアップロード済み。
- アイコン・アダプティブアイコン・スプラッシュが本プロジェクト用に差し替わっている。
- プライバシーポリシーが Web 上に公開され、設定画面と Play Store から参照可能。

## Todo

- [ ] `eas-cli` の準備（`npx eas-cli login`、`npx eas init` でプロジェクト連携）※未実施
- [×] `eas.json` の作成（base + development / preview / production、`appVersionSource: local`、production は `app-bundle` + `autoIncrement`、各 `channel` 設定）
- [×] クラウドビルド向けに公開環境変数を登録 → `eas.json` の `base.env` に `EXPO_PUBLIC_SUPABASE_URL`/`_ANON_KEY`/`_AI_WORKER_URL` を直書き（全プロファイル継承）。3 つとも公開可の値（REQUIREMENTS §9.2）なので Dashboard ではなく eas.json に埋め込んで `.env.local` 不在のクラウドでも起動できるようにした。秘匿が必要になったら `eas env:create` へ移行する。
- [×] `app.json` の `android.package` を **`com.rabohohoemi.oisyasannavi`** に確定（+ `versionCode: 1`）。`name`/`slug`/`version(1.0.0)` は既存
- [ ] アイコン（聴診器 + 矢印モチーフ）を `assets/images/icon.png` / `adaptive-icon.png` に差し替え ※現状は Expo テンプレ既定
- [ ] スプラッシュ画像を差し替え ※同上
- [ ] Android 7.0 (API 24) 以上のサポートを `app.json` で明示（必要なら）
- [ ] `eas build --profile preview --platform android` で実機検証 ※**クラウド枠 or `--local`**
- [ ] `eas build --profile production --platform android` で AAB 生成 ※同上
- [ ] Play Store Console でアプリ作成（仮称「お医者さんナビ」）
- [×] プライバシーポリシー本文の作成 → `docs/privacy-policy.md`（収集情報・匿名ログ目的・**Gemini 経由の第三者提供**・データ削除方法・端末権限を記載）。事業者名=**ほほえみラボ**／連絡先=rabo.hohoemi@gmail.com／制定日=2026-06-05 を確定。最近の仕様変更（アンケート下書き非保存・設備フィルタ撤去）も反映済み。
- [×] 利用規約本文の作成 → `docs/terms-of-use.md`（免責中心）。事業者名・連絡先・日付を確定。
- [×] プライバシーポリシー/利用規約をホスティング → GitHub Pages（`main` の `/docs`、`.nojekyll` で HTML をそのまま配信。ソースは `docs/{privacy-policy,terms-of-use,index}.html`）。公開 URL を `app/settings/about.tsx` の `PRIVACY_URL`/`TERMS_URL` に投入済み。
  - プライバシー: https://hohoemi-rabo.github.io/oisyasan-nabi/privacy-policy.html
  - 利用規約: https://hohoemi-rabo.github.io/oisyasan-nabi/terms-of-use.html
  - ※Play Console のプライバシーポリシー欄にも上記 URL を登録する。
- [ ] スクリーンショット 5 枚（ホーム / 症状結果 / 緊急時 / 病院詳細 / 通院）
- [ ] アプリ概要文・短い説明文・カテゴリ「医療」設定
- [ ] 内部テストトラックにアップロード
- [ ] EAS Update のチャネル設定（`production` チャネル）※eas.json に `channel` は記載済み、`eas update:configure` + `runtimeVersion` はビルド時

## 留意事項

- パッケージ ID は **`com.rabohohoemi.oisyasannavi` で確定**（app.json 反映済み）。一度公開すると変更困難。
- プライバシーポリシーで Gemini 経由のデータ送信は必ず明記（Play Store 審査で必須）→ `docs/privacy-policy.md` の §3.1 に記載済み。
- Play Console の年 25 ドル支払いを忘れない。
- **EAS クラウドビルドの無料枠を使い切っている場合**は、翌月リセットを待つか、`eas build --platform android --local`（クレジット消費なし）か `npx expo prebuild && cd android && ./gradlew :app:bundleRelease` でローカルビルド可（WSL2 では JDK 17 + Android SDK の用意が必要）。AAB は公開時に 1 個作ればよく、毎回ビルド不要。
- AI 判定が動く前提として Workers は本番デプロイ済み（`EXPO_PUBLIC_AI_WORKER_URL`）。クラウドビルドではこの 3 つの公開環境変数を EAS 側にも登録すること。
