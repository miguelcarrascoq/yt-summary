import { Typography } from 'antd';
import React from 'react'

const { Title } = Typography;

function PageNotAvailable() {
    return (
        <>
            <Title level={1} style={{ textAlign: 'center', marginTop: 100 }}>App is currently down for maintenance</Title>
            <Title level={3} style={{ textAlign: 'center', marginTop: 20 }}>Please come back later</Title>
        </>
    )
}

export default PageNotAvailable