/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Box, Button, Checkbox, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Skeleton from 'react-loading-skeleton';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import DjangoConfig from '../../config/Config';
import { useNavigate } from 'react-router-dom';

const FinishingPlaning = () => {
    const [buyerList, setBuyerList] = useState([]);
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedRef, setSelectedRef] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [tableData, setTableData] = useState([])
    const [planDate, setPlanDate] = useState(new Date());
    const [lineData, setLineDate] = useState([])
    const [selectedLine, setSelectedLine] = useState(null)
    const [floorData, setFloorData] = useState([])
    const [selectedFloor, setSelectedFloor] = useState(null)
    const [unitData, setUnitData] = useState([])
    const [selectedUnit, setSelectedUnit] = useState(null)
    const [totalData, setTotalData] = useState([])
    const [selectedData, setSelectedData] = useState({})
    const [processData, setProcessData] = useState([])
    const [selectedProcess, setSelectedProcess] = useState(null)
    const [orderQty, setOrderQty] = useState(0)
    const [orderExQty, setOrderExQty] = useState(0)




    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const fetchProcessesData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view`, {
                params: { plan_process: 'plan_process' }            });
            setProcessData(response.data.pro_data.map(item => ({ value: item.id, label: item.name })));
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to fetch processes data.');
        }
    };

    useEffect(() => {
        fetchProcessesData()
    }, [])

    const fetchInitialData = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/finishing_planing/`);
            setTableData(response.data.planing_data)
            console.log(response.data.planing_data)
            setIsLoading(false)
            setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));
            setUnitData(response.data.location_data.map(item => ({ value: item.id, label: item.name })))
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    useEffect(() => {


        fetchInitialData();
    }, []);

    const handleBuyerChange = (selectedValue) => {
        setSelectedBuyer(selectedValue);
        setOrderExQty(0)
        setOrderQty(0)
        setSelectedStyle(null)
        fetchStyleData(selectedValue);
    };






    const fetchStyleData = (selectedValue) => {
        setStyleNoData([])
        const userData = {
            buyer: selectedValue.value,
        }
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/finishing_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const responseData = response.data.style_data
            console.log(response.data)

            const styleOptions = responseData.map(item => ({ value: item.styleno, label: item.styleno, ourref: item.ourref }));
            setStyleNoData(styleOptions);
            setTotalData(responseData)
            setIsLoading(false);


        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }

    const handelChangeStyle = (selectedValue) => {
        setSelectedStyle(selectedValue)
        setOrderExQty(0)
        setOrderQty(0)
        fetchOrderQtyData(selectedValue)

    }


    const fetchOrderQtyData = (selectedValue) => {
        const userData = {
            buyer: selectedBuyer.value,
            style: selectedValue.value,
            ourref: selectedValue.ourref

        }
        console.log(userData)
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/finishing_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const responseData = response.data.order_data
            setOrderExQty(responseData.order_ex_qty)
            // console.log(response.data.order_data)

            setOrderQty(responseData.total_qty)
            setIsLoading(false);
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }




    const handleUnitChange = (selectedValue) => {
        setSelectedUnit(selectedValue);
        fetchUniteData(selectedValue)
    };


    const fetchUniteData = (selectedValue) => {
        console.log("selected Value", selectedValue);
        const userData = {
            unit_id: selectedValue.value,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/finishing_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const floorOptions = response.data.common_master_data.map(item => ({ value: item.id, label: item.name }));
                setFloorData(floorOptions)
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const handleFloorChange = (selectedValue) => {
        setSelectedFloor(selectedValue);
        fetchFloorData(selectedValue)
    };


    const fetchFloorData = (selectedValue) => {
        console.log("selected Value", selectedValue);
        const userData = {
            common_id: selectedValue.value,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/finishing_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const lineOptions = response.data.line_master_data.map(item => ({ value: item.id, label: item.name }));
                setLineDate(lineOptions)

            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };





    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const userData = {
            buyer: selectedBuyer.value,
            buyer_name: selectedBuyer.label,
            ourref: selectedStyle.ourref,
            styleno: selectedStyle.value,
            unit: selectedUnit.value,
            floor: selectedFloor.value,
            line: selectedLine.value,
            order_ex_qty: orderExQty,
            order_qty: orderQty,
            planing_date: planDate,
            process:selectedProcess.value
        };


        try {
            const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/finishing_planing2/`, userData, { withCredentials: true });
            toast.success(response.data.message);
            fetchInitialData();


        } catch (error) {
            console.error('Error creating QmsFinishingPlaning:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const navigate = useNavigate()
    const handleButtonClick = (planingId) => {
        navigate(`/dashboard/planing/finishing-planing-dt/${planingId}`);
    };

    // --------------Table  Column Data------------------------------->

    const StatusOptions = [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'In Active' },
    ];

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Add',
                enableEditing: false,
                size: 10,
                Cell: ({ row }) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleButtonClick(row.original.id)}
                    >
                        {row.original.total_quantity}
                    </Button>
                ),
            },
            
            {
                accessorKey: 'process__name',
                header: 'Process ',
                enableEditing: false,
                size: 10,
            },
            {
                accessorKey: 'unit_name',
                header: 'Unit ',
                enableEditing: false,
                size: 10,
            },
            {
                accessorKey: 'line_name',
                header: 'Line ',
                enableEditing: false,
                size: 20,

            },
            {
                accessorKey: 'style',
                header: 'Style ',
                enableEditing: false,
                size: 30,

            },

            {
                accessorKey: 'order_qty',
                header: 'Quantity',
                muiEditTextFieldProps: {
                    required: true,
                    helperText: 'Enter duration',
                },
                size: 20,

            },
            {
                accessorKey: 'order_ex_qty',
                header: 'Order Ex Quantity',
                enableEditing: false,
                size: 20,


            },
            {
                accessorKey: 'planing_date',
                header: 'Plan Date',
                enableEditing: false,
                size: 30,

            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                size: 20,
                editVariant: 'select',
                editSelectOptions: StatusOptions,
                muiEditTextFieldProps: {
                    select: true,
                },
                Cell: ({ cell }) => (
                    <span>
                        {cell.getValue() ? (
                            <CheckIcon checked={cell.getValue()} />
                        ) : (
                            <CloseIcon color="error" />
                        )}
                    </span>
                ),

            },

        ],
        []
    );


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

    const handleUpdatePlan = ({ values, table }) => {
        const userData = {
            id: values.id,
            quantity: values.quantity,
            is_active: values.is_active

        };
        console.log("response Data", values.id)
        axios.post(`${DjangoConfig.apiUrl}/rtqm/finishing_planing/`, userData)
            .then((response) => {
                console.log(response.data);
                toast.success(` ${response.data.message} `);
                fetchInitialData()
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error("Data save failed");
            });

        console.log(values, table);
    };

    const table = useMaterialReactTable({
        columns,
        data: tableData,

        enableRowSelection: true,
        enableHiding: false,
        enablePagination: false,
        enableStickyHeader: true,
        enableStickyFooter: true,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        onEditingRowSave: handleUpdatePlan,
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
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                {/* <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmDt(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip> */}
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '12px',
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
            <div className='w-full h-10 flex items-center justify-between bg-gray-300 rounded-lg'>
                <h1 className='text-center ml-2'>{selectedProcess?.label || ''} Planning</h1>
                <Button
                    onClick={toggleFormVisibility}
                    variant="contained"
                    color="primary"
                    className="float-right mr-2"
                >
                    {isFormVisible ? 'Add Plan' : 'Add Plan'}
                </Button>
            </div>


            <div className={`form-container mt-2 transition-all duration-500 ease-in-out ${isFormVisible ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5  gap-4 mb-4">
                    <div>
                        <label htmlFor="processData">Process</label>
                        <Select
                            options={processData}
                            value={selectedProcess}
                            onChange={setSelectedProcess}
                            placeholder="Process"
                            className="w-full border-2 z-30 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!processData.length}
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
                        <label htmlFor="buyerList"> Buyer</label>
                        <Select
                            options={buyerList}
                            value={selectedBuyer}
                            onChange={handleBuyerChange}
                            placeholder="Select Buyer"
                            className="w-full border-2 z-50 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!buyerList.length}
                            loadingMessage={() => <Skeleton count={5} />}
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
                        <label htmlFor="styleNoData">Style No</label>
                        <Select
                            options={styleNoData}
                            value={selectedStyle}
                            onChange={handelChangeStyle}
                            placeholder="Select Style"
                            className="w-full border-2 z-30 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!styleNoData.length}
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
                            onChange={handleFloorChange}
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
                    <div>
                        <label htmlFor="lineData">Line</label>
                        <Select
                            options={lineData}
                            value={selectedLine}
                            onChange={setSelectedLine}
                            placeholder=" Line"
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
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="quantity">Order  Quantity</label>
                        <input
                            type="number"
                            name="exQuantity"
                            value={orderQty}
                            // onChange={(e) => setQuantity(e.target.value)}

                            className="w-full border-2 border-gray-400 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:border-gray-600"
                            style={{ height: '43px', fontSize: '12px' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="quantity">Order Ex Quantity</label>
                        <input
                            type="disable"
                            name="OrderQuantity"
                            value={orderExQty}
                            className="w-full border-2 border-gray-400 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:border-gray-600"
                            style={{ height: '43px', fontSize: '12px' }}
                        />

                    </div>
                    <div>
                        <label htmlFor="planDate">Plan Date</label>
                        <input
                            type='date'
                            className="w-full  border-2 border-gray-400 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:border-gray-600"
                            name="date"
                            value={planDate}
                            onChange={(e) => setPlanDate(e.target.value)}
                            style={{ height: '43px', fontSize: '12px' }}

                        // placeholder='FinishingPlaning Date'
                        />
                    </div>
                    <div>
                        {/* <label htmlFor="submit">Submit</label> */}
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
            <div className="mt-3 ">
                <MaterialReactTable table={table} />
            </div>


        </div>


    );
};

export default FinishingPlaning;
