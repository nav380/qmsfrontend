import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DjangoConfig from '../../config/Config';
import { saveRows } from "../../utils/slices/SewingInputSlice";
import { toast } from 'react-toastify';
import Select from 'react-select';
import Skeleton from "react-loading-skeleton";
import * as XLSX from 'xlsx';
// import { Button, Box } from '@mui/material'; // Import MUI components


const ProductionMaster = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userData = useSelector(state => state.user.userData);
    console.log(userData)
    const [tableData, setTableData] = useState([])
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [buyerList, setBuyerList] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedOrderno, setSelectedOrderno] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [colorData, setColorData] = useState([]);
    const [entry_date, setEntryDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef(null);

    // console.log("userData", userData)


    useEffect(() => {
        fetchOrderPlanData();

    }, [])

    const fetchOrderPlanData = () => {
        const userData = {
            buyer: selectedBuyer ? selectedBuyer.value : '',
            style: selectedStyle ? selectedStyle.value : '',
            orderno: selectedOrderno ? selectedOrderno.value : '',
            color: selectedColor ? selectedColor.value : '',
            start_date: startDate,
            end_date: endDate
        };
        console.log('userData', userData)
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/production_master_view/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const responseData = response.data.order_process_plan
                console.log('-------------------->', responseData)
                setTableData(responseData)
                setIsLoading(false)
                const entydateOptions = responseData.map(entrydate => (entrydate.entry_date));
                console.log('entydateOptions', entydateOptions)
                if (entydateOptions) {
                    const entrydate = entydateOptions.sort((a, b) => new Date(a) - new Date(b))[0];
                    setEntryDate(entrydate);
                }
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };
    // useEffect(() => {
    //     setStartDate(entry_date)
    // }, [entry_date])

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/production_master_view/`);
            setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer, label: item.buyer_name })));
            console.log('initialresponse', response.data.buyer_list)
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    // useState hook
    useEffect(() => {
        fetchInitialData();
    }, []);

    //1.h----> handle buyer selection
    const handleBuyerChange = (selectedValue) => {
        setSelectedBuyer(selectedValue);
        fetchByBuyer(selectedValue);
        setSelectedStyle(null)
        setSelectedOrderno(null)
        setSelectedColor(null)
        setStartDate('')
        setEndDate('')
        setStyleNoData([])
        setColorData([])
        setOrderData([])
        // setOrderQuantity(0)
        // setOrderQuantity(0)
        // setOrder_ex_qty(0)
        // setOrderDate(' ')
        // setTotalCutqty(0)
    };

    //2---> fetch style by buyer
    const fetchByBuyer = (selectedValue) => {
        const userData = { buyer_filter: selectedValue.value };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/production_master_view/?${queryParams}`)
            .then(response => {
                const responseData = response.data.all_data;
                console.log('fetchByBuyer----->', responseData)
                // const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
                const styleOptions = responseData.map(style => ({ value: style.style, label: style.style }));
                setStyleNoData(styleOptions);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };
    //2.h -------> handle style selection
    const handleStyleChange = (selectedValue) => {
        setSelectedStyle(selectedValue);
        fetchByStyle(selectedValue);
        setSelectedOrderno(null)
        setSelectedColor(null)
        setStartDate('')
        setEndDate('')
        setColorData([])
        setOrderData([])
        // setOrderQuantity(0)
        // setOrder_ex_qty(0)
        // setOrderDate(' ')
        // setTotalCutqty(0)
    };

    //3----------> fetch orderno by buyer and style 
    const fetchByStyle = (selectedValue) => {
        const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedValue.value };
        console.log('userData', userData)
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/production_master_view/?${queryParams}`,)
            .then(response => {
                const responseData = response.data.all_data;
                console.log('fetchByStyle----->', responseData)
                const uniqueOrderno = [...new Set(responseData.map(item => item.ourref))];
                const orderOptions = uniqueOrderno.map(order => ({ value: order, label: order }));
                setOrderData(orderOptions);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    //3.h--------> handle orderno selection
    const handleOrderno = (selectedValue) => {
        setSelectedOrderno(selectedValue);
        fetchByOrderno(selectedValue);
        setSelectedColor(null)
        setStartDate('')
        setEndDate('')
        setColorData([])
        // setOrderQuantity(0)
        // setOrder_ex_qty(0)
        // setOrderDate(' ')
        // setTotalCutqty(0)
    };

    //4-------> Fetch color,total quantityData, orderDate by buyer, style and orderno 
    const fetchByOrderno = (selectedValue) => {
        const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedStyle.value, orderno_filter: selectedValue.value };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/production_master_view/?${queryParams}`,)
            .then(response => {
                const responseData = response.data.all_data;
                //  color list maping 
                const uniqueColor = [...new Set(responseData.map(item => item.color))];
                const colorOptions = uniqueColor.map(color => ({ value: color, label: color }));
                setColorData(colorOptions);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };
    // 4.h-----------> handle color selection
    const handleColor = (selectedValue) => {
        setSelectedColor(selectedValue);
        // fetchOrderPlanData(selectedValue)
        // fetchByColor(selectedValue);
    };

    // const handleSearch = () => {
    //     fetchOrderPlanData();
    // };





    //5-------> Fetch size data by buyer, style and orderno and color 
    // const fetchByColor = (selectedValue) => {
    //     const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedStyle.value, ourref_filter: selectedOrderno.value, color_filter: selectedValue.value };
    //     const queryParams = new URLSearchParams(userData).toString();
    //     axios.get(`${DjangoConfig.apiUrl}/rtqm/cutting_helper_data/?${queryParams}`,)
    //         .then(response => {
    //             const responseData = response.data;
    //             // const responseData1 = response.data.prviouscutData;
    //             // setPreqcutMtData(responseData.prevcutMtData);
    //             // setPreqSizeBreakup(responseData.prevcutDtData);
    //             // // order Quantity setting
    //             // setOrderQuantity(responseData1.totalqty)
    //             // setOrder_ex_qty(responseData1.order_ex_qty)
    //             // const sizeOptions = responseData1.colorbysize.map(size => ({ value: size.sizeval, label: size.sizeval, qty: size.qty, ex_qty: size.ex_qty }));

    //             // /
    //             // const totalcutqty = responseData.prevcutMtData.map(item => setTotalCutqty(item.totalqty || 0))
    //             // console.log('totalcutqty', totalcutqty)
    //             // //  Fabric list maping 
    //         })
    //         .catch(error => {
    //             console.error('Error fetching filtered data:', error);
    //         });
    // };

    const handleExportRows = (rows) => {
        try {
            if (rows && rows.length > 0 && rows[0].original) {
                const rowData = rows[0].original;
                // console.log("rowData",rowData, typeof(rowData))
                const updatedObject = {
                    ...rowData,
                    start_date: startDate,    // Purane object ko spread karna
                    end_date: endDate         // Nayi key-value pair add karna
                };

                dispatch(saveRows(updatedObject));
                console.log("Planing Data", updatedObject)
                navigate('/dashboard/reports/pro-help/');
                toast.success(`Production help`);
            } else {
                console.error('Invalid')
            }

        } catch (error) {
            console.log(error)
        }

    }

    const columnHelper = createMRTColumnHelper();
    const columnnamearray = ['buyer_name', 'style', 'ourref', 'color', 'order_qty', 'order_ex_qty', 'orderdate', 'delvdate'];

    // Create static columns from columnnamearray
    const staticColumns = columnnamearray.map((colName) =>
        columnHelper.accessor(colName, {
            header: colName.charAt(0).toUpperCase() + colName.slice(1).replace('_', ' '),
            size: 100,
        })
    );

    // Get dynamic column names from tableData
    const dynamicColumnNames = tableData.length > 0 ? Object.keys(tableData[0]) : [];

    // Create dynamic columns, excluding those present in columnnamearray and 'buyer_name'
    const dynamicColumns = dynamicColumnNames
        .filter((colName) => !columnnamearray.includes(colName) && colName !== 'buyer') // Exclude 'buyer_name' and static columns
        .map((colName) =>
            columnHelper.accessor(colName, {
                header: colName.charAt(0).toUpperCase() + colName.slice(1).replace('_', ' '),
                size: 100,
            })
        );

    // Merge static and dynamic columns
    const columns = [...staticColumns, ...dynamicColumns];

    // export file in xecell file format using xlsx package 
    const exportToExcel = (tableData) => {
        const worksheet = XLSX.utils.json_to_sheet(tableData); // Convert JSON data to worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "TableData"); // Append the worksheet
        XLSX.writeFile(workbook, "table_data.xlsx"); // Export the file as table_data.xlsx
    };

    // Correctly map the accessor keys to your data fields

    const table = useMaterialReactTable({
        columns,
        data: tableData,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        enableMultiRowSelection: false,
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '10px',
                    padding: '4px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    disabled={
                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    className="text-2xl font-bold"
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Show Data
                </Button>

                {/* Add a new button for exporting to Excel */}
                <Button
                    className="text-2xl font-bold"
                    onClick={() => exportToExcel(tableData)} // Call export function here
                    startIcon={<FileDownloadIcon />}
                >
                    Export to Excel
                </Button>
            </Box>
        ),
    });

    return (
        <div>
            <div className='text-2xl font-bold pl-5'>Main Report : Style Transaction Summery Report</div>
            {/* <form ref={formRef} className="pb-2"> */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-5 mb-2 pl-5 pr-5">
                <div className="'w-full h-12 flex items-center justify-between  pt-2 mb-4 mt-4">
                    <div className='w-64 h-12 mr-2'>
                        <label htmlFor="buyerList">Buyer</label>
                        <Select
                            options={buyerList}
                            value={selectedBuyer}
                            onChange={handleBuyerChange}
                            name="buyer"
                            placeholder="Select Buyer"
                            className="w-full border-2 z-10 border-gray-300 rounded-md outline-none"
                            isSearchable
                            isLoading={!buyerList.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                    borderColor: '#d1d5db', // Light gray border color
                                }),
                            }}
                        />
                    </div>
                    <div className='w-64 h-12 mr-2'>
                        <label htmlFor="styleNoData">Style No</label>
                        <Select
                            options={styleNoData}
                            value={selectedStyle}
                            onChange={handleStyleChange}
                            name="style_no"
                            placeholder="Select Style"
                            className="w-full z-10 border-2 border-gray-300 rounded-md"
                            isSearchable
                            isLoading={!styleNoData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                    borderColor: '#d1d5db', // Light gray border color
                                }),
                            }}
                        />
                    </div>
                    <div className='w-64 h-12 mr-2'>
                        <label htmlFor="orderData">Order No</label>
                        <Select
                            options={orderData}
                            value={selectedOrderno}
                            onChange={handleOrderno}
                            placeholder="Select Order No"
                            className="w-full z-10 border-2 border-gray-300 rounded-md"
                            isSearchable
                            isLoading={!orderData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                    borderColor: '#d1d5db', // Light gray border color
                                }),
                            }}
                        />
                    </div>
                    <div className='w-64 h-12 mr-2'>
                        <label htmlFor="colorData">Color</label>
                        <Select
                            options={colorData}
                            value={selectedColor}
                            onChange={handleColor}
                            placeholder="Select Color"
                            className="w-full z-15 border-2 border-gray-300 rounded-md"
                            isSearchable
                            isLoading={!colorData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                    borderColor: '#d1d5db', // Light gray border color
                                }),
                            }}
                        />
                    </div>
                </div>
                <div className='w-full h-10 flex items-center justify-between rounded-lg pr-8 pt-2 mb-4 mt-6'>
                    <div className="mb-4">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Start Date:
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            className="w-64 h-12 border-2 border-gray-300 rounded-md pl-2"
                            // className="block w-full bg-white border border-slate-300 rounded-md py-2 px-4 shadow-sm"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 ml-5">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Select End Date:
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            className="w-64 h-12 border-2 border-gray-300 rounded-md pl-2"
                            // className="block w-full bg-white border border-slate-300 rounded-md py-2 px-4 shadow-sm"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 ml-10 mt-6">
                        <button className=" w-48  btn h-8 btn-primary" onClick={fetchOrderPlanData}>Search</button>
                    </div>
                </div>
            </div>
            {/* </form> */}
            {isLoading ? (
                <div className='mt-2'>
                    <div className='text-center text-2xl font-bold  text-gray-500'>Loading ....</div>
                </div>
            ) : (
                <div className='mt-2'>
                    <MaterialReactTable table={table} />
                </div>
            )
            }
        </div>
    );
};

export default ProductionMaster;
