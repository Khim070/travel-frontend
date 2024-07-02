import Sour from '../../img/sour.png'
import React, { useState } from 'react';
import { getAllUser, updateUser, updatePassword } from '../../Services/UserService.jsx';

const ChangePassword = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('New Password and Confirm Password do not match.');
            return;
        }

        try {
            const response = await updatePassword(email, oldPassword, newPassword);
            alert('Password changed successfully.');
        } catch (err) {
            console.error('Error details:', err);
            alert('An error occurred. Please try again.');
        }

    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                    <img className="w-16 h-16 mr-2 rounded-full" src={Sour} alt="logo" />
                    <p className='text-center'>Sour Sdey Travel & Tour <br /> Website Management System</p>
                </a>
                <div className="w-full p-6 bg-white rounded-lg shadow md:mt-0 sm:max-w-md  sm:p-8">
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                        Change Password
                    </h2>
                    <form onSubmit={handleChangePassword} className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
                        <div>
                            <label for="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@travel.com.kh" required=""/>
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Old Password</label>
                            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""/>
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" />
                        </div>
                        <button type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Change passwod</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default ChangePassword;