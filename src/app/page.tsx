'use client'

import { Button, Flex, Input, Select, Space, Card, App, Row, Col, Grid, Tooltip, Divider } from 'antd';
import { grabYT, grabYTChannelRelatedVideos, grabYTVideoInfo, runGoogleAI } from './services/apis';
import { TranscriptResponse } from 'youtube-transcript';
import { useCallback, useEffect, useState } from 'react';
import { populateVoiceList, IVoice, sayInput, stopSpeech } from './services/win';
import { CopyOutlined, MutedOutlined, SoundOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { IVideoData } from './api/video-info/interface';
import { checkLanguage, convertYouTubeDuration, decodeHtmlEntities, extractVideoID, openInNewTab } from './services/utils';
import FloatButtonComponent from './components/FloatButton';
import Image from 'next/image'
import { IYoutubeSearchResponseItem } from './api/yt-related/interface';
import React from 'react';

export default function Home() {

  const initURL = 'https://www.youtube.com/watch?v=rs72LPygGMY' // 'https://www.youtube.com/watch?v=EYKYY1MssO4'
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

  const [voiceList, setVoiceList] = useState<IVoice[]>([]);
  const [voice, setVoice] = useState('Mónica');
  const [summaryLength, setSummaryLength] = useState<string>('ultra-short');

  const [loading, setLoading] = useState(false);
  const [everythingOk, setEverythingOk] = useState(false);
  const [actionPerfomed, setActionPerfomed] = useState('')
  const [playingAudio, setPlayingAudio] = useState(false);

  const [relatedVideos, setRelatedVideos] = useState<IYoutubeSearchResponseItem[]>([]);
  const [videoTitleRollOver, setVideoTitleRollOver] = useState('');

  useEffect(() => {
    const fetchVoices = () => {
      try {
        const data = populateVoiceList();
        setVoiceList(data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchVoices();
  }, []);

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
    setActionPerfomed('Running Google AI...')
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
    setEverythingOk(true);
  }, [message]);

  const callGrabYT = useCallback(async (fullURL?: string, generateSummary: boolean = true) => {
    setLoading(true);
    setEverythingOk(false);
    setActionPerfomed('Getting video data...')
    setMergedTranscript('');
    setSummary('');
    stopSpeechSummary()

    const url = fullURL ? extractVideoID(fullURL) : extractVideoID(ytUrl);
    const ytResponse = await grabYT(url);
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
      const langFromVideo = checkLanguage(ytTitleResponse.data?.extra?.items[0]?.snippet?.defaultAudioLanguage ?? 'en');
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

  const playSpeechSummary = (summary: string, voice: string) => {
    sayInput(summary, voice);
    setPlayingAudio(true);
  }

  const stopSpeechSummary = () => {
    stopSpeech();
    setPlayingAudio(false);
  }
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Copied to clipboard`);
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
      stopSpeechSummary()
      setRelatedVideos([]);
    }
  }, [ytUrl])

  const clearValues = () => {
    setLoading(false);
    setActionPerfomed('')
    setMergedTranscript('');
    setSummary('');
    stopSpeechSummary()
    setRelatedVideos([]);
  }

  return (
    <div style={{ marginTop: screens.md ? 64 : 0 }}>
      <Row gutter={10} style={{ marginBottom: 22 }}>
        <Col md={6} xs={0}>

        </Col>
        <Col md={12} xs={24}>

          <Space.Compact style={{ width: '100%' }}>
            <Input allowClear onChange={onChangeInput} placeholder={initURL} defaultValue={initURL} value={ytUrl} onKeyDown={handleKeyDown} />
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

          {summary !== '' &&
            <Card size="small" style={{ marginTop: 10 }} title={<Flex gap='small'>
              <div>Summary</div>
            </Flex>} extra={

              <Flex gap='small' justify='flex-end'>
                <Select
                  size='small'
                  defaultValue={voice}
                  popupMatchSelectWidth={false}
                  onChange={(value) => setVoice(value)}
                  options={voiceList.map((voice) => ({ label: `${voice.name} [${voice.lang}]`, value: voice.name }))}
                />
                {!playingAudio && <Button size='small' type="default" onClick={() => playSpeechSummary(summary, voice)} icon={<SoundOutlined />}>Play</Button>}
                {playingAudio && <Button size='small' type="default" onClick={() => stopSpeechSummary()} danger icon={<MutedOutlined />}>Stop</Button>}
                <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(summary)} />
              </Flex>

            }>
              <div dangerouslySetInnerHTML={{ __html: summary }} style={{ height: 'auto' }}></div>
            </Card>
          }

          {mergedTranscript !== '' &&
            <Card size="small" title={`Transcript: ${videoData.title}`} style={{ marginTop: 10 }} extra={
              <>
                <>[{convertYouTubeDuration(videoData.extra?.items[0]?.contentDetails.duration ?? '')}]</>
                <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(mergedTranscript)} />
              </>
            }>
              <Flex gap='small'>
                <Image
                  width={120}
                  height={90}
                  src={videoData.extra?.items[0]?.snippet?.thumbnails?.high?.url ?? ''}
                  alt={videoData.title}
                  style={{ height: 'auto', width: 120, borderRadius: 8, border: '1px gray solid', cursor: 'pointer' }}
                  onClick={() => openInNewTab(`https://www.youtube.com/watch?v=${videoData.videoId}`)}
                />
                <div dangerouslySetInnerHTML={{ __html: mergedTranscript }} style={{ height: 100, overflow: 'scroll' }}></div>
              </Flex>

            </Card>
          }

          {everythingOk && relatedVideos && relatedVideos.length > 0 && ytUrl !== initURL &&
            <>
              <div style={{ textAlign: 'center' }}>
                <Divider style={{ color: 'white' }}>Related videos (select to analize)</Divider>
                <Flex wrap gap="middle" justify='space-around' align='center'>
                  {relatedVideos.map((video, index) => (
                    <React.Fragment key={index}>
                      <Image alt={video.snippet.title} src={video.snippet.thumbnails.medium.url} width={120} height={90} style={{ height: 'auto', width: 120, borderRadius: 8, border: '1px gray solid', cursor: 'pointer' }}
                        onClick={() => {
                          clearValues()
                          const url = `https://www.youtube.com/watch?v=${video.id.videoId}`;
                          setYtUrl(url);
                          callGrabYT(url)
                        }}
                        onMouseOver={() => setVideoTitleRollOver(video.snippet.title)}
                        onMouseOut={() => setVideoTitleRollOver('')}
                      />
                    </React.Fragment>
                  ))}
                </Flex>
                <div dangerouslySetInnerHTML={{ __html: videoTitleRollOver }} style={{ color: 'white', fontSize: 12, paddingTop: 6, fontWeight: 'bold' }}></div>
              </div>
            </>
          }

        </Col>
        <Col md={6} xs={0}>

        </Col>
      </Row>

      <FloatButtonComponent />
    </div>
  );
}
