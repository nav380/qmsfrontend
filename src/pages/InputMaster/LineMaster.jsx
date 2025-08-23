// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { Box, Button, Menu, MenuItem } from '@mui/material';
// import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
// import Skeleton from 'react-loading-skeleton';
// import { toast } from 'react-toastify';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';
// import DjangoConfig from '../../config/Config';
// import { saveRows } from '../../utils/slices/SewingInputSlice';

// import Select from 'react-select';


// const LineMaster = () => {
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const userData = useSelector(state => state.user.userData);
//     const [tableData, setTableData] = useState([])
//     const sewingPlanData = useSelector(state => state.sewingInput.rowData);
//     const [cuttingData,setCuttingData]= useState([])
//     const [buyerList, setBuyerList] = useState([]);
//     const [refData, setRefData] = useState([]);
//     const [styleNoData, setStyleNoData] = useState([]);
//     const [selectedBuyer, setSelectedBuyer] = useState(null);
//     const [selectedRef, setSelectedRef] = useState(null);
//     const [selectedStyle, setSelectedStyle] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [colorData, setColorData] = useState([])
//     const [selectedColor, setSelectedColor] = useState(null)
//     const [delvdateData,setDelvdateData] = useState([]) 
//     const [selectedDelvdate,setSelectedDelvDate] = useState(null)
//     console.log("userData", userData)

//     useEffect(() => {
//         fetchCuttingData()
//     }, [])

//     const fetchTableData = () => {
//         const userData2 = {
//             id: userData?.line_id || "",
//             process_id: userData.process_id,
//             section_id: userData.section_id,
//             buyer : selectedBuyer.value,
//             color : selectedColor.value,
//             ourref : selectedRef.value,
//             style : selectedStyle.value,
//             delvdate : selectedDelvdate.value
//         };
//         const queryParams = new URLSearchParams(userData2).toString();
//         let url = '';

//         if (userData.section_name === 'Finishing - Input') {
//             url = `${DjangoConfig.apiUrl}/rtqm/finishing_input_view/?${queryParams}`;
//         }
//         else if (userData.section_name === 'Stitching - Input') {
//             url = `${DjangoConfig.apiUrl}/rtqm/cutting_master/?${queryParams}`;
//         }
//         else if (userData.section_name === 'Kaj Button - Input') {
//             url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/?${queryParams}`;
//         } else {
//             console.error('Unknown process_name:', userData.section_name);
//             return;
//         }
//         axios.get(url, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => {
//                 const responseData = response.data.filter_buyer
//                 console.log(response.data)
//                 setTableData(responseData)
//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };

//     const handleExportRows = (rows) => {
//         try {
//             if (rows && rows.length > 0 && rows[0].original) {
//                 const rowData = rows[0].original;
//                 console.log("rowData", rowData)
//                 localStorage.setItem('cuttingData', JSON.stringify(rowData));
//                 dispatch(saveRows(rowData));
//                 console.log("Cutting Data", rowData)
//                 if (userData.section_name === 'Kaj Button - Input') {
//                     navigate('/input-master/select-quantity-by-master');
//                 }
//                 else {
//                     navigate('/input-master/select-quantity-by-master');

//                 }
//             } else {
//                 console.error('Invalid rows or missing "original" property');
//             }
//         } catch (error) {
//             console.error('Error saving rows:', error);
//         }
//     };

//     const columnHelper = createMRTColumnHelper();
//     const columns = [
//         columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
//         columnHelper.accessor('buyer_name', { header: 'Buyer', size: 20 }),
//         columnHelper.accessor('style', { header: 'Style No', size: 20 }),
//         columnHelper.accessor('color', { header: 'Color ', size: 20 }),
//         columnHelper.accessor('totalqty', { header: 'Total  Qty', size: 20 }),
//         columnHelper.accessor('orderqty', { header: 'OrderQuantity', size: 20 }),
//         columnHelper.accessor('delvdate', { header: 'Delivery Date', size: 20 }),
//     ];



//     const table = useMaterialReactTable({
//         columns,
//         data: tableData,
//         // state: {
//         //   isLoading:  isLoading ? <Skeleton count={5} /> : null,

//         // },
//         enableRowSelection: true,
//         columnFilterDisplayMode: 'popover',
//         paginationDisplayMode: 'pages',
//         positionToolbarAlertBanner: 'bottom',
//         enableMultiRowSelection: false,
//         renderTopToolbarCustomActions: ({ table }) => (
//             <Box
//                 sx={{
//                     display: 'flex',
//                     gap: '10px',
//                     padding: '4px',
//                     flexWrap: 'wrap',
//                     style: { fontSize: '5px' },
//                 }}
//             >


//                 <Button
//                     disabled={
//                         !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
//                     }
//                     //only export selected rows
//                     onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
//                     startIcon={<FileDownloadIcon />}
//                 >
//                     Save Data
//                 </Button>
//             </Box>
//         ),
//     });





//     const fetchCuttingData =()=>{
//         const userData2 = {
//             id: userData?.line_id || "",
//             process_id: userData.process_id,
//             section_id: userData.section_id,
//         };
//         const queryParams = new URLSearchParams(userData2).toString();
//         let url = `${DjangoConfig.apiUrl}/rtqm/cutting_master/?${queryParams}`;

       
//         axios.get(url, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => {
//                 const responseData = response.data.cutMtdata
//                 console.log("cutting all data",response.data)
//                 setCuttingData(responseData)
//             setBuyerList(response.data.cutMtdata.map(item => ({ value: item.buyer, label: item.buyer_name })));

//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     }

    
//     const handleBuyerChange = (selectedValue) => {
//         if (selectedValue) {
//             setSelectedBuyer(selectedValue);
//             const filteredData = cuttingData.filter(item => item.buyer === selectedValue.value);
//             console.log("buyer filteredData",filteredData)
//             setRefData(filteredData.map(item => ({ value: item.ourref, label: item.ourref })));
//         }
//     };

//     const handleRefChange = (selectedValue) => {
//         if (selectedValue) {
//             setSelectedRef(selectedValue);
//             const filteredData = cuttingData.filter(item => item.ourref === selectedValue.value);
//             setStyleNoData(filteredData.map(item => ({ value: item.style, label: item.style })));
//             setColorData(filteredData.map(item => ({ value: item.color, label: item.color })));
//         }
//     };

//     const handleColorChange = (selectedValue) => {
//         if (selectedValue) {
//             setSelectedColor(selectedValue);
//             const filteredData = cuttingData.filter(item => item.color === selectedValue.value);
//             setDelvdateData(filteredData.map(item => ({ value: item.delvdate, label: item.delvdate })));
//         }
//     };
//     return (
//         <div>

//             <form onSubmit={fetchTableData} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5  gap-4 mb-4">
//                 <div>
//                     <label htmlFor="buyerList"> Buyer</label>
//                     <Select
//                         options={buyerList}
//                         value={selectedBuyer}
//                         onChange={handleBuyerChange}
//                         placeholder="Select Buyer"
//                         className="w-full border-2 z-50 border-gray-400 rounded-md"
//                         isSearchable
//                         isLoading={!buyerList.length}
//                         loadingMessage={() => <Skeleton count={5} />}
//                         styles={{
//                             control: (provided) => ({
//                                 ...provided,
//                                 height: '40px',
//                                 fontSize: '12px',
//                             }),
//                         }}
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="refdata"> Ref</label>
//                     <Select
//                         options={refData}
//                         value={selectedRef}
//                         onChange={handleRefChange}
//                         placeholder="Select Ref"
//                         className="w-full border-2 z-40 border-gray-400 rounded-md"
//                         isSearchable
//                         isLoading={!refData.length}
//                         isClearable
//                         loadingMessage={() => <Skeleton count={5} />}
//                         styles={{
//                             control: (provided) => ({
//                                 ...provided,
//                                 height: '40px',
//                                 fontSize: '12px',
//                             }),
//                         }}
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="styleNoData">Style No</label>
//                     <Select
//                         options={styleNoData}
//                         value={selectedStyle}
//                         onChange={setSelectedStyle}
//                         placeholder="Select Style"
//                         className="w-full border-2 z-30 border-gray-400 rounded-md"
//                         isSearchable
//                         isLoading={!styleNoData.length}
//                         loadingMessage={() => <Skeleton count={5} />}
//                         isClearable
//                         styles={{
//                             control: (provided) => ({
//                                 ...provided,
//                                 height: '40px',
//                                 fontSize: '12px',
//                             }),
//                         }}
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="colorData">Color</label>
//                     <Select
//                         options={colorData}
//                         value={selectedColor}
//                         onChange={handleColorChange}
//                         placeholder="Select Color"
//                         className="w-full border-2 z-20 border-gray-400 rounded-md"
//                         isSearchable
//                         isLoading={!colorData.length}
//                         loadingMessage={() => <Skeleton count={5} />}
//                         isClearable
//                         styles={{
//                             control: (provided) => ({
//                                 ...provided,
//                                 height: '40px',
//                                 fontSize: '12px',
//                             }),
//                         }}
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="delvDate">Delivery Date</label>
//                     <Select
//                         options={delvdateData}
//                         value={selectedDelvdate}
//                         onChange={setSelectedDelvDate}
//                         placeholder="Select Date"
//                         className="w-full border-2 z-20 border-gray-400 rounded-md"
//                         isSearchable
//                         isLoading={!colorData.length}
//                         loadingMessage={() => <Skeleton count={5} />}
//                         isClearable
//                         styles={{
//                             control: (provided) => ({
//                                 ...provided,
//                                 height: '40px',
//                                 fontSize: '12px',
//                             }),
//                         }}
//                     />
//                 </div>
//                 <div>

//                     <button type='submit' className='btn btn-primary'>
//                         Submit
//                     </button>
//                 </div>
//             </form>



//             <div className='mt-2'>
//                 <MaterialReactTable table={table} />
//             </div>

//         </div>
//     );
// };

// export default LineMaster;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DjangoConfig from '../../config/Config';
import { saveRows } from '../../utils/slices/SewingInputSlice';

import Select from 'react-select';

const LineMaster = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.user.userData);
    const [tableData, setTableData] = useState([]);
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);
    const [cuttingData, setCuttingData] = useState([]);
    const [buyerList, setBuyerList] = useState([]);
    const [refData, setRefData] = useState([]);
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedRef, setSelectedRef] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [colorData, setColorData] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [delvdateData, setDelvdateData] = useState([]);
    const [selectedDelvdate, setSelectedDelvDate] = useState(null);
    console.log("userData", userData);

    useEffect(() => {
        fetchCuttingData();
    }, []);

    const fetchTableData = (event) => {
        event.preventDefault(); // Prevent page refresh
        const userData2 = {
            id: userData?.line_id || "",
            process_id: userData.process_id,
            section_id: userData.section_id,
            buyer: selectedBuyer?.value,
            buyer_name: selectedBuyer?.label,

            color: selectedColor?.value,
            ourref: selectedRef?.value,
            style: selectedStyle?.value,
            delvdate: selectedDelvdate?.value

        };
        const queryParams = new URLSearchParams(userData2).toString();
        let url = '';

        if (userData.section_name === 'Finishing - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/?${queryParams}`;
        } else if (userData.section_name === 'Stitching - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/stitching_input_view/?${queryParams}`;
        } else if (userData.section_name === 'Kaj Button - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/?${queryParams}`;
        }
        else if (userData.section_name === 'Washing - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/?${queryParams}`;
        } 
        else if (userData.section_name === 'Packing - MD Point') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/?${queryParams}`;
        } 
        else {
            console.error('Unknown process_name:', userData.section_name);
            return;
        }
        axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const responseData = response.data.filter_buyer;
                console.log("------------------------",response.data.filter_buyer);
                setTableData(response.data.filter_buyer);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    console.log("tableData",tableData)

    const handleExportRows = (rows) => {
        try {
            if (rows && rows.length > 0 && rows[0].original) {
                const rowData = rows[0].original;
                const sewingData = {
                    id : rowData.id,
                    buyer: rowData.buyer,
                    style: rowData.style,
                    color: rowData.color,
                    totalqty: rowData.totalqty,
                    delvdate: rowData.delvdate,
                    line_id: userData.line_id,
                    line_name: userData.line_name,
                    ourref :rowData.ourref,
                    buyer_name : rowData.buyer_name,
                    process_name: userData.process_name,
                    process_id:userData.process_id,
                    section_name : userData.section_name,
                    section_id: userData.section_id,
                    cutting_id : rowData.cutting_id

                };
                localStorage.setItem('cuttingData', JSON.stringify(sewingData));
                dispatch(saveRows(sewingData));
                console.log("Cutting Data", sewingData);
                if (userData.section_name === 'Kaj Button - Input') {
                    navigate('/input-master/select-quantity-by-master');
                } else {
                    navigate('/input-master/select-quantity-by-master');
                }
            } else {
                console.error('Invalid rows or missing "original" property');
            }
        } catch (error) {
            console.error('Error saving rows:', error);
        }
    };

    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('buyer_name', { header: 'Buyer', size: 20 }),
        columnHelper.accessor('style', { header: 'Style No', size: 20 }),
        columnHelper.accessor('color', { header: 'Color', size: 20 }),
        columnHelper.accessor('ourref', { header: 'Our Ref', size: 20 }),
        columnHelper.accessor('totalqty', { header: 'Total Quantity', size: 20 }),

      ];

    const table = useMaterialReactTable({
        columns:columns,
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
                    style: { fontSize: '5px' },
                }}
            >
                <Button
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Save Data
                </Button>
            </Box>
        ),
    });

    const fetchCuttingData = () => {
        const userData2 = {
            id: userData?.line_id || "",
            process_id: userData.process_id,
            section_id: userData.section_id,
        };
        const queryParams = new URLSearchParams(userData2).toString();
        let url = `${DjangoConfig.apiUrl}/rtqm/cutting_buyer_data/?${queryParams}`;

        axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const responseData = response.data.cutMtdata;
                // console.log("cutting all data", response.data);
                setCuttingData(responseData);
                setBuyerList(responseData.map(item => ({ value: item.buyer, label: item.buyer_name })));
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const handleBuyerChange = (selectedValue) => {
        if (selectedValue) {
            setSelectedBuyer(selectedValue);
            const filteredData = cuttingData.filter(item => item.buyer === selectedValue.value);
            console.log("buyer filteredData", filteredData);
            setRefData(filteredData.map(item => ({ value: item.ourref, label: item.ourref })));
        }
    };

    const handleRefChange = (selectedValue) => {
        if (selectedValue) {
            setSelectedRef(selectedValue);
            const filteredData = cuttingData.filter(item => item.ourref === selectedValue.value);
            setStyleNoData(filteredData.map(item => ({ value: item.style, label: item.style })));
            setColorData(filteredData.map(item => ({ value: item.color, label: item.color })));
        }
    };

    const handleColorChange = (selectedValue) => {
        if (selectedValue) {
            setSelectedColor(selectedValue);
            const filteredData = cuttingData.filter(item => item.color === selectedValue.value);
            setDelvdateData(filteredData.map(item => ({ value: item.delvdate, label: item.delvdate })));
        }
    };

    return (
        <div>
            <div>
                {userData.line_name}
            </div>
            <form onSubmit={fetchTableData} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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
                    <label htmlFor="refdata"> Ref</label>
                    <Select
                        options={refData}
                        value={selectedRef}
                        onChange={handleRefChange}
                        placeholder="Select Ref"
                        className="w-full border-2 z-40 border-gray-400 rounded-md"
                        isSearchable
                        isLoading={!refData.length}
                        isClearable
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
                        onChange={setSelectedStyle}
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
                    <label htmlFor="colorData">Color</label>
                    <Select
                        options={colorData}
                        value={selectedColor}
                        onChange={handleColorChange}
                        placeholder="Select Color"
                        className="w-full border-2 z-20 border-gray-400 rounded-md"
                        isSearchable
                        isLoading={!colorData.length}
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
                    <label htmlFor="delvDate">Delivery Date</label>
                    <Select
                        options={delvdateData}
                        value={selectedDelvdate}
                        onChange={setSelectedDelvDate}
                        placeholder="Select Date"
                        className="w-full border-2 z-20 border-gray-400 rounded-md"
                        isSearchable
                        isLoading={!colorData.length}
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
                    <button type='submit' className='btn btn-primary'>
                        Submit
                    </button>
                </div>
            </form>

            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>
        </div>
    );
};

export default LineMaster;



   // columnHelper.accessor('totalqty', { header: 'Total  Qty', size: 20 }),
        // columnHelper.accessor('orderqty', { header: 'OrderQuantity', size: 20 }),
        // columnHelper.accessor('delvdate', { header: 'Delivery Date', size: 20 }),