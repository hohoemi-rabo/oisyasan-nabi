# 17. EAS Build / Update + Play Store 提出

**ステータス**: pending
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

- [ ] `eas-cli` の準備（`npx eas-cli login`、`npx eas init` でプロジェクト連携）
- [ ] `eas.json` の作成（base + development / preview / production）
- [ ] EAS Dashboard で環境変数を development / preview / production に登録
- [ ] `app.json` の `name` / `slug` / `version` / `android.package`（`com.hohoemilab.oishasan_navi` 仮）を確定
- [ ] アイコン（聴診器 + 矢印モチーフ）を `assets/images/icon.png` / `adaptive-icon.png` に差し替え
- [ ] スプラッシュ画像を差し替え
- [ ] Android 7.0 (API 24) 以上のサポートを `app.json` で明示（必要なら）
- [ ] `eas build --profile preview --platform android` で実機検証
- [ ] `eas build --profile production --platform android` で AAB 生成
- [ ] Play Store Console でアプリ作成（仮称「お医者さんナビ」）
- [ ] プライバシーポリシー本文の作成（収集情報・匿名ログ目的・Gemini 経由の第三者提供・データ削除方法）
- [ ] プライバシーポリシーをホスティング（既存 Web の `/privacy` 等）
- [ ] スクリーンショット 5 枚（ホーム / 症状結果 / 緊急時 / 病院詳細 / 通院）
- [ ] アプリ概要文・短い説明文・カテゴリ「医療」設定
- [ ] 内部テストトラックにアップロード
- [ ] EAS Update のチャネル設定（`production` チャネル）

## 留意事項

- パッケージ ID は一度公開すると変更困難。`com.hohoemilab.oishasan_navi` で確定するか先に判断する。
- プライバシーポリシーで Gemini 経由のデータ送信は必ず明記（Play Store 審査で必須）。
- Play Console の年 25 ドル支払いを忘れない。
- EAS Build の無料枠（月 30 ビルド）で Phase 1 は足りる見込み。
