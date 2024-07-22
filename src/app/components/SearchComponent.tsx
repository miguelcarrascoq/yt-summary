'use client'

import { ThunderboltOutlined } from '@ant-design/icons'
import { Button, Grid, Input, Select, Space } from 'antd'
import React from 'react'

const SearchComponent = (
    { ytUrl, setYtUrl, initURL, callGrabYT, loading, actionPerfomed, handleKeyDown, onChangeInput, summaryLength, setSummaryLength }:
        { ytUrl: string, setYtUrl: (value: string) => void, initURL: string, callGrabYT: () => void, loading: boolean, actionPerfomed: string, handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void, onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void, summaryLength: string, setSummaryLength: (value: string) => void }
) => {

    const screens = Grid.useBreakpoint();

    const onChangeSelect = (value: string) => {
        setSummaryLength(value)
    }

    return (
        <Space.Compact style={{ width: '100%' }}>
            <Input allowClear onChange={onChangeInput} placeholder={initURL} defaultValue={initURL} value={ytUrl} onKeyDown={handleKeyDown} maxLength={50} />
            <Select
                defaultValue={summaryLength}
                popupMatchSelectWidth={false}
                onChange={(value) => onChangeSelect(value)}
                options={[
                    { label: 'Ultra-short', value: 'ultra-short' },
                    { label: 'Short', value: 'short' },
                    { label: 'Normal', value: 'normal' },
                    { label: '3 bullets', value: '3-bullets' },
                    { label: '5 bullets', value: '5-bullets' },
                ]} />
            <Button type="primary" onClick={() => callGrabYT()} loading={loading} icon={<ThunderboltOutlined />} disabled={ytUrl === ''}>{loading ? actionPerfomed : (screens.xs ? '' : 'Get Summary')}</Button>
        </Space.Compact>
    )
}

export default SearchComponent