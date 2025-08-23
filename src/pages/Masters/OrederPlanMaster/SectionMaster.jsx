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
import Select from 'react-select';

const SectionMaster = () => {
    const [isLoading,setIsLoading] = useState(false)
    const [tableData,setTableData] = useState([])
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [proData, setProData] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null);
    const [selectedSectionGroup, setSelectedSectionGroup] = useState(null);

    const fetchSectionData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/section_master_view/`);
            setTableData(response.data.sec_data)
            console.log("Section data", response.data);
        } catch (err) {
            console.log("Section", err);
           
        }
    };
    useEffect(()=>{
        fetchSectionData()
        fetchProcessesData()
    },[])

    const fetchProcessesData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view`);
            setProData(response.data.pro_data.map(item => ({ value: item.id, label: item.name })));
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred');
            setMessage('');
        }
    };

    const handleSectionSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = {
                name: name,
                id: selectedPro.value,
                section_group :selectedSectionGroup.value
            };
            const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/section_master_view/`, data, {
                headers: { 'Content-Type': 'application/json' }
            });

            setMessage(response.data.message);
            toast.success(response.data.message);
            setError('');
            setName('');
            setSelectedPro(null)
            setSelectedSectionGroup(null)
            fetchSectionData();
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred');
            setMessage('');
        }
    };

    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('name', { header: 'Name', size: 20 }),
        columnHelper.accessor('pro_master__name', { header: 'Process', size: 20 }),
        columnHelper.accessor('section_group', { header: 'Section Group', size: 20 }),


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

    const SectionGroupData =[
        {
            'value' :'IN',
            "label" : 'In'
        },
        {
            'value' :'OUT',
            "label" : 'Out'
        },
        {
            'value' :'AUDIT',
            "label" : 'AUDIT'
        }
    
    
    ]
    // Stitching Audit

    return (
        <div>
            <div className="w-full h-16 flex items-center justify-between bg-white p-4  shadow-md">
                <h1 className="text-xl font-semibold text-gray-800"> Section Master</h1>

                <button
                    className="btn"
                    onClick={() => document.getElementById('my_modal_2').showModal()}
                >
                    Add Section
                </button>
            </div>
             <div className="mt-2">
                <MaterialReactTable table={table}   muiTableBodyRowProps={({ row }) => ({
                sx: getRowStyle(row),
            })}/>
            </div>

            <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <form onSubmit={handleSectionSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                Name:
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="proData" className="block text-lg font-medium text-gray-700">
                                Select Processes:
                            </label>
                            <Select
                                options={proData}
                                value={selectedPro}
                                onChange={setSelectedPro}
                                placeholder="Select Processes"
                                className="w-full border-2 border-gray-300 rounded-md"
                                isSearchable
                                isLoading={!proData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '14px',
                                    }),
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="proData" className="block text-lg font-medium text-gray-700">
                            Section Group :
                            </label>
                            <Select
                                options={SectionGroupData}
                                value={selectedSectionGroup}
                                onChange={setSelectedSectionGroup}
                                placeholder="Select Processes"
                                className="w-full border-2 border-gray-300 rounded-md"
                                isSearchable
                                isLoading={!proData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '14px',
                                    }),
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Submit
                        </button>
                    </form>

                </div>
            </dialog>


        </div>
    )
}

export default SectionMaster
