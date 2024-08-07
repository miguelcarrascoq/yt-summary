'use client'

import React, { useEffect } from 'react'
import { CONST_REDIRECT_URL } from '../services/constants';
import { useRouter } from 'next/navigation';

const RedirectComponent = () => {

    const router = useRouter();

    useEffect(() => {
        if (CONST_REDIRECT_URL !== '') {
            router.push(CONST_REDIRECT_URL);
        }
    }, [router]);

    return (
        <div>...</div>
    )
}

export default RedirectComponent