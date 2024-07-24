'use client'

import { ApiOutlined, GithubOutlined, MoreOutlined, QrcodeOutlined, QuestionOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Divider, FloatButton, Modal, QRCode } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import useOrigin from '../hooks/origin'
import { openInNewTab, webShare } from '../services/utils'
import { CONST_APP_URL, CONST_INIT_YTID, CONST_REPO_URL } from '../services/constants'
import ConfigComponent from './ConfigComponent'

const FloatButtonComponent = forwardRef(({ }, ref) => {

    const [isModalOpenQR, setIsModalOpenQR] = useState(false);
    const [isModalOpenCustomApiKey, setIsModalOpenQRCustomApiKey] = useState(false);
    const urlToShare = (useOrigin() + '?vid=' + CONST_INIT_YTID) || '/';

    const triggerShare = () => {
        webShare('Youtube Summary', 'Summarize YouTube videos with AI', CONST_APP_URL);
    }

    useImperativeHandle(ref, () => ({
        setIsModalOpenQRCustomApiKey() {
            setIsModalOpenQRCustomApiKey(true);
        }
    }));

    return (
        <>
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ right: 24 }}
                icon={<MoreOutlined />}
            >
                <FloatButton tooltip="GitHub repo" icon={<GithubOutlined />} onClick={() => openInNewTab(CONST_REPO_URL)} />
                <FloatButton tooltip="QR to scan" icon={<QrcodeOutlined />} onClick={() => setIsModalOpenQR(true)} />
                <FloatButton tooltip="Share this page" icon={<ShareAltOutlined />} onClick={triggerShare} />
                <FloatButton tooltip="Custom API KEY" icon={<ApiOutlined />} onClick={() => setIsModalOpenQRCustomApiKey(true)} />
                <FloatButton tooltip="Help" icon={<QuestionOutlined />} onClick={() => setIsModalOpenQR(true)} />
            </FloatButton.Group>

            <Modal title={`${urlToShare}`} open={isModalOpenQR} onOk={() => setIsModalOpenQR(false)} onCancel={() => setIsModalOpenQR(false)} footer={<></>}>
                <QRCode value={urlToShare} style={{ width: '100%', height: 'auto' }} />
            </Modal>

            <Modal title={`Custom API KEY`} open={isModalOpenCustomApiKey} onOk={() => setIsModalOpenQRCustomApiKey(false)} onCancel={() => setIsModalOpenQRCustomApiKey(false)} footer={<></>} style={{ width: 400 }}>
                <Divider />
                <ConfigComponent />
            </Modal>
        </>
    )
})

FloatButtonComponent.displayName = 'FloatButtonComponent'
export default FloatButtonComponent