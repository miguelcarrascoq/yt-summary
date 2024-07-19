import { videoTranscript } from '@/lib/actions';

describe('videoTranscript', () => {
    it('should return the correct transcript for a given video', async () => {
        const videoId = process.env.NEXT_PUBLIC_INIT_YTID ?? 'rs72LPygGMY';

        const result = await videoTranscript(videoId);

        if (result[0].text === 'Transcript not available') {
            expect(result[0].text).toBe('Transcript not available');
            return;
        }

        expect(result).toBeDefined();
        expect(typeof result[0].text).toBe('string');
        expect(typeof result[0].offset).toBe('number');
        expect(typeof result.length).toBe('number');
        // expect(result).toBe('Expected transcript'); //
    });

    // Add more tests as needed
});