import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'YT Summary',
    short_name: 'YT Summary',
    description: 'Summarize YouTube videos with AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#000',
    theme_color: '#000',
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
    categories: ['tools', 'ai', 'youtube', 'summary'],
  };
}
