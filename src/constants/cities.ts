export const CITIES = [
  '飯田市',
  '松川町',
  '高森町',
  '阿智村',
  '阿南町',
  '下条村',
  '売木村',
  '天龍村',
  '泰阜村',
  '喬木村',
  '豊丘村',
  '大鹿村',
  '根羽村',
  '平谷村',
] as const;

export type City = (typeof CITIES)[number];

export const OUTSIDE_AREA = '区域外' as const;

export const RESIDENTIAL_AREAS = [...CITIES, OUTSIDE_AREA] as const;

export type ResidentialArea = (typeof RESIDENTIAL_AREAS)[number];
