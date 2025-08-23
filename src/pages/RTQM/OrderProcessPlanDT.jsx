import React, { useState, useEffect } from 'react';
import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import NotificationContainer from '../../utils/NotificationContainer';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import DjangoConfig from '../../config/Config';

const OrderProcessPlanDT = () => {
  const [tableData, setTableData] = useState([]);
  const [orderMtData,setOrderMtData] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  // --------------Column Data------------------------------->
  const columnHelper = createMRTColumnHelper();
  const columns = [
      columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
      columnHelper.accessor((row) => {
        const matchingMtData = orderMtData.find(mtData => mtData.id === row.order_mt_id);
        return matchingMtData ? matchingMtData.buyer : '';
      }, { header: 'Buyer', size: 20 }),
     
      columnHelper.accessor('quantity', { header: 'Quantity', size: 20 }),
      columnHelper.accessor('size', { header: 'Size', size: 20 }),
    ];

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });
  // ------------Columns data end--------------------->

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/order_dt_view2/`);

      const data = response.data.order_dts;
      setTableData(data);
      setOrderMtData(response.data.order_mts)
      // console.log(orderMtData)
      setIsLoading(false);
      toast.success('Your action was successful!');
     


    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Your action was successful!');
     
      setTableData([]);
    }
  };

  useEffect(() => {
    fetchTableData()
  }, []);




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

  const [subWindow, setSubWindow] = useState(null);

    const openSubWindow = () => {
        const newSubWindow = window.open('http://localhost:11005/rtqm/order-process-plan-dt', '_blank', 'width=600,height=400');
        setSubWindow(newSubWindow);
    };

    const closeSubWindow = () => {
        if (subWindow) {
            subWindow.close();
            setSubWindow(null);
        }
    };

  return (
    <>

     
      <div className="flex items-center justify-end">
        <button type="button" onClick={openSubWindow} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Open Sub Window
        </button>
      </div>
           
     
   
      <div className="mt-3">
          <MaterialReactTable table={table} />
      </div>

    
    </>
  )
};

export default OrderProcessPlanDT;
