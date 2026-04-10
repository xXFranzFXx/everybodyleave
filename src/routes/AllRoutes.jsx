import { BrowserRouter, Routes, Route } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import { useAuth0 } from '@auth0/auth0-react';
import CalendarComponent from '../components/calendar/CalendarComponent';
import SimpleForm from '../form/SimpleForm';
import LoginButton from '../components/LoginButton';
import App from '../App';
import Payments from '../components/paypal/Payments';
import ContributionPage from '../components/graph/ContributionPage';
const AllRoutes = () => {
  return (
    <Routes>
    {/* <Route path="/login" element={<LoginButton/>} /> */}

     <Route  element={<ProtectedRoute />} >
        <Route path="/" element={<SimpleForm/>} />
      <Route path="/calendar" element={<CalendarComponent/>} />
      <Route path="/upgrade" element={<Payments/>} />
            <Route path="/progress" element={<ContributionPage/>}/>

      </Route>
       <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};

export default AllRoutes;
