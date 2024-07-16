import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'YT summary',
    short_name: 'YT summary',
    description: 'Just testing some API/AI stuff',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        sizes: '192x192',
        src: '/pwa/icon-default.png',
        type: 'image/png',
      },
      {
        sizes: '512x512',
        src: '/pwa/icon-default-large.png',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        sizes: '192x192',
        src: '/pwa/icon-default-maskable.png',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        sizes: '512x512',
        src: '/pwa/icon-default-maskable-large.png',
        type: 'image/png',
      },
    ],
    categories: ['tools'],
  };
}
