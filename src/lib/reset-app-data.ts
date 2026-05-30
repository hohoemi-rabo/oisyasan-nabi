import { useFavoritesStore } from '@/src/stores/favorites-store';
import { useProfileStore } from '@/src/stores/profile-store';
import { useQuestionnaireStore } from '@/src/stores/questionnaire-store';
import { useSearchConditionsStore } from '@/src/stores/search-conditions-store';

// データ初期化。永続化している 4 つの store を初期状態へ戻す。
// 各 persist middleware が AsyncStorage を初期値で書き戻すため、別途キー削除は不要。
// メモリ常駐 stores（hospitals / transport / emergency）は個人情報を含まない
// リモートキャッシュで未永続のため対象外。
export function resetAppData(): void {
  useProfileStore.getState().reset();
  useFavoritesStore.getState().reset();
  useSearchConditionsStore.getState().clear();
  useQuestionnaireStore.getState().clearDraft();
}
