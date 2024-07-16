'use client'

import { Button, Flex, Input, Select, Space, Image } from 'antd';
import { grabYT, grabYTTitle, runGoogleAI, transformUrl } from './services';

import { TranscriptResponse } from 'youtube-transcript';
import { useEffect, useState } from 'react';
import { populateVoiceList, IVoice, sayInput, stopSpeech } from './services/win';
import { BorderOutlined, SwapOutlined } from '@ant-design/icons';
import { IVideoData } from './api/title/route';

export default function Home() {

  const [ytUrl, setYtUrl] = useState<string>('https://www.youtube.com/watch?v=tdLs7nyQJtU');
  const [videoData, setVideoData] = useState<IVideoData>({
    videoId: '',
    title: '',
    thumbnail: ''
  });
  const [ytTranscript, setYtTrans] = useState<TranscriptResponse[]>([]);
  const [mergedTranscript, setMergedTranscript] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  const [voiceList, setVoiceList] = useState<IVoice[]>([]);
  const [voice, setVoice] = useState('Mónica');
  const [summaryLength, setSummaryLength] = useState<string>('ultra-short');


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
    let mergedTranscript = '';
    ytResponse.forEach((transcript) => {
      mergedTranscript += transcript.text + ' ';
    });
    console.log(mergedTranscript)
    setMergedTranscript(mergedTranscript)
  }

  const callGrabYT = async () => {
    const url = transformUrl(ytUrl);
    const ytResponse = await grabYT(url);
    const ytTitleResponse = await grabYTTitle(url);
    setVideoData({
      videoId: url,
      title: ytTitleResponse.data?.title ?? '',
      thumbnail: ytTitleResponse.data?.thumbnail ?? ''
    });
    console.log(ytResponse);
    console.log(ytTitleResponse)
    setYtTrans(ytResponse);
    mergeTranscript(ytResponse)
  }

  const callRunGoogleAI = async () => {
    const result = await runGoogleAI(mergedTranscript, summaryLength);
    console.log(result);
    setSummary(result);
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const url = e.target.value;
    setYtUrl(url);
  };

  return (
    <div>
      <Space.Compact style={{ width: '100%' }}>
        <Input allowClear onChange={onChangeInput} placeholder="https://www.youtube.com/watch?v=tdLs7nyQJtU" defaultValue='https://www.youtube.com/watch?v=tdLs7nyQJtU' addonAfter={videoData.title} />
        <Button type="primary"><SwapOutlined /></Button>
        <Button type="primary"><SwapOutlined /></Button>
      </Space.Compact>
      <Flex gap='small' >
        <Button type="primary" onClick={callGrabYT}>grabYT</Button>
        <Button type="primary" onClick={callRunGoogleAI}>runGoogleAI</Button>
        <Button type="primary" onClick={() => sayInput(summary, voice)}>sayInput</Button>

        <Button type="primary" onClick={() => stopSpeech()} danger icon={<BorderOutlined />}></Button>
      </Flex >
      <Image
        width={200}
        src={videoData.thumbnail}
        alt=""
      />
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
    </div>

  );
}
