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

const DailyProductionReport = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [tableData, setTableData] = useState([])
  


    
    
    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
    
        columnHelper.accessor('buyer_name', { header: 'Buyer', size: 100 }),
        columnHelper.accessor('style', { header: 'Style', size: 100 }),
        columnHelper.accessor('ourref', { header: 'Our Ref', size: 100 }),
        columnHelper.accessor('color', { header: 'Color', size: 100 }),
        columnHelper.accessor('size', { header: 'Size', size: 100 }),
        columnHelper.accessor('orderqty', { header: 'Order Qty', size: 100 }),
        columnHelper.accessor('cutting_qty', { header: 'Total Cut', size: 100 }),
        columnHelper.accessor((row) => row.orderqty - row.cutting_qty, { header: 'Balance To Cut', size: 100 }),
        columnHelper.accessor('ready_input_qty', { header: 'Ready To Load', size: 100 }),
        columnHelper.accessor((row) => row.cutting_qty - row.ready_input_qty, { header: 'Balance To Load', size: 100 }),
    
        columnHelper.accessor('stitching_input_qty', { header: 'Stitching Input', size: 100 }),
        columnHelper.accessor('rd_st_balance', { header: 'Balance  Stitching Input', size: 100 }),

        columnHelper.accessor('stitching_output_qty', { header: ' Stitching Output', size: 100 }),
        columnHelper.accessor('st_balance', { header: 'Balance to Output', size: 100 })
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
        enableStickyHeader:true,
        enablePagination: false,
    // enableRowNumbers: true,
    // enableRowVirtualization: true,
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
        fetchData()
    }, []);

  




    const fetchData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/daily_production_report/?`);
            setTableData(response.data.combined_data)
                        console.log("Process data", response.data);
        } catch (err) {
            console.log(err)
        }
    };

 

    return (
        <div>
            <div className="w-full h-16 flex items-center justify-between bg-white p-4 shadow-md">
                <h1 className="text-xl font-semibold text-gray-800"> Daily Production Reports</h1>
            </div>
            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>
        </div >
    )
}

export default DailyProductionReport;

