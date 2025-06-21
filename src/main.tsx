import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {Toaster} from 'react-hot-toast';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#3b82f6', // blue-500
          colorText: '#ffffff',
          colorBackground: '#030712', // gray-950
          colorInputBackground: '#1f2937', // gray-800
          colorInputText: '#ffffff',
        },
        elements: {
          card: {
            backgroundColor: '#111827', // gray-900
            border: '1px solid #374151', // gray-700
          },
          socialButtonsBlockButton: {
            backgroundColor: '#ffffff', // gray-800
            borderColor: '#4b5563', // gray-600
            '&:hover': {
              backgroundColor: '#374151', // gray-700
            },
          },
          footerActionLink: {
            color: '#60a5fa', // blue-400
            '&:hover': {
              color: '#93c5fd', // blue-300
            },
          },
        },
      }}
    >
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
