export interface IVoice {
    voiceURI: string;
    name: string;
    lang: string;
    default: boolean;
    localService: boolean;
}


declare const window: any;

const synth = typeof window !== 'undefined' && window.speechSynthesis;

export const populateVoiceList = () => {
    try {
        let voices = synth.getVoices();
        voices = voices.sort((a: any, b: any) => a.name.localeCompare(b.name));
        const voicesList: IVoice[] = voices.map((voice: any) => {
            return {
                voiceURI: voice.voiceURI,
                name: voice.name,
                lang: voice.lang,
                default: voice.default,
            };
        })
        return voicesList.filter((voice: any) => voice.lang.includes('en') || voice.lang.includes('es'));
    } catch (err) {
        console.log(err);
    }
};

export const sayInput = (
    speechValue: string,
    inputVoice: string = 'Mónica',
    pitch: number = 1,
    rate: number = 1
) => {
    const utterance = new SpeechSynthesisUtterance(speechValue);
    let voices = synth.getVoices();

    console.log('buscando', inputVoice)

    const selectedVoice = voices.find((voice: SpeechSynthesisVoice) => voice.name === inputVoice);
    console.log(selectedVoice);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        utterance.voice = voices[0];
    }

    utterance.pitch = pitch;
    utterance.rate = rate;

    window.speechSynthesis.cancel();
    synth.speak(utterance);
};

export const stopSpeech = () => {
    window.speechSynthesis.cancel();
}
