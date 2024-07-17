Get a summary of a youtube video using AI. Check the [demo](https://yt-summary-next.vercel.app/).

![Preview](public/images/preview.jpg)

## Getting Started

Do you need a **YouTube Data API v3** key, a **Generative Language API** key and/or an **OpenAI** key.

Create an environment file `cp .env.example .env.local` and set the following variables:

```.env
NEXT_PUBLIC_INIT_YTID="rs72LPygGMY"
NEXT_PUBLIC_CRYPTO_SECRET="pUL0hKCryDObhIfMeMh6ZMMg/WqMuuGK"
NEXT_PUBLIC_OPENAI_API_KEY="sk-proj-..."
NEXT_PUBLIC_GOOGLE_API_KEY="AIza..."
NEXT_PUBLIC_YOUTUBE_API_KEY="AIza..."
```

- **NEXT_PUBLIC_INIT_YTID** just to have a default video to show when the page loads.
- **NEXT_PUBLIC_CRYPTO_SECRET** is a 32 characters string and can be generated with `openssl rand -base64 24`
- **NEXT_PUBLIC_OPENAI_API_KEY** is the API key for OpenAI.
- **NEXT_PUBLIC_GOOGLE_API_KEY** is the API key for Google (Generative Language API).
- **NEXT_PUBLIC_YOUTUBE_API_KEY** is the API key for Google (YouTube Data API v3).

Run the development server: `npm run dev`

## TODO

- limit the AI request (Google Gemini API)
- select the AI model
- use only free AI models (??)
- prevent (by IP?) multiple requests to the AI
- switch between AI models & providers (Google, OpenAI)
- make more responsive
- change style
- add related/more video links
- add getparam to work (video ID as query param)
- show more info about the video
- add 3 more options: 3 most important points, 5 most important points & a custom prompt (in a modal)
- order voices by language

## FIXME

- play/stop status (when finish playing, it should change state)
- Voice in mobile (when no voice found)
