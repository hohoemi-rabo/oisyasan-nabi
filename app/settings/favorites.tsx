import { ScreenPlaceholder } from '@/src/components/common/screen-placeholder';
import { t } from '@/src/i18n';

export default function FavoritesScreen() {
  // TODO(ticket-14): かかりつけ医一覧（最大5件・並び替え・スワイプ削除）はここに実装する。
  return <ScreenPlaceholder title={t('settings.menu.favorites')} ticket="14" />;
}
