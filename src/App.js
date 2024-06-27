import SideBar from "./components/sidebar/sidebar";
import Logout from './components/Account/logout';
import Home from './components/Home/home';
import Popular from './components/Review/popular';
import Destination from './components/Review/destination';
import AboutUs from './components/AboutUs/aboutus';
import ContactUs from './components/ContactUs/contactus';
// import React, { createContext, useState, useContext } from 'react';
// import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<SideBar />} />
        <Route path="/login" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
