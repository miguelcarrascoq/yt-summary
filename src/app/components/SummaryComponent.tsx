'use client'

import { Button, Card, Flex, Select } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import TextZoomComponent from './TextZoomComponent'
import { CopyOutlined, MutedOutlined, SoundOutlined } from '@ant-design/icons'
import { IVoice, populateVoiceList, sayInput, stopSpeech } from '../services/win'

const SummaryComponent = forwardRef((
    {
        summary,
        copyToClipboard,
    }: {
        summary: string,
        copyToClipboard: (text: string) => void
    }, ref
) => {

    const [voiceList, setVoiceList] = useState<IVoice[]>([]);
    const [voice, setVoice] = useState('Mónica');
    const [playingAudio, setPlayingAudio] = useState(false);

    useImperativeHandle(ref, () => ({
        stopSpeechSummary() {
            stopSpeechSummary();
        }
    }));

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

    const playSpeechSummary = (summary: string, voice: string) => {
        sayInput(summary, voice);
        setPlayingAudio(true);
    }

    const stopSpeechSummary = (): void => {
        stopSpeech();
        setPlayingAudio(false);
    }

    return (
        <>
            {summary !== '' &&
                <Card size="small" style={{ marginTop: 10 }}
                    title={
                        <Flex gap='small'>
                            <div>Summary</div>
                        </Flex>
                    } extra={
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
                            <TextZoomComponent summaryText={summary} />
                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(summary)} ></Button>
                        </Flex>

                    }>
                    <div dangerouslySetInnerHTML={{ __html: summary }} style={{ height: 'auto' }}></div>
                </Card>
            }
        </>
    )
})

SummaryComponent.displayName = 'SummaryComponent'
export default SummaryComponent