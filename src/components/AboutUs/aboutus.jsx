import React, { useEffect, useState, useRef } from 'react';
import { getAllAboutUs, updateAboutUs } from '../../Services/AboutUsService.jsx';
import { useLocation } from 'react-router-dom';
import { addOnlyRecord, addRecord } from '../../Services/RecordService.jsx';

function Aboutus(){

    const [aboutUs, setAboutUs] = useState([]);
    const [previewImages, setPreviewImages] = useState({});
    const fileInputRefs = useRef({});
    const [editMode, setEditMode] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [headerAboutUsChanged, setHeaderAboutUsChanged] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const location = useLocation();
    const userAboutUs = location.state?.user;

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
        const fetchAboutUs = async () => {
            try {
                const response = await getAllAboutUs();
                const activeAboutUs = response.data
                    .filter(item => item.id === 1);

                setAboutUs(activeAboutUs);
            } catch (error) {
                console.error('Failed to fetch about Us:', error);
            }
        };

        fetchAboutUs();
    }, []);

    const handleFileChangeImage = (id, field, file) => {
        const fileURL = URL.createObjectURL(file);

        setPreviewImages(prevState => ({
            ...prevState,
            [`${id}-${field}`]: fileURL,
        }));

        setAboutUs(prevState =>
            prevState.map(item =>
                item.id === id ? { ...item, [field]: file, [`${field}File`]: file } : item
            )
        );
        setHeaderAboutUsChanged(true);
    };

    const handleToggleDisappear = (id, checked) => {
        const updatedAboutUs = aboutUs.map(item =>
            item.id === id ? { ...item, display: checked ? 1 : 0 } : item
        );
        setAboutUs(updatedAboutUs);
        setHeaderAboutUsChanged(true);
    };

    const handleInputChange = (id, field, value) => {
        setAboutUs(prevState =>
            prevState.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
        setHeaderAboutUsChanged(true);
    };

    const toggleEditModeImage = (id, field) => {
        setEditMode(prevState => ({
            ...prevState,
            [`${id}-${field}`]: !prevState[`${id}-${field}`]
        }));

        if (fileInputRefs.current[`${id}-${field}`]) {
            fileInputRefs.current[`${id}-${field}`].click();
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const newValidationErrors = {};
        let hasError = false;

        aboutUs.forEach(item => {
            if (!item.title.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].title = true;
                hasError = true;
            }
        });

        if (hasError) {
            setValidationErrors(newValidationErrors);
            return;
        }

        if (userAboutUs.userUpdate === 0) {
            alert("You have no permissions to update item. Please contact the administrator!!!");
            return;
        } else {
            alert("Data Saved");
        }

        const recordsToAdd = [];

        try {
            const updateHeaderPromises = aboutUs.map(item => {
                const formData = new FormData();
                formData.append('aboutUs', new Blob([JSON.stringify({
                    title: item.title,
                    tag: item.tag,
                    description: item.description,
                    id: item.id,
                    display: item.display,
                    active: item.active
                })], { type: "application/json" }));
                if (item.imageFile) {
                    formData.append('image', item.imageFile);
                }

                return updateAboutUs(item.id, formData);
            });

            await Promise.all(updateHeaderPromises);

            if (headerAboutUsChanged) {
                recordsToAdd.push({
                    name: userAboutUs.name,
                    role: userAboutUs.role,
                    action: "Update",
                    form: "AboutUs",
                    userID: aboutUs[0].id,
                    userName: aboutUs[0].title,
                    date: currentDateTime,
                });

                setHeaderAboutUsChanged(false);
            }

            if (recordsToAdd.length > 0) {
                await addRecord(recordsToAdd);
            }

        } catch (error) {
            console.error('Failed to update or delete item order:', error);
        }
    };

    return(
        <form onSubmit={handleSave}>
            {aboutUs.map((item, i) => (
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-6">
                    <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-5">
                        <div className="sm:col-span-2 sm:col-start-1">
                            <label className="block text-2xl font-medium leading-6 text-gray-900">
                                Title
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                                    value={item.title}
                                    onChange={(e) => handleInputChange(item.id, 'title', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-2xl font-medium leading-6 text-gray-900">
                                Tag
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                                    placeholder="Optional"
                                    value={item.tag}
                                    onChange={(e) => handleInputChange(item.id, 'tag', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-2xl font-medium leading-6 text-white-900">
                                Description
                            </label>
                            <div className="mt-5">
                                <textarea
                                    type="text"
                                    placeholder="Optional"
                                    className=" h-72 resize-none block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl sm:leading-6"
                                    value={item.description}
                                    onChange={(e) => handleInputChange(item.id, 'description', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-2xl font-medium leading-6 text-white-900">
                                Image
                            </label>
                            <div className="mt-5 flex justify-center rounded-lg border border-dashed bg-white border-gray-900/25 px-6 py-16">
                                    <div className="h-40 text-center">
                                        {item.image ? (
                                            <>
                                                <img src={previewImages[`${item.id}-image`] || `http://localhost:8080/image/${item.image}`} alt="Logo" className="w-[250px] h-[180px] cursor-pointer" />
                                                <a
                                                    onClick={() => toggleEditModeImage(item.id, 'image')}
                                                    className="mt-5 text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                >
                                                    Edit
                                                </a>
                                                <input
                                                    id={`file-upload-${item.id}-image`}
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    ref={el => (fileInputRefs.current[`${item.id}-image`] = el)}
                                                    onChange={(e) => handleFileChangeImage(item.id, 'image', e.target.files[0])}
                                                />
                                            </>
                                        ) : (
                                            <div>
                                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                    <label className="cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={(e) => handleFileChangeImage(item.id, 'image', e.target.files[0])}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        )}
                                    </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-2xl font-medium leading-6 text-white-900">
                                Display
                            </label>
                            <label class="inline-flex items-center cursor-pointer mt-4">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        value=""
                                        checked={item.display === 1}
                                        onChange={(e) => handleToggleDisappear(item.id, e.target.checked)}
                                    />
                                <div class="z-0 relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            ))}
            <div className="my-3 flex items-center justify-end gap-x-6">
                <div className={userAboutUs.role === "Guest" ? 'hidden' : 'block'}>
                    <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-4 py-2 text-2xl font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Aboutus;