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
import DjangoConfig from '../../config/Config';
import { useNavigate } from 'react-router-dom';


const SilhouettesList = () => {
    const [tableData, setTableData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('buyer', { header: 'Buyer', size: 20 }),
        columnHelper.accessor('style_no', { header: 'Style No', size: 20 }),
        // columnHelper.accessor('front_image', {
        //     header: 'Front Silhouettes',
        //     size: 20,
        //     cellRenderer: (row) => <img src={`${DjangoConfig.apiUrl}row.value`} alt="Front Silhouette" style={{ width: 100 }} />,
        // }),
        // columnHelper.accessor('back_image', {
        //     header: 'Back Silhouettes',
        //     size: 20,
        //     cellRenderer: (row) => <img src={`${DjangoConfig.apiUrl}row.value`} alt="Back Silhouette" style={{ width: 100 }} />,
        // }),
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
        const csv = generateCsv(csvConfig)(tableData);
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
            isLoading: isLoading ? <Skeleton count={5} /> : null,

        },
        enableRowSelection: true,
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
        axios.get(`${DjangoConfig.apiUrl}/rtqm/silhouettes_view/`)
            .then(response => {
                console.log(response.data.silhouettes_data);
                setTableData(response.data.silhouettes_data);
                setIsLoading(false)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    const navigate = useNavigate()
    const uploadSilhouettes = () => {
        navigate('/dashboard/master/style-silhouettes')
    }


    return (
        <div>
            <div className='flex justify-between w-full'>
                <h1 className="text-3xl font-bold mb-8"> Buyer Silhouettes List</h1>
                <button className='btn btn-outline' onClick={uploadSilhouettes}>Upload Silhouettes</button>
            </div>
            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>

        </div>
    )
}

export default SilhouettesList
