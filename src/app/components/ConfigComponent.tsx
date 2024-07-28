'use client'

import React, { useEffect } from 'react'
import { Card, Form, Input } from 'antd'
import { ApiKeysStore } from '../store/keys';

const ConfigComponent = () => {
    const [form] = Form.useForm();

    const { youtubeApiKey, googleApiKey, setYoutubeApiKey, setGoogleApiKey } = ApiKeysStore();

    useEffect(() => {
        form.setFieldsValue({
            GOOGLE_API_KEY: googleApiKey,
            YOUTUBE_API_KEY: youtubeApiKey
        })
    }, [form, googleApiKey, youtubeApiKey])

    return (
        <Form form={form} layout="vertical"
            initialValues={{
                GOOGLE_API_KEY: googleApiKey,
                YOUTUBE_API_KEY: youtubeApiKey
            }}>
            <Form.Item name="GOOGLE_API_KEY" label="Google Generative Language API Key"
                rules={[{ required: true, message: 'Google Generative Language API Key required' }]}>
                <Input placeholder="AIza..." onChange={() => setGoogleApiKey(form.getFieldValue('GOOGLE_API_KEY'))} />
            </Form.Item>
            <Form.Item name="YOUTUBE_API_KEY" label="YouTube Data API Key (v3)"
                rules={[{ required: true, message: 'YouTube Data API Key (v3) required' }]}>
                <Input placeholder="AIza..." onChange={() => setYoutubeApiKey(form.getFieldValue('YOUTUBE_API_KEY'))} />
            </Form.Item>
        </Form>
    )
}

export default ConfigComponent