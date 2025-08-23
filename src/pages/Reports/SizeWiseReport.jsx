import { Box, Button, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DjangoConfig from '../../config/Config';
import { useLocation, useNavigate } from 'react-router-dom';

const SizeWiseReport = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [historyData, setHistoryData] = useState([])
    const navigate = useNavigate() 
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 10 }),
        columnHelper.accessor('size', { header: 'Size', size: 10 }),
        columnHelper.accessor('total_input', { header: 'Total Input', size: 10 }),
        columnHelper.accessor('actual_total_output', { header: 'Total Output ', size: 10 }),
        columnHelper.accessor('total_reject', { header: 'Total Reject ', size: 10 }),
        columnHelper.accessor('wip', { header: 'Wip ', size: 10 }),
        columnHelper.accessor('alter_balance', { header: 'Alter Balance ', size: 10 }),
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
        enablePagination: false,

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
        fetchDefectData();
    }, []);

    const fetchDefectData = () => {
        setIsLoading(true)

        axios.get(`${DjangoConfig.apiUrl}/rtqm/all_report/?id=${id}&fun_call=size_log`)
            .then(response => {
                console.log(response.data.size_log);
                setHistoryData(response.data.size_log);
                setIsLoading(false)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
   
    const UploadObPage = () => {
        navigate('/dashboard/reports/rtqm-report')
    }


    return (
        <div>
            <div className='w-full h-10 flex items-center justify-between  rounded-lg'>
                <h1>Size Wise Log</h1>
                <Button
                    onClick={UploadObPage}
                    variant="contained"
                    color="primary"
                    className="float-right mr-2"
                >
                    Back To Reports
                </Button>
            </div>
            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>
        </div>
    )
}

export default SizeWiseReport;

