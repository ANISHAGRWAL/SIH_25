export const PARAMS = [
  'Mood Disturbance',
  'Sleep Disruption',
  'Appetite Issues',
  'Academic Disengagement',
  'Social Withdrawal',
];

function maybeScale(val: any): number | null {
  let v = parseFloat(val);
  if (isNaN(v)) return null;
  if (v < 0) return 0.0;
  if (v > 10) return 10.0;
  return v <= 1.0 ? +(v * 10).toFixed(1) : +v.toFixed(1);
}

export function normalizeScores(input: any): Record<string, number | null> {
  const result: Record<string, number | null> = {};
  for (const param of PARAMS) result[param] = null;

  for (const [key, val] of Object.entries(input)) {
    for (const param of PARAMS) {
      if (param.toLowerCase() === key.toLowerCase()) {
        result[param] = maybeScale(val);
      }
    }
  }

  return result;
}
