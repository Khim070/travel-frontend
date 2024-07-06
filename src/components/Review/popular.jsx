import { useState, useEffect } from "react";
import { deletePopular, getAllPopular, updateOrderIds, updatePopular } from "../../Services/ReviewFirstSection.jsx";
import PopularItem from "./popularItem.jsx";
import { updatePopularHeader, getOnlyPopularHeader, getAllPopularHeader } from "../../Services/ReviewHeaderServices.jsx";
import { useLocation } from "react-router-dom";
import { addRecord } from "../../Services/RecordService.jsx";


function Popular(){

    const [popular, setPopular] = useState([]);
    const [headerPopular, setHeaderPopular] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const location = useLocation();
    const userPopular = location.state?.user;
    const [add, setAdd] = useState(1);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [headerPopularChanged, setHeaderPopularChanged] = useState(false);
    const [popularChanged, setPopularChanged] = useState(false);

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
        const fetchPopular = async () => {
            try {
                const response = await getAllPopular();
                const activePopular = response.data
                    .filter(item => item.active === 1)
                    .sort((a, b) => a.orderID - b.orderID);

                setPopular(activePopular);
            } catch (error) {
                console.error('Failed to fetch Popular:', error);
            }
        };

        fetchPopular();
    }, []);

    useEffect(() => {
        const fetchReviewHeader = async () => {
            try {
                const response = await getAllPopularHeader();
                const activeHeaderReview = response.data
                    .filter(item => item.id === 1);
                setHeaderPopular(activeHeaderReview);
            } catch (error) {
                console.error('Failed to fetch review header:', error);
            }
        };

        fetchReviewHeader();
    }, []);

    const handleSave = async (event) => {
        event.preventDefault();

        const newValidationErrors = {};
        let hasError = false;

        popular.forEach(item => {
            if (!item.title.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].title = true;
                hasError = true;
            }
        });

        headerPopular.forEach(item => {
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

        const reorderedPopular = popular.map((item, index) => ({
            ...item,
            orderId: index + 1,
            image: item.image instanceof File ? item.image : (typeof item.image === 'string' ? item.image : undefined)
        }));

        setPopular(reorderedPopular);

        if (userPopular.userUpdate === 0) {
            alert("You have no permissions to update item. Please contact the administrator!!!");
            return;
        } else {
            alert("Data Saved");
        }

        const recordsToAdd = [];

        try {
            if (headerPopularChanged) {
                const updateHeaderPromises = headerPopular.map((item) =>
                    updatePopularHeader(item.id, item)
                );
                await Promise.all(updateHeaderPromises);

                recordsToAdd.push({
                    name: userPopular.name,
                    role: userPopular.role,
                    action: "Update",
                    form: "HeaderPopular",
                    userID: headerPopular[0].id,
                    userName: headerPopular[0].title,
                    date: currentDateTime,
                });

                setHeaderPopularChanged(false);
            }

            if (popularChanged) {
                const updatePromises = reorderedPopular.map(async (item) => {
                    const formData = new FormData();
                    const itemCopy = { ...item };

                    if (item.image && item.image instanceof File) {
                        formData.append('image', item.image);
                        delete itemCopy.image;
                    }

                    formData.append('reviewfirstsection', new Blob([JSON.stringify(itemCopy)], {
                        type: 'application/json'
                    }));

                    try {
                        const updateResponse = await updatePopular(item.id, formData);

                        if (updateResponse.data && updateResponse.data.image) {
                            item.image = updateResponse.data.image;
                        } else {
                            console.warn(`No image data returned for item ${item.id}`);
                        }
                    } catch (updateError) {
                        console.error(`Failed to update item ${item.id}:`, updateError);
                    }
                });

                reorderedPopular.forEach(item => {
                    if (item.hasChanged) {
                        recordsToAdd.push({
                            name: userPopular.name,
                            role: userPopular.role,
                            action: add === 2 ? "Add" : add === 1 ? "Update" : add === 3 ? "Delete" : "",
                            form: "PopularItem",
                            userID: item.id,
                            userName: item.title,
                            date: currentDateTime,

                        });
                    }
                });

                setPopularChanged(false);
                await Promise.all(updatePromises);

                setPopular(reorderedPopular);
            }

            if (recordsToAdd.length > 0) {
                await addRecord(recordsToAdd);
            }

        } catch (error) {
            console.error('Failed to update or delete item order:', error);
        }
    };

    const handleInputChangeHeader = (id, field, value) => {
        setHeaderPopular(prevState =>
            prevState.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );

        if (validationErrors[id] && validationErrors[id][field]) {
            setValidationErrors({
                ...validationErrors,
                [id]: {
                    ...validationErrors[id],
                    [field]: false
                }
            });
        }

        setHeaderPopularChanged(true);
    };

    return(
        <form onSubmit = {handleSave}>
            {headerPopular.map((item, i) => (
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
                                            className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.title ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                            placeholder="Title"
                                            value={item.title}
                                            onChange={(e) => handleInputChangeHeader(item.id, 'title', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-6">
                        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-5">
                            <div className="sm:col-span-2 sm:col-start-1">
                                <label className="block text-2xl font-medium leading-6 text-gray-900">
                                    Tag
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className="block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                                        placeholder="Optional"
                                        value={item.tag}
                                        onChange={(e) => handleInputChangeHeader(item.id, 'tag', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-2xl font-medium leading-6 text-gray-900">
                                    Color
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className="block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                                        placeholder="Optional"
                                        value={item.color}
                                        onChange={(e) => handleInputChangeHeader(item.id, 'color', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* popularItem */}
                        <div className="mt-5">
                            <PopularItem
                                setAdd={setAdd}
                                popular={popular}
                                setPopular={setPopular}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors}
                                userPopular={userPopular}
                                setPopularChanged={setPopularChanged}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <div className="my-3 flex items-center justify-end gap-x-6">
                <div className={userPopular.role === 'Guest' ? 'hidden' : 'block'}>
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

export default Popular;