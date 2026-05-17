import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Service Worker — uniquement en production, hors iframe Lovable preview
if (
  'serviceWorker' in navigator &&
  import.meta.env.PROD &&
  window.self === window.top
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
