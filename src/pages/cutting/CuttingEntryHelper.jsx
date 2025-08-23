import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DjangoConfig from '../../config/Config';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";



const CuttingEntryHelper = () => {
    const navigate = useNavigate()
    // const location = useLocation()
    // const {id} = location.state || {}
    const location = useLocation();
    const { id } = location.state || {};

    const [data, setData] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [buyerList, setBuyerList] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedOrderno, setSelectedOrderno] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [colorData, setColorData] = useState([]);
    const [orderQuantity, setOrderQuantity] = useState(0);
    const [order_ex_qty, setOrder_ex_qty] = useState(0);
    const [selectedcuttingtype, setSelectedCuttingtype] = useState(null);
    const [totalcutqty, setTotalCutqty] = useState(0);
    const [orderDate, setOrderDate] = useState('');
    const formRef = useRef(null);
    const [sizeData, setSizeData] = useState([]);
    const [preqcutMtData, setPreqcutMtData] = useState([]);
    const [preqsizebreakup, setPreqSizeBreakup] = useState([]);



    const columnHelper = createMRTColumnHelper();

    const createArray = () => {
        let dataArray = [];
        if (Array.isArray(sizeData) && sizeData.length > 0) {
            dataArray = sizeData.map((item) => {
                let totalcutqty = 0;
                if (Array.isArray(preqsizebreakup) && preqsizebreakup.length > 0) {
                    const preqcutMtData1 = preqsizebreakup.find(item1 => item1.size === item.value);
                    totalcutqty = preqcutMtData1 ? preqcutMtData1.cutpcs || 0 : 0;
                }
                // console.log(typeof(item.ex_qty), item.ex_qty,typeof(totalcutqty), totalcutqty)
                return {
                    size: item.value,
                    ex_totalqty: item.ex_qty,
                    totalqty: item.qty,
                    totalcutqty: totalcutqty,
                    remaincutqty: Number(item.ex_qty) - totalcutqty
                };
            });
        }
        return dataArray;
    };

    console.log('Final data Sizewise --->', data)

    const getprevioussavecutMtData = () => {
        try {
            if (selectedBuyer && selectedStyle && selectedOrderno && selectedColor) {
                const userData = {
                    buyer: selectedBuyer.value,
                    style: selectedStyle.value,
                    orderno: selectedOrderno.value,
                    color: selectedColor.value,
                    cutting_type: selectedcuttingtype.value,
                };
                const queryParams = new URLSearchParams(userData).toString();
                axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
                    .then(response => {
                        const respondData = response.data.getMtDtSaveData;
                        console.log('getprevioussavecutMtData=======>', respondData);
                        setPreqcutMtData(respondData.getcuttMtData);
                        setPreqSizeBreakup(respondData.getcutDtData);
                        const totalcutqty = respondData.getcuttMtData.map(item => setTotalCutqty(item.totalqty || 0))
                        console.log('totalcutqty', totalcutqty)
                    })
                    .catch((e) => {
                        console.log("Data fetching error");
                    });
            }
        } catch (e) {
            console.error("Error in getprevioussavecutMtData:", e);
        }
    };
    useEffect(() => {
        const newData = createArray();
        setData(newData);
    }, [selectedBuyer, selectedStyle, selectedOrderno, selectedColor, sizeData, preqcutMtData, preqsizebreakup])

    useEffect(() => {
        getprevioussavecutMtData()
    }, [selectedOrderno, selectedColor, selectedcuttingtype])

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
            setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));
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
        setOrderQuantity(0)
        setOrder_ex_qty(0)
        setOrderDate(' ')
    };

    //2---> fetch style by buyer
    const fetchByBuyer = (selectedValue) => {
        const userData = { buyer_filter: selectedValue.value };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/excel_data_show_view/?${queryParams}`)
            .then(response => {
                const responseData = response.data.data;
                console.log('fetchByBuyer----->', responseData)
                const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
                const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
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
        setOrderQuantity(0)
        setOrder_ex_qty(0)
        setOrderDate(' ')
    };

    //3----------> fetch orderno by buyer and style 
    const fetchByStyle = (selectedValue) => {
        const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedValue.value };
        // console.log('userData ---------->', userData);
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
            .then(response => {
                const responseData = response.data.data;
                console.log('fetchByStyle-------->', responseData);
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
        setOrderQuantity(0)
        setOrder_ex_qty(0)
        setOrderDate(' ')
    };

    //4-------> Fetch color,total quantityData, orderDate by buyer, style and orderno 
    const fetchByOrderno = (selectedValue) => {
        const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedStyle.value, orderno_filter: selectedValue.value };
        // console.log('userData ---------->', userData);
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
            .then(response => {
                const responseData = response.data.data;
                const responseData1 = response.data.data1
                // const responseData2 = response.data.data1.data
                console.log('fetchByOrderno------->', responseData1);
                //  color list maping 
                const uniqueColor = [...new Set(responseData.map(item => item.color))];
                const colorOptions = uniqueColor.map(color => ({ value: color, label: color }));
                // console.log('colorOptions --------->', colorOptions)
                setColorData(colorOptions);

            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };
    // 4.h-----------> handle color selection
    const handleColor = (selectedValue) => {
        setSelectedColor(selectedValue);
        fetchByColor(selectedValue);
        setOrderQuantity(0)
        setOrder_ex_qty(0)
        setOrderDate(' ')
    };

    //5-------> Fetch size data by buyer, style and orderno and color 
    const fetchByColor = (selectedValue) => {
        const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedStyle.value, orderno_filter: selectedOrderno.value, color_filter: selectedValue.value };
        // console.log('userData ---------->', userData);
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
            .then(response => {
                const responseData = response.data.data1;
                console.log('fetchByColor-------->', responseData)
                // order Quantity setting
                setOrderQuantity(responseData.totalqty)
                setOrder_ex_qty(responseData.order_ex_qty)
                // orderdate setting
                setOrderDate(responseData.orderdaye[0].orderdate)
                // color by size maping
                // const uniquesize = [...new Set(responseData.colorbysize.map(item => item.sizeval))];
                const sizeOptions = responseData.colorbysize.map(size => ({ value: size.sizeval, label: size.sizeval, qty: size.qty, ex_qty: size.ex_qty }));
                setSizeData(sizeOptions);
                createArray()
                //  Fabric list maping 
                // const fabricOptions = responseData.fabricdetail.map(item => ({ value: item.ITEM, label: `${item.description}(${item.fabcolor})` }));
                // console.log('fabricOptions --------->', fabricOptions)
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const cuttingtypeOptions = [
        { label: "Main body", value: "Main body" },
        { label: "trim", value: "trim" },

    ];
    const handleCuttingtype = (selectedValue) => {
        setSelectedCuttingtype(selectedValue);
        setSelectedStyle(null)
        setSelectedOrderno(null)
        setSelectedColor(null)
        setOrderQuantity(0)
        setOrder_ex_qty(0)
        setOrderDate(' ')
        setTotalCutqty(0)

    };


    // Correctly map the accessor keys to your data fields
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('size', { header: 'Size', size: 100, style: { align: "center" } }),
        columnHelper.accessor('totalqty', { header: 'Totalpcs', size: 120 }),
        columnHelper.accessor('ex_totalqty', { header: 'Ex_Totalpcs', size: 120 }),
        columnHelper.accessor('totalcutqty', { header: 'Totalcutcs', size: 120 }),
        columnHelper.accessor('remaincutqty', { header: 'Balance Cutpcs', size: 120 }),
        // columnHelper.accessor('updated_at', { header: 'Updated_at', size: 120 }),
        // columnHelper.accessor('cuttingno', { header: 'Cutting No', size: 120 }),
        // columnHelper.accessor('id', { header: 'ID', size: 40 }),
        // columnHelper.accessor('cutting_mt_id', { header: 'cutting_mt', size: 120 }),
    ];

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    // const handleExportData = () => {
    //     const csv = generateCsv(csvConfig)(data);
    //     download(csvConfig)(csv);
    // };

    const table = useMaterialReactTable({
        columns,
        data,
        // enableRowSelection: true,
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                {/* <Button
                    onClick={handleExportData}
                    startIcon={<FileDownloadIcon />}
                >
                    Export All Data
                </Button> */}
            </Box>
        ),
    });

    const obTablePage = () => {
        navigate('/dashboard/cutting_route/cutting1/')
    }

    return (
        <>
            <section className="bg-white">
                <div className='w-full h-10 flex items-center justify-between z-10 rounded-lg pl-3 pr-8 pt-2 mb-4 '>
                    <div className="text-2xl mb-1 text-slate-950 font-bold">
                        Size Wise Cutting Quantity (Layer)
                    </div>
                    <div>
                        <Button
                            onClick={obTablePage}
                            variant="contained"
                            color="primary"
                            className="float-right mr-2 "
                        >
                            Back
                        </Button>
                    </div>
                </div>
                {/*==================================== first form ================================================ */}
                <div className="pl-6 pr-8 bg-white">
                    {/* onSubmit={saveData} */}
                    <form ref={formRef} className="pb-2">
                        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-5 mb-2">
                            <div>
                                <label htmlFor="colorData">Cutting Type</label>
                                <Select
                                    options={cuttingtypeOptions}
                                    value={selectedcuttingtype}
                                    onChange={handleCuttingtype}
                                    placeholder="Select cutting type"
                                    className="w-full border-2 z-30 border-gray-300 rounded-md"
                                    isSearchable
                                    isLoading={!cuttingtypeOptions.length}
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

                            <div>
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
                                            height: '30px',
                                            fontSize: '12px',
                                            borderColor: '#d1d5db', // Light gray border color
                                        }),
                                    }}
                                />
                            </div>
                            <div>
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
                                            height: '30px',
                                            fontSize: '12px',
                                            borderColor: '#d1d5db', // Light gray border color
                                        }),
                                    }}
                                />
                            </div>
                            <div>
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
                                            height: '30px',
                                            fontSize: '12px',
                                            borderColor: '#d1d5db', // Light gray border color
                                        }),
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="colorData">Color</label>
                                <Select
                                    options={colorData}
                                    value={selectedColor}
                                    onChange={handleColor}
                                    placeholder="Select Color"
                                    className="w-full z-10 border-2 border-gray-300 rounded-md"
                                    isSearchable
                                    isLoading={!colorData.length}
                                    loadingMessage={() => <Skeleton count={5} />}
                                    isClearable
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            height: '30px',
                                            fontSize: '12px',
                                            borderColor: '#d1d5db', // Light gray border color
                                        }),
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="orderQuantity">Order Quantity</label><br/>
                                <input
                                    type="number"
                                    id="orderQuantity"
                                    value={orderQuantity}
                                    // onChange={(e) => setOrderQuantity(e.target.value)}
                                    className="w-36 h-10 border-2 border-gray-300 rounded-md p-2 outline-none "
                                />
                            </div>
                            <div>
                                <label htmlFor="orderQuantity">Order_ex_Qty</label><br/>
                                <input
                                    type="number"
                                    id="orderQuantity"
                                    value={order_ex_qty}
                                    // onChange={(e) => setOrderQuantity(e.target.value)}
                                    className="w-36 h-10 border-2 border-gray-300 rounded-md p-2 outline-none "
                                />
                            </div>
                            <div>
                                <label htmlFor="orderQuantity">Total Cut Qty</label><br/>
                                <input
                                    type="number"
                                    id="orderQuantity"
                                    value={totalcutqty}
                                    readOnly
                                    // onChange={(e) => setOrderQuantity(e.target.value)}
                                    className="w-36 h-10 border-2 border-gray-300 rounded-md p-2 outline-none "
                                />
                            </div>

                        </div>
                    </form>
                </div>
                <div>
                    <MaterialReactTable table={table} style={{ paddingLeft: '10px', paddingRight: '10px' }} />
                </div>
            </section>

        </>
    );
};

export default CuttingEntryHelper;
