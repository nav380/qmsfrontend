import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import DjangoConfig from '../../config/Config'
import axios from 'axios'
import Select from 'react-select';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { toast } from 'react-toastify';
const PlanVsActualReport = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([])
    const [lineData, setLineDate] = useState([])
    const [selectedLine, setSelectedLine] = useState(null)
    const [floorData, setFloorData] = useState([])
    const [selectedFloor, setSelectedFloor] = useState(null)
    const [unitData, setUnitData] = useState([])
    const [selectedUnit, setSelectedUnit] = useState(null)
    const [processData, setProcessData] = useState([])
    const [selectedProcess, setSelectedProcess] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [fromDate, setFromDate] = useState(null)
    const [buyerList, setBuyerList] = useState([]);
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);

    const fetchProcessesData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view`, {
                params: { plan_process: 'plan_all_process' }
            });
            setProcessData(response.data.pro_data.map(item => ({ value: item.id, label: item.name })));
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to fetch processes data.');
        }
    };
    const fetchInitialData = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/finishing_planing/`);
            setIsLoading(false)
            setUnitData(response.data.location_data.map(item => ({ value: item.id, label: item.name })))
            setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));

        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };


    const handleBuyerChange = (selectedValue) => {
        setSelectedBuyer(selectedValue);
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
            // console.log(response.data)

            const styleOptions = responseData.map(item => ({ value: item.styleno, label: item.styleno, ourref: item.ourref }));
            setStyleNoData(styleOptions);
            setIsLoading(false);
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }


    useEffect(() => {
        fetchInitialData();
        fetchProcessesData();
    }, []);
    const handleUnitChange = (selectedValue) => {
        setSelectedUnit(selectedValue);
        fetchUniteData(selectedValue)
    };


    const fetchUniteData = (selectedValue) => {
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

    const handelSubmit = () => {
        setTableData([])
        setIsLoading(true)
        const postData = {
            line: selectedLine?.value || null,
            unit: selectedUnit.value,
            floor: selectedFloor?.value || null,
            to_date: toDate || null,
            from_date: fromDate || null,
            process: selectedProcess.value,
            buyer : selectedBuyer?.value || null,
            style : selectedStyle?.value || null,
        }
        const queryParams = new URLSearchParams(postData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/plan_vs_actual/?${queryParams}`).then((response) => {
            console.log("data rec", response.data)
            setTableData(response.data)
            setIsLoading(false)

        }).catch((error) => {
            console.log(error)
            setIsLoading(false)

        })
    }


    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('date', { header: 'Date', size: 10 }),
        columnHelper.accessor('unit_name', { header: 'Unit', size: 10 }),
        columnHelper.accessor('floor_name', { header: 'Floor', size: 10 }),
        columnHelper.accessor('line_name', { header: 'Line', size: 10 }),
        columnHelper.accessor('buyer_name', { header: 'Buyer', size: 10 }),
        columnHelper.accessor('style', { header: 'Style', size: 10 }),
        columnHelper.accessor('planned_quantity', { header: 'Plan QTY', size: 10 }),
        columnHelper.accessor('actual_quantity', { header: 'Actual QTY', size: 10 }),
        columnHelper.accessor('diff_quantity', { header: 'Difference', size: 10 }),

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
            density: 'compact'

        },
        enableRowSelection: true,
        enablePagination: false,
        enableStickyHeader: true,
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
                // zIndex:0
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

    return (
        <div className="p-4">
             <div className="w-full h-16 flex items-center justify-between bg-white p-4 shadow-md">
                <h1 className="text-xl font-semibold text-gray-800"> Plan Vs Actual Report</h1>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5  gap-4 mb-4">
                <div className="flex-1 max-w-xs">
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full border-2 border-gray-400 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:border-gray-600"
                    />
                </div>

                <div className="flex-1 max-w-xs">
                    <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full border-2 border-gray-400 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:border-gray-600"
                    />
                </div>

                <div className="flex-1 max-w-xs">
                    <label htmlFor="unitData" className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                    <Select
                        options={unitData}
                        value={selectedUnit}
                        onChange={handleUnitChange}
                        placeholder="Select Unit"
                        className="w-full border-2 z-30 border-gray-400 rounded-md shadow-sm"
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

                <div className="flex-1 max-w-xs">
                    <label htmlFor="floorData" className="block mb-1 text-sm font-medium text-gray-700">Floor</label>
                    <Select
                        options={floorData}
                        value={selectedFloor}
                        onChange={handleFloorChange}
                        placeholder="Select Floor"
                        className="w-full border-2 z-20 border-gray-400 rounded-md shadow-sm"
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

                <div className="flex-1 max-w-xs">
                    <label htmlFor="lineData" className="block mb-1 text-sm font-medium text-gray-700">Line</label>
                    <Select
                        options={lineData}
                        value={selectedLine}
                        onChange={setSelectedLine}
                        placeholder="Select Line"
                        className="w-full border-2 z-10 border-gray-400 rounded-md shadow-sm"
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

                {/* Row 2 */}
                <div className="flex-1 max-w-xs">
                    <label htmlFor="processData" className="block mb-1 text-sm font-medium text-gray-700">Process</label>
                    <Select
                        options={processData}
                        value={selectedProcess}
                        onChange={setSelectedProcess}
                        placeholder="Select Process"
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

                <div className="flex-1 max-w-xs">
                    <label htmlFor="buyerList" className="block mb-1 text-sm font-medium text-gray-700">Buyer</label>
                    <Select
                        options={buyerList}
                        value={selectedBuyer}
                        onChange={handleBuyerChange}
                        placeholder="Select Buyer"
                        className="w-full border-2 z-10 border-gray-400 rounded-md"
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

                <div className="flex-1 max-w-xs">
                    <label htmlFor="styleNoData" className="block mb-1 text-sm font-medium text-gray-700">Style No</label>
                    <Select
                        options={styleNoData}
                        value={selectedStyle}
                        onChange={setSelectedStyle}
                        placeholder="Select Style"
                        className="w-full border-2 z-10 border-gray-400 rounded-md"
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

                <div className="flex-1 max-w-xs">
                    <button
                        type="button"
                        onClick={handelSubmit}
                        className="bg-blue-600 text-white rounded-md mt-6 py-2 px-4 hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </div>
            </form>

            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>
        </div>

    )
}
export default PlanVsActualReport