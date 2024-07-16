export interface IYoutubeDataApiResponse {
    kind: string;
    etag: string;
    items: Item[];
    pageInfo: PageInfo;
}

interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
}

interface Item {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
    contentDetails: ContentDetails;
    statistics: Statistics;
}

interface Statistics {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
}

interface ContentDetails {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    contentRating: ContentRating;
    projection: string;
}

interface ContentRating {
}

interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: Localized;
    defaultAudioLanguage: string;
}

interface Localized {
    title: string;
    description: string;
}

interface Thumbnails {
    default: Default;
    medium: Default;
    high: Default;
    standard: Default;
    maxres: Default;
}

interface Default {
    url: string;
    width: number;
    height: number;
}

/*
Response Example:

{
  "kind": "youtube#videoListResponse",
  "etag": "PJc77XDwEz6BNog_bF--IROt35Y",
  "items": [
    {
      "kind": "youtube#video",
      "etag": "fOXNVkkJ-X8Qjt_q1eYbkccXX6Y",
      "id": "rs72LPygGMY",
      "snippet": {
        "publishedAt": "2020-06-08T03:36:32Z",
        "channelId": "UCF89MV_WAIPtYcE4QtHJ5PA",
        "title": "Trabajo Remoto (conversación con Rodrigo Carrillo de Smart Araucanía)",
        "description": "Conversación con Rodrigo Carrillo de Smart Araucanía sobre Trabajo Remoto\n\nMás info: http://www.VisitAnyPlace.com",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/rs72LPygGMY/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/rs72LPygGMY/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/rs72LPygGMY/hqdefault.jpg",
            "width": 480,
            "height": 360
          },
          "standard": {
            "url": "https://i.ytimg.com/vi/rs72LPygGMY/sddefault.jpg",
            "width": 640,
            "height": 480
          },
          "maxres": {
            "url": "https://i.ytimg.com/vi/rs72LPygGMY/maxresdefault.jpg",
            "width": 1280,
            "height": 720
          }
        },
        "channelTitle": "Miguel Carrasco Q.",
        "tags": [
          "remote",
          "work",
          "trabajo",
          "remoto",
          "smart",
          "Araucania",
          "rv",
          "motorhome",
          "casa rodante",
          "software",
          "offline"
        ],
        "categoryId": "19",
        "liveBroadcastContent": "none",
        "localized": {
          "title": "Trabajo Remoto (conversación con Rodrigo Carrillo de Smart Araucanía)",
          "description": "Conversación con Rodrigo Carrillo de Smart Araucanía sobre Trabajo Remoto\n\nMás info: http://www.VisitAnyPlace.com"
        },
        "defaultAudioLanguage": "es-419"
      },
      "contentDetails": {
        "duration": "PT30M39S",
        "dimension": "2d",
        "definition": "hd",
        "caption": "false",
        "licensedContent": false,
        "contentRating": {},
        "projection": "rectangular"
      },
      "statistics": {
        "viewCount": "58",
        "likeCount": "2",
        "favoriteCount": "0",
        "commentCount": "2"
      }
    }
  ],
  "pageInfo": {
    "totalResults": 1,
    "resultsPerPage": 1
  }
}
*/

export interface IVideoDataResponse {
    status: boolean;
    data?: IVideoData;
    message?: string;
}

export interface IVideoData {
    videoId: string;
    title: string;
    thumbnail: string;
    extra?: IYoutubeDataApiResponse;
}