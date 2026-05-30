import { supabase } from '@/src/lib/supabase';
import type { Profile } from '@/src/stores/profile-store';
import type { QuestionnaireDraft } from '@/src/stores/questionnaire-store';
import type { SearchConditions } from '@/src/types/hospital';

type LogType = 'search' | 'symptom';

// fire-and-forget anonymous logging. Errors never block or surface to the UI.
function insertLog(
  logType: LogType,
  searchData: Record<string, unknown>,
  area: string | null,
): void {
  void (async () => {
    try {
      await supabase.from('search_logs').insert({
        log_type: logType,
        search_data: searchData,
        area,
      });
    } catch {
      // payload は出さず、失敗の事実だけ残す。
      console.warn('[search-log] insert failed');
    }
  })();
}

// 条件検索結果の表示時に記録（検索条件のみ。個人特定情報なし）。
export function logSearch(conditions: SearchConditions, area?: string | null): void {
  insertLog('search', { ...conditions }, area ?? null);
}

// AI 結果の表示時に記録。自由記述 memo とプロフィール（年齢層・移動補助）は
// 個人特定リスクを避けるため search_data に含めない。居住エリアは area 列へ。
export function logSymptom(draft: QuestionnaireDraft, profile: Profile): void {
  insertLog(
    'symptom',
    {
      location: draft.location,
      duration: draft.duration,
      symptoms: draft.symptoms,
      lumpSize: draft.lumpSize,
      conditions: draft.conditions,
      medicine: draft.medicine,
    },
    profile.residentialArea ?? null,
  );
}
