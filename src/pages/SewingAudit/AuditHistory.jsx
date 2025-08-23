import React, { useState, useEffect } from 'react';
import { MaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useParams } from 'react-router-dom';
import DjangoConfig from '../../config/Config';
import { CSVLink } from 'react-csv';
import { utils, writeFile } from 'xlsx';
import { button } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

const AuditHistory = () => {
  const [auditType, setAuditType] = useState([]);
  const [selectedAuditType, setSelectedAuditType] = useState(null);
  const [unitList, setUnitList] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [floorData, setFloorData] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [lineData, setLineData] = useState([]);
  const [selectedLine, setSelectedLine] = useState(null);
  const [buyerList, setBuyerList] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [styleNoData, setStyleNoData] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [section, setSection] = useState(0);
  const [process, setProcess] = useState(0);
  const [auditTypeFinOrSewing,setAuditTypeFinOrSewing] = useState('');
  const [auditHistoryData, setAuditHistoryData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { type, id, pid } = useParams();
  const navigate = useNavigate();
  const columnHelper = createMRTColumnHelper();

  useEffect(() => {
    setSection(id);
    setProcess(pid);
    setAuditTypeFinOrSewing(type);
  }, [id, pid]);
   
  useEffect(() => {
    fetchInitialData();
  }, [section, process]);  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auditTypeRes, unitListRes] = await Promise.all([
          axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_history/`, { params: { call: 'get_audit_type' } }),
          axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_history/`, { params: { call: 'get_unit_list' } })
        ]);

        if (auditTypeRes.data) {
          setAuditType(auditTypeRes.data.map(audit => ({ value: audit.final_result, label: audit.final_result })));
        }

        if (unitListRes.data) {
          setUnitList(unitListRes.data.map(unit => ({ value: unit.payroll_code, label: unit.name })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      const fetchFloorData = async () => {
        try {
          const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
            params: { call: 'get_floor', unit_filter: selectedUnit.value }
          });

          if (response.data) {
            setFloorData(response.data.map(floor => ({ value: floor.floor_id, label: floor.floor_name })));
          }
        } catch (error) {
          console.error('Error fetching floor data:', error);
        }
      };

      fetchFloorData();
    }
  }, [selectedUnit]);


  const fetchStyles = async (buyer) => {
    if (!buyer) return;
    try {
    const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
      params: {
        call: 'get_style',
        buyer_filter: buyer.value,
        unit_id : selectedUnit?.value || '',
        line_id : selectedLine?.value || '',
        section_id : section
      }
    });
    if (response.data) {
      const uniqueStyles = [...new Set(response.data.map(item => item.style))];
      setStyleNoData(uniqueStyles.map(style => ({ value: style, label: style })));
    }
    } catch (error) {
      console.error('Error fetching style data:', error);
      toast.error('Error fetching style data.');
    }
  }
  useEffect(() => {
    if (selectedBuyer) fetchStyles(selectedBuyer);
  }, [selectedBuyer]);

  const fetchBuyerData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: { 
          call : 'get_buyer',
          line_id : selectedLine?.value,
          section_id : section,
          process_id : process,
          audit_type : auditTypeFinOrSewing
         },
      });
      setBuyerList(response.data.map(buyer => ({ value: buyer.buyer, label: buyer.buyer_name })));
    } catch (error) {
      console.error('Error fetching buyer data:', error);
      // toast.error('Error fetching buyer data.');  
    }
    finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBuyerData();
  }, [selectedLine, selectedUnit]);

  useEffect(() => {
    if (selectedFloor) {
      const fetchLineData = async () => {
        try {
          const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
            params: { call: 'get_line', floor_filter: selectedFloor.value }
          });

          if (response.data) {
            setLineData(response.data.map(line => ({ value: line.line_id, label: line.line_name })));
          }
        } catch (error) {
          console.error('Error fetching line data:', error);
        }
      };

      fetchLineData();
    }
  }, [selectedFloor]);

  const fetchAllData = async () => {
    if (!selectedAuditType || !selectedUnit || !selectedFloor || !selectedLine) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_history/`, {
        params: {
          call: 'get_history_data',
          audit_type: selectedAuditType.value,
          unit_id: selectedUnit.value,
          floor_id: selectedFloor.value,
          line_id: selectedLine.value,
          section_id: section,
          process_id: process,
          buyer_id : selectedBuyer?.value,
          style_id : selectedStyle?.value
        },
      });

      if (response.data) {
        setAuditHistoryData(response.data);
        setTableData(response.data); // Assuming 'data' is the key with the table data
        resetForm();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_history/`, {
        params: {
          call: 'get_initial_history_data',
          section_id: section,
          process_id: process,
        },
      });

      if (response.data) {
        setAuditHistoryData(response.data);
        setTableData(response.data); // Assuming 'data' is the key with the table data
        resetForm();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedAuditType(null);
    setSelectedUnit(null);
    setSelectedFloor(null);
    setSelectedLine(null);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month_name = date.toLocaleString('default', { month: 'short' });
    const month = month_name.charAt(0).toUpperCase() + month_name.slice(1);
    const year = String(date.getFullYear()); // Get last two digits of the year
    return `${day} ${month_name} ${year}`;
  };

  const handleReAudit = (e) => {
    navigate(`/dashboard/audit/audit-selection/${type.replace(/\s+/g, '-').toLowerCase()}/${id}/${pid}/${e}`);
  }

  const handlePendingAudit = (e) => {
    navigate(`/dashboard/audit/audit-selection/${type.replace(/\s+/g, '-').toLowerCase()}/${id}/${pid}/${e}`);
  }

  const columns = [
    columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
    columnHelper.accessor(
      row => {
        if (row.final_result === 'Fail' && row.re_audit_no === null) {
          return (
            <button
              style={{
                backgroundColor: '#1565c0',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px'
              }}
              onClick={(e) => handleReAudit(row.id)}
            >
              Re-audit
            </button>
          );
        } else if (row.final_result === 'Pending') {
          return (
            <button
              style={{
                backgroundColor: '#1565c0',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px'
              }}
              onClick={(e)=>handlePendingAudit(row.id)}
            >
              Complete Audit
            </button>
          );
        } else {
          return null;
        }
      },
      { header: 'Action', size: 20 }
    ),
    columnHelper.accessor('audit_no', { header: 'Audit No', size: 20 }),
    columnHelper.accessor('audit_type', { header: 'Audit Type', size: 20 }),
    columnHelper.accessor(({ audit_date }) => formatDate(audit_date), { header: 'Audit Date', size: 20 }),
    columnHelper.accessor('buyer_name', { header: 'Buyer Name', size: 20 }),
    columnHelper.accessor('style', { header: 'Style', size: 20 }),
    columnHelper.accessor('order_no', { header: 'Order No', size: 20 }),
    columnHelper.accessor('color', { header: 'Color', size: 20 }),
    columnHelper.accessor('order_qty', { header: 'Order QTY', size: 20 }),
    columnHelper.accessor('ex_order_qty', { header: 'Ex Order QTY', size: 20 }),
    columnHelper.accessor('issued_qty', { header: 'Issued QTY', size: 20 }),
    columnHelper.accessor('pcs_received', { header: 'PCS Received', size: 20 }),
    columnHelper.accessor('sample_size', { header: 'Sample Size', size: 20 }),
    columnHelper.accessor('pcs_checked', { header: 'PCS Checked', size: 20 }),
    columnHelper.accessor('re_audit_no', { header: 'Re Audit Number', size: 20 }),
    columnHelper.accessor('final_result', { header: 'Final Result', size: 20 }),

  ];

  const handleClick = () => {
    // Extract column headers from your columns array
    const headers = columns.map((col) => col.header);
  
    // Prepare the data by combining headers with the table data
    const exportData = tableData.map(row => {
      const formattedRow = {};
      columns.forEach((col) => {
        formattedRow[col.header] = row[col.accessorKey]; // Replace 'accessorKey' if your data structure uses a different key
      });
      return formattedRow;
    });
  
    // Create a worksheet with headers and data
    const worksheet = utils.json_to_sheet(exportData, { header: headers });
  
    // Create a new workbook
    const workbook = utils.book_new();
  
    // Append the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'Audit Data');
  
    // Write the Excel file
    writeFile(workbook, 'audit_data_all.xlsx');
  };
  const handleClose = () => setAnchorEl(null);

  const handleExportData = () => {
    const headers = columns.map(col => ({ label: col.header, key: col.accessor }));
    const csvData = auditHistoryData.map(row => {
      const rowData = {};
      columns.forEach(col => {
        rowData[col.accessor] = row[col.accessor];
      });
      return rowData;
    });
    return { headers, data: csvData };
  };

  const handleExportRows = (rows) => {
    const headers = columns.map(col => ({ label: col.header, key: col.accessor }));
    const csvData = rows.map(row => {
      const rowData = {};
      columns.forEach(col => {
        rowData[col.accessor] = row[col.accessor];
      });
      return rowData;
    });
    return { headers, data: csvData };
  };

  return (
    <div className="p-4 w-full h-screen overflow-x-auto">
      <div className='flex justify-between'>
      <h1 className="text-2xl font-bold mb-4">{type} </h1>
      <div className='flex gap-4' >
      <button className='btn btn-primary' 
        onClick={() => navigate(`/dashboard/audit/audit-selection/${type.replace(/\s+/g, '-').toLowerCase()}/${id}/${pid}`)}>
        New Audit 
      </button>
      <button className='btn btn-primary' onClick={()=>{window.location.reload()}}> Refresh </button>
      </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4 mb-4">
        <label className="label flex-col items-start">
          <span className="label-text">Select Audit</span>
          <Select
            options={auditType}
            value={selectedAuditType}
            onChange={setSelectedAuditType}
            className="w-full z-10"
            isClearable
            styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
            noOptionsMessage={() => <Skeleton count={5} />}
          />
        </label>
        <label className="label flex-col items-start">
          <span className="label-text">Select Unit</span>
          <Select
            options={unitList}
            value={selectedUnit}
            onChange={setSelectedUnit}
            className="w-full  z-10"
            isClearable
          />
        </label>
        <label className="label flex-col items-start">
          <span className="label-text">Select Floor</span>
          <Select
            options={floorData}
            value={selectedFloor}
            onChange={setSelectedFloor}
            className="w-full  z-10"
            isClearable
          />
        </label>
        <label className="label flex-col items-start">
          <span className="label-text">Select Line</span>
          <Select
            options={lineData}
            value={selectedLine}
            onChange={setSelectedLine}
            className="w-full  z-10"
            isClearable
          />
        </label>
        <label className='label flex-col items-start'>
          <span className='label-text'> Select Buyer </span>
        <Select
          options={buyerList}
          value={selectedBuyer}
          onChange={(value) => {
            setSelectedBuyer(value);
            fetchData();
            resetFields();}}
          className="w-full z-10"
          isClearable
          noOptionsMessage={() => <Skeleton count={5} />}
          isLoading={isLoading}
        />
        </label>
        <label className='label flex-col items-start'>
          <span className='label-text'> Select Style </span>
        <Select
          options={styleNoData}
          value={selectedStyle}
          onChange={setSelectedStyle}
          className="w-full z-10"
          noOptionsMessage={() => <Skeleton count={5} />}
          isClearable
          isLoading={isLoading}
        />
        </label>
        <div className="flex items-end">
        <label className="label flex-col w-full items-start">
        <span className="label-text"></span>
          <Button
            onClick={fetchAllData}
            variant="contained"
            color="primary"
            className="w-full"
          >
            Fetch Data
          </Button>
        </label>
        </div>
      </div>

      {isLoading ? (
        <Skeleton count={10} />
      ) : (
        <Box>
      <div className="flex justify-end mt-4">
      <Button
        onClick={handleClick}
        variant="contained"
        color="primary"
        startIcon={<FileDownloadIcon />}
      >
        Export
      </Button>
    </div>
          <MaterialReactTable
            columns={columns}
            data={tableData}
            enablePagination={false}
            enableRowSelection
            enableColumnFiltering
            enableColumnOrdering
            enableGlobalFilter
            enableTopToolbar
            enableBottomToolbar
            options={{ search: true }}
            localization={{
              noData: 'No data available',
            }}
          />
    
        </Box>
      )}
    </div>
  );
};
export default AuditHistory; 