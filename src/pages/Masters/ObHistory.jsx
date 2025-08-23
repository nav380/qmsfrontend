import { Box, Button, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';
import DjangoConfig from '../../config/Config';
import { useNavigate } from 'react-router-dom';


const ObHistory = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [obData, setObData] = useState([])
    const navigate = useNavigate()

    //   console.log("99999999999999999",obData)

    const usStates = [
        { value: '37.33999999999999', label: 'mil gaya' },
        { value: 'AK', label: 'Alaska' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'AR', label: 'Arkansas' },
        { value: 'CA', label: 'California' },
    ];
    const validationErrors = {
        state: 'Please select a state',
    };

    //    =========================== Table columnHelper ============================== 
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    };

    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),

        // columnHelper.accessor('ob_no', { header: 'OB NO', size: 20 }),
        columnHelper.accessor('ob_no', {
            header: 'OB NO',
            size: 20,
            Cell: ({ cell }) => (
                <span onClick={() => handleOBNOClick(cell.row.original)}
                    style={{
                        color: 'blue',
                        cursor: 'pointer'
                    }}>
                    {cell.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor('buyer_name', { header: 'Buyer', size: 20 }),
        columnHelper.accessor('style', { header: 'Style ', size: 20 }),
        columnHelper.accessor('color', { header: 'Color', size: 20 }),
        columnHelper.accessor('line_sum', { header: 'Total Operations', size: 20 }),
        columnHelper.accessor('line_sam', { header: 'Line Sam', size: 20 }),
        columnHelper.accessor('total_sam', {
            accessorKey: 'total_sam',
            header: ' Total Sam',
            size: 20,
            cell: (info) => {
                const value = info.getValue(); // Get the value of the cell
                return value != null ? value.toFixed(2) : ''; // Format the value to 2 decimal places, handle null/undefined
            },
            editVariant: 'select',
            editSelectOptions: usStates,
            muiEditTextFieldProps: {
                select: true,
                error: !!validationErrors?.state,
                helperText: validationErrors?.state,
            },
        }),

        columnHelper.accessor('ob_date', {
            header: 'Ob Date',
            size: 20,
            // cellRenderer: (row) => {
            //     const datetimeString = row.value; 

            //     return date; 
            // },
        }),
        columnHelper.accessor('created_at', {
            header: 'Created At',
            size: 20,
            // cellRenderer: (row) => {
            //     const datetimeString = row.value;
            //     console.log('datetimeString====>',datetimeString)
            //     const created_at = new Date(datetimeString).toLocaleString('en-US', options);
            //     console.log('created_at=======>', created_at)
            //     return created_at;
            // },
        }),
        columnHelper.accessor('updated_at', {
            header: 'Updated_at',
            size: 20,
        }),
        columnHelper.accessor('full_name', {
            header: 'Created By',
            size: 20,

        }),

    ];

    //    =========================== Table csvConfig  ============================== 

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    //    =========================== handleExportRows, handleExportData function  ==============================

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(obData);
        download(csvConfig)(csv);
    };

    // =============== OB_Detail ViewDavedExcelData page calling ==========================

    const handleOBNOClick = (row) => {
        console.log("OB NO clicked: ", row.ob_no, "-------", row.buyer_name, row.re_cutting, row.kaz_button, row.other, row.ob_date);
        navigate("/dashboard/master/view-saved", { state: { id: row.ob_no, buyer_name: row.buyer_name, style: row.style, ob_date: row.ob_date, color: row.color, re_cutting: row.re_cutting, kaz_button: row.kaz_button, other: row.other } });
    };

    // -----for DropDown-------------------->

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //---------- Table Button and column Manageing ---------------->

    const table = useMaterialReactTable({
        columns,
        data: obData,
        state: {
            //   isLoading:  isLoading ? <Skeleton count={""} /> : 1,
            density: 'compact',

        },
        // enableRowSelection: true,
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
        // columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        // editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
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

    //   ============== UseEffect ==========================

    useEffect(() => {
        fetchDefectData();
    }, []);

    // ===================== FetchDefectData ============================

    const fetchDefectData = () => {
        axios.get(`${DjangoConfig.apiUrl}/rtqm/ob_mt_data/`)
            .then(response => {
                console.log(response.data);
                setObData(response.data.ob_mt_data);
                setIsLoading(true)
            })
            .catch(error => {
                console.log('Error:', error);
            });
    };

    // ===================== UploadObPage ============================

    const UploadObPage = () => {
        navigate('/dashboard/master/operation-master')
    }

    return (
        <>
            <div>
                <div className="w-full h-16 flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md">
                    <h1 className="text-xl font-semibold text-gray-800">Operation Bulletin</h1>
                    <Button
                        onClick={UploadObPage}
                        variant="contained"
                        color="primary"
                        className="ml-4"
                    >
                        Upload Ob
                    </Button>
                </div>
                <div className='mt-2'>
                    <MaterialReactTable table={table} />
                </div>
            </div>


        </>
    )
}

export default ObHistory

