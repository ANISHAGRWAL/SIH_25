const CRISIS_KEYWORDS = [
  'suicidal',
  'suicide',
  'end',
  'kill',
  'quit',
  'want to die',
  'i quit',
  'give up',
  'hopeless',
  'no reason to live',
  'no one love me',
  'this is end',
  'ending it all',
];

export const SAFETY_MESSAGE = `It sounds like you're going through a really difficult time right now. You're not alone — there are people who care about you and want to help.

Please consider reaching out to a mental health professional or calling a trusted helpline: +91 9152987821.

You matter. Your life matters. Things can get better — and support is just a call away.`;

export function containsCrisisKeywords(text: string): boolean {
  const textLower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => textLower.includes(keyword));
}
