import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { FOREGROUND_REFRESH_MS } from '@/src/lib/cache';
import { useEmergencyRotationsStore } from '@/src/stores/emergency-rotations-store';
import { useHospitalsStore } from '@/src/stores/hospitals-store';
import { useTransportServicesStore } from '@/src/stores/transport-services-store';

function loadAll(force: boolean): void {
  void useHospitalsStore.getState().load(force);
  void useTransportServicesStore.getState().load(force);
  void useEmergencyRotationsStore.getState().load(force);
}

// 手動「データを更新」用。全キャッシュを強制再取得し、全て成功したか返す。
export async function refreshAllCaches(): Promise<boolean> {
  await Promise.all([
    useHospitalsStore.getState().load(true),
    useTransportServicesStore.getState().load(true),
    useEmergencyRotationsStore.getState().load(true),
  ]);
  return (
    !useHospitalsStore.getState().error &&
    !useTransportServicesStore.getState().error &&
    !useEmergencyRotationsStore.getState().error
  );
}

// 起動時（全 hydrate 完了後に isFresh ガード付きで初回ロード）と、
// フォアグラウンド復帰時（バックグラウンド 1h+ 経過で強制再取得）にキャッシュを最新化する。
export function useCacheSync(): void {
  const hHospitals = useHospitalsStore((s) => s.hasHydrated);
  const hTransport = useTransportServicesStore((s) => s.hasHydrated);
  const hEmergency = useEmergencyRotationsStore((s) => s.hasHydrated);
  const allHydrated = hHospitals && hTransport && hEmergency;
  const didInitial = useRef(false);

  useEffect(() => {
    if (allHydrated && !didInitial.current) {
      didInitial.current = true;
      loadAll(false);
    }
  }, [allHydrated]);

  useEffect(() => {
    let backgroundedAt: number | null = null;
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'background' || state === 'inactive') {
        if (backgroundedAt === null) backgroundedAt = Date.now();
      } else if (state === 'active') {
        if (backgroundedAt !== null && Date.now() - backgroundedAt > FOREGROUND_REFRESH_MS) {
          loadAll(true);
        }
        backgroundedAt = null;
      }
    });
    return () => sub.remove();
  }, []);
}
