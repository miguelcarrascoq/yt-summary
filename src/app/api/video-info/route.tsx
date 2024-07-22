import { NextRequest, NextResponse } from 'next/server';
import { IVideoDataResponse, IYoutubeDataApiResponse } from './interface';
import { CONST_YOUTUBE_API_KEY } from '@/app/services/constants';

export async function GET(request: NextRequest): Promise<NextResponse<IVideoDataResponse>> {
    const videoId = request.nextUrl.searchParams.get('videoId');
    if (!videoId) {
        return NextResponse.json({
            status: false,
            message: 'Video ID is required'
        });
    }
    try {

        const resTitle: Response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${CONST_YOUTUBE_API_KEY}`)

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