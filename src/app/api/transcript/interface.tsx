export interface ITranscriptResponse {
    title: string;
    captions: ITranscriptCaption[];
}

export interface ITranscriptCaption {
    dur: string;
    start: string;
    text: string;
}