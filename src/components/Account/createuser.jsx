import { addUser, getAllUser } from '../../Services/UserService.jsx';
import { useState, useEffect } from 'react';
import { addOnlyRecord, } from "../../Services/RecordService.jsx";

const CreateUser = ({ user, onClose }) => {

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [onlyID, setOnlyID] = useState(null);

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

    useEffect(() => {
        const fetchGetAllUser = async () => {
            try {
                const response = await getAllUser();
                const users = response.data;
                const maxID = users.reduce((max, user) => (user.id > max ? user.id : max), users[0].id);

                setOnlyID(maxID);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchGetAllUser();
    }, []);

    const handleAddUser = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const newUser = {
            name,
            role,
            email,
            password,
        };

        const formData = new FormData();
        formData.append('user', new Blob([JSON.stringify(newUser)], { type: "application/json" }));
        formData.append('photo', photo);

        try {

            const recordToAdd = {
                name: user.name,
                role: user.role,
                action: "Add User",
                form: "User",
                userID: onlyID + 1,
                userName: newUser.name,
                date: currentDateTime,
            };

            await addOnlyRecord(recordToAdd);

            await addUser(formData);
            alert("User added successfully");
            window.location.reload();
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
            // alert("Photo upload");
        } else {
            setPhoto(null);
            setPhotoPreview(null);
        }
    };

    return (
        <form onSubmit={handleAddUser}>
            <div id="addUser" className="fixed top-0 left-0 z-[80] w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white border shadow-sm rounded-xl w-[400px]">
                    <div className="flex justify-between items-center py-3 px-4 border-b ">
                        <h3 className="font-bold text-gray-800 flex gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>
                            Add User
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
                        <div >
                            <label htmlFor="input-label" className="block text-sm font-medium mb-2 ">Username</label>
                            <input type="username" value={name} onChange={(e) => setName(e.target.value)} id="input-name" className="py-3 px-4 block w-full border  border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 " placeholder="username" autoFocus required/>
                        </div>
                        <div >
                            <label htmlFor="input-label" className="block text-sm font-medium mb-2 ">Position</label>
                            <select name="position" id="input-role" value={role} onChange={(e) => setRole(e.target.value)} className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 " autoFocus required>
                                <option value="">Select Type  </option>
                                <option value="Guest">Guest</option>
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-2">
                        <label htmlFor="input-label" className="block text-sm font-medium mb-2 ">Email</label>
                        <input type="email" id="input-email" value={email} onChange={(e) => setEmail(e.target.value)} className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 " placeholder="name@travel.com.kh" autoFocus required/>
                    </div>
                    <div className="p-2">
                        <div className="flex gap-4">
                            {/* <label htmlFor="input-label" className="block text-sm font-medium mb-2 ">Photo</label> */}
                            <div className="rounded-lg border border-black p-4 w-36 relative">
                                <input
                                    id="upload"
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handlePhotoChange}
                                />
                                {!photoPreview && (
                                    <label htmlFor="upload" className="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                        </svg>
                                        <span className="text-gray-600 font-medium">Upload Photo</span>
                                    </label>
                                )}
                                {photoPreview && (
                                    <img src={photoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                                )}
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="input-label" className="block text-sm font-medium mb-2 ">Password</label>
                                    <input type="password" id="input-password" value={password} onChange={(e) => setPassword(e.target.value)} className="py-3 px-4 block w-half border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 " placeholder="password" autoFocus required/>
                                </div>
                                <div>
                                    <label htmlFor="input-label" className="block text-sm font-medium mb-2 ">Confirm Password</label>
                                    <input type="password" id="input-confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="py-3 px-4 block w-half border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 " placeholder="confirm password" autoFocus required/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t ">
                        <button type="button" onClick={onClose} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 ">
                            Close
                        </button>
                        <button type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
                            Add User
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreateUser;