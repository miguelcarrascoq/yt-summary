import { NextRequest, NextResponse } from 'next/server';

interface IYoutubeDataApiResponse {
    kind: string;
    etag: string;
    items: Item[];
    pageInfo: PageInfo;
}

interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
}

interface Item {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
}

interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    defaultLanguage: string;
    localized: Localized;
    defaultAudioLanguage: string;
}

interface Localized {
    title: string;
    description: string;
}

interface Thumbnails {
    default: Default;
    medium: Default;
    high: Default;
    standard: Default;
    maxres: Default;
}

interface Default {
    url: string;
    width: number;
    height: number;
}

export interface IVideoDataResponse {
    status: boolean;
    data?: IVideoData;
    message?: string;
}

export interface IVideoData {
    videoId: string;
    title: string;
    thumbnail: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<IVideoDataResponse>> {
    const videoId = request.nextUrl.searchParams.get('videoId');
    if (!videoId) {
        return NextResponse.json({
            status: false,
            message: 'Video ID is required'
        });
    }
    try {

        const resTitle: Response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)
        console.log(resTitle)

        const resThumb = `https://i1.ytimg.com/vi/${videoId}/hqdefault.jpg`

        const titleResponse: IYoutubeDataApiResponse = await resTitle.json();
        return NextResponse.json({
            status: true,
            data: { videoId: videoId, title: titleResponse.items[0].snippet.title, thumbnail: resThumb }
        });
    } catch (error) {
        return NextResponse.json({
            status: false,
            message: 'Failed to fetch transcript'
        });
    }
}