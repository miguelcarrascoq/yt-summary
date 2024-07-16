import { NextRequest, NextResponse } from 'next/server';
import { IVideoDataResponse, IYoutubeDataApiResponse } from './interface';

export async function GET(request: NextRequest): Promise<NextResponse<IVideoDataResponse>> {
    const videoId = request.nextUrl.searchParams.get('videoId');
    if (!videoId) {
        return NextResponse.json({
            status: false,
            message: 'Video ID is required'
        });
    }
    try {

        const resTitle: Response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)
        console.log(resTitle)

        const resThumb = `https://i1.ytimg.com/vi/${videoId}/hqdefault.jpg`

        const titleResponse: IYoutubeDataApiResponse = await resTitle.json();
        return NextResponse.json({
            status: true,
            data: {
                videoId: videoId,
                title: titleResponse.items[0].snippet.title,
                thumbnail: resThumb,
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