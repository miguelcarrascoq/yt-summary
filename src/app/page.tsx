'use client'

import { Button, Flex, Input, Select } from 'antd';
import { grabYT, runGoogleAI } from './services';

import { TranscriptResponse } from 'youtube-transcript';
import { useEffect, useState } from 'react';
import { populateVoiceList, IVoice, sayInput, stopSpeech } from './services/win';
import { BorderOutlined } from '@ant-design/icons';

export default function Home() {

  const [ytUrl, setYtUrl] = useState<string>('');
  const [ytTranscript, setYtTrans] = useState<TranscriptResponse[]>([]);
  const [mergedTranscript, setMergedTranscript] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  const selectValues = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const [voiceList, setVoiceList] = useState<IVoice[]>([]);
  const [voiceOptions, setVoiceOptions] = useState([]);
  const [voice, setVoice] = useState('Mónica');
  const [pitch, setPitch] = useState<number>(1);
  const [rate, setRate] = useState<number>(1);
  const [summaryLength, setSummaryLength] = useState<string>('short');


  useEffect(() => {
    const fetchVoices = () => {
      try {
        const data = populateVoiceList();
        console.log(data)
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
    const ytResponse = await grabYT(ytUrl);
    console.log(ytResponse);
    setYtTrans(ytResponse);
    mergeTranscript(ytResponse)
  }

  const callRunGoogleAI = async () => {
    const result = await runGoogleAI(mergedTranscript, summaryLength);
    console.log(result);
    setSummary(result);
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(e);
    // remove the youtube url from e.target.value (example: https://www.youtube.com/watch?v=AAAAAAA)
    const url = e.target.value;
    const urlParams = new URLSearchParams(url);
    const ytId = urlParams.get('v');
    if (ytId) {
      setYtUrl(ytId);
      return;
    } else {
      setYtUrl(url);
    }
  };

  return (
    <div>
      <Input allowClear onChange={onChangeInput} placeholder="Youtube ID (i.e.: tdLs7nyQJtU) or URL (i.e.: https://www.youtube.com/watch?v=tdLs7nyQJtU)" defaultValue='tdLs7nyQJtU' />
      <Flex gap='small' >
        <Button type="primary" onClick={callGrabYT}>grabYT</Button>
        <Button type="primary" onClick={callRunGoogleAI}>runGoogleAI</Button>
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
        defaultValue='short'
        onChange={(value) => setSummaryLength(value)}
        options={[
          { label: 'Ultra-short', value: 'ultra-short' },
          { label: 'short', value: 'short' },
          { label: 'normal', value: 'normal' },
        ]} />
      <div><b>summary</b>: {summary}</div>
      <hr />
      <div><b>mergedTranscript</b>: {mergedTranscript}</div>
    </div>

  );
}
