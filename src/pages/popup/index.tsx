import {scan} from "react-scan"; // must be imported before React and React DOM
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {ThemeProvider} from "@/components/ThemeProvider.tsx";
import {MockBrowserStorageApi, MockBrowserTabApi} from "@/lib/browser/mock/MockBrowserApi.ts";
import {ChromeExtensionStorageApi, ChromeExtensionTabApi} from "@/lib/browser/chrome/ChromeApi.ts";
import Popup from "@/popup/Popup.tsx";

const isProduction = import.meta.env.MODE === 'production';

scan({
    enable: !isProduction,
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <Popup
                browserTabApi={isProduction ? ChromeExtensionTabApi.init() : MockBrowserTabApi.init()}
                browserStorageApi={isProduction ? ChromeExtensionStorageApi.init() : MockBrowserStorageApi.init()}
            />
        </ThemeProvider>
    </StrictMode>,
)
