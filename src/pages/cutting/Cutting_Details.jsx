import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DjangoConfig from '../../config/Config';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Cutting_Details = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate()
  // const location = useLocation()
  // const {id} = location.state || {}
  const location = useLocation();
    const { id } = location.state || {};
  const columnHelper = createMRTColumnHelper();

  const getdataby_id = (id) => {
    console.log("pppppppppppp====>,", id)
    const useData = {
      mt_id: id
    }
    const queryParams = new URLSearchParams(useData).toString();
    const url = `${DjangoConfig.apiUrl}/rtqm/layer_cuttingDt/?${queryParams}`;
    axios.get(url).then((resp) => {
      setData(resp.data.dtData);
      console.log(resp.data.dtData)
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  };

  useEffect(() => {
    getdataby_id(id);
  }, []);

  // Correctly map the accessor keys to your data fields
  const columns = [
    // columnHelper.accessor('id', { header: 'ID', size: 40 }),
    columnHelper.accessor('size', { header: 'Size', size: 100, style:{align:"center"} }),
    columnHelper.accessor('ratio', { header: 'Ratio', size: 120 }),
    columnHelper.accessor('cutpcs', { header: 'CutPCS', size: 120 }),
    columnHelper.accessor('created_by', { header: 'Created_by', size: 120 }),
    columnHelper.accessor('updated_by', { header: 'Updated_by', size: 120 }),
    columnHelper.accessor('created_at', { header: 'Created_at', size: 120 }),
    columnHelper.accessor('updated_at', { header: 'Updated_at', size: 120 }),
    columnHelper.accessor('cuttingno', { header: 'Cutting No', size: 120 }),
    columnHelper.accessor('cutting_mt_id', { header: 'cutting_mt', size: 120 }),
  ];

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
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
        <Button
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
      </Box>
    ),
  });

  const obTablePage =()=>{
    navigate('/dashboard/cutting_route/history/')
  }

  return (
    <>
      <div className='w-full h-10 flex items-center justify-end  rounded-lg p-8 pr-10 '>
        <Button
          onClick={obTablePage}
          variant="contained"
          color="primary"
          className="float-right mr-2 "
        >
          Back
        </Button>
      </div>
      <div className="p-3">
        <MaterialReactTable table={table} />
      </div>
    </>
  );
};

export default Cutting_Details;
