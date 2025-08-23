

import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import DjangoConfig from '../../../config/Config';
import { useEffect, useState } from 'react';
import { resetOperations } from '../../../utils/slices/DefectMasterSlice';
import { kajOrder, kajResetProduct1, kajResetProduct2, kajUndo } from '../../../utils/slices/KajButtonSlice';
import { resetRejectOperations } from '../../../utils/slices/RejectMasterSlice';
import { userLogout } from '../../../utils/slices/userSlice';
import { clearRows } from '../../../utils/slices/SewingInputSlice';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { toast } from 'react-toastify';
import { formatDate } from '../../../features/DateUtils';
import { passResetProduct1, passResetProduct2 } from '../../../utils/slices/PassMasterSlice';

const KajButtonScreen = () => {
    const dispatch = useDispatch();
    const [selectedSize, setSelectedSize] = useState('');
    const [sizeData, setSizeData] = useState([]);
    const [sizeInputData, setSizeInputData] = useState([]);
    const [sizeOutputData, setSizeOutputData] = useState([]);
    const [todaySizeCheck, setTodaySizeCheck] = useState([]);
    const [incrementedQuantities, setIncrementedQuantities] = useState([]);
    const [undoHistory, setUndoHistory] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isUndoDisabled, setIsUndoDisabled] = useState(true);
    // const orderItems = useSelector((state) => state.kajButton.items1);
    const orderItems2 = useSelector((state) => state.kajButton.items2);
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);
    const navigate = useNavigate();

    const [orderProcessPlan, setOrderProcessPlan] = useState({ size_wise_tracking: false });

    const fetchOrderProcessesPlan = async () => {
        try {
            const userData2 = {
                // line_id: sewingPlanData.line_id,
                process_id: sewingPlanData.process_id,
                section_id: sewingPlanData.section_id,
                buyer: sewingPlanData.buyer,
                style: sewingPlanData.styleno,
                color: sewingPlanData.color,
                ourref: sewingPlanData.ourref,
                buyer_name: sewingPlanData.buyer_name,
                fun_call :'order_obj'
            };
            const queryParams = new URLSearchParams(userData2).toString();

            console.log("sewingPlanData", sewingPlanData);
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/order_process_view/?${queryParams}`);
            setOrderProcessPlan(response.data.order_obj);
            // if (!response.data.order_obj.qms_track) {
            //     alert("QMS Tracking is disabled. Redirecting to line selection.");
            //     navigate('/line-selection');
            // }
            // console.log("orderProcessPlan Data", response.data.order_obj);
        } catch (err) {
            toast.error('Failed to load processes data');
        }
    };

    // console.log(orderProcessPlan.qms_track)
    useEffect(() => {
        fetchSizeData();
        fetchOutputSizeData();
        fetchOrderProcessesPlan();
    }, []);

    // const handleLogout = () => {
    //     dispatch(resetOperations());
    //     dispatch(kajResetProduct1());
    //     dispatch(kajResetProduct2());
    //     dispatch(resetRejectOperations());
    //     // navigate('/')
    // };

    const fetchSizeData = () => {
        const userData = {
            // id: sewingPlanData?.id || "",
            process_id: sewingPlanData.process_id,
            section_id: sewingPlanData.section_id,
            buyer: sewingPlanData.buyer,
            style: sewingPlanData.styleno,
            color: sewingPlanData.color,
            ourref: sewingPlanData.ourref,
            buyer_name: sewingPlanData.buyer_name,
        };
        const queryParams = new URLSearchParams(userData).toString();
        let url = '';

        if (sewingPlanData.section_name === 'Kaj Button - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`;
        } else if (sewingPlanData.section_name === 'Washing - Output') {
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
            setSizeData(response.data.size_mt_list);
            setSizeInputData(response.data.size_mt_list);
            console.log("Input Data", response.data)
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const fetchOutputSizeData = () => {
        const userData = {
            id: sewingPlanData.id,
            process_id: sewingPlanData.process_id,
            section_id: sewingPlanData.section_id,
            cutting_id: sewingPlanData.cutting_id,
            buyer: sewingPlanData.buyer,
            color: sewingPlanData.color,
            style: sewingPlanData.styleno,
            ourref: sewingPlanData.ourref
        };
        const queryParams = new URLSearchParams(userData).toString();
        let url = '';

        if (sewingPlanData.section_name === 'Kaj Button - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_output_view/?${queryParams}`;
        }
        else if (sewingPlanData.section_name === 'Washing - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_output_view/?${queryParams}`;
        } else {
            console.error('Unknown process_name:', sewingPlanData.section_name);
            return;
        }
        axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            setSizeOutputData(response.data.rtqm_dt_data);
            setTodaySizeCheck(response.data.today_size_qty);
            console.error(' Output data :', response.data);
            console.error('User Data:', userData);
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const getQuantityForSize = (size) => {
        const items = orderItems2.filter(item => item.size === size);
        let totalQuantity = 0;
        items.forEach(item => {
            totalQuantity += item.quantity;
        });
        return totalQuantity;
    };

    const getRemainingQuantity = (size) => {
        if (sizeInputData && sizeInputData.length > 0 || sizeOutputData && sizeOutputData.length > 0) {
            const input = sizeInputData.find(item => item.size === size);
            const output = sizeOutputData.find(item => item.size === size);

            if (input && output) {
                return input.total_input_qty - output.size_count;
            } else if (input) {
                return input.total_input_qty;
            }
        }
        return;
    };

    const handleSizeSelection = (size) => {
        setSelectedSize(size);
    };

    const handleIncrement = () => {
        if (selectedSize) {
            const remainingQuantity = getRemainingQuantity(selectedSize);
            const totalQuantity = getQuantityForSize(selectedSize);
            const currentDate = formatDate(new Date());

            if (remainingQuantity <= 0 || totalQuantity >= remainingQuantity) {
                toast.error("No remaining quantity available for this size.");
            } else {
                const newOrder = { size: selectedSize, quantity: 1, entry_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), entry_date: formatDate(new Date()) };
                dispatch(kajOrder(newOrder));
                setIncrementedQuantities([...incrementedQuantities, newOrder]);
                setUndoHistory([...undoHistory, newOrder]);
                setIsUndoDisabled(false);
            }
        }
    };

    const handleUndo = () => {
        if (undoHistory.length > 0) {
            const lastAction = undoHistory[undoHistory.length - 1];
            dispatch(kajUndo());
            setIsUndoDisabled(true);
            setIncrementedQuantities(incrementedQuantities.filter(item => item !== lastAction));
            setUndoHistory(undoHistory.slice(0, -1));
            if (undoHistory.length === 1) {
                setIsUndoDisabled(true);
            }
        }
    };

    const handleSave = async () => {
        setIsButtonDisabled(true)

        let totalQuantity = 0;
        orderItems2.forEach(item => {
            if (item.quantity) {
                totalQuantity += item.quantity;
            }
        });

        const formData = {
            pass_data: orderItems2,
            rtqm_mt_data: sewingPlanData,
            status: "RFT",
            quantity: totalQuantity
        };

        try {
            const response = await fetch(`${DjangoConfig.apiUrl}/rtqm/rtqm_dt_mt_pass_view/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Add successfully!');
                resetPassStorage2();
                setSelectedSize('');
                setIncrementedQuantities([]);
                fetchOutputSizeData();
                setUndoHistory([]);
                setIsButtonDisabled(false)
            } else {
                toast.error('Failed to Add Pass.');
                setIsUndoDisabled(false);
                setIsButtonDisabled(false)

            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to Add Pass.');
            setIsUndoDisabled(false);
            setIsButtonDisabled(false)

        }
    };

    const resetPassStorage2 = () => {
        dispatch(kajResetProduct2());
    };

    const validationWithoutSize = () => {
        let totalTodayQuantity = 0;


        const totalInputQuantity =sewingPlanData.quantity
        const totalOutputQuantity = sizeOutputData.reduce((accumulator, item) => {
            return accumulator + item.size_count;
        }, 0);

        todaySizeCheck.forEach((item) => {
            totalTodayQuantity += item.size_count;
        });
        // Example of usage
        return {
            totalInputQuantity,
            totalOutputQuantity,
            totalTodayQuantity
        };
    }



    const handleIncrementWitoutSize = () => {
        const { totalInputQuantity, totalOutputQuantity, } = validationWithoutSize();
        let totalAddQuantity = 0;
        orderItems2.forEach(item => {
            totalAddQuantity += item.quantity;
        });

        const remainingQuantity = totalInputQuantity - totalOutputQuantity
        // toast.error(`${}`)
        console.log(remainingQuantity, totalInputQuantity, totalOutputQuantity)

        if (remainingQuantity <= 0 || totalAddQuantity >= remainingQuantity) {
            toast.error("No remaining quantity available for this size.");
        } else {
            const newOrder = { size: null, quantity: 1, entry_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), entry_date: formatDate(new Date()) };
            dispatch(kajOrder(newOrder));
            setIncrementedQuantities([...incrementedQuantities, newOrder]);
            setUndoHistory([...undoHistory, newOrder]);
            setIsUndoDisabled(false);
        }
    }


    const handelBack = () => {
        dispatch(kajResetProduct2())
        dispatch(kajResetProduct1())
        dispatch(passResetProduct1())
        dispatch(passResetProduct2())

        dispatch(clearRows())
        // navigate('/qms-tab/end-line-start')
        navigate('/qms-tab/end-line-start')
    }

    const helpButton = () => {
        navigate('/qms-tab/help-button')
    }

    return (
        <div className="flex flex-col w-full h-full border rounded-md p-4 m-2">
            <div className="flex justify-evenly">
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Buyer</p>
                    <p className="text-sm"> {sewingPlanData.buyer_name} </p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Style</p>
                    <p className="text-sm">{sewingPlanData.styleno} </p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Color</p>
                    <p className="text-sm">{sewingPlanData.color} </p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Quantity</p>
                    <p className="text-sm">{sewingPlanData.quantity} </p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Process</p>
                    <p className="text-sm">{sewingPlanData.process_name} </p>
                    <p className="text-sm">{sewingPlanData.section_name} </p>
                </div>
            </div>

            <div className="flex justify-normal w-full h-72 black-border-1">
                <div className="w-full">
                    <div className='flex flex-wrap mt-1 bg-slate-100 justify-between'>
                        <div className='flex flex-wrap w-auto  justify-around'>
                            <div className='w-44 flex justify-around'>
                                <p>Total Checked:</p>
                                <badge>{sizeOutputData.reduce((acc, item) => acc + item.size_count, 0)}</badge>

                            </div>
                            <div className='w-44 flex justify-around'>
                                <p>Total Add Now:</p>
                                <badge>{todaySizeCheck.reduce((acc, item) => acc + item.size_count, 0)}</badge>
                            </div>
                            <div>
                                <button className='btn  btn-primary w-24 float-end' onClick={helpButton}> Help </button>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>

                    {/* Conditional Rendering of Size Buttons */}
                    {orderProcessPlan.size_wise_tracking && sizeData.length > 0 ? (

                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-2">
                                {sizeData.map((size, index) => (
                                    <div key={index} className="relative w-full bg-blue-500 p-4 h-20 mt-1 rounded-lg shadow-md">
                                        <p className="absolute top-0 left-0 p-4 z-10 text-white text-lg">
                                            {todaySizeCheck.find(so => so.size === size.size)?.size_count || 0}
                                        </p>
                                        <p className="absolute top-0 right-0 p-4 z-10 text-white text-lg">
                                            {getQuantityForSize(size.size)}
                                        </p>
                                        <button
                                            className={`absolute inset-0 w-full h-full text-white text-xl font-semibold ${selectedSize === size.size ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg focus:outline-none`}
                                            onClick={() => handleSizeSelection(size.size)}
                                        >
                                            {size.size}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between p-4 mt-2">
                                <button
                                    onClick={handleIncrement}
                                    className="w-[48%] h-[200px] bg-green-500 text-white text-4xl font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!selectedSize}
                                >
                                    +
                                </button>
                                <button
                                    className="w-[48%] h-[200px] bg-red-500 text-white text-4xl font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isUndoDisabled}
                                    onClick={handleUndo}
                                >
                                    -
                                </button>
                            </div>
                        </>

                    ) : (

                        <div className="flex items-center justify-between p-4 mt-2">
                            <h1>
                                {getQuantityForSize(null)}
                            </h1>
                            <button
                                onClick={handleIncrementWitoutSize}
                                className="w-[48%] h-[200px] bg-green-500 text-white text-4xl font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                            <button
                                className="w-[48%] h-[200px] bg-red-500 text-white text-4xl font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleUndo}
                                disabled={isUndoDisabled}

                            >
                                -
                            </button>
                        </div>

                    )}



                    <div className='mt-20'>
                        <button
                            className={`px-4 py-2 bg-blue-900 w-28 float-end text-white rounded hover:bg-blue-600 mr-2 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handelBack}
                        >
                            Back
                        </button>
                        <button
                            className={`px-4 py-2 bg-blue-900 w-28 float-end text-white rounded hover:bg-blue-600 mr-2 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleSave}
                            disabled={isButtonDisabled}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KajButtonScreen;
