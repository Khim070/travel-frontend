import PopularItem from "./popularItem.jsx";

function popular(){
    return(
        <form>
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
                                        className="rounded-md block flex-1 border-0 bg-transparent py-2 pl-5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-2xl sm:leading-9"
                                        placeholder="Title"
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
                                />
                            </div>
                        </div>
                    </div>
                    {/* popularItem */}
                    <div className="mt-5">
                        <PopularItem />
                    </div>
                </div>
            </div>
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

export default popular;