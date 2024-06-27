import profile from '../../img/profile.webp';
import profile1 from '../../img/profile.JPG';
import logo from '../../img/logo.webp';
import soursdey from '../../img/sour.png';
import Home from '../Home/home';
import MenuItem from "../Home/menuItem";
import Popular from '../Review/popular';
import Destination from '../Review/destination';
import AboutUs from '../AboutUs/aboutus';
import ContactUs from '../ContactUs/contactus';
import Logout from '../Account/logout';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import React, { useState} from 'react';
import Ourteam from '../AboutUs/ourteam';


function SideBar(){

    const [isOpen, setIsOpen] = useState(false);
    const [isWidth, setIsWidth] = useState(false);
    const navigateLogout = useNavigate();
    const [activeSection, setActiveSection] = useState('Home');

    const OpenClick = () => {
        setIsOpen(!isOpen);
        setIsWidth(!isWidth);
    }

    const setActive = (section) => {
        setActiveSection(section);
    }

    const handleRedirectLogOut = () => {
        navigateLogout('/login');
    }

    return (
        <div className='mx-auto relative'>
            <div className='mx-auto flex justify-between'>
                {/* left-side */}
                <div className='h-screen w-auto overflow-hidden'>
                    <div className={`flex flex-col z-10 absolute justify-between bg-gray-100 sm:w-3/12 h-screen border-r-2 border-gray-300 ease-in-out duration-150 col-span-1 ${isOpen ? 'w-5/6' : 'w-16'}`}>
                        <div className="px-5 py-6">
                            <span className='flex items-center md:justify-center justify-between'>
                                <img className={`md:block md:size-28 rounded-full object-cover size-10 ${isOpen ? '' : 'hidden'}`} src={soursdey} alt="logo" />
                                <div className='md:hidden cursor-pointer' onClick={OpenClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-400 hover:text-gray-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                </div>
                            </span>
                            <ul className={`mt-6 md:block cursor-pointer ${isOpen ? '' : 'hidden'}`}>
                                <li className="pb-2">
                                    <Link to="/home"
                                        className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Home' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}
                                        onClick={() => setActive('Home')}>Home</Link>
                                </li>
                                <li className="pb-2">
                                    <details className='group [&_summary::-webkit-details-marker]:hidden'>
                                        <summary className='flex justify-between cursor-pointer rounded-lg hover:bg-gray-200 hover:text-gray-700 px-4 py-2 text-ms font-medium text-gray-500'>
                                            <span className="">Review</span>
                                            <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <ul className='mt-2 space-y-1 px-4'>
                                            <li className=''>
                                                <Link to="/popular"
                                                className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Popular' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActive('Popular')}>Popular</Link>
                                            </li>
                                            <li className=''>
                                                <Link to="/destination"
                                                    className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Destination' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActive('Destination')}>Destination</Link>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                                <li className="pb-2">
                                    <details className='group [&_summary::-webkit-details-marker]:hidden'>
                                        <summary className='flex justify-between cursor-pointer rounded-lg hover:bg-gray-200 hover:text-gray-700 px-4 py-2 text-ms font-medium text-gray-500'>
                                            <span className="">About Us</span>
                                            <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <ul className='mt-2 space-y-1 px-4'>
                                            <li className=''>
                                                <Link to="/about-us"
                                                    className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'AboutUs' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActive('AboutUs')}>Main page</Link>
                                            </li>
                                            <li className=''>
                                                <Link to="/our-team"
                                                    className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'OurTeam' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActive('OurTeam')}>Our Team</Link>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                                {/* <li className="pb-2">
                                    <Link to="/about-us"
                                     className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'AboutUs' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}
                                        onClick={() => setActive('AboutUs')}>About Us</Link>
                                </li> */}
                                <li className="pb-2">
                                    <Link to="/contact-us"
                                    className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'ContactUs' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}
                                        onClick={() => setActive('ContactUs')}>Contact Us</Link>
                                </li>
                                <li className="pb-2">
                                    <details className='group [&_summary::-webkit-details-marker]:hidden'>
                                        <summary className='flex justify-between cursor-pointer rounded-lg hover:bg-gray-200 hover:text-gray-700 px-4 py-2 text-ms font-medium text-gray-500'>
                                            <span className="">Account</span>
                                            <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <ul className='mt-2 space-y-1 px-4'>
                                            <li className=''>
                                                <Link to="user" className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'User' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActive('User')}>User</Link>
                                            </li>
                                            <li className=''>
                                                <Link to="/record" className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Record' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActive('Record')}>Record</Link>
                                            </li>
                                            <li className=''>
                                                <Link to="/login" className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Log-Out' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}
                                                onClick={() => setActive('Log-Out')}>Log Out
                                                </Link>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </div>
                        <div className="bottom-0  border-gray-100">
                            <a href="" className="flex items-center gap-2 bg-white p-4">
                                <img src={profile} alt="photo" className='md:size-10 size-8 rounded-full object-cover' />
                                <div>
                                    <p className={`text-xs md:block ${isOpen ? '' : 'hidden'}`}>Leang Vakhim</p>
                                    <span className={`font-medium md:block ${isOpen ? '' : 'hidden'} `}>Super Admin</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                {/* right-side */}
                <div className='h-screen max-w-full md:w-9/12 w-5/6 overflow-y-auto'>
                    <div className='mx-10'>
                        <main>
                            <Routes>
                                <Route path="/home/*" element={<Home />} />
                                <Route path="/popular" element={<Popular />} />
                                <Route path="/destination" element={<Destination />} />
                                <Route path="/about-us" element={<AboutUs />} />
                                <Route path="/contact-us" element={<ContactUs />} />
                                <Route path="/our-team" element={<Ourteam />} />
                                <Route path="/login" element={<Logout />} />
                                {/* Add other routes here */}
                            </Routes>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;