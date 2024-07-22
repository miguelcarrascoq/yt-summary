'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button, Input, Select, Space, App, Row, Col, Grid } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

import { TranscriptResponse } from 'youtube-transcript';

import { IVideoData } from './api/video-info/interface';
import { IYoutubeSearchResponseItem } from './api/yt-related/interface';

import { grabYT, grabYTChannelRelatedVideos, grabYTVideoInfo, runGoogleAI } from './services/apis';
import { checkLanguage, decodeHtmlEntities, extractVideoID } from './services/utils';

import FloatButtonComponent from './components/FloatButtonComponent';
import TranscriptComponent from './components/TranscriptComponent';
import RelatedVideosComponent from './components/RelatedVideosComponent';
import SummaryComponent from './components/SummaryComponent';

export default function Home() {

  const initURL = `https://www.youtube.com/watch?v=${process.env.NEXT_PUBLIC_INIT_YTID ?? 'rs72LPygGMY'}`;
  const [ytUrl, setYtUrl] = useState<string>(initURL);
  const [videoData, setVideoData] = useState<IVideoData>({
    videoId: '',
    title: '',
    thumbnail: '',
    extra: undefined
  });
  const [mergedTranscript, setMergedTranscript] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  const { message } = App.useApp();
  const screens = Grid.useBreakpoint();

  const [summaryLength, setSummaryLength] = useState<string>('ultra-short');

  const [loading, setLoading] = useState(false);
  const [actionPerfomed, setActionPerfomed] = useState('')

  const [relatedVideos, setRelatedVideos] = useState<IYoutubeSearchResponseItem[]>([]);

  const [transcriptViewType, setTranscriptViewType] = useState<string>('concat');
  const [transcriptTimeline, setTranscriptTimeline] = useState<TranscriptResponse[]>([]);

  const summaryComponentRef = useRef<any>(null);

  const handleStopSpeech = () => {
    summaryComponentRef.current?.stopSpeechSummary();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Copied to clipboard`);
  }

  const mergeTranscript = (ytResponse: TranscriptResponse[]) => {
    setActionPerfomed('Merging transcript...')
    let mergedTranscript = '';
    ytResponse.forEach((transcript) => {
      mergedTranscript += transcript.text + ' ';
    });
    const decodeHtml = decodeHtmlEntities(mergedTranscript)
    setMergedTranscript(decodeHtml)
    return decodeHtml
  }

  const callRunGoogleAI = useCallback(async (mergedTranscript: string, summaryLength: string, langFromVideo: string, channelId?: string) => {
    setActionPerfomed('Running AI...')
    setLoading(true);

    const result = await runGoogleAI(mergedTranscript, summaryLength, langFromVideo);
    if (!result.status) {
      message.error(result.message);
      setLoading(false);
      setActionPerfomed('')
      return;
    }
    setSummary(result.transcript);
    setLoading(false);
    setActionPerfomed('')
    if (channelId !== undefined) {
      fetchYTVideoRelated(channelId)
    }
  }, [message]);

  const callGrabYT = useCallback(async (fullURL?: string, generateSummary: boolean = true) => {
    setLoading(true);
    setActionPerfomed('Getting video data...')
    setMergedTranscript('');
    setSummary('');
    handleStopSpeech()

    const url = fullURL ? extractVideoID(fullURL) : extractVideoID(ytUrl);
    const ytResponse = await grabYT(url);
    setTranscriptTimeline(ytResponse)
    const ytTitleResponse = await grabYTVideoInfo(url);
    if (!ytTitleResponse.status) {
      message.error('Error getting video info');
      setLoading(false);
      setActionPerfomed('')
      return
    }
    setVideoData({
      videoId: url,
      title: ytTitleResponse.data?.title ?? '',
      thumbnail: ytTitleResponse.data?.thumbnail ?? '',
      extra: ytTitleResponse.data?.extra
    });
    const mergedTranscript = mergeTranscript(ytResponse)
    if (generateSummary) {
      const langFromVideo = checkLanguage(ytResponse[0].lang ?? (ytTitleResponse.data?.extra?.items[0]?.snippet?.defaultAudioLanguage ?? 'en'));
      callRunGoogleAI(mergedTranscript, summaryLength, langFromVideo, ytTitleResponse.data?.extra?.items[0]?.snippet?.channelId);
    } else {
      setLoading(false);
      setActionPerfomed('')
    }
  }, [callRunGoogleAI, message, summaryLength, ytUrl]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const url = e.target.value;
    setYtUrl(url);
  };

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      callGrabYT()
    }
  }

  const fetchYTVideoRelated = async (videoId: string) => {
    const res = await grabYTChannelRelatedVideos(videoId, 15);
    if (res.status && res.data?.items && res.data?.items.length > 0) {
      setRelatedVideos(res.data?.items);
    } else {
      setRelatedVideos([]);
    }
  }

  const onChangeSelect = (value: string) => {
    setSummaryLength(value)
  }

  useEffect(() => {
    if (ytUrl === '') {
      setLoading(false);
      setActionPerfomed('')
      setMergedTranscript('');
      setSummary('');
      handleStopSpeech()
      setRelatedVideos([]);
    }
  }, [ytUrl])

  const clearValues = () => {
    setLoading(false);
    setActionPerfomed('')
    setMergedTranscript('');
    setSummary('');
    handleStopSpeech()
    setRelatedVideos([]);
  }

  return (
    <div style={{ marginTop: screens.md ? 64 : 0 }}>
      <Row gutter={10} style={{ marginBottom: 22 }}>
        <Col md={6} xs={0}>

        </Col>
        <Col md={12} xs={24}>

          <Space.Compact style={{ width: '100%' }}>
            <Input allowClear onChange={onChangeInput} placeholder={initURL} defaultValue={initURL} value={ytUrl} onKeyDown={handleKeyDown} maxLength={50} />
            <Select
              defaultValue={summaryLength}
              popupMatchSelectWidth={false}
              onChange={(value) => onChangeSelect(value)}
              options={[
                { label: 'Ultra-short', value: 'ultra-short' },
                { label: 'Short', value: 'short' },
                { label: 'Normal', value: 'normal' },
                { label: '3 bullets', value: '3-bullets' },
                { label: '5 bullets', value: '5-bullets' },
              ]} />
            <Button type="primary" onClick={() => callGrabYT()} loading={loading} icon={<ThunderboltOutlined />} disabled={ytUrl === ''}>{loading ? actionPerfomed : (screens.xs ? '' : 'Get Summary')}</Button>
          </Space.Compact>

          <SummaryComponent ref={summaryComponentRef} summary={summary} copyToClipboard={copyToClipboard} />

          <TranscriptComponent mergedTranscript={mergedTranscript} videoData={videoData} transcriptTimeline={transcriptTimeline} transcriptViewType={transcriptViewType} setTranscriptViewType={setTranscriptViewType} copyToClipboard={copyToClipboard} />

          <RelatedVideosComponent relatedVideos={relatedVideos} ytUrl={ytUrl} setYtUrl={setYtUrl} callGrabYT={callGrabYT} clearValues={clearValues} initURL={initURL} />

        </Col>
        <Col md={6} xs={0}>

        </Col>
      </Row>

      <FloatButtonComponent />
    </div>
  );
}
