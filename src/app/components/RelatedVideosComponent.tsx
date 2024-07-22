'use client'

import { Divider, Flex } from 'antd'
import React, { useState } from 'react'
import Image from 'next/image'
import { primaryColor } from '../services/constants'

const RelatedVideosComponent = (
    {
        relatedVideos,
        ytUrl,
        setYtUrl,
        callGrabYT,
        clearValues,
        initURL
    }: {
        relatedVideos: any[],
        ytUrl: string,
        setYtUrl: (url: string) => void,
        callGrabYT: (url: string) => void,
        clearValues: () => void,
        initURL: string
    }
) => {

    const [videoTitleRollOver, setVideoTitleRollOver] = useState('');

    return (
        <>
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
        </>
    )
}

export default RelatedVideosComponent