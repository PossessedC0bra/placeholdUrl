import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Popup from './Popup.tsx'
import {ThemeProvider} from "@/components/ThemeProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <Popup/>
        </ThemeProvider>
    </StrictMode>,
)
