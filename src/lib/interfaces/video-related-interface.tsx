export interface IYoutubeSearchResponse {
    kind: string;
    etag: string;
    nextPageToken: string;
    regionCode: string;
    pageInfo: PageInfo;
    items: IYoutubeSearchResponseItem[];
}

export interface IYoutubeSearchResponseItem {
    kind: string;
    etag: string;
    id: Id;
    snippet: Snippet;
}

interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
}

interface Thumbnails {
    default: Default;
    medium: Default;
    high: Default;
}

interface Default {
    url: string;
    width: number;
    height: number;
}

interface Id {
    kind: string;
    videoId: string;
}

interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
}

// ---

export interface IVideoSearchResponse {
    status: boolean;
    data?: IYoutubeSearchResponse;
    message?: string;
}