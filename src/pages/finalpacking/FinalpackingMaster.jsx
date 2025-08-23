import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DjangoConfig from '../../config/Config';
import { saveRows } from "../../utils/slices/SewingInputSlice";
// import { toast } from 'react-toastify';


const FinalpackingMaster = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userData = useSelector(state => state.user.userData);
    console.log(userData)
    const [tableData, setTableData] = useState([])

    // console.log("userData", userData)


    useEffect(() => {
        fetchPlaningData();

    }, [])

    const fetchPlaningData = () => {
        const usersendData = {
            process_id: userData.process_id,
            section_id: userData.section_id,
        };
        // console.log('userData============>', userData)
        const queryParams = new URLSearchParams(usersendData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/final_packing_view/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const responseData = response.data.final_packing_Mt
                console.log("-------------------------",responseData)
                setTableData(responseData)
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const handleExportRows = (rows) => {
        try {
            if (rows && rows.length > 0 && rows[0].original) {
                const rowData = rows[0].original;
                // console.log("rowData",rowData)
                dispatch(saveRows(rowData));
                console.log("Planing Data", rowData)
                // toast.success(`${response.data.message}`);
                navigate('/final-pack/finalpack-input/');
            } else {
                console.error('Invalid')
            }

        } catch (error) {
            console.log(error)
        }

    }


    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('buyer', { header: 'Buyer', size: 20 }),
        columnHelper.accessor('style', { header: 'Style No', size: 20 }),
        columnHelper.accessor('color', { header: 'Color ', size: 20 }),
        columnHelper.accessor('ourref', { header: 'ourref', size: 20 }),
        columnHelper.accessor('total_input_qty', { header: 'Total Quantity', size: 20 }),
        columnHelper.accessor('order_qty', { header: 'OrderQuantity', size: 20 }),
        columnHelper.accessor('order_exe_qty', { header: 'Ex_Order_Qty', size: 20 }),
        columnHelper.accessor(({ orderdate }) => {
            if (orderdate) {
                const dateObj = new Date(orderdate);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const year = dateObj.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;
                return formattedDate
            } else {
                return 'DD-MM-YYYY'
            }
        }, { header: 'order date', size: 20 }),
        columnHelper.accessor(({ delvdate }) => {
            // Check if delvdate is valid and not null or undefined
            if (delvdate && typeof delvdate === 'string') {
                return delvdate.length > 11 ? (
                    delvdate.split(',').slice(0, -1).map((dat, index) => {
                        const trimmedDate = dat.trim();

                        // Check if trimmedDate is a valid date string
                        if (trimmedDate) {
                            const dateObj = new Date(trimmedDate);
                            const day = String(dateObj.getDate()).padStart(2, '0');
                            const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                            const year = dateObj.getFullYear();
                            const formattedDate = `${day}-${month}-${year}`;
                            return <div key={index}>{formattedDate}</div>;
                        } else {
                            return <div key={index}>Invalid Date</div>;
                        }
                    })
                ) : (
                    // Check if delvdate is a valid date before trimming
                    new Date(delvdate.trim()).toLocaleDateString('en-GB')
                );
            } else {
                // Return a default value if delvdate is null or undefined
                return 'DD-MM-YYYY';
            }
        },
            { header: 'Delivery Date', size: 120 }
        ),

    ];
    // columnHelper.accessor('pcs_checked', { header: 'Checked pcs', size: 20 }),


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
                Show Data
                </Button>
            </Box>

        ),
    });

    return (
        <div>
            {/* <div className="h-8 absolute top-5 left-[35%] text-ms font-medium w-full  z-10">Process Name:&nbsp;&nbsp;{userData.process_name}&nbsp;&nbsp;&nbsp;&nbsp;   Section Name:&nbsp;&nbsp;{userData.section_name} </div> */}
            <div className='text-2xl font-bold pl-5'>Final Packing Master</div>
            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>

        </div>
    );
};

export default FinalpackingMaster;
