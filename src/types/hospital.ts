// Mirrors the public.hospitals + public.hospital_schedules schema (verified via Supabase MCP).
// When DB columns change, also update workers/src/schemas.ts if AI flows use any of these fields.

export type Hospital = {
  id: string;
  name: string;
  category: string[];
  address: string;
  tel: string | null;
  city: string;
  opening_hours: string | null;
  google_map_url: string | null;
  website: string | null;
  note: string | null;
  latitude: number | null;
  longitude: number | null;
  online_consultation: boolean;
  online_consultation_url: string | null;
  parking: boolean;
  parking_capacity: number | null;
  barrier_free: boolean;
  emergency_available: boolean;
  shuttle_bus: boolean;
  shuttle_bus_info: string | null;
  schedules?: HospitalSchedule[];
};

export type HospitalSchedule = {
  id: string;
  hospital_id: string;
  day_of_week: number;
  morning_start: string | null;
  morning_end: string | null;
  afternoon_start: string | null;
  afternoon_end: string | null;
  is_closed: boolean;
  note: string | null;
};

export type SearchConditions = {
  keyword: string;
  departments: string[];
  cities: string[];
};

export const EMPTY_CONDITIONS: SearchConditions = {
  keyword: '',
  departments: [],
  cities: [],
};
