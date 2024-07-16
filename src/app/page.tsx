'use client'

import { Button, Flex, Input, Select, Space, Image } from 'antd';
import { grabYT, grabYTTitle, runGoogleAI, extractVideoID } from './services';

import { TranscriptResponse } from 'youtube-transcript';
import { useEffect, useState } from 'react';
import { populateVoiceList, IVoice, sayInput, stopSpeech } from './services/win';
import { BorderOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { IVideoData } from './api/title/interface';
import { convertYouTubeDuration } from './services/utils';

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
    console.log(mergedTranscript)
    setMergedTranscript(mergedTranscript)
    return mergedTranscript
  }

  const callGrabYT = async () => {
    setLoading(true);
    setEverythingOk(false);
    setActionPerfomed('Getting video data...')
    const url = extractVideoID(ytUrl);
    const ytResponse = await grabYT(url);
    const ytTitleResponse = await grabYTTitle(url);
    setVideoData({
      videoId: url,
      title: ytTitleResponse.data?.title ?? '',
      thumbnail: ytTitleResponse.data?.thumbnail ?? '',
      extra: ytTitleResponse.data?.extra
    });
    console.log(ytResponse);
    console.log(ytTitleResponse)
    setYtTrans(ytResponse);
    const mergedTranscript = mergeTranscript(ytResponse)
    callRunGoogleAI(mergedTranscript, summaryLength);
  }

  const callRunGoogleAI = async (mergedTranscript: string, summaryLength: string) => {
    setActionPerfomed('Running Google AI...')
    setLoading(true);
    const result = await runGoogleAI(mergedTranscript, summaryLength);
    console.log(result);
    setSummary(result.transcript);
    setEverythingOk(true);
    setLoading(false);
    setActionPerfomed('')
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const url = e.target.value;
    setYtUrl(url);
  };

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      callGrabYT()
    }
  }

  return (
    <div>

      {everythingOk &&
        <div>
          <div>Title: {videoData.title}</div>
          <div>Duration: {convertYouTubeDuration(videoData.extra?.items[0]?.contentDetails.duration || '')}</div>
          <Image
            width={200}
            src={videoData.thumbnail}
            alt=""
          />
        </div>
      }
      <Space.Compact style={{ width: '100%' }}>
        <Input allowClear onChange={onChangeInput} placeholder={initURL} defaultValue={initURL} onKeyDown={handleKeyDown} addonAfter={actionPerfomed} />
        <Button type="primary" onClick={callGrabYT} loading={loading} icon={<SearchOutlined />}></Button>
      </Space.Compact>

      <Button type="default" icon={<SwapOutlined />}></Button>
      <Flex gap='small' >
        <Button type="primary" onClick={callGrabYT}>grabYT</Button>
        <Button type="primary" onClick={() => callRunGoogleAI(mergedTranscript, summaryLength)}>runGoogleAI</Button>
        <Button type="primary" onClick={() => sayInput(summary, voice)}>sayInput</Button>

        <Button type="primary" onClick={() => stopSpeech()} danger icon={<BorderOutlined />}></Button>
      </Flex >

      <Select
        defaultValue={voice}
        popupMatchSelectWidth={false}
        onChange={(value) => setVoice(value)}
        options={voiceList.map((voice) => ({ label: `${voice.name} [${voice.lang}]`, value: voice.name }))}
      />
      <Select
        defaultValue='ultra-short'
        onChange={(value) => setSummaryLength(value)}
        options={[
          { label: 'Ultra-short', value: 'ultra-short' },
          { label: 'Short', value: 'short' },
          { label: 'Normal', value: 'normal' },
        ]} />
      <div><b>summary</b>: {summary}</div>
      <hr />
      <div><b>mergedTranscript</b>: {mergedTranscript}</div>

      <hr />
      <pre>{JSON.stringify(videoData, undefined, 4)}</pre>
    </div>

  );
}
