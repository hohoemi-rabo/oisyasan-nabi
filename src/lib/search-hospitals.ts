import type { Hospital, SearchConditions } from '@/src/types/hospital';

export function searchHospitals(hospitals: Hospital[], c: SearchConditions): Hospital[] {
  const kw = c.keyword.trim();
  return hospitals.filter((h) => {
    if (kw && !h.name.includes(kw)) return false;
    if (
      c.departments.length > 0 &&
      !h.category.some((cat) => c.departments.includes(cat))
    ) {
      return false;
    }
    if (c.cities.length > 0 && !c.cities.includes(h.city)) return false;
    return true;
  });
}
