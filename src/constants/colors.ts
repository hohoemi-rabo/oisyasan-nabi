// 立体的医療UI のカラートークン（DESIGN-GUIDELINES.md §2）。
// グラデ・影・診療科タグなど className で表現しづらい箇所はこの JS 定数を使う。
// className 側の面/背景/文字トークン（bg/surface/line/ink）は tailwind.config.js に対応。

export const colors = {
  // ブランド（プライマリ＝医療のティール：信頼・清潔・健康）
  teal: { 50: '#E6FAF6', 100: '#CCF3EC', 500: '#0EA5A4', 600: '#0D9488', 700: '#0F766E' },
  // 検索・情報系（ブルー）
  blue: { 50: '#EAF2FF', 100: '#DBE8FF', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
  // 緊急（レッド）※緊急用途のみに限定
  red: { 50: '#FEF0F0', 100: '#FEE2E2', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C' },
  // 通院・営業中（グリーン）
  green: { 50: '#ECFDF5', 100: '#D1FAE5', 500: '#10B981', 600: '#059669', 700: '#047857' },
  // 診療科タグ用の補助色
  amber: { 50: '#FEF6E7', 100: '#FDECC8', 600: '#D97706', 700: '#B45309' },
  pink: { 50: '#FDF0F6', 600: '#DB2777', 700: '#BE185D' },
  purple: { 50: '#F3F0FF', 600: '#7C3AED', 700: '#6D28D9' },
  // テキスト（slate 系）
  ink: { 900: '#0F172A', 700: '#334155', 500: '#64748B', 400: '#94A3B8', 300: '#CBD5E1' },
  // 面・背景・境界
  surface: '#FFFFFF',
  bg: '#EEF3F8',
  line: '#E8EEF4',
} as const;

// ヒーロー3種のグラデーション + カラー影（DESIGN-GUIDELINES.md §5.1）。
export const heroGradients = {
  teal: { colors: ['#14B8A6', '#0D9488', '#0F766E'] as const, shadow: '#0D9488' },
  blue: { colors: ['#3B82F6', '#2563EB', '#1D4ED8'] as const, shadow: '#2563EB' },
  red: { colors: ['#F87171', '#EF4444', '#DC2626'] as const, shadow: '#DC2626' },
} as const;

export type HeroVariant = keyof typeof heroGradients;

// 旧 BrandColors 互換（既存 6 ファイルが順次 restyle されるまでのブリッジ）。
// 新規実装では colors を直接使うこと。
export const BrandColors = {
  primary: colors.teal[600],
  primaryDark: colors.teal[700],
  emergency: colors.red[600],
  emergencyDark: colors.red[700],
  success: colors.green[600],
  warning: colors.amber[600],
  info: colors.blue[600],
  neutral50: colors.bg,
  neutral100: colors.line,
  neutral500: colors.ink[500],
  neutral900: colors.ink[900],
} as const;

export type BrandColor = keyof typeof BrandColors;
