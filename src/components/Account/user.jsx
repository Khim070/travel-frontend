import userImage from '../../img/user.webp';
import CreateUser from './createuser';
import EditUser from './edituser';
import React, {useState, useEffect} from 'react';
import { getAllUser, updateUser, deleteUser } from '../../Services/UserService.jsx';

const User = () => {

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [user, setUser] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredUser, setFilteredUser] = useState([]);
    const [originalUser, setOriginalUser] = useState([]);

    const handleAddUser = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedUser(null);
    };

    const handleSave = async (event) => {
        event.preventDefault();

        try {
            const updateUserPromises = user.map(item => {
                const originalItem = originalUser.find(usr => usr.id === item.id);
                const password = item.password === originalItem.password ? originalItem.password : item.password;

                const formData = new FormData();
                formData.append('user', new Blob([JSON.stringify({
                    id: item.id,
                    name: item.name,
                    email: item.email,
                    role: item.role,
                    password: password,
                    active: item.active,
                    userCreate: item.userCreate,
                    userUpdate: item.userUpdate,
                    userDelete: item.userDelete,
                })], { type: "application/json" }));

                return updateUser(item.id, formData);
            });

            await Promise.all(updateUserPromises);
            alert("Data Saved");
        } catch (error) {
            console.error('Failed to update or delete item order:', error);
        }
    };

    useEffect(() => {
        const fetchGetAllUser = async () => {
            try {
                const response = await getAllUser();
                const activeUser = response.data
                    .filter(item => item.active === 1)
                    .sort((a, b) => b.id - a.id);

                setUser(activeUser);

                setOriginalUser(JSON.parse(JSON.stringify(activeUser)));

                setFilteredUser(activeUser);

            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchGetAllUser();
    }, []);

    const handleCreateChecked = (id, checked) => {
        const updatedCreateCheck = user.map(item =>
            item.id === id ? { ...item, userCreate: checked ? 1 : 0 } : item
        );
        setUser(updatedCreateCheck);
        updateFilteredUser(updatedCreateCheck);

    };

    const handleUpdateChecked = (id, checked) => {
        const updatedUpdateCheck = user.map(item =>
            item.id === id ? { ...item, userUpdate: checked ? 1 : 0 } : item
        );
        setUser(updatedUpdateCheck);
        updateFilteredUser(updatedUpdateCheck);
    };

    const handleDeleteChecked = (id, checked) => {
        const updatedDeleteCheck = user.map(item =>
            item.id === id ? { ...item, userDelete: checked ? 1 : 0 } : item
        );
        setUser(updatedDeleteCheck);
        updateFilteredUser(updatedDeleteCheck);
    };

    const fetchUserItems = async () => {
        try {
            const response = await getAllUser();
            const activeUser = response.data
                .filter(item => item.active === 1)
                .sort((a, b) => b.id - a.id);

            setUser(activeUser);

            setOriginalUser(JSON.parse(JSON.stringify(activeUser)));

            setFilteredUser(activeUser);
        } catch (error) {
            console.error('Failed to fetch User:', error);
        }
    };

    const handleDeleteUser = async (itemId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");

        if (confirmDelete) {
            try {
                const item = user.find(item => item.id === itemId);
                const formData = new FormData();
                const itemCopy = {
                    ...item,
                    active: 0,
                    userCreate: item.userCreate || 0,
                    userUpdate: item.userUpdate || 0,
                    userDelete: item.userDelete || 0,
                    name: item.name || '',
                    password: item.password || '',
                    email: item.email || '',
                    role: item.role || '',
                    photo: item.photo
                };

                if (item.photo && item.photo instanceof File) {
                    formData.append('photo', item.photo);
                }

                formData.append('user', new Blob([JSON.stringify(itemCopy)], {
                    type: 'application/json'
                }));

                await deleteUser(item.id, formData);

                await fetchUserItems();
            } catch (error) {
                console.error(`Failed to update item ${itemId}:`, error);
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                }
            }
        } else {
            console.log("Deletion canceled");
        }
    };

    useEffect(() => {
        fetchUserItems();
    }, []);

    const handlesearchUser = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchInput(value);

        const filtered = user.filter(u =>
            u.name.toLowerCase().includes(value) ||
            u.email.toLowerCase().includes(value) ||
            u.role.toLowerCase().includes(value)
        );
        setFilteredUser(filtered);
    };

    const updateFilteredUser = (updatedUser) => {
        const filtered = updatedUser.filter(u =>
            u.name.toLowerCase().includes(searchInput) ||
            u.email.toLowerCase().includes(searchInput) ||
            u.role.toLowerCase().includes(searchInput)
        );
        setFilteredUser(filtered);
    };

    return (
        <div className="mt-10 relative overflow-x-auto px-2">
            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white ">
                <div>
                    <div className='flex gap-2'>
                        <div>
                            <button onClick={handleAddUser} className=" inline-flex items-center text-gray-500 bg-white border border-gray-500 focus:outline-none hover:bg-gray-100 focus:ring-2 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 " type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                </svg>
                                Add User
                            </button>
                            {showModal && <CreateUser onClose={handleCloseModal} />}
                        </div>
                        <div className='flex justify-end float-end '>
                            <button onClick={handleSave} className=" inline-flex items-center text-gray-500 bg-white border border-gray-500 focus:outline-none hover:bg-gray-100 focus:ring-2 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 " type="button">
                                <svg className="h-6 w-6 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />  <polyline points="17 21 17 13 7 13 7 21" />  <polyline points="7 3 7 8 15 8" />
                                </svg>
                                Save
                            </button>
                        </div>
                    </div>
                    <div className='inline-flex items-center gap-2 max-w-full'>
                        <div>
                            <label for="table-search" className="sr-only">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="text" id="table-search-users" value={searchInput} onChange={handlesearchUser} className="my-2 block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for users"/>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-ms text-gray-700 uppercase bg-gray-200 ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Create
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Update
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Delete
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUser.map((item, i) => (
                            <tr className="bg-white border-b  hover:bg-gray-50 " key={i}>
                                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <img
                                        className="w-10 h-10 rounded-full"
                                        src={`http://localhost:8080/image/${item.photo}`}
                                        alt="User image"
                                    />
                                    <div className="ps-3">
                                        <div className="text-base text-black font-semibold">{item.name}</div>
                                        <div className="font-normal text-black">{item.role}</div>
                                    </div>
                                </th>
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input id={`checkbox-${item.id}`} checked={item.userCreate === 1} onChange={(e) => handleCreateChecked(item.id, e.target.checked)} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor={`checkbox-${item.id}-create`} className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input id={`checkbox-${item.id}`} checked={item.userUpdate === 1} onChange={(e) => handleUpdateChecked(item.id, e.target.checked)} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor={`checkbox-${item.id}-update`} className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input id={`checkbox-${item.id}`} checked={item.userDelete === 1} onChange={(e) => handleDeleteChecked(item.id, e.target.checked)} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor={`checkbox-${item.id}-delete`} className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-lg flex">
                                    {/* <!-- Modal toggle --> */}
                                    <div>
                                        <a type="button" onClick={() => handleEditUser(item)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>/
                                    </div>
                                    <div>
                                        <a type="button" onClick={() => handleDeleteUser(item.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showEditModal && <EditUser user={selectedUser} onClose={handleCloseEditModal} />}
            </div>
        </div>
    );
}

export default User;