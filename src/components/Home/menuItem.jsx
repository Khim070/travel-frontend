import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MenuItem = ({ menuBar, setMenuBar, validationErrors, setValidationErrors}) => {

    const reorderMenuBar = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const updatedMenuBar = [...menuBar];
        const [movedItem] = updatedMenuBar.splice(source.index, 1);
        updatedMenuBar.splice(destination.index, 0, movedItem);

        const reorderedMenuBar = updatedMenuBar.map((item, index) => ({
            ...item,
            orderId: index + 1
        }));

        setMenuBar(reorderedMenuBar);
    }

    const handleInputChange = (id, field, value) => {
        const updatedMenuBar = menuBar.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setMenuBar(updatedMenuBar);

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

    const handleDeleteToggle = (id, checked) => {
        if (checked) {
            const confirmed = window.confirm("Are you sure to delete it?");
            if (confirmed) {
                const updatedMenuBar = menuBar.map(item =>
                    item.id === id ? { ...item, toBeDeleted: true } : item
                );
                setMenuBar(updatedMenuBar);
            } else {
                const updatedMenuBar = menuBar.map(item =>
                    item.id === id ? { ...item, toBeDeleted: false } : item
                );
                setMenuBar(updatedMenuBar);
            }
        } else {
            const updatedMenuBar = menuBar.map(item =>
                item.id === id ? { ...item, toBeDeleted: false } : item
            );
            setMenuBar(updatedMenuBar);
        }
    };

    const handleAddNewItem = () => {
        const newId = menuBar.length > 0 ? Math.max(...menuBar.map(item => item.id)) + 1 : 1;
        const newItem = {
            id: newId,
            title: '',
            titleLink: '',
            orderId: menuBar.length + 1,
            active: 1,
            toBeDeleted: false
        };
        setMenuBar([...menuBar, newItem]);
    };

    return (
        <div>
            <div className="col-span-1 sm:col-span-3">
                <label className="block text-2xl font-medium leading-6 text-gray-900">
                    Menu
                </label>
                <div>
                    <ul className="mt-6 md:block cursor-pointer ">
                        <details className='group [&_summary::-webkit-details-marker]:hidden'>
                            <summary className='flex justify-between cursor-pointer rounded-lg px-2 py-2 text-xl font-medium w-full border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'>
                                <span className="">Menu Items</span>
                            <span className='shrink-0 transition-transform duration-300 group-open:-rotate-180'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                    </svg>
                                </span>
                            </summary>

                            <DragDropContext onDragEnd={reorderMenuBar}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                        <ul class="h-auto py-2 overflow-y-auto text-gray-300 bg-gray-500 dark:text-gray-200 ">
                                            {menuBar.map((item, i) => (
                                                <Draggable key={item.orderId} draggableId={item.orderId.toString()} index={i}>
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
                                                                        <span className="ml-2">{item.title}</span>
                                                                    </div>
                                                                    <span className='shrink-0 transition-transform duration-500 group-open:-rotate-0'>
                                                                        <svg class="size-6 fill-[#ffffff]" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"></path>
                                                                        </svg>
                                                                    </span>
                                                                </summary>
                                                                <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-6">
                                                                    <div className="sm:col-span-2 px-5">
                                                                        <label className="block text-xl font-medium leading-6 text-white-900">
                                                                            Menu Title
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <input
                                                                                type="text"
                                                                                className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.title ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                                                                value={item.title}
                                                                                onChange={(e) => handleInputChange(item.id, 'title', e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="sm:col-span-2 px-5">
                                                                        <label className="block text-xl font-medium leading-6 text-white-900">
                                                                            Menu Link
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <input
                                                                                type="text"
                                                                                className={`block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${validationErrors[item.id]?.titleLink ? 'ring-red-500 ring-2' : 'focus:ring-indigo-600'} sm:text-2xl sm:leading-6`}
                                                                                value={item.titleLink}
                                                                                onChange={(e) => handleInputChange(item.id, 'titleLink', e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sm:col-span-1 px-5">
                                                                        <label className="block text-xl font-medium leading-6 text-white-900">
                                                                            Delete
                                                                        </label>
                                                                        <label className="inline-flex items-center cursor-pointer mt-4">
                                                                            <input
                                                                                type="checkbox"
                                                                                value=""
                                                                                className="sr-only peer"
                                                                                checked={!!item.toBeDeleted}
                                                                                onChange={(e) => handleDeleteToggle(item.id, e.target.checked)}
                                                                                />
                                                                            <div className="z-0 relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-red-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                                                                        </label>
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
                                className="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
                                onClick={handleAddNewItem}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mr-2">
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

export default MenuItem;