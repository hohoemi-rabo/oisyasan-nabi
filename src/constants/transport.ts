import type { ServiceType } from '@/src/types/transport';

// フィルター chip 反復用のランタイム配列（ServiceType union と一致させる）。
export const SERVICE_TYPES: ServiceType[] = [
  'route_bus',
  'demand',
  'taxi',
  'welfare_taxi',
  'shuttle',
];
