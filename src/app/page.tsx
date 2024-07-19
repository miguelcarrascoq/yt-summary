'use client'

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'

import { Button, Flex, Input, Select, Space, Card, App, Row, Col, Grid, Divider, Segmented, Typography, Timeline, Tag } from 'antd';
import { AlignLeftOutlined, ClockCircleOutlined, CommentOutlined, CopyOutlined, EyeOutlined, FieldTimeOutlined, LikeOutlined, MutedOutlined, SoundOutlined, ThunderboltOutlined, YoutubeOutlined } from '@ant-design/icons';

import FloatButtonComponent from './components/FloatButton';

import { TranscriptResponse } from 'youtube-transcript';

import { IVideoData } from '../lib/interfaces/video-info-interface';
import { IYoutubeSearchResponseItem } from '../lib/interfaces/video-related-interface';

import { checkLanguage, convertSecondsToTime, convertYouTubeDuration, decodeHtmlEntities, extractVideoID, formatNumber, openInNewTab } from './services/utils';
import { populateVoiceList, IVoice, sayInput, stopSpeech } from './services/win';

import { googleAI, videoInfo, videoRelated, videoTranscript } from '@/lib/actions';

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
  const [actionPerfomed, setActionPerfomed] = useState('')
  const [playingAudio, setPlayingAudio] = useState(false);

  const [relatedVideos, setRelatedVideos] = useState<IYoutubeSearchResponseItem[]>([]);
  const [videoTitleRollOver, setVideoTitleRollOver] = useState('');

  const [transcriptViewType, setTranscriptViewType] = useState<string | number>('concat');
  const [transcriptTimeline, setTranscriptTimeline] = useState<TranscriptResponse[]>([]);

  const primaryColor = '#B70283';

  const colorCSS: React.CSSProperties = {
    color: primaryColor
  }

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
    setActionPerfomed('Running AI...')
    setLoading(true);

    const result = await googleAI(mergedTranscript, summaryLength, langFromVideo);
    if (!result.status) {
      message.error(result.message);
      setLoading(false);
      setActionPerfomed('')
      return;
    }
    setSummary(result.transcript ?? '');
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
    stopSpeechSummary()

    const url = fullURL ? extractVideoID(fullURL) : extractVideoID(ytUrl);
    const ytResponse = await videoTranscript(url);
    setTranscriptTimeline(ytResponse)
    const ytTitleResponse = await videoInfo(url);
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

  const fetchYTVideoRelated = async (channelId: string) => {
    const res = await videoRelated(channelId, 15);
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
                <Button type="link" size="small" icon={<CopyOutlined />} style={{ ...colorCSS }} onClick={() => copyToClipboard(summary)} ></Button>
              </Flex>

            }>
              <div dangerouslySetInnerHTML={{ __html: summary }} style={{ height: 'auto' }}></div>
            </Card>
          }

          {mergedTranscript !== '' &&
            <Card size="small" title={`Transcript`} style={{ marginTop: 10 }} extra={
              <Flex gap='small'>
                <Typography.Text><ClockCircleOutlined /> {convertYouTubeDuration(videoData.extra?.items[0]?.contentDetails.duration ?? '')}</Typography.Text>
                <Segmented size='small'
                  value={transcriptViewType} onChange={setTranscriptViewType}
                  options={[
                    { label: 'Concat', value: 'concat', icon: <AlignLeftOutlined /> },
                    { label: 'Timeline', value: 'timeline', icon: <FieldTimeOutlined /> },
                  ]}
                />
                <Button type="link" size="small" icon={<CopyOutlined />} style={{ ...colorCSS }} onClick={() => copyToClipboard(mergedTranscript)} />
              </Flex>
            }>
              <Flex gap='small'>
                <Row gutter={10} style={{ width: '-webkit-fill-available' }}>
                  <Col md={8} xs={24}>
                    <Flex vertical gap='small' align='center'>
                      <Image
                        width={120}
                        height={90}
                        src={videoData.extra?.items[0]?.snippet?.thumbnails?.high?.url ?? videoData.thumbnail}
                        alt={videoData.title}
                        style={{ borderRadius: 8, border: `1px ${primaryColor} solid`, cursor: 'pointer', width: '90%', height: 'auto' }}
                        onClick={() => openInNewTab(`https://www.youtube.com/watch?v=${videoData.videoId}`)}
                      />
                      <Flex gap='small' justify='space-around'>
                        <Typography.Text><EyeOutlined /> {formatNumber(Number(videoData.extra?.items[0]?.statistics.viewCount) || 0)}</Typography.Text>
                        <Typography.Text><LikeOutlined /> {formatNumber(Number(videoData.extra?.items[0]?.statistics.likeCount) || 0)}</Typography.Text>
                        <Typography.Text><CommentOutlined /> {formatNumber(Number(videoData.extra?.items[0]?.statistics.commentCount) || 0)}</Typography.Text>
                      </Flex>
                    </Flex>
                  </Col>
                  <Col md={16} xs={24}>
                    <div style={{ width: '100%' }}>
                      <div style={{ textAlign: 'center' }}>
                        <Typography.Text strong style={{ textAlign: 'center' }}>{videoData.title}</Typography.Text>&nbsp;&nbsp;
                        <Typography.Link style={{ ...colorCSS, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                          onClick={() => openInNewTab(`https://youtube.com/channel/${videoData.extra?.items[0].snippet.channelId}`)}
                        ><YoutubeOutlined /> {videoData.extra?.items[0].snippet.channelTitle}</Typography.Link>
                        <hr />
                      </div>
                      {transcriptViewType === 'timeline' &&
                        <Timeline style={{ paddingTop: 8, paddingLeft: 2, height: 189, overflow: 'scroll', width: 'auto' }}
                          items={transcriptTimeline.map((transcript) => (
                            {
                              color: 'gray',
                              dot: <ClockCircleOutlined style={{ fontSize: '12px' }} />,
                              children:
                                <Flex>
                                  <Tag color="default" style={{ height: 'fit-content' }}>{convertSecondsToTime(transcript.offset)}</Tag>
                                  <div dangerouslySetInnerHTML={{ __html: transcript.text }}></div>
                                </Flex>
                            }
                          ))}
                        />
                      }
                      {transcriptViewType === 'concat' &&
                        <div dangerouslySetInnerHTML={{ __html: mergedTranscript }} style={{ height: 189, overflow: 'scroll', textAlign: 'justify' }}></div>
                      }
                    </div>
                  </Col>
                </Row>
              </Flex>
            </Card>
          }

          {relatedVideos && relatedVideos.length > 0 && ytUrl !== initURL &&
            <div style={{ textAlign: 'center' }}>
              <Divider style={{ color: 'white' }}>Related videos (select to summarize)</Divider>
              <Flex wrap gap="middle" justify='space-around' align='center'>
                {relatedVideos.map((video, index) => (
                  <React.Fragment key={video?.id?.videoId?.toString()}>
                    <Image alt={video.snippet.title} src={video.snippet.thumbnails.high.url} width={120} height={90} style={{ height: 'auto', width: 120, borderRadius: 8, border: `1px ${primaryColor} solid`, cursor: 'pointer' }}
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
          }

        </Col>
        <Col md={6} xs={0}>

        </Col>
      </Row>

      <FloatButtonComponent />

    </div>
  );
}
