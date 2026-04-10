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
import { BrowserRouter, Routes, Route, Switch } from "react-router";
import ProtectedRoute from './routes/ProtectedRoute';
import AllRoutes from './routes/AllRoutes';
import CalendarComponent from './components/calendar/CalendarComponent';
import Payments from './components/paypal/Payments';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <BrowserRouter>
    <Auth0ProviderWithHistory>
     <App/>
      {/* <Routes>
        <Route path="/" element={<App />} />
 <ProtectedRoute path='/calendar' component={CalendarComponent} />
            <ProtectedRoute path='/payments' component={Payments}/>        </Routes> */}
    </Auth0ProviderWithHistory>
         </BrowserRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
