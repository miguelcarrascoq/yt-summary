import { YoutubeTranscript } from 'youtube-transcript';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const videoId = request.nextUrl.searchParams.get('videoId');
    if (!videoId) {
        return NextResponse.json({ error: 'Video ID is required' });
    }
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        return NextResponse.json(transcript);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch transcript' });
    }

}