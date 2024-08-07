'use client'

import { AlignLeftOutlined, ClockCircleOutlined, CommentOutlined, CopyOutlined, EyeOutlined, FieldTimeOutlined, LikeOutlined, YoutubeOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Segmented, Timeline, Typography } from 'antd'
import React from 'react'
import Image from 'next/image'
import { convertSecondsToTime, convertYouTubeDuration, formatNumber, openInNewTab } from '../services/utils'
import { primaryColor, primaryColorCSS } from '../services/constants'
import { IVideoData } from '../api/video-info/interface'
import { ITranscriptCaption } from '../api/transcript/interface'

const TranscriptComponent = (
    {
        videoData,
        transcriptViewType,
        setTranscriptViewType,
        mergedTranscript,
        transcriptTimeline,
        copyToClipboard,
    }: {
        videoData: IVideoData,
        transcriptViewType: string,
        setTranscriptViewType: (value: string) => void,
        mergedTranscript: string,
        transcriptTimeline: ITranscriptCaption[],
        copyToClipboard: (text: string) => void,
    }
) => {
    return (
        <>
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
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(`${videoData.title}: ${mergedTranscript}. Video: https://www.youtube.com/watch?v=${videoData.videoId}`)} />
                    </Flex>
                }>
                    <Flex gap='small'>
                        <Row gutter={10} style={{ width: '-webkit-fill-available' }}>
                            <Col md={8} xs={24}>
                                <Flex vertical gap='small' align='center'>
                                    <Image
                                        unoptimized
                                        width={120}
                                        height={90}
                                        src={videoData.extra?.items[0]?.snippet?.thumbnails?.high?.url ?? videoData.thumbnail}
                                        alt={videoData.title}
                                        style={{ borderRadius: 8, border: `3px ${primaryColor} solid`, cursor: 'pointer', width: '90%', height: 'auto' }}
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
                                        <Typography.Link style={{ ...primaryColorCSS, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                                            onClick={() => openInNewTab(`https://youtube.com/channel/${videoData.extra?.items[0].snippet.channelId}`)}
                                        ><YoutubeOutlined /> {videoData.extra?.items[0].snippet.channelTitle}</Typography.Link>
                                        <hr />
                                    </div>
                                    {transcriptViewType === 'timeline' &&
                                        <Timeline style={{ paddingTop: 8, paddingLeft: 2, height: 189, overflow: 'scroll', width: '-webkit-fill-available' }}
                                            items={transcriptTimeline.map((transcript) => (
                                                {
                                                    color: 'gray',
                                                    dot: <ClockCircleOutlined style={{ fontSize: '12px' }} />,
                                                    children:
                                                        <Flex>
                                                            <Button size="small" type="primary"
                                                                onClick={() => openInNewTab(`https://www.youtube.com/watch?v=${videoData.videoId}&t=${Number(transcript.dur)}s`)}>
                                                                {convertSecondsToTime(Number(transcript.total))}
                                                            </Button>&nbsp;&nbsp;
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
        </>
    )
}

export default TranscriptComponent