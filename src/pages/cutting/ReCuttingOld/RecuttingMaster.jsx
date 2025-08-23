import { useEffect, useState } from "react";
import axios from "axios";
import DjangoConfig from "../../../config/Config";
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {useDispatch, useSelector} from "react-redux";
import { saveRows } from "../../../utils/slices/SewingInputSlice";
// import makeAnimated from 'react-select/animated';
// const animatedComponents = makeAnimated();


const ReCuttingMaster = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector(state => state.user.userData);
  console.log(userData)
  const [tableData, setTableData] = useState([])

  // console.log("userData", userData)
 

  useEffect(() => {
    fetchcuttingMtData();

  }, [])

  const fetchcuttingMtData = () => {
      axios.get(`${DjangoConfig.apiUrl}/rtqm/recutting_master/`, {
          headers: {
              'Content-Type': 'application/json',
          },
      })
          .then(response => {
              const responseData = response.data.data;
              console.log(responseData)
              setTableData(responseData)
          })
          .catch(error => {
              console.error('Error fetching filtered data:', error);
          });
  };

  // Correctly map the accessor keys to your data fields
  const handleExportRows = (rows) => {
    try {
      if (rows && rows.length > 0 && rows[0].original) {
        const rowData = rows[0].original;
        // console.log("rowData",rowData)
        dispatch(saveRows(rowData));
        console.log("Planing Data", rowData)
        // toast.success(`${response.data.message}`);
        navigate('/cutting-input/recuttinginput/');
      } else {
        console.error('Invalid')
      }

    } catch (error) {
      console.log(error)
    }

  }

  const columnHelper = createMRTColumnHelper();

  const columns = [
    // columnHelper.accessor('id', { header: 'ID', size: 40 }),
    columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 0 }),
    columnHelper.accessor('buyer_name', { header: 'Buyer', size: 120 }),
    columnHelper.accessor('style', { header: 'Style', size: 120 }),
    columnHelper.accessor('ourref', { header: 'OrderNo', size: 120 }),
    columnHelper.accessor('color', { header: 'Color', size: 120 }),
    columnHelper.accessor('totalqty', { header: 'Cut-Qty ', size: 120 }),
    columnHelper.accessor(({ delvdate }) => {
      return delvdate.length > 11 ? (
        delvdate.split(',').slice(0, -1).map((dat, index) => {
          const dateObj = new Date(dat.trim());
          // console.log(dateObj)
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
  columnHelper.accessor('cutting_type', { header: 'Cutting_type', size: 120 }),
    // columnHelper.accessor('orderqty', { header: 'Order Quantity', size: 120 }),
    // columnHelper.accessor('fabric_detail', { header: 'Fabric Detail', size: 120 }),
    // columnHelper.accessor('cutting_master', { header: 'Cutting Master', size: 120 }),
    // columnHelper.accessor('orderdate', { header: 'Order Date', size: 120 }),
    // columnHelper.accessor('cuttingno', {header: 'Cutting No', size: 120}),
    // columnHelper.accessor('layerno', { header: 'Layer Number', size: 120 }),
    // columnHelper.accessor('tablno', { header: 'Table No', size: 120 }),
    // columnHelper.accessor('fabric_use', { header: 'Fabric Used', size: 120 }),
    // columnHelper.accessor('grossAverage', { header: 'Gross Average', size: 120 }),
    // columnHelper.accessor('layerstart', { header: 'LS DateTime', size: 150 }),
    // columnHelper.accessor('layerend', { header: 'LE DateTime', size: 150 }),
    // columnHelper.accessor('cuttingstart', { header: 'CS DateTime', size: 150 }),
    // columnHelper.accessor('cuttingend', { header: 'CE DateTime', size: 150 }),
    // columnHelper.accessor('plies', { header: 'Plies', size: 80 }),
    // columnHelper.accessor('created_by', { header: 'Created By', size: 150 }),
    // columnHelper.accessor('created_at', { header: 'Created At', size: 150 }),
    // columnHelper.accessor('sizelist', {
    //   header: 'Size',
    //   size: 120,
    //   Cell: ({ cell }) => cell.getValue().join(', '),
    //   style: {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   }
    // }),
  ];

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    // state: {
    //   isLoading:  isLoading ? <Skeleton count={5} /> : null,

    // },
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
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          className="text-2xl font-bold"
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Save Data
        </Button>
      </Box>

    ),
  });

  // const obTablePage = () => {
  //   navigate('/dashboard/cutting_route/cutting1/')66
  // }

  return (
    <>
      <section className="bg-white">
        <div className='w-full h-10 flex items-center justify-between z-10 rounded-lg pl-3 pr-8 pt-2 mb-4 '>
        <div className='text-2xl font-bold pl-5'> Pocess Name:&nbsp;&nbsp; {userData.process_name}&nbsp;&nbsp;&nbsp;  Section Name :&nbsp;&nbsp; {userData.section_name}</div>
          {/* <div className="text-2xl mb-1 text-slate-950 font-bold">
            Recutting Master
          </div> */}
        </div>
        {/* ==================================== first form ================================================ */}
        {/* <div className="pl-6 pr-8 bg-white">
        </div> */}

        <div>
          <MaterialReactTable table={table} style={{ paddingLeft: '10px', paddingRight: '10px' }} />
        </div>
      </section>
    </>
  );
};
export default ReCuttingMaster;




