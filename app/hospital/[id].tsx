import { useLocalSearchParams } from 'expo-router';

import { ScreenPlaceholder } from '@/src/components/common/screen-placeholder';

export default function HospitalDetailScreen() {
  // TODO(ticket-08): render full hospital detail using id below.
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ScreenPlaceholder title={`病院詳細 (${id ?? '?'})`} ticket="08" />;
}
