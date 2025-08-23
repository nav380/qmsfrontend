import {
    MaterialReactTable,
    useMaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DjangoConfig from '../../config/Config';
import { useLocation, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const InputHelp = () => {
    // State to hold the data
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userData = useSelector(state => state.user.userData);
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the data when the component mounts
        const fetchData = async () => {
            const userData2 = {
                id: sewingPlanData?.id || "",
                process_id: sewingPlanData.process_id,
                section_id: sewingPlanData.section_id,
                buyer: sewingPlanData.buyer,
                style: sewingPlanData.style,
                ourref: sewingPlanData.ourref,
                color: sewingPlanData.color,
                line_id: sewingPlanData.line_id
            };
            console.log("data userData2", userData2)
            const queryParams = new URLSearchParams(userData2).toString();
            try {
                const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/history_qms/?${queryParams}`);
                setData(response.data.size_data);
                console.log("size data", response.data.size_data)
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    const columnHelper = createMRTColumnHelper();

    const headerNames = {
        serialNumber: 'S/N',
        size: 'Size',
        orderQuantity: 'Order Quantity',
        exQuantity: 'EX Quantity',
        prevQuantity: data.length > 0 ? data[0].prev_section_name : 'Prev Quantity',
        totalInput: data.length > 0 ? data[0].input_section_name : 'Total Input',
        balance: 'Balance'
    };

    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: headerNames.serialNumber, size: 40 }),
        columnHelper.accessor('size', { header: headerNames.size, size: 100, style: { textAlign: 'center' } }),
        columnHelper.accessor('order_qty', { header: headerNames.orderQuantity, size: 100, style: { textAlign: 'center' } }),
        columnHelper.accessor('ex_qty', { header: headerNames.exQuantity, size: 100, style: { textAlign: 'center' } }),
        columnHelper.accessor('prev_quantity', { header: headerNames.prevQuantity, size: 120 }),
        columnHelper.accessor('total_input', { header: headerNames.totalInput, size: 120 }),
        columnHelper.accessor('balance', { header: headerNames.balance, size: 120 }),
    ];

    // CSV configuration
    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    // Handle export data
    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    // MaterialReactTable configuration
    const table = useMaterialReactTable({
        columns,
        data,
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

    // Handle back button click
    const handleBack = () => {
        navigate(-1);
    };


    let totalInput = 0
    let totalOutput = 0

    if (Array.isArray(data)) {
        data.forEach((item) => {
            totalInput += item.total_input
            totalOutput += item.prev_quantity
        })
    }


    return (
        <section className="bg-white p-4">
            <div className="w-full h-16 flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 mb-4 shadow-md">
                <div className="text-2xl text-gray-800 font-bold">
                    Size Wise Quantity
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-600">
                        {data.length > 0 ? data[0].prev_section_name : 'Prev Quantity'}
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">{totalOutput}</h1>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-600">
                        {data.length > 0 ? data[0].input_section_name : 'Input Quantity'}
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">{totalInput}</h1>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Balance</p>
                    <h1 className="text-xl font-semibold text-gray-900">{totalOutput - totalInput}</h1>
                </div>
                <div className="flex items-center">
                    <Button
                        onClick={handleBack}
                        variant="contained"
                        color="primary"
                        className="float-right"
                    >
                        Back
                    </Button>
                </div>
            </div>
            {/* Table display */}
            <div className="px-4">
                <MaterialReactTable table={table} />
            </div>
        </section>

    );
};

export default InputHelp;
