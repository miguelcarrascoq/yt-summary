import { message } from 'antd';

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

    let match = standardPattern.exec(url);
    if (match?.[1]) {
        return match[1];
    }

    match = RegExp(shortPattern).exec(url);
    if (match?.[1]) {
        return match[1];
    }

    match = RegExp(shortsPattern).exec(url);
    if (match?.[1]) {
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
    const matchResult = RegExp(regex).exec(duration);
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
        return `${hours}h ${minutes % 60}m`;
    } else {
        return `${minutes + Math.round(seconds / 60)}m`;
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

    return lang;
};

export const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

export const webShare = async (title: string, text: string, url: string) => {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        navigator.clipboard.writeText(`${title} - ${text} - ${url}`);
        message.success(`Copied to clipboard`, 3);
    }
}

/**
 * Convert a number of seconds to a human-readable time format
 * @param {number} seconds - The number of seconds to convert
 * @returns {string} The human-readable time format
 * @example convertSecondsToTime(3661) // '1h 1m 1s'
 * @example convertSecondsToTime(61) // '1m 1s'
 * @example convertSecondsToTime(1) // '1s'
 */
export const convertSecondsToTime = (seconds: number) => {
    seconds = Math.floor(seconds); // Round down the input seconds to the nearest whole number

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let formattedDuration = "";
    if (hours > 0) {
        formattedDuration += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) { // Include minutes if there are hours, even if minutes are 0
        formattedDuration += `${minutes}m `;
    }
    if (remainingSeconds > 0 || (!hours && !minutes)) { // Include seconds if there are no hours and minutes, or if seconds are non-zero
        formattedDuration += `${remainingSeconds}s`;
    }
    return formattedDuration.trim();
}

/**
 * Format a number by abbreviating it with a suffix (K, M, B, T)
 * @param {number} number - The number to format
 * @returns {string} The formatted number with a suffix
 * @example formatNumber(123456) // '123.5k'
 * @example formatNumber(123456789) // '123.5m'
 * @example formatNumber(123456789012) // '123.5b'
 * @example formatNumber(123456789012345) // '123.5t'
 */
export const formatNumber = (number: number) => {
    if (number >= 1e12) {
        return (number / 1e12).toFixed(1) + 't'; // Trillion
    } else if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + 'b'; // Billion
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'm'; // Million
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'k'; // Thousand
    } else {
        return number.toString(); // No abbreviation
    }
}