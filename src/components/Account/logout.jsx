import { useState } from 'react';
import LoginImage from '../../img/loginImage.webp';
import IncorrectPassword from '../Alert/Incorrect';
import { useNavigate, Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from '../sidebar/sidebar';


function Logout(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showpassword, setShowpassword] = useState(false);
    const navigateHome = useNavigate();

    function setIsLoggedIn(){
        setIsLoggedIn(true);
    }

    const handleLogin = (e) => {
        e.preventDefault();

        // const isAuthenticated = authenticate(username, password);

        // if(isAuthenticated){
        //     setIsLoggedIn(true);
        // }else{
        //     alert("Incorrect Username or Password!!!");
        // }

        if (username === 'admin' && password === '123') {
            // alert('Login successful!');
            navigateHome('/home');
        } else {
            alert("Incorrect Username or Password!!!");
        }
    }


    // function authenticate(username, password) {
    //     username = "admin";
    //     password = 123;
    // }

    return(
        <body>
            <div className="font-[sans-serif] text-[#333]">
                <div className="min-h-screen flex fle-col items-center justify-center py-6 px-8">
                    <div className="grid md:grid-cols-2 items-center gap-4 max-w-7xl w-full">
                        <div className="border border-gray-300 rounded-md p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                            <form className="space-y-6" onSubmit={handleLogin}>
                                <div className="mb-10">
                                    <h3 className="text-3xl font-extrabold">Sign in</h3>
                                    <p className="text-sm mt-4">Welcome! Please log in to access your account and explore more features.</p>
                                </div>

                                <div>
                                    <label class="text-sm mb-2 block">Username</label>
                                    <div class="relative flex items-center">
                                        <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" required class="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter username" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <label class="text-sm mb-2 block">Password</label>
                                    <div class="relative flex items-center">
                                        <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} type={showpassword ? 'text' : 'password'} required class="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter password" />
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-[18px] h-[18px] absolute right-4 text-gray-400">
                                            <path fill-rule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex items-center">
                                        <input id="remember-me" onClick={() => setShowpassword(!showpassword)} name="remember-me" type="checkbox" class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                                        <label for="remember-me" class="ml-3 block text-sm cursor-pointer">
                                            Show password
                                        </label>
                                    </div>
                                    {/* <div class="text-sm">
                                        <a href="jajvascript:void(0);" class="text-blue-600 hover:underline">
                                            Change Password
                                        </a>
                                    </div> */}
                                </div>

                                <div className="!mt-8 flex">
                                    <Link
                                        to="/home"
                                        className={`w-full text-center shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-[#333] hover:bg-black focus:outline-none`}
                                        aria-label="Login Button"
                                        onClick={handleLogin}
                                        >
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </div>
                        <div class="lg:h-[400px] md:h-[300px] max-md:mt-10 hidden md:block">
                            <img src={LoginImage} class="w-full h-full object-cover" alt="Dining Experience" />
                        </div>
                    </div>
                </div>
            </div>
        </body>
    )
}
export default Logout;