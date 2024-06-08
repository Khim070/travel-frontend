import profile from '../../img/profile.webp';
import profile1 from '../../img/profile.JPG';
import logo from '../../img/logo.webp';
import soursdey from '../../img/sour.png';
import Home from '../Home/home';
import Popular from '../Review/popular';
import Destination from '../Review/destination';
import AboutUs from '../AboutUs/aboutus';
import ContactUs from '../ContactUs/contactus';
import React,{useState} from 'react';

function SideBar(){

    const [isOpen, setIsOpen] = useState(false);
    const [isWidth, setIsWidth] = useState(false);
    const [activeSection, setActiveSection] = useState('Home');

    const OpenClick = () => {
        setIsOpen(!isOpen);
        setIsWidth(!isWidth);
    }

    const setActive = (section) => {
        setActiveSection(section);
    }

    return(
        <div className='mx-auto relative '>
            <div className='mx-auto flex justify-between'>
                {/* left-side */}
                <div className='h-screen w-1/6 overflow-hidden'>
                    <div className={`flex flex-col z-10 absolute justify-between bg-gray-100 sm:w-1/6 h-screen border-r-2 border-gray-300 ease-in-out duration-150 col-span-1 ${isWidth ? 'w-2/3' : 'w-16'}`}>
                        <div className="px-5 py-6">
                            <span className='flex items-center md:justify-center justify-between'>
                                <img className={`md:block md:size-28 rounded-full object-cover size-10 ${isOpen ? '' : 'hidden'}`} src={soursdey} alt="logo" />
                                <div className='md:hidden cursor-pointer' onClick={OpenClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400 hover:text-gray-700">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                </div>
                            </span>
                            <ul className={`mt-6 md:block cursor-pointer ${isOpen ? '' : 'hidden'}`}>
                                <li className="pb-2">
                                    <a onClick={() => setActive('Home')} className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Home' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}>Home</a>
                                </li>
                                <li className="pb-2">
                                    <details className='group [&_summary::-webkit-details-marker]:hidden'>
                                        <summary className='flex justify-between cursor-pointer rounded-lg hover:bg-gray-200 hover:text-gray-700 px-4 py-2 text-ms font-medium text-gray-500'>
                                            <span className="">Review</span>
                                            <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <ul className='mt-2 space-y-1 px-4'>
                                            <li className=''>
                                                <a onClick={() => setActive('Popular')} className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Popular' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}>Popular</a>
                                            </li>
                                            <li className=''>
                                                <a onClick={() => setActive('Destination')} className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Destination' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}>Destination</a>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                                <li className="pb-2">
                                    <a onClick={() => setActive('AboutUs')} className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'AboutUs' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}>About Us</a>
                                </li>
                                <li className="pb-2">
                                    <a onClick={() => setActive('ContactUs')} className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'ContactUs' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}>Contact Us</a>
                                </li>
                                <li className="pb-2">
                                    <details className='group [&_summary::-webkit-details-marker]:hidden'>
                                        <summary className='flex justify-between cursor-pointer rounded-lg hover:bg-gray-200 hover:text-gray-700 px-4 py-2 text-ms font-medium text-gray-500'>
                                            <span className="">Account</span>
                                            <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <ul className='mt-2 space-y-1 px-4'>
                                            <li className=''>
                                                <a onClick={() => setActive('User')} className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'User' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}>User</a>
                                            </li>
                                            <li className=''>
                                                <a onClick={() => setActive('Record')} className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Record' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}>Record</a>
                                            </li>
                                            <li className=''>
                                                <a onClick={() => setActive('Log-Out')} className={`block text-ms font-medium px-4 py-2 rounded-lg ${activeSection !== 'Log-Out' ? 'hover:bg-gray-200 hover:text-gray-700 text-gray-500' : 'bg-gray-200 text-gray-700'}`}>Log Out</a>
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

                <div className='h-screen w-5/6 overflow-y-auto'>
                    <div className='mx-10'>
                        <main >
                            <div className={`${activeSection === 'Home' ? 'block' : 'hidden'}`}>
                                <Home />
                            </div>
                            <div className={`${activeSection === 'Popular' ? 'block' : 'hidden'}`}>
                                <Popular />
                            </div>
                            <div className={`${activeSection === 'Destination' ? 'block' : 'hidden'}`}>
                                <Destination />
                            </div>
                            <div className={`${activeSection === 'AboutUs' ? 'block' : 'hidden'}`}>
                                <AboutUs />
                            </div>
                            <div className={`${activeSection === 'ContactUs' ? 'block' : 'hidden'}`}>
                                <ContactUs />
                            </div>
                            <div className={`${activeSection === 'User' ? 'block' : 'hidden'}`}>
                                <h1>Welcome User</h1>
                            </div>
                            <div className={`${activeSection === 'Record' ? 'block' : 'hidden'}`}>
                                <h1>Welcome Record</h1>
                            </div>
                            <div className={`${activeSection === 'Log-Out' ? 'block' : 'hidden'}`}>
                                <h1>Welcome Log Out</h1>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;