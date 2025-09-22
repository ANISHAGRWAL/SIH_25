import { AssemblyAI } from 'assemblyai';

const apiKey = process.env.ASSEMBLYAI_API_KEY || '';

const client = new AssemblyAI({
  apiKey: apiKey,
});

export const transcribeAudio = async (audioUrl: string) => {
  try {
    const params = {
      audio: audioUrl,
    };
    const transcript = await client.transcripts.transcribe(params);
    if (transcript.status === 'error') {
      console.error('Transcription error:', transcript.error);
      throw new Error(transcript.error);
    }
    return transcript.text;
  } catch (error) {
    console.error('Error during transcription:', error);
    throw error;
  }
};
