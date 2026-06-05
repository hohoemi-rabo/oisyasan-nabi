import { colors } from '@/src/constants/colors';

// 診療科タグの色分け（DESIGN-GUIDELINES.md §5.4）。
// カテゴリでグルーピングして色を割り当て、一目で情報が整理されるようにする。

export type TagColor = { bg: string; text: string };

const TAG_PALETTE: Record<string, TagColor> = {
  blue: { bg: colors.blue[50], text: colors.blue[700] },
  teal: { bg: colors.teal[50], text: colors.teal[700] },
  amber: { bg: colors.amber[50], text: colors.amber[700] },
  pink: { bg: colors.pink[50], text: colors.pink[700] },
  purple: { bg: colors.purple[50], text: colors.purple[700] },
  gray: { bg: '#F1F5F9', text: colors.ink[500] },
};

const DEPT_TO_COLOR: Record<string, keyof typeof TAG_PALETTE> = {
  内科: 'blue',
  消化器内科: 'blue',
  循環器内科: 'blue',
  呼吸器内科: 'teal',
  呼吸器科: 'teal',
  神経内科: 'blue',
  外科: 'teal',
  整形外科: 'teal',
  脳神経外科: 'teal',
  心臓血管外科: 'teal',
  小児科: 'amber',
  産婦人科: 'pink',
  皮膚科: 'pink',
  耳鼻いんこう科: 'purple',
  眼科: 'purple',
  泌尿器科: 'purple',
  精神科: 'purple',
  アレルギー科: 'amber',
  リハビリテーション科: 'teal',
  放射線科: 'gray',
  救急科: 'gray',
  消化器科: 'teal',
};

export function deptTagColor(name: string): TagColor {
  return TAG_PALETTE[DEPT_TO_COLOR[name] ?? 'gray'];
}

// カード左端アクセントバーの色（主診療科の text 色を使う）。
export function deptAccentColor(name: string): string {
  return deptTagColor(name).text;
}
