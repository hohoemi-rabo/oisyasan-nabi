// Mirrors public.transport_services (verified via Supabase MCP).

export type ServiceType = 'route_bus' | 'demand' | 'taxi' | 'welfare_taxi' | 'shuttle';

export type TransportService = {
  id: string;
  name: string;
  operator: string;
  service_type: ServiceType;
  service_area: string[];
  phone: string | null;
  website_url: string | null;
  booking_url: string | null;
  booking_method: string | null;
  advance_booking_required: boolean | null;
  booking_deadline_hours: number | null;
  eligibility: string | null;
  fare_info: string | null;
  wheelchair_accessible: boolean | null;
  notes: string | null;
  is_active: boolean | null;
};
