import { supabase } from '@/src/lib/supabase';

type LogType = 'search' | 'symptom';

// fire-and-forget anonymous logging. Errors are intentionally swallowed so a failed
// log never blocks or surfaces to the UI.
export function logSearch(
  logType: LogType,
  searchData: Record<string, unknown>,
  area?: string | null,
): void {
  void (async () => {
    try {
      await supabase.from('search_logs').insert({
        log_type: logType,
        search_data: searchData,
        area: area ?? null,
      });
    } catch {
      // intentionally swallowed
    }
  })();
}
