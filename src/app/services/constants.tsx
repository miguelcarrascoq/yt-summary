export const CONST_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://yt-summary-next.vercel.app'
export const CONST_REPO_URL = process.env.NEXT_PUBLIC_REPO ?? 'https://github.com/miguelcarrascoq/yt-summary'
export const CONST_GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? ''
export const CONST_CRYPTO_SECRET = process.env.NEXT_PUBLIC_CRYPTO_SECRET ?? ''
export const CONST_INIT_YTID = process.env.NEXT_PUBLIC_INIT_YTID ?? 'rs72LPygGMY'
export const CONST_APP_ALIVE = process.env.NEXT_PUBLIC_APP_ALIVE === 'true' ? true : false
export const CONST_GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ''
export const CONST_YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? ''

export const primaryColor = '#B70283';

export const primaryColorCSS: React.CSSProperties = {
    color: primaryColor
}