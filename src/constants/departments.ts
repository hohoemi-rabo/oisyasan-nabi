// Mirror of workers/src/master-data.ts ALL_DEPARTMENTS.
// Order and contents must match exactly — the AI prompt restricts recommendations to this list,
// and the app filters hospitals using the returned department names.
export const DEPARTMENTS = [
  '内科',
  '外科',
  '小児科',
  '整形外科',
  '皮膚科',
  '耳鼻いんこう科',
  '眼科',
  '産婦人科',
  '泌尿器科',
  '脳神経外科',
  '神経内科',
  '循環器内科',
  '呼吸器内科',
  '消化器内科',
  '心臓血管外科',
  '精神科',
  'リハビリテーション科',
  '放射線科',
  'アレルギー科',
  '救急科',
] as const;

export type Department = (typeof DEPARTMENTS)[number];
