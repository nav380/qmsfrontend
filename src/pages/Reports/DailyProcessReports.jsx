

import { Box, Button, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DjangoConfig from '../../config/Config';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/utils';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const DailyProcessReports = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [historyData, setHistoryData] = useState([])
    const [lineData, setLineData] = useState([])
    const [selectedLine, setSelectedLine] = useState(null)
    const [proData, setProData] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null);
    const [columns, setColumns] = useState([]);


    // const navigate = useNavigate()



    // const getSizeWiseReport = (id) => {
    //     const url = `/dashboard/reports/size-wise-report/?id=${encodeURIComponent(id)}`;
    //     navigate(url)
    // }
    const columnHelper = createMRTColumnHelper();
    
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
        fetchProcessesData();
        fetchTabLine()
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();

        setIsLoading(true);
        const data = {
            buyer: selectedBuyer?.value || '',         
            style: selectedStyle?.value || '',         
            color: selectedColor?.value ||null ,         
            ourref: selectedOurRef?.value || null,       
            process_id: selectedPro?.value || null,      
            line_id: selectedLine?.value ||null         
        };
        if (!data.buyer || !data.style) {
            toast.error('Buyer and Style are mandatory fields.');
            setIsLoading(false);
            return; 
        }
    
    
        const queryParams = new URLSearchParams(data).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/daily_process_report/?${queryParams}`)
            .then(response => {
                console.log(response.data);
                const allKeys = new Set();
                response.data.forEach(item => {
                    Object.keys(item).forEach(key => allKeys.add(key));
                });

                const dynamicColumns = Array.from(allKeys).map(key => 
                    columnHelper.accessor(key, {
                        header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
                        size: 5
                    })
                );
                setColumns(dynamicColumns);
                setHistoryData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setIsLoading(false);
            });
    };




    const fetchProcessesData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view/?`);
            setProData(response.data.pro_data.map(item => ({ value: item.id, label: item.name })));
            console.log("Process data", response.data);
        } catch (err) {
            console.log(err)
        }
    };



    const fetchTabLine = () => {
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_tab_login/`).then((response) => {
            setLineData(response.data.line_master_data.map(item => ({ value: item.id, label: item.name })));

        }).catch((error) => {
            console.log("error is ", error)
        })
    }


    const [buyers, setBuyers] = useState([]);
    const [styles, setStyles] = useState([]);
    const [ourRefs, setOurRefs] = useState([]);
    const [colors, setColors] = useState([]);

    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [selectedOurRef, setSelectedOurRef] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    const fetchFilterData = async (funCall, params = {}) => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/common_function/`, { params: { fun_call: funCall, ...params } });
            return response.data.response_data; // Adjust based on the actual response structure
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            const buyerData = await fetchFilterData('get_buyer');
            setBuyers(buyerData.map(item => ({ value: item.buyer, label: item.buyer_name })));
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        const fetchStyles = async () => {
            if (selectedBuyer) {
                setSelectedColor([])
                setSelectedStyle([])
                setSelectedOurRef([])

                const styleData = await fetchFilterData('get_style', { buyer: selectedBuyer.value });
                setStyles(styleData.map(item => ({ value: item.style, label: item.style })));
            }
        };

        fetchStyles();
    }, [selectedBuyer]);

    useEffect(() => {
        const fetchOurRefs = async () => {
            if (selectedBuyer && selectedStyle) {
                const ourRefData = await fetchFilterData('get_ourref', { buyer: selectedBuyer.value, style: selectedStyle.value });
                setOurRefs(ourRefData.map(item => ({ value: item.ourref, label: item.ourref })));
            }
        };

        fetchOurRefs();
    }, [selectedBuyer, selectedStyle]);

    useEffect(() => {
        const fetchColors = async () => {
            if (selectedBuyer && selectedStyle && selectedOurRef) {
                const colorData = await fetchFilterData('get_color', { buyer: selectedBuyer.value, style: selectedStyle.value, ourref: selectedOurRef.value });
                setColors(colorData.map(item => ({ value: item.color, label: item.color })));
            }
        };

        fetchColors();
    }, [selectedBuyer, selectedStyle, selectedOurRef]);


    return (
        <div>
            <div className="w-full h-16 flex items-center justify-between bg-white p-4 shadow-md">
                <h1 className="text-xl font-semibold text-gray-800"> Daily Process Reports</h1>
            </div>
            <div className="flex items-center space-x-2 bg-white p-2  border rounded-sm">
                <form onSubmit={handleSubmit} className="flex flex-col w-full  space-y-4">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="buyerData" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Buyer:
                            </label>
                            <Select
                                options={buyers}
                                value={selectedBuyer}
                                onChange={setSelectedBuyer}
                                placeholder="Select Buyer"
                                className="w-full border-2 z-20 border-gray-400 rounded-md"
                                isSearchable
                                isLoading={!buyers.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '14px',
                                        margin: 0,
                                        padding: 0,
                                    }),
                                }}
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="styleData" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Style:
                            </label>
                            <Select
                                options={styles}
                                value={selectedStyle}
                                onChange={setSelectedStyle}
                                isDisabled={!selectedBuyer}
                                placeholder="Select Style"
                                className="w-full border-2 z-20 border-gray-400 rounded-md"
                                isSearchable
                                isLoading={!styles.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '14px',
                                        margin: 0,
                                        padding: 0,
                                    }),
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="ourRefsData" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Our Ref:
                            </label>
                            <Select
                                options={ourRefs}
                                value={selectedOurRef}
                                onChange={setSelectedOurRef}
                                isDisabled={!selectedStyle}
                                placeholder="Select Our Ref"
                                className="w-full border-2 z-20 border-gray-400 rounded-md"
                                isSearchable
                                isLoading={!ourRefs.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '14px',
                                        margin: 0,
                                        padding: 0,
                                    }),
                                }}
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="colorsData" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Color:
                            </label>
                            <Select
                                options={colors}
                                value={selectedColor}
                                onChange={setSelectedColor}
                                isDisabled={!selectedOurRef}
                                placeholder="Select Color"
                                className="w-full border-2 z-20 border-gray-400 rounded-md"
                                isSearchable
                                isLoading={!colors.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '14px',
                                        margin: 0,
                                        padding: 0,
                                    }),
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4">
                       
                        <div className="flex-1">
                            <label htmlFor="lineData" className="block text-sm font-medium text-gray-700 mb-1">
                                Line
                            </label>
                            <Select
                                options={lineData}
                                value={selectedLine}
                                onChange={setSelectedLine}
                                placeholder="Line"
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
                                        margin: 0,
                                        padding: 0,
                                    }),
                                }}
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="proData" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Processes:
                            </label>
                            <Select
                                options={proData}
                                value={selectedPro}
                                onChange={setSelectedPro}
                                placeholder="Select Processes"
                                className="w-full border-2 z-10 border-gray-400 rounded-md"
                                isSearchable
                                isLoading={!proData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '14px',
                                        margin: 0,
                                        padding: 0,
                                    }),
                                }}
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="lineData" className="block text-sm h-4 font-medium text-gray-700 mb-1">

                            </label>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>


            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>


        </div >
    )
}

export default DailyProcessReports;


