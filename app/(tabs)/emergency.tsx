import { ScreenPlaceholder } from '@/src/components/common/screen-placeholder';
import { t } from '@/src/i18n';

export default function EmergencyScreen() {
  return <ScreenPlaceholder title={t('tabs.emergency')} ticket="11" />;
}
