/**
 * Extracts the video ID from a YouTube URL.
 * @param url The YouTube URL.
 * @returns The video ID.
 * @example extractVideoID('https://www.youtube.com/watch?v=rs72LPygGMY&t=26s') // 'rs72LPygGMY'
 * @example extractVideoID('https://youtu.be/rs72LPygGMY') // 'rs72LPygGMY'
 * @example extractVideoID('https://www.youtube.com/shorts/rs72LPygGMY') // 'rs72LPygGMY'
 */
export const extractVideoID = (url: string): string => {
    // Pattern for standard YouTube URLs
    const standardPattern = /www\.youtube\.com\/watch\?v=([^&]+)/;
    // Pattern for shortened YouTube URLs
    const shortPattern = /youtu\.be\/([^?]+)/;
    // Pattern for YouTube shorts URLs
    const shortsPattern = /www\.youtube\.com\/shorts\/([^?]+)/;

    let match = url.match(standardPattern);
    if (match && match[1]) {
        return match[1];
    }

    match = url.match(shortPattern);
    if (match && match[1]) {
        return match[1];
    }

    match = url.match(shortsPattern);
    if (match && match[1]) {
        return match[1];
    }

    // Return null if no video ID is found
    return url;
}

/**
 * Convert a YouTube duration string to a human-readable format
 * @param {string} duration - The duration string to convert
 * @returns {string} The human-readable duration string
 * @example convertYouTubeDuration('PT1H2M3S') // '62 minutes (1h 2m)'
 * @example convertYouTubeDuration('PT5M') // '5 minutes'
 */
export const convertYouTubeDuration = (duration: string) => {
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const matchResult = duration.match(regex);
    const parts = matchResult ? matchResult.slice(1) : [];

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Extract hours, minutes, and seconds from the duration string
    parts.forEach((part) => {
        if (part) {
            const value = parseInt(part, 10);
            if (part.includes('H')) hours = value;
            else if (part.includes('M')) minutes = value;
            else if (part.includes('S')) seconds = value;
        }
    });

    // Convert everything to minutes if needed, or keep as hours and minutes
    if (hours > 0) {
        minutes += hours * 60;
        return `${minutes} minutes (${hours}h ${minutes % 60}m)`;
    } else {
        return `${minutes + Math.round(seconds / 60)} minutes`;
    }
}


export const decodeHtmlEntities = (text: string): string => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

/**
 * Check if the input text is a full language name or a language code
 * @param {string} text - The text to check
 * @returns {string} The ISO 639-1 language code
 * @example checkLanguage('English') // 'en'
 * @example checkLanguage('es-419') // 'es'
 * @example checkLanguage('es-ES') // 'es'
 * @example checkLanguage('es') // 'es'
 * @example checkLanguage('en') // 'en'
 * @example checkLanguage('Spanish') // 'es'
 * @example checkLanguage('Español') // 'es'
 * @example checkLanguage('español') // 'es'
 */
export const checkLanguage = (text: string): string => {
    // Mapping of full language names to ISO 639-1 codes
    const languageMap: { [key: string]: string } = {
        English: 'en',
        Spanish: 'es',
    };

    let lang = text;

    // Check if the result is a full language name and map it
    if (languageMap[lang]) {
        return languageMap[lang];
    }

    // Handle cases like "es-419" or "es-ES" by taking the first part
    if (lang.includes('-')) {
        lang = lang.split('-')[0];
    }

    console.log('checkLanguage', text, lang);

    return lang;
};

