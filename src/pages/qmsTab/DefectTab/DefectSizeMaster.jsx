import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSize } from '../../../utils/slices/DefectMasterSlice';
import axios from 'axios';
import DjangoConfig from '../../../config/Config';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
const DefectSizeMaster = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [selectedSize, setSelectedSize] = useState('');
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);
    const [sizeData, setSizeData] = useState([])
    const [sizeOutputData, setSizeOutputData] = useState([])



    useEffect(() => {
        fetchSizeData();
        fetchOutputSizeData()
    }, [])

    const fetchSizeData = () => {
        const userData = {
            id: sewingPlanData.id,
            process_id : sewingPlanData.process_id,
            section_id : sewingPlanData.section_id,
            buyer   : sewingPlanData.buyer,
            style : sewingPlanData.styleno,
            color : sewingPlanData.color,
            ourref :sewingPlanData.ourref,
            line_id : sewingPlanData.line_id,
        };
        const queryParams = new URLSearchParams(userData).toString();
        let url = ''; 
    
        if (sewingPlanData.section_name === 'Finishing - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`;
        } else if (sewingPlanData.section_name === 'Stitching - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`;
        } else {
            console.error('Unknown process_name:', userData.section_name);
            return;
        }
        axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log("Size wise Quantity", response.data)
            setSizeData(response.data.size_mt_list)
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }


    
    const fetchOutputSizeData = () => {
        const userData = {
            id: sewingPlanData.id,
            process_id : sewingPlanData.process_id,
            section_id : sewingPlanData.section_id,
            buyer   : sewingPlanData.buyer,
            style : sewingPlanData.styleno,
            color : sewingPlanData.color,
            ourref :sewingPlanData.ourref,
            line_id : sewingPlanData.line_id,
            
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/rtqm_dt_view/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log("Output size Data",response.data)
            setSizeOutputData(response.data.rtqm_dt_data)
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }


   


    const getRemainingQuantity = (size) => {
        console.log('get remainig quantity', size)
        console.log("sizeInputData", sizeData, "sizeOutputData", sizeOutputData)
        if (sizeData && sizeData.length > 0 || sizeOutputData && sizeOutputData.length > 0) {
            const input = sizeData.find(item => item.size === size);
            const output = sizeOutputData.find(item => item.size === size);
            if (input && output) {
                return input.total_input_qty - output.total_quantity;
            } else if (input) {
                return input.total_input_qty;
            }
        }
        return;
    };
   

    const handleSizeSelection = (size) => {
        const remainingQuantity = getRemainingQuantity(size);

        console.log("remainingQuantity", remainingQuantity)
        if (remainingQuantity <= 0) {
            toast.error("No remaining quantity available for this size.");
        }
        else {
            setSelectedSize(size);
            dispatch(setSize(size))
            navigate('/qms-tab/operation-master-select')
            // toast.success("message done")
        }
    };



    const renderSizeButtons = () => {
        return sizeData.map((size, index) => {
            return (
                <div key={index} className="relative w-full bg-blue-500 p-4 mt-1 rounded-lg">
                    <button
                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === size.size ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                        onClick={() => handleSizeSelection(size.size)}>
                        {size.size}
                    </button>
                </div>
            );
        });
    };


    const backButton = () => {
        navigate('/qms-tab/qc-section')
    }

    return (
        <>
            <div className="flex flex-col w-full border rounded-md p-4 m-2">
                <div className="flex justify-evenly">
                    <div className="border-2 w-full items-center pb-2">
                        <p className="text-sm font-medium">Buyer</p>
                        <p className="text-sm"> {sewingPlanData.buyer_name} </p>
                    </div>
                    <div className="border-2 w-full items-center pb-2">
                        <p className="text-sm font-medium">Style</p>
                        <p className="text-sm">{sewingPlanData.styleno}</p>
                    </div>
                    <div className="border-2 w-full items-center pb-2">
                        <p className="text-sm font-medium">Color</p>
                        <p className="text-sm">{sewingPlanData.color}</p>
                    </div>
                    <div className="border-2 w-full items-center pb-2">
                        <p className="text-sm font-medium">Total Quantity </p>
                        <p className="text-sm">{sewingPlanData.quantity}</p>
                    </div>
                </div>
                <div className="flex justify-normal w-full h-72 black-border-1">
                    <div className="w-full">
                        <div className='flex flex-wrap mt-1 bg-slate-500 justify-between'>
                            <div className='flex flex-wrap w-56  justify-around'>
                                <p >Total Add Product : </p>
                                {/* <badge>{totalQuantity}</badge>  */}
                            </div>
                            <div>
                                {/* <button className='btn  btn-primary w-24 float-end' onClick={handleClearStore}> clear </button> */}
                            </div>
                        </div>
                        <div className="gap-2">
                            <div className="px-4 py-3  rounded">
                                {sizeData.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {renderSizeButtons()}
                                    </div>
                                ) : (
                                    <p>No size data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Button
                onClick={backButton}
                variant="contained"
                color="primary"
                className="mr-2 float-end"
            >
                Back
            </Button>

        </>



    );
};

export default DefectSizeMaster;

