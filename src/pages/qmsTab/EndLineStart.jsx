import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DjangoConfig from '../../config/Config';
import { saveRows } from '../../utils/slices/SewingInputSlice';


const EndLineStart = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const userData = useSelector(state => state.user.userData);
    const [tableData, setTableData] = useState([])


    console.log("userData", userData)

    useEffect(() => {
        fetchPlaningData();
    }, [])


    const fetchPlaningData = () => {
        setIsLoading(true);

        const userData2 = {
            line_id: userData.line_id,
            process_id: userData.process_id,
            section_id: userData.section_id
        };

        console.log("endline", userData2);
        const queryParams = new URLSearchParams(userData2).toString();

        let url = '';

        if (userData.section_name === 'Finishing - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`;
        } else if (userData.section_name === 'Stitching - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`;
        } else if (userData.section_name === 'Kaj Button - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`;
        } else if (userData.section_name === 'Washing - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`;
        }
        else {
            console.error('Unknown process_name:', userData.section_name);
            setIsLoading(false);
            return;
        }

        axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const responseData = response.data.buyer_data;
                console.log(response.data);
                setTableData(responseData);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    const handleExportRows = (rows) => {

        if (rows && rows.length > 0 && rows[0].original) {
            const rowData = rows[0].original;
            const sewingData = {
                id: rowData.id,
                buyer: rowData.buyer,
                styleno: rowData.style,
                color: rowData.color,
                quantity: rowData.total_input_qty,
                delvdate: rowData.delvdate,
                line_id: userData.line_id,
                ourref: rowData.ourref,
                buyer_name: rowData.buyer_name,
                process_name: userData.process_name,
                process_id: userData.process_id,
                section_name: userData.section_name,
                section_id: userData.section_id,
                cutting_id: rowData.cutting_id
            };

            dispatch(saveRows(sewingData));
            if (userData.section_name === 'Kaj Button - Output') {
                navigate('/qms-tab/kaj-button-screen');
            }
            else if (userData.section_name === 'Washing - Output') {
                navigate('/qms-tab/kaj-button-screen');
            }
            else {
                navigate('/qms-tab/qc-section');
            }
        }
        else {
            toast.error("Invalid rows or missing  property")
        }
    };


    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('buyer_name', { header: 'Buyer', size: 20 }),
        columnHelper.accessor('style', { header: 'Style No', size: 20 }),
        columnHelper.accessor('color', { header: 'Color ', size: 20 }),
        columnHelper.accessor('total_input_qty', { header: 'Quantity', size: 20 }),
        columnHelper.accessor('delvdate', { header: 'Delivery Date', size: 20 }),
    ];

    const table = useMaterialReactTable({
        columns,
        data: tableData,
        state: {
            isLoading: isLoading ? <Skeleton count={5} /> : null,
        },
        enableMultiRowSelection: false, //shows radio buttons instead of checkboxes
        enableRowSelection: true,
        enablePagination: false,

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
                }}
            >
                <Button
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Select Planing Line
                </Button>
            </Box>
        ),
    });


    return (
        <div>
            <div className="flex justify-evenly">
                <div className="border-2 w-full items-center pb-2">
                    {/* <p className="text-sm font-medium">Buyer</p>
                    <p className="text-sm">{sewingPlanData.buyer_name}</p> */}
                </div>
                <div className="border-2 w-full items-center pb-2">
                    {/* <p className="text-sm font-medium">Style</p>
                    <p className="text-sm">{sewingPlanData.styleno}</p> */}
                </div>

                <div className="border-2 w-full items-center pb-2">
                    {/* <p className="text-sm font-medium">Color</p>
                    <p className="text-sm">{sewingPlanData.color}</p> */}
                </div>
                <div className="border-2 w-full items-center pb-2">
                    {/* <p className="text-sm font-medium">Quantity</p>
                    <p className="text-sm">{sewingPlanData.quantity}</p> */}
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Process</p>
                    <p className="text-sm">{userData.process_name}</p>
                    <p className="text-sm">{userData.section_name}</p>
                </div>

                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Line</p>
                    <p className="text-sm">{userData.line_name}</p>
                </div>
                {/* </div> */}

            </div>

            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>

        </div>
    );
};

export default EndLineStart;
