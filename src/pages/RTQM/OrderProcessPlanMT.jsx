import React, { useState, useEffect, useRef } from 'react';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import axios from 'axios';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import "../../index.css"
import 'tailwindcss/tailwind.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from 'react-toastify';
import DjangoConfig from '../../config/Config';

const OrderProcessPlanMT = () => {
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [buyerList, setBuyerList] = useState([]);
  const [refData, setRefData] = useState([])
  const [styleNoData, setStyleNoData] = useState([])
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [selectedRef, setSelectedRef] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);


  const options = [{ value: 'buyer', label: 'Buyer' }];
  const options1 = [{ value: 'TOP', label: 'TOP' }];
  const options2 = [{ value: 'TOP', label: 'TOP' }];
  
  const columnHelper = createMRTColumnHelper();
  
  const columns = [
      columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
      columnHelper.accessor('buyer', { header: 'Buyer', size: 20 }),
      columnHelper.accessor('party_name', { header: 'Buyer Name', size: 20 }),
      columnHelper.accessor('buyord', { header: 'Buyer Order No', size: 20 }),
      columnHelper.accessor((row) => (   
        <Button onClick={() => fatchDataOurRef(row.ourref,row.styleno,row.buyer,row.color)} variant="outlined" size="small">
          {row.ourref}
        </Button>
      ), {
        header: 'Our Ref No',
        size: 20,
      }),
      columnHelper.accessor('styleno', { header: 'Style No', size: 20 }),
      columnHelper.accessor('delvdate', { header: 'Delivery Date', size: 20 }),
      columnHelper.accessor('totalqty', { header: 'Quantity', size: 20 }),
      columnHelper.accessor('color', { header: 'Color', size: 20 }),
      columnHelper.accessor('Style_category', { header: 'Style Category', size: 20 }),
  
  ];

  const fatchDataOurRef = (ourRef, styleno, buyer,color) => {
    // console.log(ourRef,styleno,buyer)
    const userData = {
      ourref: ourRef,
      style_no: styleno,
      buyer: buyer,
      color :color
    };
    const queryParams = new URLSearchParams(userData).toString();
    axios.get(`${DjangoConfig.apiUrl}/rtqm/order_dt_view/?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log("data aaya ", response.data)

    })
    .catch((error) => {
      
      console.error("Error fetching data:", error);
      throw error; 
    });


  };
  

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });
  



  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/send_to_qms/`)
        const data = response.data.data;
        setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer, label: item.party_name })));
        // setRefData(response.data.data.map(item => ({ value: item.ourref, label: item.ourref })));
        // setStyleNoData(response.data.data.map(item => ({ value: item.styleno, label: item.styleno })));
      } catch (error) {
        console.error('Error fetching data:', error);
        setTableData([]);
      }
    };
    fetchTableData();
   
  }, []);

  const [isLoading,setIsLoading] = useState(false)
 

  const handleBuyerChange = (selectedValue) => {
    setSelectedBuyer(selectedValue);
    fatchDataSelect(selectedValue);
  };

  const handleRefChange = (selectedValue) => {
    setSelectedRef(selectedValue);
    // fatchDataSelect(selectedValue);
    
    fatchByRefDataSelect(selectedValue)

  };

  const fatchByRefDataSelect=(selectedValue)=>{
    console.log("selected Value",selectedValue)
    console.log("selected Buyer",selectedBuyer)
    setStyleNoData([])

    const userData = {
      buyer_filter: selectedBuyer.value,
      ref_filter: selectedValue.value || "",
      style_filter: selectedStyle?.value || ""
    }
    const queryParams = new URLSearchParams(userData).toString();
    axios.get(`${DjangoConfig.apiUrl}/rtqm/send_to_qms2/?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }) .then(response => {
      setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer, label: item.party_name })));
      const responseData =response.data.data
      const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
      const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
      setStyleNoData(styleOptions)
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching filtered data:', error);
    });
  }
 
  const fatchDataSelect=(selectedValue)=>{
    console.log("selected Value",selectedValue)
    const userData = {
      buyer_filter: selectedValue.value,
      ref_filter: selectedRef?.value || "",
      style_filter: selectedStyle?.value || ""
    }
    const queryParams = new URLSearchParams(userData).toString();
    axios.get(`${DjangoConfig.apiUrl}/rtqm/send_to_qms2/?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }) .then(response => {
      setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer, label: item.party_name })));
      const responseData =response.data.data
      const uniqueRefs = [...new Set(responseData.map(item => item.ourref))];
      const refOptions = uniqueRefs.map(ref => ({ value: ref, label: ref }));
      setRefData(refOptions);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching filtered data:', error);
    });
  }
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userData = {
      buyer_filter: selectedBuyer?.value || "",
      ref_filter: selectedRef?.value || "",
      style_filter: selectedStyle?.value || ""
    }
    const queryParams = new URLSearchParams(userData).toString();
    axios.get(`${DjangoConfig.apiUrl}/rtqm/send_to_qms2/?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setTableData(response.data.data);
        setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer, label: item.party_name })));
        // setRefData(response.data.data.map(item => ({ value: item.ourref, label: item.ourref })));
        // setStyleNoData(response.data.data.map(item => ({ value: item.styleno, label: item.styleno })));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching filtered data:', error);
      });
  };


  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    console.log("selected row data",rowData)
    // const csv = generateCsv(csvConfig)(rowData);
    // download(csvConfig)(csv);
    axios.post(`${DjangoConfig.apiUrl}/rtqm/send_to_qms2/`, rowData)
    .then(response => {
      toast.success('Data Saved successful!');
      
    })
    .catch(error => {
      console.error("Error saving data:", error);
      toast.error("Error saving data:" );

      // Handle error, if needed
    });
  };

  const handleExportRowss = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    }

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
      isLoading:  isLoading ? <Skeleton count={5} /> : null,
     
    },
   
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
   
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
          onClick={() => handleExportRowss(table.getPrePaginationRowModel().rows)}
        >
          Export All Rows
        </MenuItem>
        <MenuItem
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRowss(table.getRowModel().rows)}
        >
          Export Page Rows
        </MenuItem>
      </Menu>
        
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          // startIcon={<FileDownloadIcon />}
        >
          Save QMS Data
        </Button>
      </Box>
    ),
  });



  return (
    <>
     
    <div className="p-4 w-full overflow-x-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <Select
        options={buyerList}
        value={selectedBuyer}
        onChange={handleBuyerChange}
        placeholder="Select Buyer"
        className="w-full z-40"
        isSearchable
        noOptionsMessage={() => <Skeleton count="5" />}
        isLoading={!buyerList.length}

      />
        <Select
          options={refData}
          value={selectedRef}
          onChange={handleRefChange}
          placeholder="Select Ref"
          className="w-full z-30"
          isSearchable
          noOptionsMessage={() => <Skeleton count="5"/>}
          isClearable={true}
          isLoading={!refData.length}


        />
        <Select
          options={styleNoData}
          value={selectedStyle}
          onChange={setSelectedStyle}
          placeholder="Select Style"
          className="w-full z-20"
          isSearchable
          noOptionsMessage={() => <Skeleton count="5"/>}
          isClearable={true}
          isLoading={!styleNoData.length}


        />
        <Button size="md" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900" type="submit" >
          Search
        </Button>
      </form>
      <div className="mb-4 w-full">
        {/* <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="w-full border border-gray-300 rounded-md px-2 py-1"
        /> */}
      </div>
      <div className="w-full overflow-x-auto">
        <MaterialReactTable table={table}    />
      </div>
    </div>
    </>
  );
};

export default OrderProcessPlanMT;
