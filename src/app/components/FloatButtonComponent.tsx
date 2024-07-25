'use client'

import { ApiOutlined, GithubOutlined, MoreOutlined, QrcodeOutlined, QuestionOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Divider, FloatButton, Modal, QRCode, Typography } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import useOrigin from '../hooks/origin'
import { openInNewTab, webShare } from '../services/utils'
import { CONST_APP_URL, CONST_INIT_YTID, CONST_REPO_URL, primaryColor } from '../services/constants'
import ConfigComponent from './ConfigComponent'
import Image from 'next/image'
import Link from 'next/link'

const FloatButtonComponent = forwardRef(({ }, ref) => {

    const [isModalOpenQR, setIsModalOpenQR] = useState(false);
    const [isModalOpenCustomApiKey, setIsModalOpenQRCustomApiKey] = useState(false);
    const [isModalOpenHelp, setIsModalOpenHelp] = useState(false);
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
                <FloatButton tooltip="Help" icon={<QuestionOutlined />} onClick={() => setIsModalOpenHelp(true)} />
            </FloatButton.Group>

            <Modal title={`${urlToShare}`} open={isModalOpenQR} onOk={() => setIsModalOpenQR(false)} onCancel={() => setIsModalOpenQR(false)} footer={<></>}>
                <QRCode value={urlToShare} style={{ width: '100%', height: 'auto' }} />
            </Modal>

            <Modal title={`Custom API KEY`} open={isModalOpenCustomApiKey} onOk={() => setIsModalOpenQRCustomApiKey(false)} onCancel={() => setIsModalOpenQRCustomApiKey(false)} footer={<></>} style={{ width: 400 }}>
                <Divider />
                <ConfigComponent />
            </Modal>

            <Modal title={`Help`} open={isModalOpenHelp} onOk={() => setIsModalOpenHelp(false)} onCancel={() => setIsModalOpenHelp(false)} footer={<></>}>
                <Divider />
                <Typography.Text >🔘 Step 1: Press the <b>Share</b> button.</Typography.Text>
                <Image src="/images/help/step-1.jpg" alt="Step 1" width={300} height={311} style={{ width: '100%', height: 'auto' }} />
                <Divider />
                <Typography.Text >🔘 Step 2: Press the <b>Copy</b> button.</Typography.Text>
                <Image src="/images/help/step-2.jpg" alt="Step 2" width={300} height={311} style={{ width: '100%', height: 'auto' }} />
                <Divider />
                <Typography.Text >🔘 Step 3: <b>Paste</b> the link.</Typography.Text>
                <Image src="/images/help/step-3.jpg" alt="Step 3" width={300} height={311} style={{ width: '100%', height: 'auto' }} />
                <Divider />
                <Typography.Text >🔘 Step 4: <b>Select</b> the type of summary you want and press the <b>Get Summary</b> button.</Typography.Text>
                <Image src="/images/help/step-4.jpg" alt="Step 4" width={300} height={274} style={{ width: '100%', height: 'auto' }} />
                <Divider />
                <Typography.Text >🔘 Step 5: See the result.</Typography.Text>
                <Image src="/images/help/step-5.jpg" alt="Step 5" width={300} height={553} style={{ width: '100%', height: 'auto' }} />

                <Divider />
                <Typography.Text>If you can not see the result, it is possible that you need to set the API Keys. You can do this <Link style={{ color: primaryColor }} href={'#'} onClick={() => {
                    setIsModalOpenHelp(false)
                    setIsModalOpenQRCustomApiKey(true)
                }}>here</Link>. </Typography.Text>

            </Modal>
        </>
    )
})

FloatButtonComponent.displayName = 'FloatButtonComponent'
export default FloatButtonComponent