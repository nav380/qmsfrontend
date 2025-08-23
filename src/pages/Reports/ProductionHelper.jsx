import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DjangoConfig from '../../config/Config';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const ProductionHelper = () => {
    const [tableData, setTableData] = useState([]);
    const cuttingMtData = useSelector(state => state.sewingInput.rowData);
    const [isLoading, setIsLoading] = useState(true);
    const [headerdata, setHeaderData] = useState([]);
    const navigate = useNavigate();

    const fetchSizeData = () => {
        const userData = {
            buyer: cuttingMtData.buyer,
            style: cuttingMtData.style,
            ourref: cuttingMtData.ourref,
            color: cuttingMtData.color,
            start_date: cuttingMtData.entry_date,
            end_date: cuttingMtData.end_date,
            order_qty: cuttingMtData.order_qty,
            order_ex_qty: cuttingMtData.order_ex_qty,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/production_helper_view/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const respondData = response.data.date_wise_data;
                setTableData(respondData);
                console.log("=====================>", respondData)
                setIsLoading(false);
                if (respondData.length > 0) {
                    const headerList = Array.from(new Set(respondData.flatMap(row => row.process_data.map(p => p.section_name))));
                    setHeaderData(headerList);
                }
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    useEffect(() => {
        fetchSizeData();
    }, []);

    const handleExportToExcel = () => {
        const exportData = tableData.map(row => {
            const newRow = {
                date: row.date,
                order_qty: row.order_qty,
                order_ex_qty: row.order_ex_qty,
            };

            row.process_data.forEach(section => {
                newRow[`${section.section_name}_cut_qty`] = section.input_qty || 0;
                newRow[`${section.section_name}_cumulative_qty`] = section.total_input_qty || 0;
                newRow[`${section.section_name}_balance_qty`] = section.balance_qty || 0;
            });

            return newRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Production Data");
        XLSX.writeFile(workbook, `Production_Data_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const obTablePage = () => {
        navigate('/dashboard/reports/date-wise-report/');
    };

    const getColumnHeaders = (sectionName) => {
        switch (sectionName) {
            case 'Cutting Entry':
                return ['Cut Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Cutting - Ready to load':
                return ['RTL Load Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Stitching - Input':
                return ['St-Input Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Stitching - Output':
                return ['St-Output Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Stitching Audit':
                return ['Audit Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Kaj Button - Input':
                return ['Kaj-B In Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Kaj Button - Output':
                return ['Kaj-B Out Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Finishing - Input':
                return ['Finishing In Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Finishing - Output':
                return ['Finishing Out Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Finishing Audit':
                return ['Finishing Audit Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Packing - MD Point':
                return ['Packing MD Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Final - Packing':
                return ['F-Packing Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Re-Cutting':
                return ['Re-Cutting Qty', 'Cumulative Qty', 'Balance Qty'];
            case 'Final Packing':
                return ['Final Packed Qty', 'Cumulative Qty', 'Balance Qty'];
            default:
                return ['Prev Process Qty', 'Other Qty', 'Balance Qty'];
        }
    };

    return (
        <section className="w-full h-full bg-white mt-[-10px] ml-[-5px] pb-10">
            <div className='w-full h-10 flex items-center justify-between z-10 rounded-lg pl-3 pr-8 mb-2 pt-6'>
                <div className="text-2xl mb-1 mt-2 text-slate-950 font-bold">
                    Day wise Style Transaction Report
                </div>
                <div className='w-56 h-10 flex items-center justify-between'>
                    <Button
                        onClick={obTablePage}
                        variant="contained"
                        color="primary"
                        className="float-right mr-2"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleExportToExcel}
                        variant="contained"
                        color="primary"
                        className="float-right mr-2"
                    >
                        Export
                    </Button>
                </div>
            </div>
            <div className='w-full h-10 flex items-center justify-between z-10 rounded-lg pl-3 pr-8 pt-2 mb-5 mt-6'>
                <div className='w-60 h-12 border-2 border-solid border-slate-400 rounded-md flex items-center justify-center'>{cuttingMtData.buyer_name}</div>
                {/* <div className='w-60 h-12 border-2 border-solid border-slate-400 rounded-md flex items-center justify-center'>{cuttingMtData.buyer}</div> */}
                <div className='w-60 h-12 border-2 border-solid border-slate-400 rounded-md flex items-center justify-center'>{cuttingMtData.style}</div>
                <div className='w-60 h-12 border-2 border-solid border-slate-400 rounded-md flex items-center justify-center'>{cuttingMtData.ourref}</div>
                <div className='w-60 h-12 border-2 border-solid border-slate-400 rounded-md flex items-center justify-center'>{cuttingMtData.color}</div>
            </div>

            <div className="overflow-x-auto overflow-y-auto p-3 scroll-container" >
                {isLoading ? (
                    <h2 className="text-center py-4 text-2xl">Data is Loading .................</h2>
                ) : (
                    <table className="min-w-full  border-2 border-gray-300 relative overflow-scroll" style={{position: 'sticky', top: '0', zIndex: '20'}}>
                        <thead className="bg-white sticky top-0 z-10 ">
                            <tr className="border-b-2 border-gray-300 text-sm leading-4 font-medium text-gray-900">
                                <th className="w-[40px] sticky left-[-15px] top-0 bg-white px-6 py-3 border-b-2 border-r border-gray-300 text-center text-sm font-medium text-gray-900">
                                    Date
                                </th>
                                <th className="w-[100px] px-6 py-3 border-b-2 border-r border-gray-300 text-center text-sm leading-4 font-medium text-gray-900">
                                    Order Qty
                                </th>
                                <th className="w-[150px] px-6 py-3 border-b-2 border-r border-gray-300 text-center text-sm leading-4 font-medium text-gray-900">
                                    Order Ex Qty
                                </th>

                                {headerdata.map((sectionName, idx) => (
                                    <th key={idx} colSpan={3} className="w-96 px-6 py-3 border-b-2 border-r border-gray-300 text-left text-sm leading-4 font-medium text-gray-900">
                                        <div className="w-full border-b border-gray-300 text-center text-sm leading-4 font-medium text-gray-900 pb-2">
                                            {sectionName}
                                        </div>
                                        <div className="flex items-center justify-between border-r-0 border-gray-600 border-solid">
                                            {getColumnHeaders(sectionName).map((header, i) => (
                                                <div key={i} className="w-24 text-center border-r border-gray-300 pr-1 text-sm text-gray-500">
                                                    {header}
                                                </div>
                                            ))}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className='w-full h-[200px]' style={{height: '200px', overflow: 'scroll'}}>
                            {tableData.length === 0 ? (
                                <tr>
                                    <td colSpan={headerdata.length * 3 + 3} className="text-center py-4">
                                        No data available for the selected date range.
                                    </td>
                                </tr>
                            ) : (
                                tableData.map((row, index) => (
                                    <tr key={index} className=" border-b-2 border-r overflow-y-auto border-gray-300 text-left text-sm leading-4 font-medium text-gray-900">
                                        <td className="sticky left-[-12px] border-r border-gray-600  bg-white px-6 py-4 whitespace-nowrap text-center">
                                            {row.date}
                                        </td>
                                        <td className="px-6 py-4 border-r border-gray-300  whitespace-nowrap text-center">{row.order_qty}</td>
                                        <td className="px-6 py-4 border-r border-gray-300  whitespace-nowrap text-center">{row.order_ex_qty}</td>

                                        {headerdata.map((sectionName, idx) => {
                                            const sectionData = row.process_data.find(p => p.section_name === sectionName);
                                            return sectionData ? (
                                                <>
                                                    <td key={`${index}-${sectionName}-cut_qty`} className="px-6 py-4 border-r border-gray-300 whitespace-nowrap text-center">{sectionData.input_qty || 0}</td>
                                                    <td key={`${index}-${sectionName}-cumulative_qty`} className="px-6 border-r bg-green-200 border-gray-300 py-4 whitespace-nowrap text-center">{sectionData.total_input_qty || 0}</td>
                                                    <td key={`${index}-${sectionName}-balance_qty`} className="px-6 py-4 border-r border-gray-300  whitespace-nowrap text-center">{sectionData.balance_qty || 0}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td key={`${index}-${sectionName}-cut_qty`} className="px-6 py-4 whitespace-nowrap text-center">0</td>
                                                    <td key={`${index}-${sectionName}-cumulative_qty`} className="px-6 py-4 whitespace-nowrap text-center">0</td>
                                                    <td key={`${index}-${sectionName}-balance_qty`} className="px-6 py-4 whitespace-nowrap text-center">0</td>
                                                </>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
};

export default ProductionHelper;
