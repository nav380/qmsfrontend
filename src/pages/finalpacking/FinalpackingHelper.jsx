import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import DjangoConfig from '../../config/Config';
// import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const FinalpackingHelper = () => {
    const [data, setData] = useState([]);
    // const dispatch = useDispatch();
    const navigate = useNavigate()
    const [sizeQuantityData, setSizeQuantityData] = useState([])
    const [totalInput, setTotalInput] = useState([])
    const [sizeData, setSizeData] = useState([]);
    const cuttingMtData = useSelector(state => state.sewingInput.rowData);
    const userlogData = useSelector(state => state.user.userData);
    // const [sizetotalqty, setSizetotalqty] = useState(0)
    // const [sizepreqty, setSizepreqty] = useState(0)
    // const [tilladdqty, settilladdqty] = useState(0)
    // const [preqcutMtData, setPreqcutMtData] = useState([]);
    // const [preqsizebreakup, setPreqSizeBreakup] = useState([]);
    console.log("Cutting MT Data", cuttingMtData, "User Log Data", userlogData)


    let dataArray = [];
    const createArray = () => {
        if (Array.isArray(sizeData) && sizeData.length > 0) {
            dataArray = sizeData.map((item) => {
                let totalcutqty = 0;
                let todaycutqty = 0;
                if (Array.isArray(sizeQuantityData) && sizeQuantityData.length > 0) {
                    const preqcutMtData1 = sizeQuantityData.find(item1 => item1.size === item.size);
                    totalcutqty = preqcutMtData1 ? preqcutMtData1.quantity : 0;
                }
                if (Array.isArray(totalInput) && totalInput.length > 0) {
                    const preqcutMtData2 = totalInput.find(item2 => item2.size === item.size);
                    if (preqcutMtData2 === undefined) {
                        console.log("preqcutMtData2", preqcutMtData2)
                    }
                    else {
                        console.log("preqcutMtData2", preqcutMtData2)
                        todaycutqty = preqcutMtData2 ? preqcutMtData2.input_qty : 0;
                    }
                }
                // console.log(typeof(item.ex_qty), item.ex_qty,typeof(totalcutqty), totalcutqty)
                return {
                    size: item.size,
                    orderQty: item.orderqty,
                    order_ex_Qty: item.order_ex_qty,
                    totalpackmdqty:item.total_input_qty   ,
                    totalinputData: totalcutqty,
                    todayinputqty: todaycutqty || 0,
                    balance_qty: item.total_input_qty - totalcutqty,
                };
            });
        }
        return dataArray;
    }
    useEffect(() => {
        const newData = createArray();
        setData(newData);
    }, [sizeData, totalInput, sizeQuantityData])


    console.log('Final data Sizewise --->', data, "Total Qty", sizeData, 'input qty', sizeQuantityData, 'todayinputqty', totalInput)

    const fetchSizeData = () => {
        const userData = {
            buyer: cuttingMtData.buyer,
            style: cuttingMtData.style,
            ourref: cuttingMtData.ourref,
            color: cuttingMtData.color,
            section_id: userlogData.section_id,
            process_id: userlogData.process_id,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/final_packing_view/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const responseData = response.data.final_packing_Dt
            setSizeData(responseData[0].SizewiseData)
            console.log("Size Data", responseData[0].SizewiseData)
            fetchSizeQuantityData()
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });


    }

    useEffect(() => {
        fetchSizeData()
        fetchSizeQuantityData()
        if (!userlogData.process_id) {
            window.alert("Please Login First")
            console.log("Please Login First")
            navigate('/')
        }
    }, [])

    //  fetching size and sizequantity data from sewing_input_mt 
    const fetchSizeQuantityData = () => {
        const userData = {
            cutting_id: cuttingMtData.id,
            buyer: cuttingMtData.buyer,
            style: cuttingMtData.style,
            ourref: cuttingMtData.ourref,
            color: cuttingMtData.color,
            section_id: userlogData.section_id,
            process_id: userlogData.process_id,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/final_packing_dt_view/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const responseData = response.data.final_packing_data
            console.log("Size wise Quantity", responseData.fpackingMtData,'and',responseData.today_input_Data)
            setSizeQuantityData(responseData.fpackingMtData)
            setTotalInput(responseData.today_input_Data)
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }




    // Correctly map the accessor keys to your data fields
    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('size', { header: 'Size', size: 100, style: { align: "center" } }),
        columnHelper.accessor('totalpackmdqty', { header: 'Total Md pack Qty', size: 120 }),
        columnHelper.accessor('todayinputqty', { header: 'Today Input Qty', size: 120 }),
        columnHelper.accessor('totalinputData', { header: 'Total Input Qty', size: 120 }),
        columnHelper.accessor('balance_qty', { header: 'Balance input Qty', size: 120 }),

    ];

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    // const handleExportData = () => {
    //     const csv = generateCsv(csvConfig)(data);
    //     download(csvConfig)(csv);
    // };

    const table = useMaterialReactTable({
        columns,
        data,
        // enableRowSelection: true,
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
                {/* <Button
                        onClick={handleExportData}
                        startIcon={<FileDownloadIcon />}
                    >
                        Export All Data
                    </Button> */}
            </Box>
        ),
    });

    const obTablePage = () => {
        navigate('/final-pack/finalpack-input/')
    }

    return (
        <>
            <section className="bg-white">
                <div className='w-full h-10 flex items-center justify-between z-10 rounded-lg pl-3 pr-8 pt-2 mb-4 '>
                    <div className='text-2xl font-bold pl-5'> Process Name:&nbsp;&nbsp; {userlogData.process_name}&nbsp;&nbsp;&nbsp;  Section Name :&nbsp;&nbsp; {userlogData.section_name}</div>
                    {/* <div className="text-2xl mb-1 text-slate-950 font-bold">
                         Ready to Load Size wise Quantity
                    </div> */}
                    <div>
                        <Button
                            onClick={obTablePage}
                            variant="contained"
                            color="primary"
                            className="float-right mr-2 "
                        >
                            Back
                        </Button>
                    </div>
                </div>
               
                <div>
                    <MaterialReactTable table={table} style={{ paddingLeft: '10px', paddingRight: '10px' }} />
                </div>
            </section>

        </>
    );
};
export default FinalpackingHelper;