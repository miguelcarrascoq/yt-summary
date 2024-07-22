import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { TranscriptResponse } from 'youtube-transcript';
import { IVideoDataResponse } from '../api/video-info/interface';
import { IVideoSearchResponse } from '../api/yt-related/interface';
import { CONST_CRYPTO_SECRET, CONST_OPENAI_API_KEY } from './constants';

export const runOpenAI = async () => {

    const openai = createOpenAI({ apiKey: CONST_OPENAI_API_KEY })

    const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        system: 'You are a friendly assistant!',
        prompt: 'Why is the sky blue?',
    });

    console.log(text);
}

export const runGoogleAI = async (prompt: string, summaryLength: string = 'ultra-short', lang: string = 'en'): Promise<{ status: boolean, transcript: string, message: string }> => {
    const res = await fetch(`/api/ai-gemini`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Yt-Summary': CONST_CRYPTO_SECRET
        },
        body: JSON.stringify({
            prompt: prompt,
            summaryLength: summaryLength,
            lang: lang
        })
    });
    return res.json();
}

export const grabYT = async (videoId: string): Promise<TranscriptResponse[]> => {
    const res = await fetch(`/api/transcript?videoId=${videoId}`, {
        headers: {
            'X-Yt-Summary': CONST_CRYPTO_SECRET
        }
    });
    return res.json();
}

export const grabYTVideoInfo = async (videoId: string): Promise<IVideoDataResponse> => {
    const res = await fetch(`/api/video-info?videoId=${videoId}`, {
        headers: {
            'X-Yt-Summary': CONST_CRYPTO_SECRET
        }
    });
    return res.json();
}

export const grabYTChannelRelatedVideos = async (channelId: string, maxResults: number = 10): Promise<IVideoSearchResponse> => {
    const res = await fetch(`/api/yt-related?channelId=${channelId}&maxResults=${maxResults}`, {
        headers: {
            'X-Yt-Summary': CONST_CRYPTO_SECRET
        }
    });
    return res.json();
}