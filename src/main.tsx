import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
// Display face for headings; the width axis lets the hero set it condensed
import '@fontsource-variable/bricolage-grotesque/wdth.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './index.css'
import App from './App.tsx'
import { ContentProvider } from './content/ContentProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContentProvider>
  </StrictMode>,
)
