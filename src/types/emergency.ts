// Mirrors public.emergency_rotations (verified via Supabase MCP).

export type RotationType =
  | 'night_emergency'
  | 'duty_doctor'
  | 'duty_dentist'
  | 'duty_pharmacy';

export type EmergencyRotation = {
  id: string;
  duty_date: string; // 'yyyy-MM-dd'
  rotation_type: RotationType;
  area: string;
  department: string | null;
  hospital_id: string | null;
  facility_name: string;
  phone: string;
  start_time: string; // 'HH:mm:ss'
  end_time: string; // 'HH:mm:ss'
  note: string | null;
  source_month: string; // 'yyyy-MM'
  created_at: string;
  updated_at: string;
};
