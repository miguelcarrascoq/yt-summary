'use client'

import { Button, Flex, Input, Select, Space, Card, Tooltip } from 'antd';
import { grabYT, grabYTVideoInfo, runGoogleAI } from './services/apis';
import { TranscriptResponse } from 'youtube-transcript';
import { useCallback, useEffect, useState } from 'react';
import { populateVoiceList, IVoice, sayInput, stopSpeech } from './services/win';
import { ApiOutlined, CopyOutlined, MutedOutlined, SoundOutlined } from '@ant-design/icons';
import { IVideoData } from './api/video-info/interface';
import { checkLanguage, convertYouTubeDuration, decodeHtmlEntities, extractVideoID } from './services/utils';
import FloatButtonComponent from './components/FloatButton';
import Image from 'next/image'

export default function Home() {

  const initURL = 'https://www.youtube.com/watch?v=rs72LPygGMY&t=26s' // 'https://www.youtube.com/watch?v=EYKYY1MssO4'
  const [ytUrl, setYtUrl] = useState<string>(initURL);
  const [videoData, setVideoData] = useState<IVideoData>({
    videoId: '',
    title: '',
    thumbnail: '',
    extra: undefined
  });
  const [ytTranscript, setYtTrans] = useState<TranscriptResponse[]>([]);
  const [mergedTranscript, setMergedTranscript] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  const [voiceList, setVoiceList] = useState<IVoice[]>([]);
  const [voice, setVoice] = useState('Mónica');
  const [summaryLength, setSummaryLength] = useState<string>('ultra-short');

  const [loading, setLoading] = useState(false);
  const [everythingOk, setEverythingOk] = useState(false);
  const [actionPerfomed, setActionPerfomed] = useState('')
  const [playingAudio, setPlayingAudio] = useState(false);

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

  const callRunGoogleAI = async (mergedTranscript: string, summaryLength: string, langFromVideo: string) => {
    setActionPerfomed('Running Google AI...')
    setLoading(true);

    const result = await runGoogleAI(mergedTranscript, summaryLength, langFromVideo);
    setSummary(result.transcript);
    setEverythingOk(true);
    setLoading(false);
    setActionPerfomed('')
  }

  const callGrabYT = useCallback(async (generateSummary: boolean = true) => {
    setLoading(true);
    setEverythingOk(false);
    setActionPerfomed('Getting video data...')
    setMergedTranscript('');
    setSummary('');

    const url = extractVideoID(ytUrl);
    const ytResponse = await grabYT(url);
    const ytTitleResponse = await grabYTVideoInfo(url);
    setVideoData({
      videoId: url,
      title: ytTitleResponse.data?.title ?? '',
      thumbnail: ytTitleResponse.data?.thumbnail ?? '',
      extra: ytTitleResponse.data?.extra
    });
    setYtTrans(ytResponse);
    const mergedTranscript = mergeTranscript(ytResponse)
    if (generateSummary) {
      const langFromVideo = checkLanguage(ytTitleResponse.data?.extra?.items[0]?.snippet?.defaultAudioLanguage ?? 'en');
      callRunGoogleAI(mergedTranscript, summaryLength, langFromVideo);
    } else {
      setLoading(false);
      setActionPerfomed('')
    }
  }, [summaryLength, ytUrl]);

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

  /*
  const onChangeSummaryLength = (value: string) => {
    setSummaryLength(value);
    callGrabYT()
  }*/

  useEffect(() => {
    if (ytUrl !== '' && ytUrl !== initURL) {
      // callGrabYT()
    }
  }, [callGrabYT, summaryLength, ytUrl]);

  return (
    <div>
      <Space.Compact style={{ width: '100%' }}>
        <Input allowClear onChange={onChangeInput} placeholder={initURL} defaultValue={initURL} onKeyDown={handleKeyDown} addonAfter={actionPerfomed} />
        <Tooltip title="Get info & make summary">
          <Button type="primary" onClick={() => callGrabYT()} loading={loading} icon={<ApiOutlined />} disabled={ytUrl === ''}></Button>
        </Tooltip>
      </Space.Compact>

      {summary !== '' &&
        <Card size="small" style={{ marginTop: 10 }} title={<Flex gap='small'>
          <div>Summary</div>
          <Select
            size='small'
            defaultValue={summaryLength}
            popupMatchSelectWidth={false}
            onChange={(value) => setSummaryLength(value)}
            options={[
              { label: 'Ultra-short', value: 'ultra-short' },
              { label: 'Short', value: 'short' },
              { label: 'Normal', value: 'normal' },
            ]} />

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
            <Tooltip title="Copy text">
              <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => console.log('aaaaa')} />
            </Tooltip>
          </Flex>

        }>
          <div dangerouslySetInnerHTML={{ __html: summary }} style={{ height: 'auto' }}></div>
        </Card>
      }

      {mergedTranscript !== '' &&
        <Card size="small" title={`Transcript: ${videoData.title}`} style={{ marginTop: 10 }} extra={
          <>
            <>[{convertYouTubeDuration(videoData.extra?.items[0]?.contentDetails.duration || '')}]</>
            <Tooltip title="Copy text">
              <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => console.log('aaaaa')} />
            </Tooltip>
          </>
        }>
          <div dangerouslySetInnerHTML={{ __html: mergedTranscript }} style={{ height: 100, overflow: 'scroll' }}></div>
        </Card>
      }

      {everythingOk &&
        <Flex gap='small' style={{ marginTop: 10 }} justify='center'>
          <Image
            width={256}
            height={144}
            src={videoData.thumbnail}
            alt=""
            style={{ height: 'auto', width: 256 }}
          />
        </Flex>
      }

      <FloatButtonComponent />
    </div>


  );
}
