import PersonDetail from "./persondetail.jsx";
import React, {useEffect, useState, useRef} from "react";
import {getAllOurTeam, createOurTeam, getOnlyOurTeam, updateOrderIds, updateOurTeam, deleteOurTeam} from "../../Services/OurTeamService.jsx"
import { updateOurTeamHeader, getAllOurTeamHeader } from "../../Services/ReviewHeaderServices.jsx";
import { useLocation } from "react-router-dom";

function Ourteam (){

    const [ourteam, setOurteam] = useState([]);
    const [headerOurteam, setHeaderOurteam] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const location = useLocation();
    const userOurTeam = location.state?.user;

    useEffect(() => {
        const fetchOurTeam = async () => {
            try {
                const response = await getAllOurTeam();
                const activeOurTeam = response.data
                    .filter(item => item.active === 1)
                    .sort((a, b) => b.orderID - a.orderID);

                setOurteam(activeOurTeam);
            } catch (error) {
                console.error('Failed to fetch Popular:', error);
            }
        };

        fetchOurTeam();
    }, []);

    useEffect(() => {
        const fetchOurTeamHeader = async () => {
            try {
                const response = await getAllOurTeamHeader();
                const activeOurTeamHeader = response.data
                    .filter(item => item.id === 3);

                setHeaderOurteam(activeOurTeamHeader);
            } catch (error) {
                console.error('Failed to fetch Our Team Header:', error);
            }
        };

        fetchOurTeamHeader();
    }, []);

    const handleSave = async (event) => {
        event.preventDefault();

        const newValidationErrors = {};
        let hasError = false;

        ourteam.forEach(item => {
            if (!item.name.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].name = true;
                hasError = true;
            }
            if (!item.position.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].position = true;
                hasError = true;
            }
        });

        headerOurteam.forEach(item => {
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

        const reorderedOurTeam = ourteam.map((item, index) => ({
            ...item,
            orderID: index + 1,
            photo: item.photo instanceof File ? item.photo : (typeof item.photo === 'string' ? item.photo : undefined)
        }));

        if (userOurTeam.userUpdate === 0) {
            alert("You do not have permission to update the items. Please contact your administrator!!!");
            return;
        }else{
            alert("Data Saved");
        }

        setOurteam(reorderedOurTeam);

        try {
            const updatePromises = reorderedOurTeam.map(async (item) => {
                const formData = new FormData();
                const itemCopy = { ...item };

                if (item.photo && item.photo instanceof File) {
                    formData.append('photo', item.photo);
                    delete itemCopy.photo;
                }

                formData.append('ourteam', new Blob([JSON.stringify(itemCopy)], {
                    type: 'application/json'
                }));

                try {
                    const updateResponse = await updateOurTeam(item.id, formData);

                    if (updateResponse.data && updateResponse.data.photo) {
                        item.photo = updateResponse.data.photo;
                    } else {
                        console.warn(`No photo data returned for item ${item.id}`);
                    }
                } catch (updateError) {
                    console.error(`Failed to update item ${item.id}:`, updateError);
                }
            });

            await Promise.all(updatePromises);

            setOurteam(reorderedOurTeam);

            const updateHeaderPromises = headerOurteam.map((item) =>
                updateOurTeamHeader(item.id, item)
            );
            await Promise.all(updateHeaderPromises);
        } catch (error) {
            console.error('Failed to update or delete item order:', error.message);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
        }
    };

    const handleInputChangeHeader = (id, field, value) => {
        setHeaderOurteam(prevState =>
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
    };

    return(
        <form onSubmit={handleSave}>
            {headerOurteam.map((item, i) => (
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

                        <div className="mt-5">
                            <PersonDetail
                                ourteam={ourteam}
                                setOurteam={setOurteam}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <div className="my-3 flex items-center justify-end gap-x-6">
                <div className={userOurTeam.role === "Guest" ? 'hidden' : 'block'}>
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

export default Ourteam;