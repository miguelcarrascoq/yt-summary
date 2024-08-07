import { checkLanguage } from '@/app/services/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const videoId = request.nextUrl.searchParams.get('videoId');
    const lang = request.nextUrl.searchParams.get('lang');
    if (!videoId) {
        return NextResponse.json([{ text: 'Video ID is required' }]);
    }
    try {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "videoUrl": `https://www.youtube.com/watch?v=${videoId}`,
            "langCode": checkLanguage(lang ?? 'en')
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const response = await fetch("https://tactiq-apps-prod.tactiq.io/transcript", { ...requestOptions, redirect: "follow" })
        const transcript = await response.json();

        return NextResponse.json(transcript);
    } catch (error) {
        return NextResponse.json([{ text: 'Failed to fetch transcript', error: error }]);
    }

}