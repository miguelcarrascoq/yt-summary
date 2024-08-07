import { TranscriptResponse, YoutubeTranscript } from 'youtube-transcript';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const videoId = request.nextUrl.searchParams.get('videoId');
    if (!videoId) {
        return NextResponse.json([{ text: 'Video ID is required' }]);
    }
    try {
        const transcript: TranscriptResponse[] = await YoutubeTranscript.fetchTranscript(videoId);
        return NextResponse.json(transcript);
    } catch (error) {
        return NextResponse.json([{ text: 'Failed to fetch transcript', error: error }]);
    }

}