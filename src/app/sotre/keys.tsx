import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiKeysState {
    youtubeApiKey: string;
    googleApiKey: string;
}

interface Actions {
    setYoutubeApiKey: (key: string) => void;
    setGoogleApiKey: (key: string) => void;
}

export const ApiKeysStore = create<ApiKeysState & Actions>()(

    persist((set) => ({
        youtubeApiKey: '',
        googleApiKey: '',
        setYoutubeApiKey: (key: string) => set({ youtubeApiKey: key }),
        setGoogleApiKey: (key: string) => set({ googleApiKey: key }),
    }), {
        name: 'api-keys',
    })
);