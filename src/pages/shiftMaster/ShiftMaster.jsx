import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Skeleton from 'react-loading-skeleton';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { toast } from 'react-toastify';
import DjangoConfig from '../../config/Config';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const ShiftMaster = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [unitData, setUnitData] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [floorData, setFloorData] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [tableDtData, setTableDtData] = useState([]);

    // Fetch initial data for dropdowns
    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
            setUnitData(response.data.location_data.map(item => ({ value: item.id, label: item.name })));
        } catch (error) {
            console.error('Error fetching initial data:', error);
            toast.error('Failed to fetch initial data.');
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Handle unit dropdown change
    const handleUnitChange = (selectedValue) => {
        setSelectedUnit(selectedValue);
        fetchFloorData(selectedValue);
    };

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    // Fetch floor data based on selected unit
    const fetchFloorData = async (selectedValue) => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/`, {
                params: { unit_id: selectedValue.value },
                headers: { 'Content-Type': 'application/json' },
            });
            const floorOptions = response.data.common_master_data.map(item => ({ value: item.id, label: item.name }));
            setFloorData(floorOptions);
        } catch (error) {
            console.error('Error fetching floor data:', error);
            toast.error('Failed to fetch floor data.');
        }
    };

    
    const columnHelper = createMRTColumnHelper();

    // Columns for table1
    const columns1 = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('id', { header: 'ID ', size: 20 }),
        columnHelper.accessor('name', { header: 'Shift Name', size: 20 }),
        columnHelper.accessor('start_time', { header: 'Start Time', size: 20 }),
        columnHelper.accessor('end_time', { header: 'End Time', size: 20 }),
        columnHelper.accessor('hours', { header: 'Hours', size: 20 }),
        columnHelper.accessor('applicable_date', { header: 'Applicable Date', size: 20 }),
        columnHelper.accessor((row) => (
            <Button onClick={() => openSubWindow(row.id)} variant="outlined" size="small">
                Open
            </Button>
        ), { header: 'Action', size: 20 }),
    ];


    const handleUpdateMt = ({ values, table }) => {
        const userData = {
            action: 'update_shift_mt',
            mt_id: values.id,
            name: values.name,
            start_time: values.start_time,
            end_time: values.end_time,
            applicable_date: values.applicable_date
        };
    
        axios.post(`${DjangoConfig.apiUrl}/rtqm/shift_master_crud_view/`, userData)
            .then((response) => {
                console.log(response.data);
                toast.success(` ${response.data.message} `);
            })
            .catch((error) => {
                console.error('Error:', error.response ? error.response.data : error.message);
                toast.error("Data save failed");
            });
    
        console.log(values, table);
    };

    const deleteMt =(id)=>{
        axios.get(`${DjangoConfig.apiUrl}/rtqm/shift_master_crud_view/?mt_id=${id}`)
            .then((response) => {
                console.log(response.data);
                toast.success(` ${response.data.message} `);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error("failed ....");
            });
    }

    const openDeleteConfirmMt = (row) => {
        if (window.confirm(`Are you sure you want to delete ? `)) {
            deleteMt(row.original.id);
        }
      };
    


    const table1 = useMaterialReactTable({
        columns: columns1,
        data: tableData,
        enableHiding: false,
        enableRowSelection: true,
        enablePagination: false,
        enableStickyHeader: true,
        enableStickyFooter: true,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        onEditingRowSave: handleUpdateMt,  //save button 
        getRowId: (row) => row.id,
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            // columnVisibility: { id: false }
        },
        muiTableBodyCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
            },
        },
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmMt(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
       
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



    const columns2 = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'start_time',
                header: 'Start Time',
                muiEditTextFieldProps: {
                    required: true,
                    helperText: 'Enter start time',
                },
            },
            {
                accessorKey: 'end_time',
                header: 'End Time',
                muiEditTextFieldProps: {
                    required: true,
                    helperText: 'Enter end time',
                },
            },
            {
                accessorKey: 'hour_no',
                header: 'Hour No',
                muiEditTextFieldProps: {
                    required: true,
                    helperText: 'Enter hour number',
                },
            },
            {
                accessorKey: 'duration',
                header: 'Duration',
                muiEditTextFieldProps: {
                    required: true,
                    helperText: 'Enter duration',
                },
            },
            {
                accessorKey: 'type',
                header: 'Type',
                muiEditTextFieldProps: {
                    required: true,
                    helperText: 'Enter type',
                },
            },
            {
                accessorKey: 'cumulative_minutes',
                header: 'Cumulative Minutes',
                muiEditTextFieldProps: {
                    required: true,
                    helperText: 'Enter cumulative minutes',
                },
            },
        ],
        []
    );
    

    const handleUpdateDt = ({ values, table }) => {
        const userData = {
            action: 'update_shift_dt',
            dt_id: values.id,
            start_time: values.start_time,
            end_time: values.end_time,
            hour_no: values.hour_no,
            type: values.type,
            duration: values.duration,
            cumulative_minutes: values.cumulative_minutes

        };
        axios.post(`${DjangoConfig.apiUrl}/rtqm/shift_master_crud_view/`, userData)
            .then((response) => {
                console.log(response.data);
                toast.success(` ${response.data.message} `);
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error("Data save failed");
            });
    
        console.log(values, table);
    };

    const deleteDt =(id)=>{
        axios.get(`${DjangoConfig.apiUrl}/rtqm/shift_master_crud_view/?dt_id=${id}`)
            .then((response) => {
                console.log(response.data);
                toast.success(` ${response.data.message} `);
                openSubWindow(response.data.id)
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error("failed ....");
            });
    }

    const openDeleteConfirmDt = (row) => {

        if (window.confirm(`Are you sure you want to delete ?`)) {
          deleteDt(row.original.id);
        }
      };

    const table2 = useMaterialReactTable({
        columns: columns2,
        data: tableDtData,
        enableHiding: false,
        enableRowSelection: true,
        enablePagination: false,
        enableStickyHeader: true,
        enableStickyFooter: true,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        onEditingRowSave: handleUpdateDt,  //save button 
        getRowId: (row) => row.id,
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
        },
        muiTableBodyCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
            },
        },
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmDt(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
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
                <h1>

                </h1>
            </Box>
        ),
    });



    // Function to open subwindow with detailed data
    const openSubWindow = (id) => {
        setIsLoading(true);
        axios.get(`${DjangoConfig.apiUrl}/rtqm/shift_master_view/?id=${id}`, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                setTableDtData(response.data.shift_dt);
            })
            .catch(error => {
                console.error('Error fetching subwindow data:', error);
                toast.error('Failed to fetch subwindow data.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Handle form submission to fetch table data
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = {
            unit_id: selectedUnit.value,
            floor_id: selectedFloor ? selectedFloor.value : null,
        };
        axios.get(`${DjangoConfig.apiUrl}/rtqm/shift_master_view/`, {
            params: data,
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                setTableData(response.data.shift_mt);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
                toast.error('Failed to fetch filtered data.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Handle exporting all rows
    const handleExportData = (data) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };
    const navigate = useNavigate()
    const pageShift=()=>{
        navigate('/dashboard/master/add-sift-master')
    }
    return (
        <div>
             <div className='w-full h-12 text-center flex items-center justify-between'>
                <h1 className='text-balance font-semibold flex-grow'>Shift Master</h1>
                <button onClick={pageShift} className='btn btn-primary h-10 w-32'>Add Shift</button>
            </div>

            <div className='first-line:form-container mt-2 transition-all duration-500 ease-in-out'>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                        <label htmlFor="unitData">Unit</label>
                        <Select
                            options={unitData}
                            value={selectedUnit}
                            onChange={handleUnitChange}
                            placeholder="Unit"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!unitData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="floorData">Floor</label>
                        <Select
                            options={floorData}
                            value={selectedFloor}
                            onChange={setSelectedFloor}
                            placeholder=" Floor"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!floorData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                }),
                            }}
                        />
                    </div>
                    <div className='mt-6'>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            className="w-full h-10 mt-14 "
                        >
                            {isLoading ? 'Loading...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="mt-3">
                <div>
                    {tableData.length > 0 && (
                        <div>
                            <MaterialReactTable table={table1} />
                        </div>
                    )}
                    {tableDtData.length > 0 && (
                        <div className='mt-4'>
                            <MaterialReactTable table={table2} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShiftMaster;


