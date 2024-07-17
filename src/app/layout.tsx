import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import theme from './media/themeConfig';
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: "📺 Youtube summary",
  description: "Summarize YouTube videos with AI",
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
