import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { createCard, updateCard, deleteCard, updateOrderIds, getAllCard } from "../../Services/CardService";


const DestinationItem = ({ card, setCard, validationErrors, setValidationErrors }) =>{

    const fileInputRefs = useRef({});
    const [previewImages, setPreviewImages] = useState({});
    const [inputErrors, setInputErrors] = useState({});

    const reorderCard = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const updatedCard = [...card];
        const [movedItem] = updatedCard.splice(source.index, 1);
        updatedCard.splice(destination.index, 0, movedItem);

        const reorderCard = updatedCard.map((item, index) => ({
            ...item,
            orderID: index + 1
        }));

        setCard(reorderCard);
    }

    const handleInputChange = (id, field, value) => {
        if ((field === 'price' && isNaN(value)) || (field === 'rate' && isNaN(value))) {
            setInputErrors(prevState => ({
                ...prevState,
                [id]: { ...prevState[id], [field]: true }
            }));
        } else {
            setInputErrors(prevState => ({
                ...prevState,
                [id]: { ...prevState[id], [field]: false }
            }));
            setCard(prevState =>
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
        }
    };

    const handleFileChangeImage = (id, field, file) => {
        const url = URL.createObjectURL(file);
        setPreviewImages(prevState => ({
            ...prevState,
            [`${id}-${field}`]: url
        }));
        setCard(prevCard =>
            prevCard.map(item =>
                item.id === id ? { ...item, [field]: file } : item
            )
        );
    };

    const toggleEditModeCardImage = (id, field) => {
        if (fileInputRefs.current[`${id}-${field}`]) {
            fileInputRefs.current[`${id}-${field}`].click();
        }
    };

    const fetchCardItems = async () => {
        try {
            const response = await getAllCard();
            const activeCard = response.data
                .filter(item => item.active === 1)
                .sort((a, b) => a.orderID - b.orderID);

            setCard(activeCard);
        } catch (error) {
            console.error('Failed to fetch card items:', error);
        }
    };

    const handleDisplyToggle = (id, checked) => {
        const updateCard = card.map(item =>
            item.id === id ? { ...item, display: checked ? 1 : 0 } : item
        );
        setCard(updateCard);
    };

    const handleDelete = async (itemId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");

        if (confirmDelete) {
            try {
                const item = card.find(item => item.id === itemId);
                const formData = new FormData();
                const itemCopy = {
                    ...item,
                    active: 0,
                    name: item.name || '',
                    address: item.address || '',
                    day: item.day || '',
                    buttonBook: item.buttonBook || '',
                    buttonLink: item.buttonLink || '',
                    cardImage: item.cardImage,
                    price: item.price || 0,
                    rate: item.rate || 0,
                    display: item.display || 0,
                    orderID: item.orderID || 0
                };

                // Append image to FormData if it's a File
                if (item.cardImage && item.cardImage instanceof File) {
                    formData.append('cardImage', item.cardImage);
                }

                // Append itemCopy to FormData
                formData.append('card', new Blob([JSON.stringify(itemCopy)], {
                    type: 'application/json'
                }));

                await deleteCard(item.id, formData);

                // Refresh the data
                await fetchCardItems();
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
        fetchCardItems();
    }, []);

    const handleAddNewItem = () => {
        const newId = card.length > 0 ? Math.max(...card.map(item => item.id)) + 1 : 1;
        const newItem = {
            id: newId,
            name: '',
            address: '',
            price: 1,
            rate: 1,
            day: '',
            type: 'Select Type',
            orderID: card.length + 1,
            display: 1,
            cardImage: '',
            active: 1,
            toBeDeleted: false,
            toBeDisplayed: false
        };
        setCard([...card, newItem]);
    };

    return (
        <div>
            <div className="col-span-1 sm:col-span-3">
                <label className="block text-2xl font-medium leading-6 text-gray-900">
                    Destination
                </label>
                <div>
                    <ul className="mt-6 md:block cursor-pointer ">
                        <details className='group [&_summary::-webkit-details-marker]:hidden'>
                            <summary className='flex justify-between cursor-pointer rounded-lg px-2 py-2 text-xl font-medium w-full border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'>
                                <span className="">Items</span>
                                <span className='shrink-0 transition-transform duration-300 group-open:-rotate-180'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                    </svg>
                                </span>
                            </summary>

                            <DragDropContext onDragEnd={reorderCard}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            <ul class="h-auto py-2 overflow-y-auto text-gray-300 bg-gray-500 dark:text-gray-200 ">
                                                {card.map((item, i) => (
                                                    <Draggable key={item.orderID} draggableId={item.orderID.toString()} index={i}>
                                                        {(provided, snapshot) => (
                                                            <li
                                                                className='border-b border-gray-300 pb-2'
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>

                                                                <details className='group [&_summary::-webkit-details-marker]:hidden'>
                                                                    <summary className='flex justify-between rounded-lg px-2 py-2 pl-5 w-full'>
                                                                        <div className="flex justify-start ">
                                                                            <svg class="size-5 fill-[#ffffff]" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
                                                                            </svg>
                                                                            <span className="ml-2">{item.name}</span>
                                                                        </div>
                                                                        <span className='shrink-0 transition-transform duration-500 group-open:-rotate-0 flex gap-2'>
                                                                            <div>
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth={1.5}
                                                                                    stroke="currentColor"
                                                                                    className="size-6 cursor-pointer"
                                                                                    onClick={() => handleDelete(item.id)}
                                                                                >
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                                </svg>
                                                                            </div>
                                                                            <svg class="size-6 fill-[#ffffff]" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"></path>
                                                                            </svg>
                                                                        </span>
                                                                    </summary>

                                                                    <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-6">
                                                                        <div className="sm:col-span-2 px-5">
                                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                                Destination Title
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.name ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                                                                    value={item.name}
                                                                                    onChange={(e) => handleInputChange(item.id, 'name', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-2 px-5">
                                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                                Price
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="number"
                                                                                    className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.price ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}                                                                                    value={item.price}
                                                                                    onChange={(e) => handleInputChange(item.id, 'price', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-2 px-5">
                                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                                Day
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.day ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}                                                                                    value={item.day}
                                                                                    onChange={(e) => handleInputChange(item.id, 'day', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-2 px-5">
                                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                                Button
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.buttonBook ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                                                                    value={item.buttonBook}
                                                                                    onChange={(e) => handleInputChange(item.id, 'buttonBook', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-2 px-5">
                                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                                ButtonLink
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.buttonLink ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                                                                    value={item.buttonLink}
                                                                                    onChange={(e) => handleInputChange(item.id, 'buttonLink', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-2 px-5">
                                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                                Type
                                                                            </label>
                                                                            <div className="mt-3">
                                                                                <select
                                                                                    className="block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                                                                                    value={item.type || ''}
                                                                                    onChange={(e) => handleInputChange(item.id, 'type', e.target.value)}
                                                                                >
                                                                                    <option value="">Select Type</option>
                                                                                    <option value="Normal">Normal</option>
                                                                                    <option value="Popular">Popular</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-2 px-5">
                                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                                Address
                                                                            </label>
                                                                            <div className="mt-5">
                                                                                <textarea
                                                                                    type="text"
                                                                                    className={`block w-full resize-none h-48 rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.address ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}                                                                                    value={item.address}
                                                                                    onChange={(e) => handleInputChange(item.id, 'address', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-2 px-5">
                                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                                Image <span className="text-red-500">(Optional)</span>
                                                                            </label>
                                                                            <div className="mt-5 flex h-48 justify-center rounded-lg border border-dashed bg-white border-gray-900/25 px-6 py-16">
                                                                                <div className="text-center">
                                                                                    {item.cardImage ? (
                                                                                        <>
                                                                                            <img
                                                                                                src={previewImages[`${item.id}-cardImage`] || `http://localhost:8080/image/${item.cardImage}`}
                                                                                                alt="Image"
                                                                                                className="w-[180px] h-[80px] cursor-pointer items-center"
                                                                                            />
                                                                                            <a
                                                                                                onClick={() => toggleEditModeCardImage(item.id, 'cardImage')}
                                                                                                className="mt-2 text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                                                            >
                                                                                                Edit
                                                                                            </a>
                                                                                            <input
                                                                                                id={`file-upload-${item.id}-image`}
                                                                                                name="file-upload"
                                                                                                type="file"
                                                                                                className="sr-only"
                                                                                                ref={el => (fileInputRefs.current[`${item.id}-cardImage`] = el)}
                                                                                                onChange={(e) => handleFileChangeImage(item.id, 'cardImage', e.target.files[0])}
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
                                                                                                        onChange={(e) => handleFileChangeImage(item.id, 'cardImage', e.target.files[0])}
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

                                                                        <div className="sm:col-span-2 px-5">
                                                                            <div className="col-span-full">
                                                                                <label className="block text-xl font-medium leading-6 text-white-900">
                                                                                    Rate
                                                                                </label>
                                                                                <div className="mt-5">
                                                                                    <input
                                                                                        type="number"
                                                                                        className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.rate ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}                                                                                        value={item.rate}
                                                                                        onChange={(e) => handleInputChange(item.id, 'rate', e.target.value)}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {/* toggle button */}
                                                                            <div className="col-span-full">
                                                                                <label class="inline-flex items-center cursor-pointer mt-5">
                                                                                    <span className="mr-4 block text-xl font-medium leading-6 text-white-900">Display</span>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        value=""
                                                                                        class="sr-only peer"
                                                                                        checked={item.display === 1}
                                                                                        onChange={(e) => handleDisplyToggle(item.id, e.target.checked)}
                                                                                    />
                                                                                    <div class="z-0 relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                                                                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </details>
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </ul>
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>

                            <a
                                href="#"
                                class="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
                                onClick={handleAddNewItem}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Add new item
                            </a>
                        </details>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DestinationItem;