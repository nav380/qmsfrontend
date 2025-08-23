import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import DjangoConfig from '../../../config/Config';
// import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import Select from 'react-select';
// import Skeleton from "react-loading-skeleton";
// import { toast } from "react-toastify";

const ReadytoLoadHelp = () => {
    const [data, setData] = useState([]);
    // const dispatch = useDispatch();
    const navigate = useNavigate()
    const [sizeQuantityData, setSizeQuantityData] = useState([])
    const [totalInput, setTotalInput] = useState([])
    const [sizeData, setSizeData] = useState([]);

    // const [sizetotalqty, setSizetotalqty] = useState(0)
    // const [sizepreqty, setSizepreqty] = useState(0)
    // const [tilladdqty, settilladdqty] = useState(0)
    // const [preqcutMtData, setPreqcutMtData] = useState([]);
    // const [preqsizebreakup, setPreqSizeBreakup] = useState([]);
    const cuttingMtData = useSelector(state => state.sewingInput.rowData);
    const userlogData = useSelector(state => state.user.userData);
    console.log("Cutting MT Data", cuttingMtData, "User Log Data", userlogData)


    let dataArray = [];
    const createArray = () => {
        if (Array.isArray(sizeData) && sizeData.length > 0) {
            dataArray = sizeData.map((item) => {
                let totalcutqty = 0;
                if (Array.isArray(sizeQuantityData) && sizeQuantityData.length > 0) {
                    const preqcutMtData1 = sizeQuantityData.find(item1 => item1.size === item.size);
                    totalcutqty = preqcutMtData1 ? preqcutMtData1.total_input_qty : 0;
                }
                // console.log(typeof(item.ex_qty), item.ex_qty,typeof(totalcutqty), totalcutqty)
                return {
                    size: item.size,
                    totalQty: item.cutpcs,
                    totalinputData: totalcutqty,
                    balance_qty: item.cutpcs - totalcutqty,
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
        if (userlogData.section_name == "Cutting - Ready to load") {
            const userData = {
                buyer: cuttingMtData.buyer,
                style: cuttingMtData.style,
                ourref: cuttingMtData.ourref,
                color: cuttingMtData.color,
                section_id: userlogData.section_id,
                process_id: userlogData.process_id,
            };
            const queryParams = new URLSearchParams(userData).toString();
            axios.get(`${DjangoConfig.apiUrl}/rtqm/cutting_master/?${queryParams}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                setSizeData(response.data.cutDtData || [])
                console.log("Size Data", response.data.cutDtData)
                fetchSizeQuantityData()
            })
                .catch(error => {
                    console.error('Error fetching filtered data:', error);
                });
        }
        else if (userlogData.section_name == "Re-Cutting") {
            const userData = {
                buyer: cuttingMtData.buyer,
                style: cuttingMtData.style,
                ourref: cuttingMtData.ourref,
                color: cuttingMtData.color,
                fabric_item: cuttingMtData.fabric_item,
                process_id: userlogData.process_id,
                section_id: userlogData.section_id
            };
            // console.log('userData============>', userData)
            const queryParams = new URLSearchParams(userData).toString();
            axios.get(`${DjangoConfig.apiUrl}/rtqm/recutting_input/?${queryParams}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                console.log("total====================>", response.data)
                setSizeData(response.data.data)
                fetchSizeQuantityData()
            })
                .catch(error => {
                    console.error('Error fetching filtered data:', error);
                });

        }
    }

    useEffect(() => {
        fetchSizeData()
        fetchSizeQuantityData()
        if(!userlogData.process_id){
            window.alert("Please Login First")
            console.log("Please Login First")
            navigate('/')
        }
    }, [])

    //  fetching size and sizequantity data from sewing_input_mt 
    const fetchSizeQuantityData = () => {
        if (userlogData.section_name == "Cutting - Ready to load") {
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
            axios.get(`${DjangoConfig.apiUrl}/rtqm/cutting_master/?${queryParams}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                const responseData = response.data.sewinputData
                console.log("Size wise Quantity", responseData)
                setSizeQuantityData(responseData.data)
                setTotalInput(responseData.currentsizewisebreakup)
            })
                .catch(error => {
                    console.error('Error fetching filtered data:', error);
                });
        }
        else if (userlogData.section_name == "Re-Cutting") {
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
            axios.get(`${DjangoConfig.apiUrl}/rtqm/recutting_input/?${queryParams}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                const responseData = response.data.prevsaveData
                console.log("Size wise Quantity", responseData)

                setSizeQuantityData(responseData.data)
                setTotalInput(responseData.currentsizewisebreakup)
            })
                .catch(error => {
                    console.error('Error fetching filtered data:', error);
                });
        }
    }


    // Correctly map the accessor keys to your data fields
    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('size', { header: 'Size', size: 100, style: { align: "center" } }),
        columnHelper.accessor('totalQty', { header: 'Total Cut Qty', size: 120 }),
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
        navigate('/cutting-input/cut-input/')
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
export default ReadytoLoadHelp;