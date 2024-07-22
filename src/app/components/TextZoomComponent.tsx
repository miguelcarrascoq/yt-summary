'use client'

import { CloseOutlined, CompressOutlined, FontSizeOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Grid, Modal } from 'antd'
import React, { useState } from 'react'

const initFontSize = 22;
const incrementFontSize = 2;

const TextZoomComponent = (
    { summaryText }: { summaryText: string },
) => {

    const screens = Grid.useBreakpoint();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fontSize, setFontSize] = useState(initFontSize);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const increaseFontSize = () => {
        setFontSize(fontSize + incrementFontSize);
    }

    const decreaseFontSize = () => {
        setFontSize(fontSize - incrementFontSize);
    }

    const resetFontSize = () => {
        setFontSize(initFontSize);
    }

    return (
        <div>
            <Button size="small" icon={<FontSizeOutlined />} onClick={showModal}></Button>

            <Modal
                open={isModalOpen} onOk={handleOk} onCancel={handleCancel} closeIcon={false}
                style={{ top: screens.md ? 16 : 0 }}
                title={
                    <Flex justify='space-between'>
                        <div>Summary</div>
                        <Flex gap='small'>
                            <Button type="primary" icon={<ZoomInOutlined />} onClick={increaseFontSize}></Button>
                            <Button type="primary" icon={<ZoomOutOutlined />} onClick={decreaseFontSize}></Button>
                            <Divider type="vertical" style={{ height: 'auto' }} />
                            <Button type="primary" icon={<CompressOutlined />} onClick={resetFontSize} disabled={initFontSize === fontSize}></Button>
                            <Divider type="vertical" style={{ height: 'auto' }} />
                            <Button icon={<CloseOutlined />} onClick={handleCancel}></Button>
                        </Flex>
                    </Flex>
                }
                footer={<></>}

                width='100%' height='auto'>
                <div dangerouslySetInnerHTML={{ __html: summaryText }} style={{ height: 'auto', fontSize: fontSize }}></div>
            </Modal>
        </div>
    )
}

export default TextZoomComponent