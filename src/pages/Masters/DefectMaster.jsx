import { Box, Button, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DjangoConfig from '../../config/Config';
const DefectMaster = () => {
    const [inputData, setInputData] = useState({
        name: '',
        remarks: '',
        critical:'',
        process:'',
        is_reject:false,
        hindi_name:'',

    });
    const [isLoading,setIsLoading] = useState(false)
    const [defectData,setDEfectData] = useState([])
    const [processData,setProcessData] = useState([])



    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('name', { header: 'Name', size: 20 }),
        columnHelper.accessor('hindi_name', { header: 'Hindi Name', size: 20 }),
        columnHelper.accessor('critical', { header: 'Critical', size: 20 }),
        columnHelper.accessor('process_id', { header: 'Process', size: 20 }),
        columnHelper.accessor((row) => {
          const matchingData = processData.find(data => data.id === row.process_id);
          return matchingData ? matchingData.name : '';
        }, { header: 'Process', size: 20 }),
       
        columnHelper.accessor(({ is_active }) => (
          is_active ? <CheckIcon style={{ color: 'green' }} /> : <CloseIcon style={{ color: 'red' }} />
        ), { header: 'Status', size: 20 }),
        columnHelper.accessor(({ is_reject }) => (
          is_reject ? <CheckIcon style={{ color: 'green' }} /> : <CloseIcon style={{ color: 'red' }} />
        ), { header: 'Is Reject', size: 20 }),

      

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
        const csv = generateCsv(csvConfig)(defectData);
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
        data: defectData,
        // state: {
        //   isLoading:  isLoading ? <Skeleton count={5} /> : null,
         
        // },
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
    // ------------Columns data end--------------------->

    useEffect(() => {
        fetchDefectData();
    }, []);

    const fetchDefectData = () => {
        axios.get(`${DjangoConfig.apiUrl}/masters/defect_master/`)
            .then(response => {
                console.log(response.data);
                setDEfectData(response.data.dp_data);
                setProcessData(response.data.process_data);
                setIsLoading(true)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      setInputData(prev => ({
        ...prev,
        [name]: newValue
      }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${DjangoConfig.apiUrl}/masters/defect_master/`, inputData,)
            .then(response => {
                // console.log(response.data);
                toast.success('Data Saved successful!');
                fetchDefectData();

            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Error',error);

            });
    };

    return (
        <div className="p-4">
            <div className="flex justify-center bg-gray-300 rounded-md  items-center">
                <h1 className="text-4xl font-bold">DEFECT MASTER</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-wrap justify-between mt-2 gap-4">
                <input 
                    type="text" 
                    name="name" 
                    value={inputData.name} 
                    onChange={handleChange} 
                    placeholder="Name" 
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 flex-grow"
                />
                <input 
                  
                    type="text" 
                    name="hindi_name" 
                    value={inputData.hindi_name} 
                    onChange={handleChange} 
                    placeholder="Hindi Name" 
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 flex-grow"
                />
                 <input 
                  
                    type="text" 
                    name="remarks" 
                    value={inputData.remarks} 
                    onChange={handleChange} 
                    placeholder="Remarks" 
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 flex-grow"
                />
                

                <select
                    name="critical"
                    value={inputData.critical}
                    onChange={handleChange}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 flex-grow"
                >
                    <option value="">Select Category</option>
                    <option value="MINOR">MINOR</option>
                    <option value="MAJOR">MAJOR</option>
                </select>
                <select
                  name="process"
                  onChange={handleChange}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 flex-grow"
                >
                  {processData.map((item) => (
                    <option key={item.id} value={item.id} >
                      {item.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="recutting">Is Rejected</label>


                 <input 
                  
                  type="checkbox" 
                  name="is_reject" 
                  value={inputData.is_reject} 
                  onChange={handleChange} 
                  placeholder="Is Reject" 
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 flex-grow"
              />
                
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button>
            </form>
            <div className='mt-2'>
                    <MaterialReactTable table={table} />
            </div>
        </div>
    );
};

export default DefectMaster;
