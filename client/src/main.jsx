import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css';
import './styles/enhancements.css';
import './styles/trust-signals.css';
import './styles/mobile-optimizations.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
