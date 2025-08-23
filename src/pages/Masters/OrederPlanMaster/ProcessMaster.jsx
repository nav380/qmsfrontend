import { Box, Button, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DjangoConfig from '../../../config/Config';
const ProcessMaster = () => {
    const [isLoading,setIsLoading] = useState(false)
    const [tableData,setTableData] = useState([])
    const [name, setName] = useState('');
    const [processPlan,setProcessPlan]=useState(false)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const fetchProcessesData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view`);
            setTableData(response.data.pro_data)
        } catch (err) {
           toast(err)
        }
    };
    
    useEffect(()=>{
        fetchProcessesData()
    },[])

    const handleProcessesSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/processes_master_view/`, { 'name':name ,'process_plan':processPlan}, {
                headers: { 'Content-Type': 'application/json' }
            });

            setMessage(response.data.message);
            toast.success(response.data.message);
            setError('');
            setName('');
            fetchProcessesData()
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred');
            setMessage('');
        }
    };


    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('name', { header: 'Name', size: 20 }),
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
        const csv = generateCsv(csvConfig)();
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
        data: tableData,
        state: {
          isLoading:  isLoading ? <Skeleton count={5} /> : null,
          density: 'compact',
        },
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
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

    return (
        <div>
             <div className="w-full h-16 flex items-center justify-between bg-white p-4  shadow-md">
                <h1 className="text-xl font-semibold text-gray-800"> Process Master</h1>
                <button
                    className="btn"
                    onClick={() => document.getElementById('my_modal_1').showModal()}
                >
                    Add Processes
                </button>
            </div>
             <div className="mt-2">
                <MaterialReactTable table={table}  />
            </div>

            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <div className='w-full '>
                            <form onSubmit={handleProcessesSubmit} className='flex space-x-4'>
                                <div className="flex-1 flex flex-col justify-between">
                                    <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                                        Name:
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <label htmlFor="processPlan" className="block text-lg font-medium text-gray-700 mb-2">
                                        Process Plan:
                                    </label>
                                    <input
                                        id="process_plan"
                                        type="checkbox"
                                        checked={processPlan}
                                        onChange={(e) => setProcessPlan(e.target.checked)} 
                                        required
                                        className="w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex-1 flex mt-8 items-center">
                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </dialog>


        </div>
    )
}

export default ProcessMaster
