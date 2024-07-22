'use client'

import { GithubOutlined, MoreOutlined, QrcodeOutlined, QuestionOutlined, ShareAltOutlined } from '@ant-design/icons'
import { FloatButton, Modal, QRCode } from 'antd'
import React, { useState } from 'react'
import useOrigin from '../hooks/origin'
import { openInNewTab, webShare } from '../services/utils'
import { CONST_APP_URL, CONST_INIT_YTID, CONST_REPO_URL } from '../services/constants'

const FloatButtonComponent = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const urlToShare = (useOrigin() + '?vid=' + CONST_INIT_YTID) || '/';

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
        webShare('Youtube Summary', 'Summarize YouTube videos with AI', CONST_APP_URL);
    }

    return (
        <>
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ right: 24 }}
                icon={<MoreOutlined />}
            >
                <FloatButton tooltip="GitHub repo" icon={<GithubOutlined />} onClick={() => openInNewTab(CONST_REPO_URL)} />
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