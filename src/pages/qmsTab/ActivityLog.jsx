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
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/utils';

const ActivityLog = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [historyData, setHistoryData] = useState([])
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);
    // console.log("sewingdata",sewingPlanData)
    const navigate = useNavigate() 


    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor(({ entry_date }) => (
            formatDate(entry_date)
        ), { header: 'Date', size: 20 }),
        columnHelper.accessor('buyer_name', { header: 'Buyer', size: 20 }),
        columnHelper.accessor('styleno', { header: 'Style ', size: 20 }),
        columnHelper.accessor('size', { header: 'Size', size: 20 }),
        columnHelper.accessor('status', { header: 'Status', size: 20 }),
        columnHelper.accessor('count_entries', { header: 'Total', size: 20 }),

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
        // editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
        // enableEditing: true,
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
        const userData2 = {
            id: sewingPlanData.cutting_id ,
            process_id: sewingPlanData.process_id,
            section_id: sewingPlanData.section_id,
            buyer: sewingPlanData?.buyer, 
            color: sewingPlanData?.color,
            ourref: sewingPlanData?.ourref,
            style: sewingPlanData?.styleno,
            // delvdate: sewingPlanData?.value
        };
        const queryParams = new URLSearchParams(userData2).toString();

        axios.get(`${DjangoConfig.apiUrl}/rtqm/rtqm_dt_view/?${queryParams}`)
            .then(response => {
                console.log(response.data.history_list);
                setHistoryData(response.data.history_list);
                setIsLoading(false)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    let totalCount = 0
    if (historyData) {
        historyData.forEach((item) => {
            totalCount += item.count_entries

        })
    }
    console.log("Total Entry", totalCount)
    const UploadObPage = () => {
        navigate('/qms-tab/qc-section')
    }


    return (
        <div>
            <div className='w-full h-10 flex items-center justify-end  rounded-lg'>
                <Button
                    onClick={UploadObPage}
                    variant="contained"
                    color="primary"
                    className="float-right mr-2"
                >
                    Back To End-Line
                </Button>
            </div>

            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>


        </div>
    )
}

export default ActivityLog;

