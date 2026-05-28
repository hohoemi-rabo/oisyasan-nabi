import { ALL_DEPARTMENTS } from './master-data';
import type { AIRecommendRequest, FollowUpRequest } from './schemas';

export const SYSTEM_PROMPT = `あなたは南信州地域の医療アクセスを支援するAIアシスタントです。
以下の症状情報を分析し、JSON形式で回答してください。

出力JSON構造:
{
  "urgency": "emergency" | "soon" | "watch",
  "urgency_reason": "緊急度の判定理由（1〜2文）",
  "recommended_departments": ["診療科1", "診療科2"],
  "department_reason": "診療科推奨の理由（1〜2文）",
  "advice": "受診までの注意点（2〜3文）",
  "disclaimer": "※この判定は医療診断ではありません。症状が重い場合はすぐに119番に電話してください。"
}

注意:
- 必ずJSONのみを返してください
- 緊急度は安全側（高め）に判定してください
- 推奨診療科は以下の20科から選択してください: ${ALL_DEPARTMENTS.join('、')}
- 医療行為や診断に該当する表現は避けてください`;

export function buildAiRecommendUserPrompt(req: AIRecommendRequest): string {
  const parts: string[] = [
    `【部位】${req.location.join('、')}`,
    `【期間】${req.duration ?? '未選択'}`,
    `【症状】${req.symptoms.join('、')}`,
  ];
  parts.push(`【持病】${req.conditions.length > 0 ? req.conditions.join('、') : 'なし'}`);
  parts.push(`【服薬】${formatMedicine(req.medicine)}`);
  if (req.memo) parts.push(`【メモ】${req.memo}`);
  if (req.profile?.ageGroup) parts.push(`【年齢層】${req.profile.ageGroup}`);
  if (req.profile?.area) parts.push(`【居住エリア】${req.profile.area}`);

  if (req.followUpAnswers && req.followUpAnswers.length > 0) {
    parts.push('\n【追加情報（深掘り質問への回答）】');
    for (const answer of req.followUpAnswers) {
      parts.push(`Q: ${answer.question_text} → A: ${answer.answer}`);
    }
  }

  return parts.join('\n');
}

function formatMedicine(medicine: AIRecommendRequest['medicine']): string {
  if (medicine === null || medicine === undefined) return 'なし';
  if (typeof medicine === 'boolean') return medicine ? 'あり' : 'なし';
  return medicine;
}

export const FOLLOW_UP_PROMPT = `あなたは医療アクセスを支援するAIアシスタントです。
以下の症状情報をもとに、より詳しい判定をするための追加質問を2〜3個生成してください。

出力JSON構造（配列のみ返してください）:
[
  {
    "id": "q1",
    "text": "質問文",
    "type": "select",
    "options": ["選択肢1", "選択肢2", "選択肢3"]
  }
]

ルール:
- 必ず2〜3個の質問を生成
- type は "select"（選択式）または "text"（自由入力）
- select の場合は options に3〜5個の選択肢を含める
- 質問は症状の深掘りに有用なもの（痛みの場所の詳細、痛みの種類、関連症状など）
- シニア向けにわかりやすい日本語で
- 医療診断に該当する表現は避ける`;

export function buildFollowUpUserPrompt(req: FollowUpRequest): string {
  const q = req.questionnaire;
  const lines = [
    `部位: ${q.location?.join('、') ?? ''}`,
    `期間: ${q.duration ?? ''}`,
    `症状: ${q.symptoms?.join('、') ?? ''}`,
    `持病: ${q.conditions?.join('、') ?? ''}`,
  ];
  if (req.ai_result?.urgency) lines.push(`初回判定の緊急度: ${req.ai_result.urgency}`);
  if (req.ai_result?.recommended_departments) {
    lines.push(`初回推奨診療科: ${req.ai_result.recommended_departments.join('、')}`);
  }
  return ['【現在の症状情報】', ...lines.filter(Boolean)].join('\n');
}
