import { NextRequest, NextResponse } from 'next/server';
import { IVideoSearchResponse, IYoutubeSearchResponse } from './interface';

export async function GET(request: NextRequest): Promise<NextResponse<IVideoSearchResponse>> {
    const channelId = request.nextUrl.searchParams.get('channelId');
    const maxResults = request.nextUrl.searchParams.get('maxResults') || 10;
    if (!channelId) {
        return NextResponse.json({
            status: false,
            message: 'Channel Id is required'
        });
    }
    try {

        const res: Response = await fetch(`https://content-youtube.googleapis.com/youtube/v3/search?videoDuration=medium&type=video&maxResults=${maxResults}&part=snippet&order=date&channelId=${channelId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)

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