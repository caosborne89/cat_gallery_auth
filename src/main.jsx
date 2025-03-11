import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@aws-amplify/ui-react/styles.css';
import outputs from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import RedirectAuthenticator from "./RedirectAthenticator.jsx"

Amplify.configure(outputs);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RedirectAuthenticator>
      <App />
    </RedirectAuthenticator>
  </StrictMode>,
)
