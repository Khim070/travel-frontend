import Features from "./features";
import { useState, useEffect } from "react";
import { updateContactUsDetail, getOnlyContactUsDetail, getAllContactUsDetail, deleteContactUsDetail } from "../../Services/ContactUsDetailServices.jsx";
import { updateHeaderContactUs, getOnlyHeaderContactUs, getAllHeaderContactUs, DisplayHeaderContactUs } from "../../Services/ContactUsHeaderServices.jsx";

function Contactus(){

    const [contactUsDetail, setContactUsDetail] = useState([]);
    const [headerContactUs, setHeaderContactUs] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchContactUsDetail = async () => {
            try {
                const response = await getAllContactUsDetail();
                const activeContactUsDetail = response.data
                    .filter(item => item.active === 1)
                    .sort((a, b) => a.orderID - b.orderID);

                setContactUsDetail(activeContactUsDetail);
            } catch (error) {
                console.error('Failed to fetch Popular:', error);
            }
        };

        fetchContactUsDetail();
    }, []);

    useEffect(() => {
        const fetchContactHeader = async () => {
            try {
                const response = await getAllHeaderContactUs();
                const activeHeaderContactUs = response.data
                    .filter(item => item.id === 1);
                setHeaderContactUs(activeHeaderContactUs);
            } catch (error) {
                console.error('Failed to fetch contact us header:', error);
            }
        };

        fetchContactHeader();
    }, []);

    const handleSave = async (event) => {
        event.preventDefault();

        const newValidationErrors = {};
        let hasError = false;

        contactUsDetail.forEach(item => {
            if (!item.name.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].name = true;
                hasError = true;
            }
            if (!item.description.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].description = true;
                hasError = true;
            }
            if (!item.link.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].link = true;
                hasError = true;
            }
        });

        headerContactUs.forEach(item => {
            if (!item.title.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].title = true;
                hasError = true;
            }
            if (!item.info.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].info = true;
                hasError = true;
            }
            if (!item.buttonSend.trim()) {
                if (!newValidationErrors[item.id]) newValidationErrors[item.id] = {};
                newValidationErrors[item.id].buttonSend = true;
                hasError = true;
            }
        });

        if (hasError) {
            setValidationErrors(newValidationErrors);
            return;
        }

        const reorderContactUsDetail = contactUsDetail.map((item, index) => ({
            ...item,
            orderId: index + 1,
            icon: item.icon instanceof File ? item.icon : (typeof item.icon === 'string' ? item.icon : undefined)
        }));

        setContactUsDetail(reorderContactUsDetail);

        try {
            const updatePromises = reorderContactUsDetail.map(async (item) => {
                const formData = new FormData();
                const itemCopy = { ...item };

                // Append image to FormData if it's a File
                if (item.icon && item.icon instanceof File) {
                    formData.append('icon', item.icon);
                    delete itemCopy.icon;
                }

                formData.append('contactusdetail', new Blob([JSON.stringify(itemCopy)], {
                    type: 'application/json'
                }));

                try {
                    const updateResponse = await updateContactUsDetail(item.id, formData);

                    if (updateResponse.data && updateResponse.data.icon) {
                        item.icon = updateResponse.data.icon;
                    } else {
                        console.warn(`No image data returned for item ${item.id}`);
                    }
                } catch (updateError) {
                    console.error(`Failed to update item ${item.id}:`, updateError);
                }
            });

            await Promise.all(updatePromises);

            setContactUsDetail(reorderContactUsDetail);

            const updateHeaderPromises = headerContactUs.map((item) =>
                updateHeaderContactUs(item.id, item)
            );
            await Promise.all(updateHeaderPromises);

            alert("Data Saved");
        } catch (error) {
            console.error('Failed to update or delete item order:', error.message);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
        }
    };

    const handleDisplyToggle = (id, checked) => {
        const updatedHeaderContactUs = headerContactUs.map(item =>
            item.id === id ? { ...item, active: checked ? 1 : 0 } : item
        );
        setHeaderContactUs(updatedHeaderContactUs);
    };

    const handleInputChangeHeader = (id, field, value) => {
        setHeaderContactUs(prevState =>
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

    return (
        <form onSubmit={handleSave}>
            {headerContactUs.map((item, i) => (
                <div className="space-y-12" key={i}>
                    <div className="border-b border-gray-900/10 pb-6">
                        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-5">
                            <div className="sm:col-span-2 sm:col-start-1">
                                <label className="block text-2xl font-medium leading-6 text-gray-900">
                                    Title
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.title ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                        value={item.title}
                                        onChange={(e) => handleInputChangeHeader(item.id, 'title', e.target.value)}
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
                                        className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.tag ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                        placeholder="Optional"
                                        value={item.tag}
                                        onChange={(e) => handleInputChangeHeader(item.id, 'tag', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-2xl font-medium leading-6 text-gray-900">
                                    Information
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.info ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                        value={item.info}
                                        onChange={(e) => handleInputChangeHeader(item.id, 'info', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-2xl font-medium leading-6 text-gray-900">
                                    Button
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.buttonSend ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                        value={item.buttonSend}
                                        onChange={(e) => handleInputChangeHeader(item.id, 'buttonSend', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-2xl font-medium leading-6 text-white-900">
                                    Display
                                </label>
                                <label class="inline-flex items-center cursor-pointer mt-4">
                                    <input
                                        type="checkbox"
                                        value=""
                                        class="sr-only peer"
                                        checked={item.active === 1}
                                        onChange={(e) => handleDisplyToggle(item.id, e.target.checked)}
                                    />
                                    <div class="z-0 relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                                </label>
                            </div>
                        </div>
                        {/* Contact Us Item */}
                        <div className="mt-5">
                            <Features
                                contactUsDetail={contactUsDetail}
                                setContactUsDetail={setContactUsDetail}
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

export default Contactus;