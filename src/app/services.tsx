import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranscriptResponse } from 'youtube-transcript';
import { IVideoDataResponse } from './api/title/interface';

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

export const runGoogleAI = async (prompt: string, summaryLength: string = 'ultra-short'): Promise<{ status: boolean, transcript: string }> => {
    const res = await fetch(`/api/ai-gemini`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            summaryLength: summaryLength
        })
    });
    return res.json();
}

export const grabYT = async (videoId: string): Promise<TranscriptResponse[]> => {
    const res = await fetch(`/api/transcript?videoId=${videoId}`);
    return res.json();
}

export const grabYTTitle = async (videoId: string): Promise<IVideoDataResponse> => {
    const res = await fetch(`/api/title?videoId=${videoId}`);
    return res.json();
}