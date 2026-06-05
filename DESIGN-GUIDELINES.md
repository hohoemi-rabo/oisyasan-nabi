# お医者さんナビ — デザインガイドライン（立体的医療UI）

**目的**: 平面的なUIを、医療らしい清潔感・信頼感を保ちつつ立体的で魅力的に刷新する
**対象**: Expo（React Native）+ NativeWind
**作成日**: 2026年5月26日
**関連**: `design-mockup.html`（ビジュアル確認用）

---

## 1. デザイン原則

立体感は「派手にする」ことではなく、以下3つの設計で生まれる。

| 原則 | 内容 |
|------|------|
| **1. 背景と面の分離** | 背景を純白にしない。淡いブルーグレーの上に白いカードを置くことで、カードが浮き上がる |
| **2. やわらかい多層シャドウ** | 1枚の濃い影ではなく、薄い影を2層重ねる。医療アプリらしい上品な奥行き |
| **3. 色で情報を整理** | すべて灰色にしない。診療科・状態・種別を色分けし、一目で意味が伝わるように |

**やってはいけないこと**:
- 純白(#FFF)背景に白カード＋細い灰色線（＝今の状態。沈んで見える）
- 全タグ・全チップを同じ灰色アウトラインにする
- 濃すぎる影、ぼかしすぎる影（医療アプリの清潔感が損なわれる）

---

## 2. カラートークン

`src/constants/colors.ts` に定義。

```typescript
export const colors = {
  // ブランド（プライマリ＝医療のティール：信頼・清潔・健康）
  teal: { 50:'#E6FAF6', 100:'#CCF3EC', 500:'#0EA5A4', 600:'#0D9488', 700:'#0F766E' },
  // 検索・情報系（ブルー）
  blue: { 50:'#EAF2FF', 100:'#DBE8FF', 500:'#3B82F6', 600:'#2563EB', 700:'#1D4ED8' },
  // 緊急（レッド）※緊急用途のみに限定
  red:  { 50:'#FEF0F0', 100:'#FEE2E2', 500:'#EF4444', 600:'#DC2626', 700:'#B91C1C' },
  // 通院・営業中（グリーン）
  green:{ 50:'#ECFDF5', 100:'#D1FAE5', 500:'#10B981', 600:'#059669', 700:'#047857' },
  // 診療科タグ用の補助色
  amber:{ 50:'#FEF6E7', 600:'#D97706', 700:'#B45309' },
  pink: { 50:'#FDF0F6', 600:'#DB2777', 700:'#BE185D' },
  purple:{ 50:'#F3F0FF', 600:'#7C3AED', 700:'#6D28D9' },
  // テキスト（slate系）
  ink:  { 900:'#0F172A', 700:'#334155', 500:'#64748B', 400:'#94A3B8', 300:'#CBD5E1' },
  // 面・背景・境界
  surface: '#FFFFFF',   // カード
  bg:      '#EEF3F8',   // 画面背景（ここが最重要：純白にしない）
  line:    '#E8EEF4',   // 極薄の境界線
} as const;
```

### 2.1 用途別カラールール

| 用途 | 色 |
|------|-----|
| 画面背景 | `colors.bg`（#EEF3F8） |
| カード面 | `colors.surface`（#FFF） |
| プライマリ操作（電話ボタン等） | `colors.teal[600]` |
| 「症状から探す」ヒーロー | ティールのグラデ |
| 「条件で探す」ヒーロー | ブルーのグラデ |
| 「緊急時」ヒーロー・119 | レッドのグラデ |
| 営業中バッジ | グリーン |
| 通院サービス | グリーン |
| 本文テキスト | `colors.ink[900]` |
| 補助テキスト | `colors.ink[500]` |

---

## 3. シャドウ（立体感の核）

React Nativeは iOS と Android で影の指定が異なる。**両方を指定する共通スタイルオブジェクト**を用意する。

`src/constants/shadows.ts`:

```typescript
import { Platform } from 'react-native';

export const shadows = {
  // 小：サブカード・リスト項目
  sm: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
  }),

  // 標準：病院カード・情報カード（最も使う）
  card: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
    },
    android: { elevation: 4 },
  }),

  // 強：モーダル・浮かせたい要素
  lift: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
  }),
};

// カラー影（ヒーローボタンが「光って浮く」演出）
export const coloredShadow = (hex: string) => Platform.select({
  ios: {
    shadowColor: hex,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.36,
    shadowRadius: 16,
  },
  android: { elevation: 8 },
});
```

**重要**: Androidの `elevation` は影の色を指定できないため、カラー影はiOSのみ完全再現。Androidでは `elevation` + グラデーション自体の鮮やかさで立体感を担保する。

---

## 4. 角丸・余白・タイポグラフィ

### 4.1 角丸（borderRadius）

| 要素 | 値 |
|------|-----|
| ヒーローボタン | 22 |
| カード（病院・情報） | 18 |
| サブカード・リスト項目 | 18 |
| ボタン | 12〜13 |
| タグ | 8 |
| ピル（状態バッジ） | 99（完全な丸） |
| アイコン背景（角丸四角） | 13〜16 |

### 4.2 余白

| 箇所 | 値 |
|------|-----|
| 画面左右パディング | 18 |
| カード内パディング | 16 |
| ヒーロー内パディング | 20（縦） / 18（横） |
| カード間の間隔 | 12〜13 |
| セクションタイトル上 | 14 |

### 4.3 フォント

- 日本語：**Noto Sans JP**（`expo-font` で読み込み、または `@expo-google-fonts/noto-sans-jp`）
- ウェイト：400（本文）/ 700（見出し・強調）/ 900（アプリタイトル・ヒーロー見出し）

| 要素 | サイズ / ウェイト |
|------|------------------|
| アプリタイトル | 25 / 900 |
| 画面見出し | 21 / 900 |
| セクションタイトル | 16 / 700 |
| カード見出し（病院名） | 17 / 700 |
| ヒーロー見出し | 20 / 900 |
| 本文 | 13〜14 / 400〜500 |
| 補助テキスト | 12〜13 / 500（色は ink[500]） |
| タグ・ピル | 11 / 700 |

---

## 5. コンポーネント仕様

### 5.1 ヒーローボタン（ホーム画面）

立体感の主役。`expo-linear-gradient` を使う。

```bash
npx expo install expo-linear-gradient
```

```tsx
import { LinearGradient } from 'expo-linear-gradient';

<Pressable style={[{ borderRadius: 22 }, coloredShadow('#0D9488')]}>
  <LinearGradient
    colors={['#14B8A6', '#0D9488', '#0F766E']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}
  >
    {/* 半透明の角丸アイコン背景 */}
    <View style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="medkit" size={27} color="#fff" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>症状から探す</Text>
      <Text style={{ color: 'rgba(255,255,255,0.92)', fontSize: 13, fontWeight: '500' }}>緊急度もAIが判定</Text>
    </View>
    <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.85)" />
  </LinearGradient>
</Pressable>
```

3種のグラデーション:
| ボタン | colors | カラー影 |
|--------|--------|----------|
| 症状から探す | `['#14B8A6','#0D9488','#0F766E']` | `'#0D9488'` |
| 条件で探す | `['#3B82F6','#2563EB','#1D4ED8']` | `'#2563EB'` |
| 緊急時 | `['#F87171','#EF4444','#DC2626']` | `'#DC2626'` |

> 光の反射演出（`::after` の radial-gradient）は、RNでは省略可。グラデと影だけで十分立体的になる。どうしても入れたい場合は半透明の白い円を `position:absolute` で重ねる。

### 5.2 病院カード

```tsx
<View style={[{ backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.line }, shadows.card]}>
  {/* 左端のアクセントバー（主診療科の色） */}
  <View style={{ position: 'absolute', left: 0, top: 18, bottom: 18, width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: deptColor(primaryDept) }} />

  {/* 病院名 + 営業状態ピル */}
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <Text style={{ fontSize: 17, fontWeight: '700', flex: 1 }}>いちはし内科医院</Text>
    <StatusPill isOpen={false} />
  </View>

  {/* 診療科タグ（色分け） */}
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 10 }}>
    <DeptTag name="内科" /><DeptTag name="呼吸器科" /><DeptTag name="アレルギー科" />
  </View>

  {/* 住所 */}
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
    <Ionicons name="location-outline" size={15} color={colors.ink[400]} />
    <Text style={{ fontSize: 12.5, color: colors.ink[500], fontWeight: '500' }}>長野県飯田市…</Text>
  </View>

  {/* アクションボタン（電話・地図） */}
  <View style={{ flexDirection: 'row', gap: 8, marginTop: 13 }}>
    <PrimaryButton icon="call" label="電話" />
    <GhostButton icon="map" label="地図で開く" />
  </View>
</View>
```

### 5.3 営業状態ピル（StatusPill）

色付きドット + 淡色背景 + 同系の濃い文字。

```tsx
function StatusPill({ isOpen }: { isOpen: boolean }) {
  const c = isOpen
    ? { bg: colors.green[50], dot: colors.green[500], text: colors.green[700], label: '営業中' }
    : { bg: '#F1F5F9', dot: colors.ink[400], text: colors.ink[500], label: '営業時間外' };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: c.bg, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 99 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.dot }} />
      <Text style={{ fontSize: 11, fontWeight: '700', color: c.text }}>{c.label}</Text>
    </View>
  );
}
```

### 5.4 診療科タグの色分け（DeptTag）

診療科をカテゴリでグルーピングして色を割り当てる。

```typescript
// src/constants/deptColors.ts
type TagColor = { bg: string; text: string };

const TAG_PALETTE: Record<string, TagColor> = {
  blue:   { bg: colors.blue[50],   text: colors.blue[700] },
  teal:   { bg: colors.teal[50],   text: colors.teal[700] },
  amber:  { bg: colors.amber[50],  text: colors.amber[700] },
  pink:   { bg: colors.pink[50],   text: colors.pink[700] },
  purple: { bg: colors.purple[50], text: colors.purple[700] },
  gray:   { bg: '#F1F5F9',         text: colors.ink[500] },
};

// 診療科 → 色のマッピング（カテゴリで分類）
const DEPT_TO_COLOR: Record<string, keyof typeof TAG_PALETTE> = {
  '内科': 'blue', '消化器内科': 'blue', '循環器内科': 'blue', '呼吸器内科': 'teal',
  '呼吸器科': 'teal', '神経内科': 'blue',
  '外科': 'teal', '整形外科': 'teal', '脳神経外科': 'teal', '心臓血管外科': 'teal',
  '小児科': 'amber', '産婦人科': 'pink', '皮膚科': 'pink',
  '耳鼻いんこう科': 'purple', '眼科': 'purple', '泌尿器科': 'purple',
  '精神科': 'purple', 'アレルギー科': 'amber', 'リハビリテーション科': 'teal',
  '放射線科': 'gray', '救急科': 'gray', '消化器科': 'teal',
};

export function deptTagColor(name: string): TagColor {
  return TAG_PALETTE[DEPT_TO_COLOR[name] ?? 'gray'];
}
```

```tsx
function DeptTag({ name }: { name: string }) {
  const c = deptTagColor(name);
  return (
    <View style={{ backgroundColor: c.bg, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: c.text }}>{name}</Text>
    </View>
  );
}
```

### 5.5 条件検索のチップ（選択状態を立体化）

今の「全部白アウトライン」をやめ、未選択／選択でメリハリをつける。

```tsx
function FilterChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          paddingVertical: 9, paddingHorizontal: 16, borderRadius: 99, borderWidth: 1.5,
        },
        selected
          ? { backgroundColor: colors.teal[50], borderColor: colors.teal[500], ...shadows.sm }
          : { backgroundColor: colors.surface, borderColor: colors.line },
      ]}
    >
      <Text style={{ fontSize: 14, fontWeight: '700', color: selected ? colors.teal[700] : colors.ink[700] }}>
        {selected ? `✓ ${label}` : label}
      </Text>
    </Pressable>
  );
}
```

### 5.6 ボトムナビ（半透明＋上影）

```tsx
<View style={{
  backgroundColor: 'rgba(255,255,255,0.95)',
  borderTopWidth: 1, borderTopColor: colors.line,
  flexDirection: 'row', paddingTop: 9, paddingBottom: 20,
  ...Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 16 },
    android: { elevation: 12 },
  }),
}}>
  {/* アクティブ時は teal[600]、非アクティブは ink[400] */}
</View>
```

> `expo-blur` の `BlurView` を背景に使うと、よりiOS的な半透明ガラス感が出る（任意）。

### 5.7 設定リスト項目（アイコン背景を色付きに）

絵文字をやめ、色付き角丸アイコン背景に統一。

```tsx
<View style={[{ backgroundColor: colors.surface, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 13 }, shadows.card]}>
  <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: colors.blue[50], alignItems: 'center', justifyContent: 'center' }}>
    <Ionicons name="person" size={21} color={colors.blue[600]} />
  </View>
  <Text style={{ flex: 1, fontSize: 15, fontWeight: '700' }}>プロフィール編集</Text>
  <Ionicons name="chevron-forward" size={20} color={colors.ink[300]} />
</View>
```

アイコン背景色の割り当て例:
| 項目 | アイコン / 色 |
|------|--------------|
| プロフィール編集 | person / blue |
| かかりつけ医 | star / amber |
| アプリについて | information-circle / teal |
| データを更新 | refresh / green |
| データを初期化 | trash / red（テキストも赤） |

### 5.8 119番ボタン・緊急カード

最重要のCTAなので、レッドグラデ + 強いカラー影で最も目立たせる。

```tsx
<Pressable style={[{ borderRadius: 22 }, coloredShadow('#DC2626')]}>
  <LinearGradient colors={['#F87171', '#EF4444', '#DC2626']} start={{x:0,y:0}} end={{x:1,y:1}}
    style={{ borderRadius: 22, padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
    <Ionicons name="call" size={34} color="#fff" />
    <View>
      <Text style={{ color: '#fff', fontSize: 23, fontWeight: '900' }}>119番に電話</Text>
      <Text style={{ color: 'rgba(255,255,255,0.92)', fontSize: 12, fontWeight: '500' }}>救急車・火事はこちら</Text>
    </View>
  </LinearGradient>
</Pressable>
```

夜間急患診療所カードは、淡いブルーのグラデ背景（`['#F0FAFF','#EAF4FF']`）+ ブルーの細枠で「情報カード」として区別する。

---

## 6. アイコン方針

絵文字（🏠⭐🗑など）は使わず、**`@expo/vector-icons` の Ionicons に統一**する。線の太さが揃い、医療アプリらしい一貫性が出る。

| 用途 | アイコン名 |
|------|-----------|
| ホーム | home |
| 探す | search |
| 緊急 | medical（または alert-circle） |
| 通院・バス | bus |
| 設定 | settings |
| 症状 | medkit |
| 電話 | call |
| 地図 | map / location-outline |
| カレンダー | calendar |
| お気に入り | star |
| 夜間 | moon |

---

## 7. 実装の優先順位

立体感への影響が大きい順に着手すると、少ない工数で印象が大きく変わる。

| 優先 | 作業 | 効果 |
|------|------|------|
| ★★★ | 画面背景を `#EEF3F8` に変更 | 全カードが一気に浮く。最小工数で最大効果 |
| ★★★ | 全カードに `shadows.card` を適用 | 平面感が消える |
| ★★★ | ヒーロー3種をグラデ＋カラー影化 | ホームの印象が劇的に変わる |
| ★★☆ | 診療科タグの色分け（DeptTag） | 情報が整理され見やすくなる |
| ★★☆ | 営業状態をStatusPill化 | 状態が瞬時に伝わる |
| ★☆☆ | 検索チップの選択状態を立体化 | 操作感が向上 |
| ★☆☆ | 設定アイコンを色付き背景化 | 統一感・洗練度アップ |
| ★☆☆ | ボトムナビの半透明＋上影 | 仕上がりの質感アップ |

---

## 8. 追加パッケージ

```bash
npx expo install expo-linear-gradient        # グラデーション（必須）
npx expo install @expo-google-fonts/noto-sans-jp expo-font   # 日本語フォント
npx expo install expo-blur                    # ボトムナビのガラス感（任意）
```

---

## 9. ダークモード（将来・任意）

Phase 1 ではライトモード固定で良い。将来対応する場合は、`colors` を light/dark の2セット用意し、背景は `#0B1220`、カード面は `#1E293B`、影は opacity を下げて border を強める方針にする。

---

## 10. 確認用ファイル

- **`design-mockup.html`** — このガイドラインを反映した3画面のビジュアル。ブラウザで開いて実際の立体感を確認できる

---

**以上**
