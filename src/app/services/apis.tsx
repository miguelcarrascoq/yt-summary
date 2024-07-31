import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { TranscriptResponse } from 'youtube-transcript';
import { IVideoDataResponse } from '../api/video-info/interface';
import { IVideoSearchResponse } from '../api/yt-related/interface';
import { CONST_COMPRESS_RESPONSE, CONST_CRYPTO_SECRET, CONST_OPENAI_API_KEY, CONST_USE_USER_API_KEY } from './constants';
import { compress } from 'lz-string'

export const runOpenAI = async () => {

    const openai = createOpenAI({ apiKey: CONST_OPENAI_API_KEY })

    const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        system: 'You are a friendly assistant!',
        prompt: 'Why is the sky blue?',
    });

    console.log(text);
}

export const runGoogleAI = async (prompt: string, summaryLength: string = 'ultra-short', lang: string = 'en', clientApiKey?: string): Promise<{ status: boolean, transcript: string, message: string }> => {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('X-Yt-Summary', CONST_CRYPTO_SECRET);
    if (clientApiKey && CONST_USE_USER_API_KEY) {
        headers.set('X-User-Api-Key', clientApiKey);
    }
    const res = await fetch(`/api/ai-gemini`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            prompt: CONST_COMPRESS_RESPONSE ? compress(prompt) : prompt,
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

export const grabYTVideoInfo = async (videoId: string, clientApiKey?: string): Promise<IVideoDataResponse> => {
    const headers = new Headers();
    headers.set('X-Yt-Summary', CONST_CRYPTO_SECRET);
    if (clientApiKey && CONST_USE_USER_API_KEY) {
        headers.set('X-User-Api-Key', clientApiKey);
    }
    const res = await fetch(`/api/video-info?videoId=${videoId}`, {
        headers: headers
    });
    return res.json();
}

export const grabYTChannelRelatedVideos = async (channelId: string, maxResults: number = 10, clientApiKey?: string): Promise<IVideoSearchResponse> => {
    const headers = new Headers();
    headers.set('X-Yt-Summary', CONST_CRYPTO_SECRET);
    if (clientApiKey && CONST_USE_USER_API_KEY) {
        headers.set('X-User-Api-Key', clientApiKey);
    }
    const res = await fetch(`/api/yt-related?channelId=${channelId}&maxResults=${maxResults}`, {
        headers: headers
    });
    return res.json();
}