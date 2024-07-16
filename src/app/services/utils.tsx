// console.log(convertYouTubeDuration("PT30M39S")); // Outputs: "31 minutes"
// console.log(convertYouTubeDuration("PT1H30M39S")); // Outputs: "91 minutes (1h 30m)"
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