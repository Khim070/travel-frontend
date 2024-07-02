import SideBar from "./components/sidebar/sidebar";
import Login from './components/Account/logout';
import Logout from './components/Account/logout';
import Home from './components/Home/home';
import Popular from './components/Review/popular';
import Destination from './components/Review/destination';
import AboutUs from './components/AboutUs/aboutus';
import ContactUs from './components/ContactUs/contactus';
import Ourteam from './components/AboutUs/ourteam';
import User from './components/Account/user';
import ChangePassword from './components/Account/changepassword';
// import React, { createContext, useState, useContext } from 'react';
// import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InactivityHandler from './InactivityHandler';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { Helmet } from 'react-helmet';
import Sour from './img/sour.png';

function App() {
  return(
    <AuthProvider>
      <Router>
        <InactivityHandler>
          <Helmet>
            <title>Travel & Tour Website Management System</title>
            <link rel="icon" href={Sour} />
          </Helmet>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<SideBar />} />
            </Route>
          </Routes>
        </InactivityHandler>
      </Router>
    </AuthProvider>
  );
}

export default App;
