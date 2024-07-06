import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Excel from '../../img/excel.png';
import Word from '../../img/doc.png';
import CSV from '../../img/csv.png';
import PDF from '../../img/pdf.png';

const Report = ({ record, onClose }) => {

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(record);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(dataBlob, 'report.xlsx');
    };

    const handleExportWord = () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Report",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    ...record.map((item, index) => new Paragraph({
                        children: [
                            new TextRun({
                                text: `${index + 1}. Name: ${item.name}, Role: ${item.role}, Action: ${item.action}, Page: ${item.form}, Item ID: ${item.userID}, Item Name: ${item.userName}, Date: ${item.date}`,
                                size: 20,
                            }),
                        ],
                    })),
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, "report.docx");
        });
    };

    const handleExportCSV = () => {
        const csv = Papa.unparse(record);
        const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(csvData, 'report.csv');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        let yPos = 10;

        record.forEach((item, index) => {
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = 10;
            }

            doc.text(`No: ${index + 1}`, 10, yPos);
            doc.text(`Name: ${item.name}`, 10, yPos + 10);
            doc.text(`Role: ${item.role}`, 10, yPos + 20);
            doc.text(`Action: ${item.action}`, 10, yPos + 30);
            doc.text(`Page: ${item.form}`, 10, yPos + 40);
            doc.text(`Item ID: ${item.userID}`, 10, yPos + 50);
            doc.text(`Item Name: ${item.userName}`, 10, yPos + 60);
            doc.text(`Date: ${item.date}`, 10, yPos + 70);
            yPos += 80;
        });

        doc.save('report.pdf');
    };

    return (
        <div id='makeReport' tabindex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow ">

                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                    <h3 className="text-xl font-semibold text-gray-900 font-nunito">
                        Export Report
                    </h3>
                    <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center" data-modal-toggle="crypto-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>

                <div className="p-4 md:p-5">
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Export the report to Excel/CSV/PDF or DOC.</p>
                    <ul className="my-4 space-y-3">
                        <li>
                            <a onClick={handleExportExcel} className="cursor-pointer flex items-center p-3 text-base font-bold text-white rounded-lg bg-gray-600 hover:bg-gray-500 group hover:shadow ">
                                <img src={Excel} alt="Excel" className='h-12 w-12'/>
                                <span className="flex-1 ms-3 whitespace-nowrap">Export to Excel</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={handleExportWord} className="cursor-pointer flex items-center p-3 text-base font-bold text-white rounded-lg bg-gray-600 hover:bg-gray-500 group hover:shadow ">
                                <img src={Word} alt="Excel" className='h-12 w-12' />
                                <span className="flex-1 ms-3 whitespace-nowrap">Export to Word</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={handleExportCSV} className="cursor-pointer flex items-center p-3 text-base font-bold text-white rounded-lg bg-gray-600 hover:bg-gray-500 group hover:shadow ">
                                <img src={CSV} alt="Excel" className='h-12 w-12' />
                                <span className="flex-1 ms-3 whitespace-nowrap">Export to CSV</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={handleExportPDF} className="cursor-pointer flex items-center p-3 text-base font-bold text-white rounded-lg bg-gray-600 hover:bg-gray-500 group hover:shadow ">
                                <img src={PDF} alt="Excel" className='h-12 w-12' />
                                <span className="flex-1 ms-3 whitespace-nowrap">Export to PDF</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Report;