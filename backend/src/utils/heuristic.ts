import { Scores } from '../types';
import { PARAMS } from './labelParser';

export function heuristicLabel(text: string): Scores {
  text = text.toLowerCase();

  const result: Scores = {
    'Mood Disturbance': /stressed|anxious|depressed|sad|overwhelmed/.test(text)
      ? 8.0
      : /happy|relaxed|good|great|energized/.test(text)
        ? 2.5
        : 5.0,
    'Sleep Disruption':
      /late|insomnia|tired|sleeping poorly|couldn't sleep/.test(text)
        ? 8.0
        : 4.0,
    'Appetite Issues': /skipped|no appetite|hungry|didn't eat/.test(text)
      ? 7.5
      : 4.0,
    'Academic Disengagement': /assignment|classes|lecture|studying|exam/.test(
      text,
    )
      ? /couldn't|didn't|struggled|confused|failed|behind/.test(text)
        ? 7.0
        : 5.0
      : 3.0,
    'Social Withdrawal': /friends|movie|party|meeting/.test(text) ? 2.5 : 6.0,
  };

  PARAMS.forEach((p) => {
    if (result[p] == null) result[p] = 5.0;
  });

  return result;
}
