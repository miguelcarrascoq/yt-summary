import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranscriptResponse, YoutubeTranscript } from 'youtube-transcript';

export const runOpenAI = async () => {

    const openai = createOpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY })

    const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        system: 'You are a friendly assistant!',
        prompt: 'Why is the sky blue?',
    });

    console.log(text);
}

export const runGoogleAI = async (prompt: string) => {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    prompt = `Escribe un resumen de la siguiente conversación: ${prompt}`;
    const result = await model.generateContent([prompt]);
    console.log(result.response.text());
    return result.response.text()
}

export const grabYT = async (videoId: string): Promise<TranscriptResponse[]> => {
    const res = await fetch(`/api/transcript?videoId=${videoId}`);
    console.log(res);
    return res.json();
}