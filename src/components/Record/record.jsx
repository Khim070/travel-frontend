import React, { useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { getAllRecord } from '../../Services/RecordService';
import Report from './report';

const Record = () => {

    const [record, setRecord] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = record.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(record.length / rowsPerPage);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    };

    useEffect(() => {
        const today = new Date();
        const oneMonthBefore = new Date(today);
        oneMonthBefore.setMonth(today.getMonth() - 1);

        setEndDate(formatDate(today));
        setStartDate(formatDate(oneMonthBefore));
    }, []);

    useEffect(() => {
        flatpickr('#datepicker-range-start', {
            enableTime: true,
            dateFormat: 'd-m-Y H:i',
            defaultDate: startDate,
            onChange: (selectedDates) => {
                handleStartDateChange(formatDate(selectedDates[0]));
            },
        });

        flatpickr('#datepicker-range-end', {
            enableTime: true,
            dateFormat: 'd-m-Y H:i',
            defaultDate: endDate,
            onChange: (selectedDates) => {
                handleEndDateChange(formatDate(selectedDates[0]));
            },
        });
    }, [startDate, endDate]);

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const response = await getAllRecord();
                const activeRecord = response.data
                    .sort((a, b) => b.id - a.id);

                setRecord(activeRecord);
            } catch (error) {
                console.error('Failed to fetch record:', error);
            }
        };

        fetchRecord();
    }, []);

    const handleExport = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSearch = () => {
        fetchDataByDateRange(startDate, endDate);
    };

    const fetchDataByDateRange = (start, end) => {
        const startDateObj = new Date(start.split('-').reverse().join('-'));
        const endDateObj = new Date(end.split('-').reverse().join('-'));

        fetch(`http://localhost:8080/api/record`)
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(record => {
                    const [day, month, yearAndTime] = record.date.split('-');
                    const [year, time] = yearAndTime.split(' ');
                    const recordDateStr = `${year}-${month}-${day}T${time}`;
                    const recordDate = new Date(recordDateStr);
                    return recordDate >= startDateObj && recordDate <= endDateObj;
                });
                setRecord(filteredData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handlePrint = () => {
        const printContent = document.getElementById('printable-area').innerHTML;
        const originalContent = document.body.innerHTML;

        const headContent = document.head.innerHTML;

        document.body.innerHTML = `<html><head>${headContent}</head><body>${printContent}</body></html>`;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    const renderPagination = () => {
        const pageNumbers = [];
        const maxPagesToShow = 3;
        const ellipsis = '...';

        if (totalPages <= maxPagesToShow + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= maxPagesToShow) {
                for (let i = 1; i <= maxPagesToShow; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push(ellipsis);
                pageNumbers.push(totalPages);
            } else if (currentPage > totalPages - maxPagesToShow) {
                pageNumbers.push(1);
                pageNumbers.push(ellipsis);
                for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push(ellipsis);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push(ellipsis);
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers.map((pageNumber, index) => (
            <li key={index}>
                <button
                    className={`flex items-center justify-center px-3 h-8 leading-tight border ${currentPage === pageNumber ? 'text-blue-600 border-gray-300 bg-blue-200 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`}
                    onClick={() => pageNumber !== ellipsis && handlePageChange(pageNumber)}
                    disabled={pageNumber === ellipsis}
                >
                    {pageNumber}
                </button>
            </li>
        ));
    };

    return (
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
            <div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                <div className="flex items-center">
                    <div date-rangepicker class="flex items-center px-2 py-2">
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <input id="datepicker-range-start" value={startDate} onChange={handleStartDateChange} name="start" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 " placeholder="Select date start"/>
                        </div>
                        <span class="mx-4 text-gray-500">to</span>
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <input id="datepicker-range-end" value={endDate} onChange={handleEndDateChange} name="end" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Select date end"/>
                        </div>
                        <button onClick={handleSearch} class="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                            <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>Search
                        </button>
                        <button onClick={handlePrint} class="inline-flex items-center py-2.5 px-3 ms-2 gap-1 text-sm font-medium text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                            </svg>Print
                        </button>
                        <button onClick={handleExport} class="inline-flex items-center py-2.5 px-2 ms-2 gap-1 text-sm font-medium text-white bg-green-700 rounded-lg border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                            <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2" />
                            </svg>Export
                        </button>
                        {showModal && <Report record={record} onClose={handleCloseModal} />}
                    </div>
                </div>
            </div>
            <div id='printable-area'>
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 " >
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                No
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Position
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Page
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Item_ID
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Item_Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, i) => (
                            <tr class="bg-white border-b hover:bg-gray-50 " key={indexOfFirstItem + i}>
                                <td class="px-6 py-4">
                                    {indexOfFirstItem + i + 1}
                                </td>
                                <td class="px-6 py-4">
                                    {item.name}
                                </td>
                                <td class="px-6 py-4">
                                    {item.role}
                                </td>
                                <td class="px-6 py-4">
                                    {item.action}
                                </td>
                                <td class="px-6 py-4">
                                    {item.form}
                                </td>
                                <td class="px-6 py-4">
                                    {item.userID}
                                </td>
                                <td class="px-6 py-4">
                                    {item.userName}
                                </td>
                                <td class="px-6 py-4">
                                    {item.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <nav class="flex items-center flex-column pb-2 px-2 flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                <div className=' inline-flex items-center justify-center gap-2'>
                    <div class="flex items-center space-x-2 mb-4 md:mb-0">
                        <select
                            id="rowsPerPage"
                            className="border rounded p-1"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                        >
                            {[10, 25, 50].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <span class="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span class="font-semibold text-gray-900 ">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, record.length)}</span> of <span class="font-semibold text-gray-900">{record.length}</span></span>
                </div>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li>
                        <button
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                    </li>
                    {renderPagination()}
                    <li>
                        <button
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}>Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>

    );
}

export default Record;