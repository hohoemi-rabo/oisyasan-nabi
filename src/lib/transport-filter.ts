import type { ServiceType, TransportService } from '@/src/types/transport';

export type TransportFilters = {
  municipalities: string[];
  serviceTypes: ServiceType[];
  barrierFree: boolean;
};

// ローカルキャッシュ上でのフィルタ（オフラインでも動作）。各軸は空 = その軸で絞らない。
export function filterTransport(
  services: TransportService[],
  { municipalities, serviceTypes, barrierFree }: TransportFilters,
): TransportService[] {
  return services.filter((s) => {
    if (municipalities.length > 0 && !s.service_area.some((a) => municipalities.includes(a))) {
      return false;
    }
    if (serviceTypes.length > 0 && !serviceTypes.includes(s.service_type)) return false;
    if (barrierFree && !s.wheelchair_accessible) return false;
    return true;
  });
}
