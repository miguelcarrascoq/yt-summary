import { NextRequest, NextResponse } from 'next/server';
import { IVideoSearchResponse, IYoutubeSearchResponse } from './interface';
import { CONST_USE_USER_API_KEY, CONST_YOUTUBE_API_KEY } from '@/app/services/constants';
import { headers } from 'next/headers'

export async function GET(request: NextRequest): Promise<NextResponse<IVideoSearchResponse>> {
    const headersList = headers();
    const userApiKey = headersList.get("X-User-Api-Key");

    const channelId = request.nextUrl.searchParams.get('channelId');
    const maxResults = request.nextUrl.searchParams.get('maxResults') || 10;
    if (!channelId) {
        return NextResponse.json({
            status: false,
            message: 'Channel Id is required'
        });
    }
    try {

        const apiKey = CONST_USE_USER_API_KEY ? userApiKey : CONST_YOUTUBE_API_KEY;
        const res: Response = await fetch(`https://content-youtube.googleapis.com/youtube/v3/search?videoDuration=medium&type=video&maxResults=${maxResults}&part=snippet&order=date&channelId=${channelId}&key=${apiKey}`)

        const apiResponse: IYoutubeSearchResponse = await res.json();
        return NextResponse.json({
            status: true,
            data: apiResponse
        });
    } catch (error) {
        return NextResponse.json({
            status: false,
            message: 'Failed to fetch related videos'
        });
    }
}