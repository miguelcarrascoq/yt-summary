import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import theme from './media/themeConfig';
import { GoogleAnalytics } from '@next/third-parties/google'
import { CONST_APP_URL } from './services/constants';

export const metadata: Metadata = {
  title: "📺 Youtube summary",
  description: "Summarize YouTube videos with AI",
  openGraph: {
    title: "📺 Youtube summary",
    description: "Summarize YouTube videos with AI",
    type: "website",
    locale: "en_US",
    url: `${CONST_APP_URL}`,
    images: [
      {
        url: `${CONST_APP_URL}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: "📺 Youtube summary",
      },
    ],
  },
  twitter: {
    title: "📺 Youtube summary",
    description: "Summarize YouTube videos with AI",
    images: [
      {
        url: `${CONST_APP_URL}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: "📺 Youtube summary",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider theme={theme}>
      <html lang="en">
        <body>
          <AntdRegistry>
            <App>
              {children}
            </App>
          </AntdRegistry>
        </body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? ''} />
      </html>
    </ConfigProvider>
  );
}
