import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SocketProvider from './context/SocketProvider';
import reportWebVitals from './reportWebVitals';
import Auth0ProviderWithHistory from './context/Auth0ProviderWithHistory';
import MetaDataProvider  from './context/MetadataProvider';
import CalendarProvider from './context/CalendarProvider';
import SettingsProvider from './context/SettingsProvider';
import { BrowserRouter, Routes, Route } from "react-router";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0ProviderWithHistory>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        </Routes>
     </BrowserRouter>
    </Auth0ProviderWithHistory>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
