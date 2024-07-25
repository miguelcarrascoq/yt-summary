'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { App, Row, Col, Grid, Typography, Flex } from 'antd';

import { TranscriptResponse } from 'youtube-transcript';

import { IVideoData } from '../api/video-info/interface';
import { IYoutubeSearchResponseItem } from '../api/yt-related/interface';

import { grabYT, grabYTChannelRelatedVideos, grabYTVideoInfo, runGoogleAI } from '../services/apis';
import { checkLanguage, decodeHtmlEntities, extractVideoID } from '../services/utils';

import FloatButtonComponent from '../components/FloatButtonComponent';
import TranscriptComponent from '../components/TranscriptComponent';
import RelatedVideosComponent from '../components/RelatedVideosComponent';
import SummaryComponent from '../components/SummaryComponent';
import SearchComponent from '../components/SearchComponent';
import PageNotAvailable from '../components/PageNotAvailable';
import { CONST_APP_ALIVE, CONST_INIT_YTID, CONST_USE_USER_API_KEY, primaryColor } from '../services/constants';
import { sendGAEvent } from '@next/third-parties/google'
import { ApiKeysStore } from '../sotre/keys';
import Link from 'antd/es/typography/Link';

const HomeComponent = () => {

    const initURL = `https://www.youtube.com/watch?v=${CONST_INIT_YTID}`;
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
    const floatButtonComponentRef = useRef<any>(null);

    const { googleApiKey, youtubeApiKey } = ApiKeysStore()

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

    const fetchYTVideoRelated = useCallback(async (videoId: string) => {
        const res = await grabYTChannelRelatedVideos(videoId, 15, youtubeApiKey);
        if (res.status && res.data?.items && res.data?.items.length > 0) {
            setRelatedVideos(res.data?.items);
        } else {
            setRelatedVideos([]);
        }
    }, [youtubeApiKey, setRelatedVideos]);

    const callRunGoogleAI = useCallback(async (mergedTranscript: string, summaryLength: string, langFromVideo: string, channelId?: string) => {
        setActionPerfomed('Running AI...')
        setLoading(true);

        const result = await runGoogleAI(mergedTranscript, summaryLength, langFromVideo, googleApiKey);
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
    }, [fetchYTVideoRelated, googleApiKey, message]);

    const callGrabYT = useCallback(async (fullURL?: string, generateSummary: boolean = true) => {
        setLoading(true);
        setActionPerfomed('Getting video data...')
        setMergedTranscript('');
        setSummary('');
        handleStopSpeech()

        sendGAEvent({
            event: 'buttonGrabYTClicked', value: {
                fullURL: fullURL,
            }
        })

        const url = fullURL ? extractVideoID(fullURL) : extractVideoID(ytUrl);
        const ytResponse = await grabYT(url);
        setTranscriptTimeline(ytResponse)
        const ytTitleResponse = await grabYTVideoInfo(url, youtubeApiKey);
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
    }, [callRunGoogleAI, message, summaryLength, youtubeApiKey, ytUrl]);

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const url = e.target.value;
        setYtUrl(url);
    };

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            callGrabYT()
        }
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
        <>
            {CONST_APP_ALIVE ? (
                <div style={{ marginTop: screens.md ? 64 : 0 }}>
                    <Row gutter={10} style={{ marginBottom: 22 }}>
                        <Col md={6} xs={0}>

                        </Col>
                        <Col md={12} xs={24}>

                            {
                                CONST_USE_USER_API_KEY &&
                                <Flex justify='center' style={{ paddingBottom: 16 }}>
                                    <Typography.Text>Set your API KEYs <Link style={{ color: primaryColor }} onClick={() => floatButtonComponentRef.current?.setIsModalOpenQRCustomApiKey()}>here</Link></Typography.Text>
                                </Flex>
                            }

                            <SearchComponent ytUrl={ytUrl} setYtUrl={setYtUrl} initURL={initURL} callGrabYT={callGrabYT} loading={loading} actionPerfomed={actionPerfomed} handleKeyDown={handleKeyDown} onChangeInput={onChangeInput} summaryLength={summaryLength} setSummaryLength={setSummaryLength} />

                            <SummaryComponent ref={summaryComponentRef} summary={summary} copyToClipboard={copyToClipboard} />

                            <TranscriptComponent mergedTranscript={mergedTranscript} videoData={videoData} transcriptTimeline={transcriptTimeline} transcriptViewType={transcriptViewType} setTranscriptViewType={setTranscriptViewType} copyToClipboard={copyToClipboard} />

                            <RelatedVideosComponent relatedVideos={relatedVideos} ytUrl={ytUrl} setYtUrl={setYtUrl} callGrabYT={callGrabYT} clearValues={clearValues} initURL={initURL} />

                        </Col>
                        <Col md={6} xs={0}>

                        </Col>
                    </Row>

                    <FloatButtonComponent ref={floatButtonComponentRef} />
                </div>
            ) : (
                <PageNotAvailable />
            )}
        </>
    )
}

export default HomeComponent