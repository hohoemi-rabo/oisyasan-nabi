import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { CollapsibleSection } from '@/src/components/symptoms/collapsible-section';
import { ResultHospitalCard } from '@/src/components/symptoms/result-hospital-card';
import { UrgencyBadge } from '@/src/components/symptoms/urgency-badge';
import { LUMP_SYMPTOM_VALUE } from '@/src/constants/symptom-options';
import { t } from '@/src/i18n';
import { fetchAiRecommend } from '@/src/lib/ai-worker';
import { buildRecommendRequest } from '@/src/lib/build-recommend-request';
import { getDepartments } from '@/src/lib/department-mapping';
import { fallbackUrgency } from '@/src/lib/fallback-urgency';
import { scoreHospitals } from '@/src/lib/hospital-scoring';
import { saveResultImage } from '@/src/lib/save-result-image';
import { logSearch } from '@/src/lib/search-log';
import { useFavoritesStore } from '@/src/stores/favorites-store';
import { useHospitalsStore } from '@/src/stores/hospitals-store';
import { useProfileStore } from '@/src/stores/profile-store';
import { useQuestionnaireStore, type QuestionnaireDraft } from '@/src/stores/questionnaire-store';
import type { AIRecommendResponse } from '@/src/types/ai';

function buildLocalFallback(location: string[], symptoms: string[]): AIRecommendResponse {
  const urgency = fallbackUrgency(symptoms);
  return {
    urgency,
    urgency_reason: t(`symptoms.result.fallback.reason.${urgency}`),
    recommended_departments: getDepartments(location, symptoms),
    department_reason: t('symptoms.result.fallback.departmentReason', {
      location: location.join('、'),
    }),
    advice: t(
      urgency === 'emergency'
        ? 'symptoms.result.fallback.adviceEmergency'
        : 'symptoms.result.fallback.adviceNormal',
    ),
    disclaimer: t('symptoms.result.disclaimer'),
    source: 'fallback',
  };
}

function buildSummaryText(d: QuestionnaireDraft): string {
  const dash = '—';
  const medicine =
    d.medicine === null
      ? dash
      : d.medicine
        ? t('symptoms.questionnaire.medicine.yes')
        : t('symptoms.questionnaire.medicine.no');

  const lines = [
    `${t('symptoms.questionnaire.confirm.fields.location')}: ${d.location.join('、') || dash}`,
    `${t('symptoms.questionnaire.confirm.fields.duration')}: ${d.duration ?? dash}`,
    `${t('symptoms.questionnaire.confirm.fields.symptoms')}: ${d.symptoms.join('、') || dash}`,
  ];
  if (d.symptoms.includes(LUMP_SYMPTOM_VALUE) && d.lumpSize) {
    lines.push(`${t('symptoms.questionnaire.confirm.fields.lumpSize')}: ${d.lumpSize}`);
  }
  if (d.conditions.length > 0) {
    lines.push(`${t('symptoms.questionnaire.confirm.fields.conditions')}: ${d.conditions.join('、')}`);
  }
  lines.push(`${t('symptoms.questionnaire.confirm.fields.medicine')}: ${medicine}`);
  if (d.memo.trim()) {
    lines.push(`${t('symptoms.questionnaire.confirm.fields.memo')}: ${d.memo.trim()}`);
  }
  return lines.join('\n');
}

export default function SymptomsResultsScreen() {
  const qHydrated = useQuestionnaireStore((s) => s.hasHydrated);
  const pHydrated = useProfileStore((s) => s.hasHydrated);
  const draft = useQuestionnaireStore(
    useShallow((s) => ({
      location: s.location,
      duration: s.duration,
      symptoms: s.symptoms,
      lumpSize: s.lumpSize,
      conditions: s.conditions,
      medicine: s.medicine,
      memo: s.memo,
    })),
  );

  const hospitals = useHospitalsStore((s) => s.data);
  const hospitalsLoadedAt = useHospitalsStore((s) => s.loadedAt);
  const hospitalsLoading = useHospitalsStore((s) => s.isLoading);
  const loadHospitals = useHospitalsStore((s) => s.load);
  const favorites = useFavoritesStore((s) => s.items);

  const [result, setResult] = useState<AIRecommendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [saving, setSaving] = useState(false);
  const summaryRef = useRef<View | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (hospitalsLoadedAt === null && !hospitalsLoading) loadHospitals();
  }, [hospitalsLoadedAt, hospitalsLoading, loadHospitals]);

  useEffect(() => {
    if (!qHydrated || !pHydrated || ranRef.current) return;
    ranRef.current = true;

    const draftNow = useQuestionnaireStore.getState();
    const profileNow = useProfileStore.getState();
    const request = buildRecommendRequest(draftNow, profileNow);

    logSearch('symptom', request as unknown as Record<string, unknown>, profileNow.residentialArea ?? null);

    fetchAiRecommend(request)
      .then((res) => {
        setResult(res);
        setIsFallback(res.source === 'fallback');
      })
      .catch(() => {
        setResult(buildLocalFallback(draftNow.location, draftNow.symptoms));
        setIsFallback(true);
      })
      .finally(() => setLoading(false));
  }, [qHydrated, pHydrated]);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.hospitalId)), [favorites]);
  const scoredHospitals = useMemo(() => {
    if (!result) return [];
    return scoreHospitals(hospitals, result.recommended_departments, favoriteIds, result.urgency);
  }, [result, hospitals, favoriteIds]);

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveResultImage(summaryRef);
    setSaving(false);
    Alert.alert(t(ok ? 'symptoms.result.saveImageDone' : 'symptoms.result.saveImageFail'));
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-neutral-50">
      <View className="flex-row items-center px-4 py-2 border-b border-neutral-100 bg-white">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('symptoms.questionnaire.back')}
          onPress={() => router.back()}
          className="min-h-[44px] min-w-[44px] items-start justify-center">
          <Text className="text-2xl text-neutral-700">‹</Text>
        </Pressable>
        <Text className="text-lg font-bold text-neutral-900">{t('symptoms.result.title')}</Text>
      </View>

      {loading || !result ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-3 text-sm text-neutral-500">{t('symptoms.result.loading')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="px-5 pt-4 pb-8">
          {isFallback ? (
            <View className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 mb-4">
              <Text className="text-sm text-amber-800">{t('symptoms.result.fallbackNotice')}</Text>
            </View>
          ) : null}

          <UrgencyBadge urgency={result.urgency} />
          <Text className="text-base text-neutral-900 mt-3 leading-relaxed">
            {result.urgency_reason}
          </Text>
          <Text className="text-base text-neutral-800 mt-3 leading-relaxed">{result.advice}</Text>
          <Text className="text-xs text-neutral-500 mt-3 leading-relaxed">
            {result.disclaimer}
          </Text>

          <View className="h-4" />

          <CollapsibleSection title={t('symptoms.result.recommendedDepartments')} defaultOpen>
            <View className="flex-row flex-wrap mb-2">
              {result.recommended_departments.map((dep) => (
                <View key={dep} className="px-3 py-1 rounded-full bg-blue-100 mr-2 mb-2">
                  <Text className="text-sm font-semibold text-blue-700">{dep}</Text>
                </View>
              ))}
            </View>
            <Text className="text-sm text-neutral-600 leading-relaxed">
              {result.department_reason}
            </Text>
          </CollapsibleSection>

          <CollapsibleSection title={t('symptoms.result.summary.title')}>
            <View ref={summaryRef} collapsable={false} className="bg-white rounded-xl py-1">
              <Text className="text-sm text-neutral-800 leading-relaxed">
                {buildSummaryText(draft)}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('symptoms.result.saveImage')}
              disabled={saving}
              onPress={handleSave}
              className={`mt-3 min-h-[48px] items-center justify-center rounded-xl ${
                saving ? 'bg-neutral-300' : 'bg-blue-600 active:bg-blue-700'
              }`}>
              <Text className="text-base font-semibold text-white">
                {t('symptoms.result.saveImage')}
              </Text>
            </Pressable>
          </CollapsibleSection>

          <Text className="text-lg font-bold text-neutral-900 mt-4 mb-3">
            {t('symptoms.result.hospitals.title')}
          </Text>
          {hospitals.length === 0 ? (
            <Text className="text-sm text-neutral-500 py-6 text-center">
              {t('symptoms.result.hospitals.emptyData')}
            </Text>
          ) : scoredHospitals.length === 0 ? (
            <Text className="text-sm text-neutral-500 py-6 text-center">
              {t('symptoms.result.hospitals.emptyMatch')}
            </Text>
          ) : (
            scoredHospitals.map((hospital) => (
              <ResultHospitalCard
                key={hospital.id}
                hospital={hospital}
                matchedDepartments={result.recommended_departments}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
