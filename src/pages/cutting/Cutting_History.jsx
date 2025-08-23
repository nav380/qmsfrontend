import { useState, useEffect } from 'react';
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import DjangoConfig from "../../config/Config";
import { useNavigate } from 'react-router-dom';
// import {formatDate} from "../../utils/utils"

const Cutting_History = () => {
  const [data, setData] = useState([]);
  // const [anchorEl, setAnchorEl] = useState(null);
  const columnHelper = createMRTColumnHelper();
  const navigate = useNavigate()

  // Fetch data
  const loaddata = () => {
    const url = `${DjangoConfig.apiUrl}/rtqm/layer_cuttingDt/`;
    axios.get(url).then((resp) => {
      setData(resp.data.data);
      console.log(resp.data.data)
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  };

  useEffect(() => {
    loaddata();
  }, []); // Dependency array is empty to run only once on component mount

  // Define columns
  const columns = [
    // columnHelper.accessor('id', { header: 'ID', size: 40 }),
    columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 0 }),
    columnHelper.accessor('cuttingno', {
      header: 'Cutting No', size: 120,
      Cell: ({ cell }) => (
        <span onClick={() => detailviews(cell.row.original)}
          style={{
            color: 'blue',
            cursor: 'pointer'
          }}>
          {cell.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('buyer_name', { header: 'Buyer', size: 120 }),
    columnHelper.accessor('style', { header: 'Style', size: 120 }),
    columnHelper.accessor('ourref', { header: 'OrderNo', size: 120 }),
    columnHelper.accessor('color', { header: 'Color', size: 120 }),
    columnHelper.accessor('fabric_item', { header: 'Fabric Detail', size: 120 }),
    columnHelper.accessor('cutting_master', { header: 'Cutting Master', size: 120 }),
    columnHelper.accessor('orderqty', { header: 'Order Quantity', size: 120 }),
    columnHelper.accessor('orderdate', { header: 'Order Date', size: 120 }),
    columnHelper.accessor(({ delvdate }) => {
      return delvdate.length > 11 ? (
        delvdate.split(',').slice(0, -1).map((dat, index) => {
          const dateObj = new Date(dat.trim());
          console.log(dateObj)
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const year = dateObj.getFullYear();
          const formattedDate = `${day}-${month}-${year}`;
          return <div key={index}>{formattedDate}</div>;
        })
      ) : (
        new Date(delvdate.trim()).toLocaleDateString('en-GB')
      );
    },
      { header: 'Delivery Date', size: 120 }
    ),
    columnHelper.accessor('layerno', { header: 'Layer Number', size: 120 }),
    columnHelper.accessor('tablno', { header: 'Table No', size: 120 }),
    columnHelper.accessor('fabric_use', { header: 'Fabric Used', size: 120 }),
    columnHelper.accessor('grossAverage', { header: 'Gross Average', size: 120 }),
    columnHelper.accessor('layerstart', { header: 'LS DateTime', size: 150 }),
    columnHelper.accessor('layerend', { header: 'LE DateTime', size: 150 }),
    columnHelper.accessor('cuttingstart', { header: 'CS DateTime', size: 150 }),
    columnHelper.accessor('cuttingend', { header: 'CE DateTime', size: 150 }),
    columnHelper.accessor('plies', { header: 'Plies', size: 80 }),
    columnHelper.accessor('totalqty', { header: 'No Of PCS Cut', size: 120 }),
    columnHelper.accessor('cutting_type', { header: 'Cutting_type', size: 120 }),
    columnHelper.accessor('sizelist', {
      header: 'Size',
      size: 120,
      Cell: ({ cell }) => cell.getValue().join(', '),
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }),
    columnHelper.accessor('created_by', { header: 'Created By', size: 150 }),
    columnHelper.accessor('created_at', { header: 'Created At', size: 150 }),
  ];

  const detailviews = (row) => {
    console.log("id=============>", row.id)
    navigate("/dashboard/cutting_route/detail/", {
      state: {
        id: row.id,
      }
    });
  };

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  // const handleExportRows = (rows) => {
  //   const rowData = rows.map((row) => row.original);
  //   const csv = generateCsv(csvConfig)(rowData);
  //   download(csvConfig)(csv);
  // };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const table = useMaterialReactTable({
    columns,
    data,
    editDisplayMode: 'modal',
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: !data.length
      ? { color: 'error', children: 'Error loading data' }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '100px',
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    enableEditing: true,
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',

      },
    },
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

  const obTablePage = () => {
    navigate('/dashboard/cutting_route/cutting1/')
  }

  return (
    <>
      <div className='w-full h-9 flex items-center justify-between  rounded-lg p-2 mb-2'>
        <div className='font-bold text-xl'>Actual Cutting (Layer)</div>
        <div>
          <Button
            onClick={obTablePage}
            variant="contained"
            color="primary"
            className="h-9 float-right mr-2 "
          >
            Add Data
          </Button>
        </div>
      </div>
      <div>
        <MaterialReactTable table={table} />
      </div>
    </>
  );
};

export default Cutting_History;
