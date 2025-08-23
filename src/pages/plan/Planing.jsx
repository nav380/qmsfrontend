// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import Select from 'react-select';
// import { Box, Button, Checkbox, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import Skeleton from 'react-loading-skeleton';
// import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
// import { download, generateCsv, mkConfig } from 'export-to-csv';
// import { toast } from 'react-toastify';
// import DatePicker from 'react-datepicker';
// import EditIcon from '@mui/icons-material/Edit';
// import CloseIcon from '@mui/icons-material/Close';
// import CheckIcon from '@mui/icons-material/Check';

// import DjangoConfig from '../../config/Config';
// import { useNavigate } from 'react-router-dom';

// const Planing = () => {
//     const [buyerList, setBuyerList] = useState([]);
//     const [refData, setRefData] = useState([]);
//     const [styleNoData, setStyleNoData] = useState([]);
//     const [selectedBuyer, setSelectedBuyer] = useState(null);
//     const [selectedRef, setSelectedRef] = useState(null);
//     const [selectedStyle, setSelectedStyle] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [colorData, setColorData] = useState([])
//     const [selectedColor, setSelectedColor] = useState(null)
//     const [quantity, setQuantity] = useState('');
//     const [isFormVisible, setIsFormVisible] = useState(false);
//     const [tableData, setTableData] = useState([])
//     const [planDate, setPlanDate] = useState(new Date());
//     const [selectedDelvDate, setSelectedDelvDate] = useState(null)
//     const [deliveryDate, setDeliveryDate] = useState([])
//     const [lineData, setLineDate] = useState([])
//     const [selectedLine, setSelectedLine] = useState(null)
//     const [floorData, setFloorData] = useState([])
//     const [selectedFloor, setSelectedFloor] = useState(null)
//     const [unitData, setUnitData] = useState([])
//     const [selectedUnit, setSelectedUnit] = useState(null)
//     const [totalData, setTotalData] = useState([])
//     const [selectedData, setSelectedData] = useState({})
//     const [maxQuantity, setMaxQuantity] = useState(0)
//     const [editingRowId, setEditingRowId] = React.useState(null);
   
    


//     const toggleFormVisibility = () => {
//         setIsFormVisible(!isFormVisible);
//     };



//     const fetchInitialData = async () => {
//         setIsLoading(true)
//         try {
//             const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
//             setTableData(response.data.planing_data)
//             console.log(response.data.planing_data)
//             setIsLoading(false)
//             setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));
//             setUnitData(response.data.location_data.map(item => ({ value: item.id, label: item.name })))
//         } catch (error) {
//             console.error('Error fetching initial data:', error);
//         }
//     };

//     useEffect(() => {


//         fetchInitialData();
//     }, []);

//     const handleBuyerChange = (selectedValue) => {
//         setSelectedBuyer(selectedValue);
//         setSelectedRef(null)
//         fatchDataSelect(selectedValue);
//     };

//     const handleRefChange = (selectedValue) => {
//         setSelectedRef(selectedValue);
//         fatchByRefDataSelect(selectedValue)

//     };


//     const fatchDataSelect = (selectedValue) => {
//         // setIsLoading(true);

//         console.log("selected Value", selectedValue);
//         setRefData([])
//         const userData = {
//             buyer_filter: selectedValue.value,
//             ref_filter: selectedRef?.value || "",
//             style_filter: selectedStyle?.value || ""
//         };
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => {
//                 const responseData = response.data.data;
//                 const uniqueRefs = [...new Set(responseData.map(item => item.ourref))];
//                 const refOptions = uniqueRefs.map(ref => ({ value: ref, label: ref }));
//                 setRefData(refOptions);
//                 // setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer, label: item.party_name })));
//                 setIsLoading(false);
//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };

//     const fatchByRefDataSelect = (selectedValue) => {
//         setStyleNoData([])
//         const userData = {
//             buyer_filter: selectedBuyer.value,
//             ref_filter: selectedValue.value || "",
//             style_filter: selectedStyle?.value || ""
//         }
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         }).then(response => {
//             const responseData = response.data.data
//             const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
//             const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
//             setStyleNoData(styleOptions);
//             setColorData(response.data.data.map(item => ({ value: item.color, label: item.color })))
//             const formattedDates = responseData.map(item => {
//                 const date = new Date(item.delvdate);
//                 return {
//                     value: date,
//                     label: date.toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                     })
//                 };
//             });
//             setDeliveryDate(formattedDates);
//             setTotalData(responseData)
//             setIsLoading(false);


//         })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     }




//     const handleUnitChange = (selectedValue) => {
//         setSelectedUnit(selectedValue);
//         fatchUniteData(selectedValue)
//     };


//     const fatchUniteData = (selectedValue) => {
//         console.log("selected Value", selectedValue);
//         const userData = {
//             unit_id: selectedValue.value,
//         };
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => {
//                 const floorOptions = response.data.common_master_data.map(item => ({ value: item.id, label: item.name }));
//                 setFloorData(floorOptions)
//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };

//     const handleFloorChange = (selectedValue) => {
//         setSelectedFloor(selectedValue);
//         fatchFloorData(selectedValue)
//     };


//     const fatchFloorData = (selectedValue) => {
//         console.log("selected Value", selectedValue);
//         const userData = {
//             common_id: selectedValue.value,
//         };
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => {
//                 const lineOptions = response.data.line_master_data.map(item => ({ value: item.id, label: item.name }));
//                 setLineDate(lineOptions)

//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };

//     useEffect(() => {
//         if (selectedColor) {
//             const matchedColorObject = totalData.find(item => item.color === selectedColor.value);
//             setSelectedData(matchedColorObject);
//         } else {
//             setSelectedData(null);
//         }
//     }, [selectedColor, totalData]);


//     const handleChange = (event) => {
//         setMaxQuantity(selectedData.totalqty)
//         const newQuantity = parseInt(event.target.value);
//         if (!isNaN(newQuantity)) {
//             setQuantity(event.target.value); 
//         }
//     };



//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         const userData = {
//             buyer: selectedBuyer.value,
//             buyer_name : selectedBuyer.label,
//             ourref: selectedRef.value,
//             styleno: selectedStyle.value,
//             color: selectedColor.value,
//             delvdate: selectedDelvDate.value,
//             unit: selectedUnit.value,
//             floor: selectedFloor.value,
//             line: selectedLine.value,
//             quantity: quantity,
//             planing_date: planDate
//         };
        

//         try {
//             const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/`, userData);
//             toast.success('Planing Create was successful!');
//             fetchInitialData();

//         } catch (error) {
//             console.error('Error creating QmsPlaning:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const navigate = useNavigate()
//     const handleButtonClick = (planingId) => {
//         navigate(`/dashboard/planing/planing-size-quantity/${planingId}`);
//     };

//     // --------------Table  Column Data------------------------------->

//     const columns = useMemo(
//         () => [
//             {
//                 accessorKey: 'planing_no',
//                 header: 'Add',
//                 enableEditing: false,
//                 size: 10,
//                 Cell: ({ row }) => (
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => handleButtonClick(row.original.id)}
//                     >
//                         Add Quantity
//                     </Button>
//                 ),
//             },
//             {
//                 accessorKey: 'planing_no',
//                 header: 'Planing No ',
//                 enableEditing: false,
//                 size: 10,
//             },
//             {
//                 accessorKey: 'unit_name',
//                 header: 'Unit ',
//                 enableEditing: false,
//                 size: 10,
//             },
//             {
//                 accessorKey: 'line_name',
//                 header: 'Line ',
//                 enableEditing: false,
//                 size: 20,

//             },
//             {
//                 accessorKey: 'styleno',
//                 header: 'Style No',
//                 enableEditing: false,
//                 size: 30,

//             },
//             {
//                 accessorKey: 'color',
//                 header: 'Color ',
//                 enableEditing: false,
//                 size: 30,

//             },
//             {
//                 accessorKey: 'quantity',
//                 header: 'Quantity',
//                 muiEditTextFieldProps: {
//                     required: true,
//                     helperText: 'Enter duration',
//                 },
//                 size: 20,

//             },
//             {
//                 accessorKey: 'planing_date',
//                 header: 'Planing Date',
//                 enableEditing: false,
//                 size: 20,


//             },
//             {
//                 accessorKey: 'delvdate',
//                 header: 'Delivery Date',
//                 enableEditing: false,
//                 size: 30,

//             },
//             {
//                 accessorKey: 'is_active',
//                 header: 'Status',
//                 size: 20,

//                 Cell: ({ cell }) => (
//                     <span>
//                         {cell.getValue() ? (
//                             <CheckIcon  checked={cell.getValue()} />
//                         ) : (
//                             <CloseIcon color="error" />
//                         )}
//                     </span>
//                 ),
//                 muiEditTextFieldProps: {
//                     required: true,
//                 },
//             },
            
//         ],
//         []
//     );
    

//     const csvConfig = mkConfig({
//         fieldSeparator: ',',
//         decimalSeparator: '.',
//         useKeysAsHeaders: true,
//     });


//     const handleExportRows = (rows) => {
//         const rowData = rows.map((row) => row.original);
//         const csv = generateCsv(csvConfig)(rowData);
//         download(csvConfig)(csv);
//     };

//     const handleExportData = () => {
//         const csv = generateCsv(csvConfig)(tableData);
//         download(csvConfig)(csv);
//     };

//     // -----for DropDown-------------------->
//     const [anchorEl, setAnchorEl] = React.useState(null);

//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };
//     //----------end DropDown---------------->

//     const handleUpdatePlan = ({ values, table }) => {

//         const userData = {
//             planing_no: values.planing_no,
//             quantity : values.quantity,
//             is_active : values.is_active

//         };
//         console.log("response Data",values.id)
//         axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`, userData)
//             .then((response) => {
//                 console.log(response.data);
//                 toast.success(` ${response.data.message} `);
//                 fetchInitialData()
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//                 toast.error("Data save failed");
//             });
    
//         console.log(values, table);
//     };

//     const table = useMaterialReactTable({
//         columns,
//         data: tableData,
       
//         enableRowSelection: true,
//         enableHiding: false,
//         enablePagination: false,
//         enableStickyHeader: true,
//         enableStickyFooter: true,
//         createDisplayMode: 'row',
//         editDisplayMode: 'row',
//         enableEditing: true,
//         onEditingRowSave: handleUpdatePlan,
//         state: {
//             showGlobalFilter: true,
//             density: 'compact',
//             isLoading: isLoading ? <Skeleton count={5} /> : null,
//         },
//         muiTableBodyCellProps: {
//             sx: {
//               border: '1px solid rgba(81, 81, 81, .5)',
//             },
//           },
//         renderRowActions: ({ row, table }) => (
//             <Box sx={{ display: 'flex', gap: '1rem' }}>
//                 <Tooltip title="Edit">
//                     <IconButton onClick={() => table.setEditingRow(row)  }>
//                         <EditIcon />
//                     </IconButton>
//                 </Tooltip>
//                 {/* <Tooltip title="Delete">
//                     <IconButton color="error" onClick={() => openDeleteConfirmDt(row)}>
//                         <DeleteIcon />
//                     </IconButton>
//                 </Tooltip> */}
//             </Box>
//         ),
//         renderTopToolbarCustomActions: ({ table }) => (
//             <Box
//                 sx={{
//                     display: 'flex',
//                     gap: '12px',
//                     padding: '4px',
//                     flexWrap: 'wrap',
//                     style: { fontSize: '5px' },
//                 }}
//             >

//                 <Button
//                     aria-controls="export-menu"
//                     aria-haspopup="true"
//                     onClick={handleClick}
//                     startIcon={<FileDownloadIcon />}
//                 >
//                     Export
//                 </Button>
//                 <Menu
//                     id="export-menu"
//                     anchorEl={anchorEl}
//                     keepMounted
//                     open={Boolean(anchorEl)}
//                     onClose={handleClose}
//                 >
//                     <MenuItem onClick={handleExportData}>Export All Data</MenuItem>
//                     <MenuItem
//                         disabled={table.getPrePaginationRowModel().rows.length === 0}
//                         onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
//                     >
//                         Export All Rows
//                     </MenuItem>
//                     <MenuItem
//                         disabled={table.getRowModel().rows.length === 0}
//                         onClick={() => handleExportRows(table.getRowModel().rows)}
//                     >
//                         Export Page Rows
//                     </MenuItem>
//                 </Menu>

//             </Box>
//         ),
//     });


//     return (
//         <div>
//             <div className='w-full h-10 flex items-center justify-between bg-gray-300 rounded-lg'>
//                 <h1 className='text-center ml-2'>Product Planning</h1>
//                 <Button
//                     onClick={toggleFormVisibility}
//                     variant="contained"
//                     color="primary"
//                     className="float-right mr-2"
//                 >
//                     {isFormVisible ? 'Add Plan' : 'Add Plan'}
//                 </Button>
//             </div>


//             <div className={`form-container mt-2 transition-all duration-500 ease-in-out ${isFormVisible ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5  gap-4 mb-4">
//                     <div>
//                         <label htmlFor="buyerList"> Buyer</label>
//                         <Select
//                             options={buyerList}
//                             value={selectedBuyer}
//                             onChange={handleBuyerChange}
//                             placeholder="Select Buyer"
//                             className="w-full border-2 z-50 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!buyerList.length}
//                             loadingMessage={() => <Skeleton count={5} />}
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="refdata"> Ref</label>
//                         <Select
//                             options={refData}
//                             value={selectedRef}
//                             onChange={handleRefChange}
//                             placeholder="Select Ref"
//                             className="w-full border-2 z-40 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!refData.length}
//                             isClearable
//                             loadingMessage={() => <Skeleton count={5} />}
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="styleNoData">Style No</label>
//                         <Select
//                             options={styleNoData}
//                             value={selectedStyle}
//                             onChange={setSelectedStyle}
//                             placeholder="Select Style"
//                             className="w-full border-2 z-30 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!styleNoData.length}
//                             loadingMessage={() => <Skeleton count={5} />}
//                             isClearable
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="colorData">Color</label>
//                         <Select
//                             options={colorData}
//                             value={selectedColor}
//                             onChange={setSelectedColor}
//                             placeholder="Select Color"
//                             className="w-full border-2 z-20 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!colorData.length}
//                             loadingMessage={() => <Skeleton count={5} />}
//                             isClearable
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="deliveryDate">Delivery Date</label>
//                         <Select
//                             options={deliveryDate}
//                             value={selectedDelvDate}
//                             onChange={setSelectedDelvDate}
//                             placeholder="Delivery Date"
//                             className="w-full border-2 z-10 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!deliveryDate.length}
//                             loadingMessage={() => <Skeleton count={5} />}
//                             isClearable
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />

//                     </div>
//                     <div>
//                         <label htmlFor="unitData">Unit</label>
//                         <Select
//                             options={unitData}
//                             value={selectedUnit}
//                             onChange={handleUnitChange}
//                             placeholder="Unit"
//                             className="w-full border-2 z-10 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!unitData.length}
//                             loadingMessage={() => <Skeleton count={5} />}
//                             isClearable
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="floorData">Floor</label>
//                         <Select
//                             options={floorData}
//                             value={selectedFloor}
//                             onChange={handleFloorChange}
//                             placeholder=" Floor"
//                             className="w-full border-2 z-10 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!floorData.length}
//                             loadingMessage={() => <Skeleton count={5} />}
//                             isClearable
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="lineData">Line</label>
//                         <Select
//                             options={lineData}
//                             value={selectedLine}
//                             onChange={setSelectedLine}
//                             placeholder=" Line"
//                             className="w-full border-2 z-10 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!lineData.length}
//                             loadingMessage={() => <Skeleton count={5} />}
//                             isClearable
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />
//                     </div>

//                     <div>

//                         <label htmlFor="quantity">Quantity</label>
//                         <input
//                             type="number"
//                             name="quantity"
//                             value={quantity}
//                             onChange={(e) => setQuantity(e.target.value)}
//                             placeholder='Quantity'
//                             // onKeyDown={e => {
//                             //     if (e.key === 'Delete') {
//                             //         setQuantity('');
//                             //     }
//                             // }}
//                             className="w-full border-2 border-gray-400 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:border-gray-600"
//                             style={{ height: '43px', fontSize: '12px' }}
//                         />
//                         {/* {quantity > maxQuantity && (
//                             <p style={{ color: 'red', fontSize: '12px' }} className='text-sm'>Maximum quantity exceeded ({maxQuantity})</p>
//                         )} */}
//                     </div>
//                     <div>
//                         <label htmlFor="planDate">Plan Date</label>
//                         <input
//                             type='date'
//                             className="w-full  border-2 border-gray-400 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:border-gray-600"
//                             name="date"
//                             value={planDate}
//                             onChange={(e) => setPlanDate(e.target.value)}
//                             style={{ height: '43px', fontSize: '12px' }}

//                         // placeholder='Planing Date'
//                         />
//                     </div>
//                     <div>
//                         {/* <label htmlFor="submit">Submit</label> */}
//                         <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             disabled={isLoading}
//                             className="w-full h-10 mt-14 "
//                         >
//                             {isLoading ? 'Loading...' : 'Submit'}
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//             <div className="mt-3 ">
//                 <MaterialReactTable table={table} />
//             </div>


//         </div>

//     );
// };

// export default Planing;

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

const Planing = () => {
    const [buyerList, setBuyerList] = useState([]);
    const [refData, setRefData] = useState([]);
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedRef, setSelectedRef] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [colorData, setColorData] = useState([])
    const [selectedColor, setSelectedColor] = useState(null)
    const [quantity, setQuantity] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [tableData, setTableData] = useState([])
    const [planDate, setPlanDate] = useState(new Date());
    const [selectedDelvDate, setSelectedDelvDate] = useState(null)
    const [deliveryDate, setDeliveryDate] = useState([])
    const [lineData, setLineDate] = useState([])
    const [selectedLine, setSelectedLine] = useState(null)
    const [floorData, setFloorData] = useState([])
    const [selectedFloor, setSelectedFloor] = useState(null)
    const [unitData, setUnitData] = useState([])
    const [selectedUnit, setSelectedUnit] = useState(null)
    const [totalData, setTotalData] = useState([])
    const [selectedData, setSelectedData] = useState({})
    const [maxQuantity, setMaxQuantity] = useState(0)
    // const [editingRowId, setEditingRowId] = React.useState(null);
    // const [editedPlan, setEditedPlan] = useState(null);

    


    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };






    const fetchInitialData = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
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
        setSelectedRef(null)
        fatchDataSelect(selectedValue);
    };

    const handleRefChange = (selectedValue) => {
        setSelectedRef(selectedValue);
        fatchByRefDataSelect(selectedValue)

    };


    const fatchDataSelect = (selectedValue) => {
        // setIsLoading(true);

        console.log("selected Value", selectedValue);
        setRefData([])
        const userData = {
            buyer_filter: selectedValue.value,
            ref_filter: selectedRef?.value || "",
            style_filter: selectedStyle?.value || ""
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const responseData = response.data.data;
                const uniqueRefs = [...new Set(responseData.map(item => item.ourref))];
                const refOptions = uniqueRefs.map(ref => ({ value: ref, label: ref }));
                setRefData(refOptions);
                // setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer, label: item.party_name })));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const fatchByRefDataSelect = (selectedValue) => {
        setStyleNoData([])
        const userData = {
            buyer_filter: selectedBuyer.value,
            ref_filter: selectedValue.value || "",
            style_filter: selectedStyle?.value || ""
        }
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const responseData = response.data.data
            const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
            const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
            setStyleNoData(styleOptions);
            setColorData(response.data.data.map(item => ({ value: item.color, label: item.color })))
            const formattedDates = responseData.map(item => {
                const date = new Date(item.delvdate);
                return {
                    value: date,
                    label: date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                };
            });
            setDeliveryDate(formattedDates);
            setTotalData(responseData)
            setIsLoading(false);


        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }




    const handleUnitChange = (selectedValue) => {
        setSelectedUnit(selectedValue);
        fatchUniteData(selectedValue)
    };


    const fatchUniteData = (selectedValue) => {
        console.log("selected Value", selectedValue);
        const userData = {
            unit_id: selectedValue.value,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
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
        fatchFloorData(selectedValue)
    };


    const fatchFloorData = (selectedValue) => {
        console.log("selected Value", selectedValue);
        const userData = {
            common_id: selectedValue.value,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
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

    useEffect(() => {
        if (selectedColor) {
            const matchedColorObject = totalData.find(item => item.color === selectedColor.value);
            setSelectedData(matchedColorObject);
        } else {
            setSelectedData(null);
        }
    }, [selectedColor, totalData]);


    const handleChange = (event) => {
        setMaxQuantity(selectedData.totalqty)
        const newQuantity = parseInt(event.target.value);
        if (!isNaN(newQuantity)) {
            setQuantity(event.target.value); 
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const userData = {
            buyer: selectedBuyer.value,
            buyer_name : selectedBuyer.label,
            ourref: selectedRef.value,
            styleno: selectedStyle.value,
            color: selectedColor?.value || "",
            delvdate: selectedDelvDate.value,
            unit: selectedUnit.value,
            floor: selectedFloor.value,
            line: selectedLine.value,
            quantity: quantity,
            planing_date: planDate
        };
        

        try {
            const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/`, userData);
            toast.success('Planing Create was successful!');
            fetchInitialData();

        } catch (error) {
            console.error('Error creating QmsPlaning:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const navigate = useNavigate()
    const handleButtonClick = (planingId) => {
        navigate(`/dashboard/planing/planing-size-quantity/${planingId}`);
    };

    // --------------Table  Column Data------------------------------->

    const StatusOptions = [
        { value: 'True', label: 'Active' },
        { value: 'False', label: 'In Active' },
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
                accessorKey: 'planing_no',
                header: 'Planing No ',
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
                accessorKey: 'styleno',
                header: 'Style No',
                enableEditing: false,
                size: 30,

            },
            {
                accessorKey: 'color',
                header: 'Color ',
                enableEditing: false,
                size: 30,

            },
            {
                accessorKey: 'quantity',
                header: 'Quantity',
                muiEditTextFieldProps: {
                    required: true,
                    helperText: 'Enter duration',
                },
                size: 20,

            },
            {
                accessorKey: 'planing_date',
                header: 'Planing Date',
                enableEditing: false,
                size: 20,


            },
            {
                accessorKey: 'delvdate',
                header: 'Delivery Date',
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
                            <CheckIcon  checked={cell.getValue()} />
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
            planing_no: values.id,
            quantity : values.quantity,
            is_active : values.is_active

        };
        // console.log("response Data",values.id)
        axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`, userData)
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
                    <IconButton onClick={() => table.setEditingRow(row)  }>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
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
                <h1 className='text-center ml-2'>Stitching  Planning</h1>
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
                            onChange={setSelectedColor}
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
                        <label htmlFor="deliveryDate">Delivery Date</label>
                        <Select
                            options={deliveryDate}
                            value={selectedDelvDate}
                            onChange={setSelectedDelvDate}
                            placeholder="Delivery Date"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!deliveryDate.length}
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

                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder='Quantity'
                            // onKeyDown={e => {
                            //     if (e.key === 'Delete') {
                            //         setQuantity('');
                            //     }
                            // }}
                            className="w-full border-2 border-gray-400 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:border-gray-600"
                            style={{ height: '43px', fontSize: '12px' }}
                        />
                        {/* {quantity > maxQuantity && (
                            <p style={{ color: 'red', fontSize: '12px' }} className='text-sm'>Maximum quantity exceeded ({maxQuantity})</p>
                        )} */}
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

                        // placeholder='Planing Date'
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

export default Planing;
