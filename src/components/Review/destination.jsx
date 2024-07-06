import DestinationItem from "./destinationItem";
import React, {useEffect, useState} from "react";
import { createCard, updateCard, deleteCard, updateOrderIds, getAllCard } from "../../Services/CardService";
import { updateCardHeader, getOnlyCardHeader, getAllCardHeader } from "../../Services/ReviewHeaderServices.jsx";
import { useLocation } from "react-router-dom";
import { addRecord } from "../../Services/RecordService.jsx";

function Destination(){

    const [card, setCard] =  useState([]);
    const [headerCard, setHeaderCard] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const location = useLocation();
    const userDestination = location.state?.user;
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [add, setAdd] = useState(1);
    const [headerDestinationChanged, setHeaderDestinationChanged] = useState(false);
    const [destinationChanged, setDestinationChanged] = useState(false);

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
        const fetchCard = async () => {
            try {
                const response = await getAllCard();
                const activeCard = response.data
                    .filter(item => item.active === 1)
                    .sort((a, b) => a.orderID - b.orderID);

                setCard(activeCard);
            } catch (error) {
                console.error('Failed to fetch Card:', error);
            }
        };

        fetchCard();
    }, []);

    useEffect(() => {
        const fetchCardHeader = async () => {
            try {
                const response = await getAllCardHeader();
                const activeHeaderCard = response.data
                    .filter(item => item.id === 2);
                setHeaderCard(activeHeaderCard);
            } catch (error) {
                console.error('Failed to fetch review header:', error);
            }
        };

        fetchCardHeader();
    }, []);

    const handleSave = async (event) => {
        event.preventDefault();

        const newValidationErrors = {};
        let hasError = false;

        card.forEach(item => {
            if (!item.name.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].name = true;
                hasError = true;
            }
        });

        card.forEach(item => {
            if (!item.day.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].day = true;
                hasError = true;
            }
        });

        card.forEach(item => {
            if (!item.address.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].address = true;
                hasError = true;
            }
        });

        headerCard.forEach(item => {
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

        const reorderedCard = card.map((item, index) => ({
            ...item,
            orderID: index + 1,
            cardImage: item.cardImage instanceof File ? item.cardImage : (typeof item.cardImage === 'string' ? item.cardImage : undefined)
        }));

        setCard(reorderedCard);

        if (userDestination.userUpdate === 0) {
            alert("You have no permissions to update item. Please contact the administrator!!!");
            return;
        } else {
            alert("Data Saved");
        }

        const recordsToAdd = [];

        try {
            if (headerDestinationChanged) {
                const updateHeaderPromises = headerCard.map((item) =>
                    updateCardHeader(item.id, item)
                );
                await Promise.all(updateHeaderPromises);

                recordsToAdd.push({
                    name: userDestination.name,
                    role: userDestination.role,
                    action: "Update",
                    form: "HeaderDestination",
                    userID: headerCard[0].id,
                    userName: headerCard[0].title,
                    date: currentDateTime,
                });

                setHeaderDestinationChanged(false);
            }

            if (destinationChanged) {
                const updatePromises = reorderedCard.map(async (item) => {
                    const formData = new FormData();
                    const itemCopy = { ...item };

                    if (item.cardImage && item.cardImage instanceof File) {
                        formData.append('cardImage', item.cardImage);
                        delete itemCopy.cardImage;
                    }

                    formData.append('card', new Blob([JSON.stringify(itemCopy)], {
                        type: 'application/json'
                    }));

                    try {
                        const updateResponse = await updateCard(item.id, formData);

                        if (updateResponse.data && updateResponse.data.cardImage) {
                            item.cardImage = updateResponse.data.cardImage;
                        } else {
                            console.warn(`No image data returned for item ${item.id}`);
                        }
                    } catch (updateError) {
                        console.error(`Failed to update item ${item.id}:`, updateError);
                    }
                });

                await Promise.all(updatePromises);

                reorderedCard.forEach(item => {
                    if (item.hasChanged) {
                        recordsToAdd.push({
                            name: userDestination.name,
                            role: userDestination.role,
                            action: add === 2 ? "Add" : "Update",
                            form: "Card",
                            userID: item.id,
                            userName: item.name,
                            date: currentDateTime,
                        });
                    }
                });

                setDestinationChanged(false);
                setCard(reorderedCard);
            }

            if (recordsToAdd.length > 0) {
                await addRecord(recordsToAdd);
            }

        } catch (error) {
            console.error('Failed to update or delete item order:', error);
        }
    };

    const handleInputChangeHeader = (id, field, value) => {
        setHeaderCard(prevState =>
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

        setHeaderDestinationChanged(true);
    };

    return (
        <form onSubmit={handleSave}>
            {headerCard.map((item, i) => (
            <div className="space-y-12">
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
                    {/* destinationItem */}
                    <div className="mt-5">
                        <DestinationItem
                            setAdd={setAdd}
                            card={card}
                            setCard={setCard}
                            validationErrors={validationErrors}
                            setValidationErrors={setValidationErrors}
                            setDestinationChanged={setDestinationChanged}
                        />
                    </div>
                </div>
            </div>
            ))}
            <div className="my-3 flex items-center justify-end gap-x-6">
                <div className={ userDestination.role === "Guest" ? 'hidden' : 'block' }>
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

export default Destination;