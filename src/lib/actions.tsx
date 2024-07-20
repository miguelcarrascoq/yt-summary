
'use server';

import { IVideoDataResponse, IYoutubeDataApiResponse } from './interfaces/video-info-interface';
import { IVideoSearchResponse, IYoutubeSearchResponse } from './interfaces/video-related-interface';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranscriptResponse, YoutubeTranscript } from 'youtube-transcript';

export async function videoTranscript(videoId: string): Promise<TranscriptResponse[]> {
    try {
        const transcript: TranscriptResponse[] = await YoutubeTranscript.fetchTranscript(videoId);
        return transcript;
    } catch (error) {
        return [{
            text: 'Transcript not available',
            duration: 0,
            offset: 0
        }];
    }
}

export async function videoInfo(videoId: string): Promise<IVideoDataResponse> {
    try {
        const resTitle: Response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)

        const titleResponse: IYoutubeDataApiResponse = await resTitle.json();
        return {
            status: true,
            data: {
                videoId: videoId,
                title: titleResponse.items[0].snippet.title,
                thumbnail: `https://i1.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                extra: titleResponse
            }
        };
    } catch (error) {
        return {
            status: false,
            message: 'Failed to fetch transcript'
        };
    }
}

export async function videoRelated(channelId: string, maxResults = 15): Promise<IVideoSearchResponse> {
    try {
        const res: Response = await fetch(`https://content-youtube.googleapis.com/youtube/v3/search?videoDuration=medium&type=video&maxResults=${maxResults}&part=snippet&order=date&channelId=${channelId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)

        const apiResponse: IYoutubeSearchResponse = await res.json();
        return {
            status: true,
            data: apiResponse
        };
    } catch (error) {
        return {
            status: false,
            message: 'Failed to fetch related videos'
        };
    }
}

export async function googleAI(inputPrompt: string, inputSummaryLength = 'ultra-short', inputLang = 'es') {

    try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let extensionMin;
        let extensionMax;

        let hasBullets = false;
        let bulletCount = 3;

        switch (inputSummaryLength) {
            case 'ultra-short':
                extensionMin = 10;
                extensionMax = 20;
                break;
            case 'short':
                extensionMin = 30
                extensionMax = 50;
                break;
            case 'normal':
                extensionMin = 60;
                extensionMax = 100;
                break;
            case '3-bullets':
                hasBullets = true;
                break;
            case '5-bullets':
                hasBullets = true;
                bulletCount = 5;
                break;
            default:
                extensionMin = 20;
                extensionMax = 50;
                break;
        }

        let language;
        switch (inputLang) {
            case 'es':
                language = 'español';
                break;
            case 'en':
                language = 'inglés';
                break;
            default:
                language = 'español';
                break;
        }

        let prompt;
        if (!hasBullets) {
            prompt = `Escribe un resumen de la siguiente conversación: ${inputPrompt}. Debido a que este texto generado será leido por un text-to-speech debe ser lo mas claro posible. La cantidad de palabras tiene que tener entre ${extensionMin} y ${extensionMax} palabras (no puede superar las ${extensionMax} palabras). Tu resumen debe estar en el idioma ${language}. Si hay caracteres especiales, renderiza el texto en HTML. Colocar en negrita frases importantes (<b>)`;
        } else {
            prompt = `Escribe un resumen de la siguiente conversación: ${inputPrompt}. Debido a que este texto generado será leido por un text-to-speech debe ser lo mas claro posible. Debe destacar los ${bulletCount} principales conceptos (renderizar con lista numerada en HTML <ol><li>). Tu resumen debe estar en el idioma ${language}. Si hay caracteres especiales, renderiza el texto en HTML. Colocar en negrita frases importantes (<b>)`;
        }

        if (prompt.length > 120000) {
            return {
                status: false,
                message: 'Prompt is too long'
            };
        }

        const result = await model.generateContent([prompt]);

        return {
            status: true,
            transcript: result.response.text()
        };
    } catch (error) {
        return {
            status: false,
            message: 'Failed to fetch transcript'
        };
    }

}