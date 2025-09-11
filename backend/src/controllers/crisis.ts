const CRISIS_KEYWORDS = [
  'suicidal',
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

export const SAFETY_MESSAGE = `YOU ARE GOING TO TOUGH TIME.
  YOU ARE NOT ALONE YOUR PARENTS AND FRIENDS ARE WITH YOU.
  YOUR LIFE MATTER AND YOU MATTER`;

export function containsCrisisKeywords(text: string): boolean {
  const textLower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => textLower.includes(keyword));
}
