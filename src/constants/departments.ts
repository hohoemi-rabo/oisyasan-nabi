export const DEPARTMENTS = [
  '内科',
  '外科',
  '小児科',
  '産婦人科',
  '皮膚科',
  '眼科',
  '耳鼻いんこう科',
  '歯科',
  '整形外科',
  '精神科',
  '心療内科',
  '泌尿器科',
  '形成外科',
  '放射線科',
  'リハビリテーション科',
  '循環器内科',
  '消化器内科',
  '呼吸器内科',
  '脳神経外科',
  '救急科',
] as const;

export type Department = (typeof DEPARTMENTS)[number];
