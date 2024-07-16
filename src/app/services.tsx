import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranscriptResponse } from 'youtube-transcript';
import { IVideoDataResponse } from './api/title/route';

// console.log(extractVideoID("https://www.youtube.com/watch?v=AAAAAAA")); // Outputs: AAAAAAA
// console.log(extractVideoID("https://youtu.be/BBBBBBBBBBB?si=rq4wDvJ4f3mQHW8V")); // Outputs: BBBBBBBBBBB
export const extractVideoID = (url: string): string => {
    // Pattern for standard YouTube URLs
    const standardPattern = /www\.youtube\.com\/watch\?v=([^&]+)/;
    // Pattern for shortened YouTube URLs
    const shortPattern = /youtu\.be\/([^?]+)/;
    // Pattern for YouTube shorts URLs
    const shortsPattern = /www\.youtube\.com\/shorts\/([^?]+)/;

    let match = url.match(standardPattern);
    if (match && match[1]) {
        return match[1];
    }

    match = url.match(shortPattern);
    if (match && match[1]) {
        return match[1];
    }

    match = url.match(shortsPattern);
    if (match && match[1]) {
        return match[1];
    }

    // Return null if no video ID is found
    return url;
}

export const runOpenAI = async () => {

    const openai = createOpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY })

    const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        system: 'You are a friendly assistant!',
        prompt: 'Why is the sky blue?',
    });

    console.log(text);
}

export const runGoogleAI = async (prompt: string, summaryLength: string = 'short') => {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let extensionMin = 0;
    let extensionMax = 100;

    switch (summaryLength) {
        case 'ultra-short':
            extensionMin = 10;
            extensionMax = 20;
            break;
        case 'short':
            extensionMin = 20
            extensionMax = 50;
            break;
        case 'normal':
            extensionMin = 50;
            extensionMax = 100;
            break;
        default:
            extensionMin = 20;
            extensionMax = 50;
            break;
    }
    prompt = `Escribe un resumen de la siguiente conversación: ${prompt}. Debido a que este texto generado será leido por un text-to-speech debe ser lo mas claro posible. La cantidad de palabras tiene que tener entre ${extensionMin} y ${extensionMax} palabras.`;
    const result = await model.generateContent([prompt]);
    console.log(result.response.text());
    return result.response.text()
}

export const grabYT = async (videoId: string): Promise<TranscriptResponse[]> => {
    const res = await fetch(`/api/transcript?videoId=${videoId}`);
    return res.json();
}

export const grabYTTitle = async (videoId: string): Promise<IVideoDataResponse> => {
    const res = await fetch(`/api/title?videoId=${videoId}`);
    return res.json();
}