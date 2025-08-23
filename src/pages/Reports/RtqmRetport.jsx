

import { Box, Button, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DjangoConfig from '../../config/Config';

import { formatDate } from '../../utils/utils';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const RtqmRetport = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [historyData, setHistoryData] = useState([])
    const [lineData, setLineData] = useState([])
    const [selectedLine, setSelectedLine] = useState(null)
    const [proData, setProData] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null);
    const [wip, setWip] = useState(0)

   
    const navigate = useNavigate()


    
    const getSizeWiseReport = (id) => {
        const url = `/dashboard/reports/size-wise-report/?id=${encodeURIComponent(id)}`;
        navigate(url)
    }
    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor(
            'buyer_name',
            {
                Cell: ({ row }) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => getSizeWiseReport(row.original.id)}
                    >
                        {row.original.buyer_name}
                    </Button>
                ),
                header: 'Buyer',
                size: 10
            }
        ),
        columnHelper.accessor('style', { header: 'Style ', size: 10 }),
        columnHelper.accessor('ourref', { header: 'Our Ref', size: 10 }),
        columnHelper.accessor('color', { header: 'Color', size: 10 }),
        columnHelper.accessor(({ delvdate }) => (
            formatDate(delvdate)
        ), { header: 'Delivery Date', size: 10 }),
        columnHelper.accessor(({ output_start_date }) =>
            output_start_date ? formatDate(output_start_date) : 'No date available',
            { header: 'Output Start Date', size: 10 }),
        columnHelper.accessor(({ input_start_date }) => (
            formatDate(input_start_date)
        ), { header: 'Input Start  Date', size: 10 }),
        columnHelper.accessor('total_input', { header: 'Total INput', size: 10 }),
        columnHelper.accessor('total_output', { header: 'Total Outpot', size: 10 }),
        columnHelper.accessor('total_reject', { header: 'Total Reject', size: 10 }),
        columnHelper.accessor('total_defect', { header: 'Total Defect', size: 10 }),
        columnHelper.accessor('alter_balance', { header: 'Alter Balance', size: 10 }),
        columnHelper.accessor('wip', { header: 'Wip', size: 10 }),
        columnHelper.accessor('runday', { header: 'Run day', size: 10 }),
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
        fetchProcessesData();
        fetchTabLine()
    }, []);

    const handelSubmit = (event) => {
        event.preventDefault();

        setIsLoading(true);

        axios.get(`${DjangoConfig.apiUrl}/rtqm/all_report/?line_id=${selectedLine.value}&&process_id=${selectedPro.value}&fun_call=rtqm_report`)
            .then(response => {
                console.log(response.data);
                setHistoryData(response.data.rtqm_report.buyer_wise_report);
                setWip(response.data.rtqm_report.line_wip)
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setIsLoading(false);
            });
    };




    const fetchProcessesData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view/?`);
            setProData(response.data.pro_data.map(item => ({ value: item.id, label: item.name })));
            console.log("Process data", response.data);
        } catch (err) {
            console.log(err)
        }
    };

    const fetchTabLine = () => {
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_tab_login/`).then((response) => {
            setLineData(response.data.line_master_data.map(item => ({ value: item.id, label: item.name })));

        }).catch((error) => {
            console.log("error is ", error)
        })
    }


    return (
        <div>
            <div className="w-full h-16 flex items-center justify-between bg-white p-4 shadow-md">
                <h1 className="text-xl font-semibold text-gray-800"> RTQM Reports</h1>
            </div>


            <div className="flex items-center space-x-2 bg-white p-2 border rounded-sm">

                <form onSubmit={handelSubmit} className="flex flex-1 space-x-4 items-center">
                    <div className="flex-1">
                        <label htmlFor="lineData" className="block text-sm font-medium text-gray-700 mb-1">
                            Line
                        </label>
                        <Select
                            options={lineData}
                            value={selectedLine}
                            onChange={setSelectedLine}
                            placeholder="Line"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!lineData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                    margin: 0, // Ensure no extra margin
                                    padding: 0, // Ensure no extra padding
                                }),
                            }}
                        />
                    </div>

                    <div className="flex-1">
                        <label htmlFor="proData" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Processes:
                        </label>
                        <Select
                            options={proData}
                            value={selectedPro}
                            onChange={setSelectedPro}
                            placeholder="Select Processes"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!proData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '14px',
                                    margin: 0, // Ensure no extra margin
                                    padding: 0, // Ensure no extra padding
                                }),
                            }}
                        />
                    </div>

                    <div className="flex-1">
                        <label htmlFor="lineData" className="block text-sm h-4 font-medium text-gray-700 mb-1">

                        </label>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Submit
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-700">Line WIP : </p>
                            <p className="text-xl font-semibold text-gray-900">{wip}</p>
                        </div>
                    </div>
                </form>
            </div>


            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>


        </div >
    )
}

export default RtqmRetport;

