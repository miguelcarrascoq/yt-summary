import { NextRequest, NextResponse } from 'next/server';
import { IVideoDataResponse, IYoutubeDataApiResponse } from './interface';
import { CONST_USE_USER_API_KEY, CONST_YOUTUBE_API_KEY } from '@/app/services/constants';
import { headers } from 'next/headers'

export async function GET(request: NextRequest): Promise<NextResponse<IVideoDataResponse>> {
    const headersList = headers();
    const userApiKey = headersList.get("X-User-Api-Key");

    const videoId = request.nextUrl.searchParams.get('videoId');
    if (!videoId) {
        return NextResponse.json({
            status: false,
            message: 'Video ID is required'
        });
    }
    try {

        const apiKey = CONST_USE_USER_API_KEY ? userApiKey : CONST_YOUTUBE_API_KEY;
        const resTitle: Response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${apiKey}`)

        const titleResponse: IYoutubeDataApiResponse = await resTitle.json();
        return NextResponse.json({
            status: true,
            data: {
                videoId: videoId,
                title: titleResponse.items[0].snippet.title,
                thumbnail: `https://i1.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                extra: titleResponse
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: false,
            message: 'Failed to fetch transcript'
        });
    }
}