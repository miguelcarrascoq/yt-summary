import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import theme from './media/themeConfig';
import { GoogleAnalytics } from '@next/third-parties/google'
import { CONST_APP_URL, CONST_GOOGLE_ANALYTICS_ID } from './services/constants';

const title = "📺 YT Summary"
const description = "Summarize YouTube videos with AI";

export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    type: "website",
    locale: "en_US",
    url: `${CONST_APP_URL}`,
    images: [
      {
        url: `${CONST_APP_URL}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    title: title,
    description: description,
    images: [
      {
        url: `${CONST_APP_URL}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: title,
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
        <GoogleAnalytics gaId={CONST_GOOGLE_ANALYTICS_ID} />
      </html>
    </ConfigProvider>
  );
}
