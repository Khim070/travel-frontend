import React, { useState, useEffect } from 'react';
import { addUser, getAllUser, updateUser } from '../../Services/UserService.jsx';
import { addOnlyRecord, addRecord } from '../../Services/RecordService.jsx';

const EditUser = ({ user, activeUser, onClose }) => {

    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        const now = new Date();
        setCurrentDateTime(formatDateTime(now));
    }, []);

    const formatDateTime = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');

        return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
    };

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        photo: null,
        photo: null,
    });

    const handleEditUser = async (event) => {
        event.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('user', new Blob([JSON.stringify({
                id: user.id,
                name: formData.name,
                role: formData.role,
                email: formData.email,
                password: user.password,
                active: user.active,
                userCreate: user.userCreate,
                userUpdate: user.userUpdate,
                userDelete: user.userDelete,
            })], { type: 'application/json' }));

            if (formData.photo instanceof File) {
                formDataToSend.append('photo', formData.photo);
            }

            const recordToAdd = {
                name: activeUser.name,
                role: activeUser.role,
                action: "Update User",
                form: "User",
                userID: user.id,
                userName: formData.name,
                date: currentDateTime,
            };
            await addOnlyRecord(recordToAdd);

            await updateUser(user.id, formDataToSend);

            alert("User updated successfully");
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Failed to update user:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                role: user.role || '',
                email: user.email || '',
                photo: user.photo ? `http://localhost:8080/image/${user.photo}` : null,
                photoURL: user.photo ? `http://localhost:8080/image/${user.photo}` : null,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            setFormData({ ...formData, [name]: files[0], photoURL: URL.createObjectURL(files[0]) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('user', new Blob([JSON.stringify({
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                password: 123,
                active: user.active,
                userCreate: user.userCreate,
                userUpdate: user.userUpdate,
                userDelete: user.userDelete,
            })], { type: 'application/json' }));

            const recordToAdd = {
                name: activeUser.name,
                role: activeUser.role,
                action: "Reset Password",
                form: "User",
                userID: user.id,
                userName: formData.name,
                date: currentDateTime,
            };
            await addOnlyRecord(recordToAdd);

            await updateUser(user.id, formDataToSend);

            alert(`Password reset successfully. Please use '${123}' for login.`);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Failed to reset password:', error);
        }
    }

    return (
        <form onSubmit={handleEditUser}>
            <div id="editUser" className="fixed top-0 left-0 z-[80] w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white border shadow-sm rounded-xl w-[400px]">
                    <div className="flex justify-between items-center py-3 px-4 border-b ">
                        <h3 className="font-bold text-gray-800 flex gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>
                            Edit User
                        </h3>
                        <button type="button" onClick={onClose} className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 ">
                            <span className="sr-only">Close</span>
                            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="p-2 md:flex gap-4">
                        <div>
                            <label htmlFor="input-name" className="block text-sm font-medium mb-2">Username</label>
                            <input type="text" name="name" id="input-name" value={formData.name} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 " placeholder="username" autoFocus />
                        </div>
                        <div>
                            <label htmlFor="input-role" className="block text-sm font-medium mb-2">Position</label>
                            <select name="role" id="input-role" value={formData.role} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="">Select Type</option>
                                <option value="Guest">Guest</option>
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-2">
                        <label htmlFor="input-email" className="block text-sm font-medium mb-2">Email</label>
                        <input type="email" name="email" id="input-email" value={formData.email} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="name@travel.com.kh" />
                    </div>

                    <div className="p-2">
                        <label htmlFor="input-label" className="block text-sm font-medium mb-2">Photo</label>
                        <div className="relative w-36 h-36 border border-black rounded-lg overflow-hidden">
                            <label htmlFor="upload" className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer bg-opacity-75 bg-gray-300 hover:bg-opacity-50">
                                {formData.photoURL ? (
                                    <img src={formData.photoURL} alt="User" className="object-cover w-full h-full" />
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                        </svg>
                                        <span className="text-gray-600 font-sm">Upload</span>
                                    </>
                                )}
                            </label>
                            <input id="upload" name="photo" onChange={handleChange} type="file" className="hidden" />
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t ">
                        <button type="button" onClick={onClose} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 ">
                            Close
                        </button>
                        <button type="button" onClick={handleResetPassword} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700">
                            Reset Password
                        </button>
                        <button type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default EditUser;