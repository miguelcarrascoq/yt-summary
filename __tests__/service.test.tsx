import { extractVideoID } from '@/app/services/utils';
import { describe, it, expect } from '@jest/globals';

describe('extractVideoID', () => {
    it('extracts video ID from a valid YouTube URL', () => {
        const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        const expectedVideoID = 'dQw4w9WgXcQ';
        const result = extractVideoID(url);
        expect(result).toEqual(expectedVideoID);
    });

});