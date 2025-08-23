import { Box, Button, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DjangoConfig from '../../config/Config';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HelpButton = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [historyData, setHistoryData] = useState([])
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);



    const headerNames = {
        serialNumber: 'S/N',
        size: 'Size',
        orderQuantity: 'Order Quantity',
        exQuantity: 'EX Quantity',
        totalInput: historyData.length > 0 ? historyData[0].prev_section : 'Total Input',
        totalOutput: historyData.length > 0 ? historyData[0].current_section : 'Total OutPut',
        balance: 'Balance'
    };
    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 10 }),
        columnHelper.accessor('size', { header: 'Size', size: 10 }),
        columnHelper.accessor('order_qty', { header: 'Oredr Quantity', size: 10 }),
        columnHelper.accessor('ex_qty', { header: 'EX Quantity', size: 10 }),
        columnHelper.accessor('total_input', { header: headerNames.totalInput, size: 10 }),
        columnHelper.accessor('actual_total_output', { header: headerNames.totalOutput, size: 10 }),
        columnHelper.accessor('today_input', { header: 'Today Input ', size: 10 }),
        columnHelper.accessor('actual_today_output', { header: 'Today  Output', size: 10 }),
        // columnHelper.accessor('today_wip', { header: 'Today Balance ', size: 10 }),
        columnHelper.accessor('total_wip', { header: 'Total Balance ', size: 10 }),

    ];


    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(historyData);
        download(csvConfig)(csv);
    };

    // -----for DropDown-------------------->
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    //----------end DropDown---------------->

    const table = useMaterialReactTable({
        columns,
        data: historyData,
        state: {
            isLoading: isLoading ? <Skeleton count={5} /> : null,

        },
        enableRowSelection: true,
        editDisplayMode: 'modal',
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoading
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '100px',
            },
        },
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiTableBodyCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '10px',
                    padding: '4px',
                    flexWrap: 'wrap',
                    style: { fontSize: '5px' },
                }}
            >

                <Button
                    aria-controls="export-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    startIcon={<FileDownloadIcon />}
                >
                    Export
                </Button>
                <Menu
                    id="export-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleExportData}>Export All Data</MenuItem>
                    <MenuItem
                        disabled={table.getPrePaginationRowModel().rows.length === 0}
                        onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                    >
                        Export All Rows
                    </MenuItem>
                    <MenuItem
                        disabled={table.getRowModel().rows.length === 0}
                        onClick={() => handleExportRows(table.getRowModel().rows)}
                    >
                        Export Page Rows
                    </MenuItem>

                </Menu>

            </Box>
        ),
    });
    // ------------Columns data end--------------------->
    useEffect(() => {
        fetchTableData();
    }, []);

    const fetchTableData = () => {
        setIsLoading(true)
        const userData2 = {

            process_id: sewingPlanData.process_id,
            section_id: sewingPlanData.section_id,
            buyer: sewingPlanData?.buyer,
            color: sewingPlanData?.color,
            ourref: sewingPlanData?.ourref,
            style: sewingPlanData?.styleno,
            // delvdate: sewingPlanData?.value
            fun_call: 'total_today_data'

        };
        const queryParams = new URLSearchParams(userData2).toString();

        axios.get(`${DjangoConfig.apiUrl}/rtqm/all_report/?${queryParams}`)
            .then(response => {
                console.log("daataa aaaaaaaaaaaaaaa", response.data);
                setHistoryData(response.data.total_today_data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    const navigate = useNavigate()
    const backButton = () => {
        navigate(-1);
    };

    let totalInput = 0
    let totalOutput = 0
    let orderQty = 0
    let exeOrderQty = 0

    if (Array.isArray(historyData)) {
        historyData.forEach((item) => {
            totalInput += item.total_input
            totalOutput += item.actual_total_output
            orderQty += parseFloat(item.order_qty) || 0;
            exeOrderQty += parseFloat(item.ex_qty)
        })
    }

    const dateWiseReport = () => {
        navigate('/qms-tab/date-wise-report')
    }


    return (
        <>
            <section className="bg-white p-4">
                <div className="w-full h-16 flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 mb-4 shadow-md">
                    <div className="text-2xl text-gray-800 font-bold">
                        Size Wise  : {sewingPlanData.process_name} Report
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-600">
                            Order Quantity
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">{orderQty}</h1>
                    </div> <div className="text-center">
                        <div className="text-sm text-gray-600">
                            EX Order Quantity
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">{exeOrderQty}</h1>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-600">
                            {historyData.length > 0 ? historyData[0].prev_section : 'Prev Quantity'}
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">{totalInput}</h1>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-600">
                            {historyData.length > 0 ? historyData[0].current_section : 'Current Quantity'}
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">{totalOutput}</h1>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Balance</p>
                        <h1 className="text-xl font-semibold text-gray-900">{totalInput - totalOutput}</h1>
                    </div>
                    <div className="flex items-center">
                        <Button
                            onClick={backButton}
                            variant="contained"
                            color="primary"
                            className="float-right"
                        >
                            Back
                        </Button>
                    </div>
                </div>
                <div className="px-4">
                    {historyData.length > 0 ? (
                        <MaterialReactTable table={table} />
                    ) : (
                        <Skeleton count={5} />
                    )}
                </div>
            </section>

            <div className='w-full h-16  bg-white-100 rounded-lg px-4 py-2 mb-4 '>
                    <Button
                        onClick={dateWiseReport}
                        variant="contained"
                        color="primary"
                        className="float-right"
                    >
                        Date Wise Report
                    </Button>
            </div>


        </>

    )
}

export default HelpButton;

