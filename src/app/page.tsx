'use client'

import { Button, Flex } from 'antd';
import * as tts from '@diffusionstudio/vits-web';
import { grabYT, runGoogleAI } from './services';

import { TranscriptResponse } from 'youtube-transcript';
import { useState } from 'react';

export default function Home() {

  const [ytTranscript, setYtTrans] = useState<TranscriptResponse[]>([]);
  const [mergedTranscript, setMergedTranscript] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  const mergeTranscript = (ytResponse: TranscriptResponse[]) => {
    let mergedTranscript = '';
    ytResponse.forEach((transcript) => {
      mergedTranscript += transcript.text + ' ';
    });
    console.log(mergedTranscript)
    setMergedTranscript(mergedTranscript)
  }

  const playSound = async () => {
    const wav = await tts.predict({
      text: "Hola! Aquí, probando este juguete.",
      voiceId: 'es_MX-claude-high',
    });

    const audio = new Audio();
    audio.src = URL.createObjectURL(wav);
    audio.play();
  }

  const callGrabYT = async () => {
    const ytResponse = await grabYT('tdLs7nyQJtU');
    console.log(ytResponse);
    setYtTrans(ytResponse);
  }

  const callRunGoogleAI = async () => {
    const result = await runGoogleAI(mergedTranscript);
    console.log(result);
    setSummary(result);
  }

  return (
    <div>
      <Flex gap='small' >
        <Button type="primary" onClick={playSound}>playSound</Button>

        <Button type="primary" onClick={callGrabYT}>grabYT</Button>
        <Button type="primary" onClick={() => mergeTranscript(ytTranscript)}>mergeTranscript</Button>
        <Button type="primary" onClick={callRunGoogleAI}>runGoogleAI</Button>
      </Flex >
      <div>summary: {summary}</div>
    </div>

  );
}
