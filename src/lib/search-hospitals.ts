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
    if (c.facilities.barrierFree && !h.barrier_free) return false;
    if (c.facilities.parking && !h.parking) return false;
    if (c.facilities.emergency && !h.emergency_available) return false;
    return true;
  });
}
