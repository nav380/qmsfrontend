
import { toast } from 'react-toastify';
import DjangoConfig from '../../../config/Config';


import { colors } from '@mui/material';
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Skeleton from 'react-loading-skeleton';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
const OPMaster = () => {
    const [tableData, setTableData] = useState([])
    const [isLoading, setIsLoading] = useState([])


    useEffect(() => {
        fetchProcessesPlan()
    }, []);


    const fetchProcessesPlan = async () => {
        try {
            const params = new URLSearchParams({
                fun_call: 'unique_data'
            });
    
            const url = `${DjangoConfig.apiUrl}/rtqm/order_process_view/?${params.toString()}`;
    
            const response = await axios.get(url);
    
            setTableData(response.data.unique_data);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setIsLoading(false); 
        }
    };

    const navigate = useNavigate()
    const handelNavigateOrder = () => {
        navigate('/dashboard/master/o-p-plan-form')
    }

    const viewOrderPlan = (buyer, style, color, ourref,buyer_name) => {
        const url = `/dashboard/master/o-p-plan?buyer=${encodeURIComponent(buyer)}&buyer_name=${encodeURIComponent(buyer_name)}&style=${encodeURIComponent(style)}&color=${encodeURIComponent(color)}&ourref=${encodeURIComponent(ourref)}`;
        navigate(url);
    };


    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    const handleExportData = (data) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

   
   

    const getRowStyle = (row) => {
        return row.original.is_active ? {} : { backgroundColor: 'red', color: 'white' };
    };
   

    const columns = useMemo(
        () => [
            { accessorKey: 'buyer_name', header: 'Buyer', size: 10 },
            { accessorKey: 'ourref', header: 'Our. Ref.', size: 10, enableEditing: false, },
            { accessorKey: 'style', header: 'Style', size: 10, enableEditing: false, },
            { accessorKey: 'color', header: 'Color', size: 10, enableEditing: false, },
            { accessorKey: 'created_by_name', header: 'Created By', size: 10, enableEditing: false },
            { accessorKey: 'updated_by_name', header: 'Updated By', size: 10, enableEditing: false },
            {
                accessorKey: 'id',
                header: 'Action',
                size: 20,
                Cell: ({ cell }) => {
                    const { buyer, style, color, ourref ,buyer_name } = cell.row.original;
                    return (
                        <span>
                            <button onClick={() => viewOrderPlan(buyer, style, color, ourref,buyer_name)}>
                                View
                            </button>
                        </span>
                    );
                },
            },
        ],
        []
    );




    const table = useMaterialReactTable({
        columns: columns,
        data: tableData,
        enableHiding: false,
        enableRowSelection: true,
        enablePagination: false,
        enableStickyHeader: true,
        enableStickyFooter: true,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        // enableEditing: true,
        // onEditingRowSave: handleUpdateUser, 
        // initialState: {
        //     showGlobalFilter: true,
        //     density: 'compact',
        // },
        state: {
            showGlobalFilter: true,
            density: 'compact',
            isLoading: isLoading ? <Skeleton count={5} /> : null,
        },
        muiTableBodyCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
            },
        },
        // renderRowActions: ({ row, table }) => (
        //     <Box sx={{ display: 'flex', gap: '1rem' }}>
        //         {/* <Tooltip title="Edit">
        //             <IconButton onClick={() => table.setEditingRow(row)}>
        //                 <EditIcon />
        //             </IconButton>
        //         </Tooltip> */}
        //         {/* <Tooltip title="Delete">
        //             <IconButton color="error" onClick={() => openDeleteConfirm(row)}>
        //                 <DeleteIcon />
        //             </IconButton>
        //         </Tooltip> */}
        //     </Box>
        // ),
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '12px',
                    padding: '4px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    aria-controls="export-menu"
                    aria-haspopup="true"
                    onClick={() => handleExportData(tableData)}
                    startIcon={<FileDownloadIcon />}
                >
                    Export
                </Button>
            </Box>
        ),
    });

    return (
        <>

            <div className="w-full h-16 flex items-center justify-between bg-white p-4  shadow-md">
                <h1 className="text-xl font-semibold text-gray-800"> Order Process Data</h1>
                <button
                    className="btn"
                    onClick={handelNavigateOrder}
                >
                    Add Order Process Plan
                </button>
            </div>

            <div className="container mx-auto p-4  bg-white shadow-md space-y-2">
                <div className=' space-y-5'>
                    <div className="mt-2">
                        <MaterialReactTable table={table} muiTableBodyRowProps={({ row }) => ({
                            sx: getRowStyle(row),
                        })} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default OPMaster;
