import MenuItem from "./menuItem.jsx";
import React, { useEffect, useState, useRef } from 'react';
import { getAllMenuBar, updateMenuBar, updateOrderIds, deleteMenuBar, createMenuBar } from '../../Services/MenuBarServices.jsx';
import { getAllHeaderBackground, updateHeaderBackground, DisplayButtonLink } from "../../Services/HeaderBackground.jsx";

const Home = () => {
    const [menuBar, setMenuBar] = useState([]);
    const [headerBackground, setHeaderBackground] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const fileInputRefs = useRef({});
    const [editMode, setEditMode] = useState({});
    const [previewImages, setPreviewImages] = useState({});
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    useEffect(() => {
        const fetchMenuBar = async () => {
            try {
                const response = await getAllMenuBar();
                const activeMenuBar = response.data
                    .filter(item => item.active === 1)
                    .sort((a, b) => a.orderId - b.orderId);

                setMenuBar(activeMenuBar);
            } catch (error) {
                console.error('Failed to fetch menu bar:', error);
            }
        };

        fetchMenuBar();
    }, []);

    useEffect(() => {
        const fetchHeaderBackground = async () =>{
            try {
                const response = await getAllHeaderBackground();
                //console.log('Response from backend:', response);
                const activeHeaderBackground = response.data
                    .filter(item => item.id === 1)

                setHeaderBackground(activeHeaderBackground);
                //console.log('Filtered active header background:', activeHeaderBackground);
            }catch(error){
                console.error('Failed to fetch header background:', error);
            }
        };

        fetchHeaderBackground();
    },[]);

    const handleToggleDisappear = (id, checked) => {
        const updatedHeaderBackground = headerBackground.map(item =>
            item.id === id ? { ...item, active: checked ? 1 : 0 } : item
        );
        setHeaderBackground(updatedHeaderBackground);
    };

    const handleFileChange = (id, field, files) => {
        const fileArray = Array.from(files);
        const newPreviewImages = fileArray.map(file => URL.createObjectURL(file));

        setPreviewImages(prevState => ({
            ...prevState,
            [`${id}-${field}`]: newPreviewImages,
        }));

        setHeaderBackground(prevState =>
            prevState.map(item =>
                item.id === id ? { ...item, [field]: newPreviewImages.join('/'), [`${field}Files`]: fileArray } : item
            )
        );
    };

    const handleFileChangeLogo = (id, field, file) => {
        const fileURL = URL.createObjectURL(file);

        setPreviewImages(prevState => ({
            ...prevState,
            [`${id}-${field}`]: fileURL,
        }));

        setHeaderBackground(prevState =>
            prevState.map(item =>
                item.id === id ? { ...item, [field]: fileURL, [`${field}File`]: file } : item
            )
        );
    };

    const handleInputChange = (id, field, value) => {
        setHeaderBackground(prevState =>
            prevState.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handlePrevImage = (id, field, images) => {
        setCurrentImageIndex(prevState => {
            const imageArray = previewImages[`${id}-${field}`] || images.split('/');
            const maxIndex = imageArray.length - 1;
            const currentIndex = prevState[`${id}-${field}`] || 0;
            const newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex; // Wrap around to the last image

            console.log(`Prev Image Index: ${newIndex} out of ${maxIndex + 1}`);

            return {
                ...prevState,
                [`${id}-${field}`]: newIndex
            };
        });
    };

    const handleNextImage = (id, field, images) => {
        setCurrentImageIndex(prevState => {
            const maxIndex = (previewImages[`${id}-${field}`]?.length || images.split('/').length) - 1;
            const currentIndex = prevState[`${id}-${field}`] || 0;
            const newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0; // Wrap around to the first image
            return {
                ...prevState,
                [`${id}-${field}`]: newIndex
            };
        });
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const newValidationErrors = {};
        let hasError = false;

        menuBar.forEach(item => {
            if (!item.title.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].title = true;
                hasError = true;
            }
            if (!item.titleLink.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].titleLink = true;
                hasError = true;
            }
        });

        if (hasError) {
            setValidationErrors(newValidationErrors);
            return;
        }

        const reorderedMenuBar = menuBar.map((item, index) => ({
            ...item,
            orderId: index + 1
        }));

        setMenuBar(reorderedMenuBar);

        try {
            const updatePromises = reorderedMenuBar.map((item) =>
                updateMenuBar(item.id, item)
            );
            await Promise.all(updatePromises);

            await updateOrderIds(reorderedMenuBar);

            const deletePromises = menuBar
                .filter(item => item.toBeDeleted)
                .map(item => deleteMenuBar(item.id, { ...item, active: 0 }));
            await Promise.all(deletePromises);

            const updatedMenuBar = menuBar.filter(item => !item.toBeDeleted);
            setMenuBar(updatedMenuBar);

            const updateHeaderPromises = headerBackground.map(item => {
                const formData = new FormData();
                formData.append('headerBackground', new Blob([JSON.stringify({
                    mainTitle: item.mainTitle,
                    buttonTitle: item.buttonTitle,
                    buttonLink: item.buttonLink,
                    id: item.id,
                    active: item.active
                })], { type: "application/json" }));
                if (item.bgImageFiles) {
                    Array.from(item.bgImageFiles).forEach((file) => formData.append('bgImage', file));
                }
                if (item.logoImageFile) {
                    formData.append('logoImage', item.logoImageFile);
                }

                return updateHeaderBackground(item.id, formData);
            });

            await Promise.all(updateHeaderPromises);
            alert("Data Saved");
            //console.log('Order updated items or deleted successfully');
        } catch (error) {
            console.error('Failed to update or delete item order:', error);
        }
    };

    const toggleEditModeLogo = (id, field) => {
        setEditMode(prevState => ({
            ...prevState,
            [`${id}-${field}`]: !prevState[`${id}-${field}`]
        }));

        if (fileInputRefs.current[`${id}-${field}`]) {
            fileInputRefs.current[`${id}-${field}`].click();
        }
    };

    const toggleEditModeBG = (id, field) => {
        setEditMode(prevState => {
            const newState = { ...prevState, [`${id}-${field}`]: !prevState[`${id}-${field}`] };

            if (!prevState[`${id}-${field}`]) {
                setTimeout(() => {
                    if (fileInputRefs.current[`${id}-${field}`]) {
                        fileInputRefs.current[`${id}-${field}`].click();
                    }
                }, 0);
            }

            return newState;
        });
    };

    return (
        <form onSubmit={handleSave}>
            {headerBackground.map((item, i) => (
                <div className="space-y-12" key={i}>
                    <div className="pb-1">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="title" className="block text-2xl font-medium leading-6 text-gray-900">
                                    Title
                                </label>
                                <div className="mt-5">
                                    <div className="flex rounded-md shadow-sm ring-2 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input
                                            type="text"
                                            className="rounded-md block flex-1 border-0 bg-transparent py-2 pl-5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-2xl sm:leading-9"
                                            placeholder="Title"
                                            value = {item.mainTitle}
                                            onChange={(e) => handleInputChange(item.id, 'mainTitle', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 sm:col-span-3">
                                <label className="block text-2xl font-medium leading-6 text-gray-900">
                                    Image
                                </label>
                                <div className="mt-5 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-16 w-auto h-[250px]">
                                    <div className="text-center">
                                        {item.bgImage && item.bgImage.length > 0 ? (
                                            <>
                                                <img src={previewImages[`${item.id}-bgImage`] ? previewImages[`${item.id}-bgImage`][currentImageIndex[`${item.id}-bgImage`] || 0] : `http://localhost:8080/image/${item.bgImage.split('/')[currentImageIndex[`${item.id}-bgImage`] || 0]}`} alt="Header Background" className="w-[250px] h-[120px] cursor-pointer" />
                                                <div className="flex justify-around mt-2 items-center text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                                    <svg onClick={() => handlePrevImage(item.id, 'bgImage', item.bgImage)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <a onClick={() => toggleEditModeBG(item.id, 'bgImage')}>
                                                        Edit
                                                    </a>
                                                    <svg onClick={() => handleNextImage(item.id, 'bgImage', item.bgImage)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                {editMode[`${item.id}-bgImage`] && (
                                                    <div className="mt-2">
                                                        <input
                                                            id={`file-upload-${item.id}-bgImage`}
                                                            name="file-upload"
                                                            type="file"
                                                            className="hidden"
                                                            multiple
                                                            ref={el => (fileInputRefs.current[`${item.id}-bgImage`] = el)}
                                                            onChange={(e) => handleFileChange(item.id, 'bgImage', e.target.files)}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div>
                                                <div className="mt-4 flex text-sm leading-6 text-gray-600 ">
                                                    <label className="cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                        <span>Upload files</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            multiple
                                                            className="sr-only"
                                                            ref={el => (fileInputRefs.current[`${item.id}-bgImage`] = el)}
                                                            onChange={(e) => handleFileChange(item.id, 'bgImage', e.target.files)}
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

                            <div className="col-span-1 sm:col-span-3">
                                <label className="block text-2xl font-medium leading-6 text-gray-900">
                                    Logo
                                </label>
                                <div className="mt-5 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-16 w-auto h-[250px]">
                                    <div className="text-center">
                                        {item.logoImage ? (
                                            <>
                                                <img src={previewImages[`${item.id}-logoImage`] || `http://localhost:8080/image/${item.logoImage}`} alt="Logo" className="w-[250px] h-[120px] cursor-pointer" />
                                                <a
                                                    onClick={() => toggleEditModeLogo(item.id, 'logoImage')}
                                                    className="mt-2 text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                >
                                                    Edit
                                                </a>
                                                <input
                                                    id={`file-upload-${item.id}-logoImage`}
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    ref={el => (fileInputRefs.current[`${item.id}-logoImage`] = el)}
                                                    onChange={(e) => handleFileChangeLogo(item.id, 'logoImage', e.target.files[0])}
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
                                                            onChange={(e) => handleFileChangeLogo(item.id, 'logoImage', e.target.files[0])}
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
                        </div>
                    </div>

                <div className="border-b border-gray-900/10 pb-6">
                    <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-2 sm:col-start-1">
                            <label className="block text-2xl font-medium leading-6 text-gray-900">
                                Button
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                                    value={item.buttonTitle}
                                    onChange={(e) => handleInputChange(item.id, 'buttonTitle', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-2xl font-medium leading-6 text-gray-900">
                                Button Link
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                                    value={item.buttonLink}
                                    onChange={(e) => handleInputChange(item.id, 'buttonLink', e.target.value)}
                                />
                            </div>
                        </div>
                        {/* toggle button */}
                        <div className="sm:col-span-2">
                            <label className="block text-2xl font-medium leading-6 text-gray-900">
                                Display
                            </label>
                            <label className="inline-flex items-center cursor-pointer mt-4">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    value=""
                                    checked={item.active === 1}
                                    onChange={(e) => handleToggleDisappear(item.id, e.target.checked)}
                                />
                                <div className="z-0 relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                            </label>
                        </div>
                    </div>
                    <div className="mt-5">
                        <MenuItem
                            menuBar={menuBar}
                            setMenuBar={setMenuBar}
                            validationErrors={validationErrors}
                            setValidationErrors={setValidationErrors}
                        />
                    </div>
                </div>
            </div>
            ))}
            <div className="my-3 flex items-center justify-end gap-x-6">
                <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-2xl font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Save
                </button>
            </div>
        </form>
    );
}

export default Home;