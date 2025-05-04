import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { store } from './store';
import 'antd/dist/reset.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

// ✅ Check if #root exists
const rootEl = document.getElementById('root');
if (!rootEl) {
  console.error('Root element not found in index.html');
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);