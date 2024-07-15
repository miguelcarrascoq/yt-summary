'use client'

import { Button } from 'antd';
import * as tts from '@diffusionstudio/vits-web';
import { runGoogleAI } from './serverai';

import { TranscriptResponse, YoutubeTranscript } from 'youtube-transcript';
import { useEffect, useState } from 'react';

export default function Home() {

  const [ytResponse, setYtResponse] = useState<TranscriptResponse[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res: TranscriptResponse[] = await YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=tdLs7nyQJtU');
      console.log(res);
      setYtResponse(res);
    }
    fetchData();
  }, []);

  const mergeTranscript = () => {
    let mergedTranscript = '';
    ytResponse.forEach((transcript) => {
      mergedTranscript += transcript.text + ' ';
    });
    console.log(mergedTranscript)
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

  return (
    <div>
      <Button type="primary" onClick={playSound}>playSound</Button>
      <Button type="primary" onClick={mergeTranscript}>mergeTranscript</Button>
      <Button type="primary" onClick={runGoogleAI}>runGoogleAI</Button>
    </div>
  );
}
