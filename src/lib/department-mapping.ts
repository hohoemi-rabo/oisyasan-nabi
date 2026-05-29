// 部位 → 診療科マッピング（フォールバック判定用）。
// workers/src/department-mapping.ts の移植。部位・症状値はアンケート
// （src/constants/symptom-options.ts）のカノニカル値に合わせている。

const DEPARTMENT_MAPPING: Record<string, string[]> = {
  のど: ['耳鼻いんこう科', '内科'],
  むね: ['内科', '循環器内科', '呼吸器内科'],
  おなか: ['内科', '消化器内科', '外科'],
  あし: ['整形外科', '内科'],
  うで: ['整形外科', '内科'],
  あたま: ['内科', '脳神経外科', '神経内科'],
  かお: ['皮膚科', '耳鼻いんこう科', '内科'],
  せなか: ['整形外科', '内科'],
  こし: ['整形外科', '内科'],
  その他: ['内科'],
};

const EMERGENCY_SYMPTOMS = ['息苦しい', '熱', 'めまい'];
const SKIN_SYMPTOMS = ['かゆい', '赤い・はれ', 'しこり'];

export function getDepartments(locations: string[], symptoms: string[]): string[] {
  const allDepartments: string[] = [];
  for (const location of locations) {
    const depts = DEPARTMENT_MAPPING[location] ?? ['内科'];
    allDepartments.push(...depts);
  }

  let departments = allDepartments.length > 0 ? [...allDepartments] : ['内科'];

  const hasEmergency = symptoms.some((s) => EMERGENCY_SYMPTOMS.includes(s));
  if (hasEmergency && !departments.includes('内科')) {
    departments = ['内科', ...departments];
  } else if (hasEmergency && departments[0] !== '内科') {
    departments = ['内科', ...departments.filter((d) => d !== '内科')];
  }

  const hasSkinSymptom = symptoms.some((s) => SKIN_SYMPTOMS.includes(s));
  if (hasSkinSymptom && !departments.includes('皮膚科')) {
    const internalIndex = departments.indexOf('内科');
    if (internalIndex !== -1) {
      departments.splice(internalIndex + 1, 0, '皮膚科');
    } else {
      departments.push('皮膚科');
    }
  }

  return Array.from(new Set(departments));
}
