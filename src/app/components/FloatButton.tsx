'use client'

import { GithubOutlined, MoreOutlined, QrcodeOutlined, QuestionOutlined, ShareAltOutlined } from '@ant-design/icons'
import { FloatButton, Modal, QRCode } from 'antd'
import React, { useState } from 'react'
import useOrigin from '../hooks/origin'
import { openInNewTab, webShare } from '../services/utils'

const FloatButtonComponent = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const urlToShare = (useOrigin() + '?vid=' + (process.env.NEXT_PUBLIC_INIT_YTID ?? 'rs72LPygGMY')) || '/';

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const triggerShare = () => {
        webShare('Youtube Summary', 'Summarize YouTube videos with AI', process.env.NEXT_PUBLIC_APP_URL ?? 'https://yt-summary-next.vercel.app');
    }

    return (
        <>
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ right: 24 }}
                icon={<MoreOutlined />}
            >
                <FloatButton tooltip="GitHub repo" icon={<GithubOutlined />} onClick={() => openInNewTab(process.env.NEXT_PUBLIC_REPO ?? 'https://github.com/miguelcarrascoq/yt-summary')} />
                <FloatButton tooltip="QR to scan" icon={<QrcodeOutlined />} onClick={showModal} />
                <FloatButton tooltip="Share this page" icon={<ShareAltOutlined />} onClick={triggerShare} />
                <FloatButton tooltip="Help" icon={<QuestionOutlined />} onClick={showModal} />
            </FloatButton.Group>

            <Modal title={`${urlToShare}`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={<></>}>
                <QRCode value={urlToShare} style={{ width: '100%', height: 'auto' }} />
            </Modal>
        </>
    )
}

export default FloatButtonComponent