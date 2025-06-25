import {scan} from "react-scan"; // must be imported before React and React DOM
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {ThemeProvider} from "@/components/ThemeProvider.tsx";
import Popup from "./Popup";

const isProduction = import.meta.env.MODE === 'production';

scan({
    enabled: !isProduction,
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <Popup
            />
        </ThemeProvider>
    </StrictMode>,
)
