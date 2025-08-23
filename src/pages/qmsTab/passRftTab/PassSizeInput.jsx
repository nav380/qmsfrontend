import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { passOrder, passResetProduct1, passResetProduct2, passUndo } from '../../../utils/slices/PassMasterSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import DjangoConfig from '../../../config/Config';
import { formatDate } from '../../../features/DateUtils';
const PassSizeInput = () => {
    const dispatch = useDispatch();
    // const [quantity, setQuantity] = useState(0)
    const [selectedSize, setSelectedSize] = useState('');

    const orderItems = useSelector((state) => state.passMaster.items1);
    const orderItems2 = useSelector((state) => state.passMaster.items2);
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);
    const navigate = useNavigate()
    const [sizeData, setSizeData] = useState([])
    const [sizeInputData, setSizeInputData] = useState([])
    const [sizeOutputData, setSizeOutputData] = useState([])
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isUndoDisabled, setIsUndoDisabled] = useState(false);
    const [todaySizeCheck, setTodaySizeCheck] = useState([])

    // console.log("sewingPlan Data",sewingPlanData)

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [navigatePath, setNavigatePath] = useState('');



    useEffect(() => {
        fetchSizeData();
        fetchOutputSizeData();

        const handleBeforeUnload = (event) => {
            if (orderItems2.length > 0) {
                const message = "You have unsaved changes. Are you sure you want to leave?";
                event.returnValue = message;
                return message;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [orderItems2]);

    const handleBackNavigation = (path) => {
        if (orderItems2.length > 0) {
            setNavigatePath(path);
            setIsConfirmOpen(true);
        } else {
            navigate(path);
        }
    };

    const handleConfirmNavigation = () => {
        setIsConfirmOpen(false);
        navigate();
    };

    const handleCancelNavigation = () => {
        setIsConfirmOpen(false);
    };

    const fetchSizeData = () => {
        const userData = {
            id: sewingPlanData?.id || "",
            process_id: sewingPlanData.process_id,
            section_id: sewingPlanData.section_id,
            buyer: sewingPlanData.buyer,
            style: sewingPlanData.styleno,
            color: sewingPlanData.color,
            ourref: sewingPlanData.ourref,
            line_id: sewingPlanData.line_id,

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
            setSizeData(response.data.size_mt_list)
            setSizeInputData(response.data.size_mt_list)
            console.log("Size data from swing line", response.data)
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }

    const fetchOutputSizeData = () => {
        const userData = {
            id: sewingPlanData.id,
            process_id: sewingPlanData.process_id,
            section_id: sewingPlanData.section_id,
            cutting_id: sewingPlanData.cutting_id,
            buyer: sewingPlanData.buyer,
            style: sewingPlanData.styleno,
            color: sewingPlanData.color,
            ourref: sewingPlanData.ourref,
            line_id: sewingPlanData.line_id,

        };
        const queryParams = new URLSearchParams(userData).toString();
        let url = '';

        if (sewingPlanData.section_name === 'Finishing - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/rtqm_dt_view/?${queryParams}`;
        } else if (sewingPlanData.section_name === 'Stitching - Output') {
            url = `${DjangoConfig.apiUrl}/rtqm/rtqm_dt_view/?${queryParams}`;
        } else {
            console.error('Unknown process_name:', userData.section_name);
            return;
        }
        axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log("Output size Data", response.data)
            setSizeOutputData(response.data.rtqm_dt_data)
            setTodaySizeCheck(response.data.today_size_qty)
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }

    const renderSizeButtons = () => {
        // Ensure todaySizeCheck is an array
        const safeTodaySizeCheck = todaySizeCheck || [];

        return sizeData.map((size, index) => {
            const matchData = safeTodaySizeCheck.find((so) => so.size === size.size);
            const totalQuantity = matchData ? matchData.size_count : 0;
            return (
                <div key={index} className="relative w-full bg-blue-500 p-4 h-20 mt-1 rounded-lg shadow-md">
                    <p className="absolute top-0 left-0 p-4 z-10 text-white text-lg">{totalQuantity}</p>
                    <p className="absolute top-0 right-0 p-4 z-10 text-white text-lg">{getQuantityForSize(size.size)}</p>
                    <button
                        className="absolute inset-0 w-full h-full text-white text-xl font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none"
                        onClick={() => handleSizeSelection(size.size)}
                    >
                        {size.size}
                    </button>
                </div>
            );
        });
    };



    const getRemainingQuantity = (size) => {
        console.log('get remainig quantity', size)
        // console.log("sizeInputData", sizeInputData, "sizeOutputData", sizeOutputData)
        if (sizeInputData && sizeInputData.length > 0 || sizeOutputData && sizeOutputData.length > 0) {
            const input = sizeInputData.find(item => item.size === size);
            const output = sizeOutputData.find(item => item.size === size);
            if (input && output) {
                return input.total_input_qty - output.total_quantity;
            } else if (input) {
                return input.total_input_qty;
            }
        }
        return;
    };

    const getQuantityForSize = (size) => {
        const items = orderItems2.filter(item => item.size === size);
        let totalQuantity = 0;
        items.forEach(item => {
            totalQuantity += item.quantity;
        });
        return totalQuantity;
    };




    // let limitedQuantity = sewingPlanData?.quantity || 0
    let totalPastQuantity = 0
    if (sizeOutputData) {
        sizeOutputData.forEach(item => {
            totalPastQuantity += item.total_quantity;
        });
    }
    let totalAddQuantity = 0
    if (orderItems2) {
        orderItems2.forEach(item => {
            totalAddQuantity += item.quantity;
        });
    }

    // console.log("orderItems2",orderItems2)
    let totalTodayCheck = 0
    if (todaySizeCheck) {
        todaySizeCheck.forEach((item) => {
            totalTodayCheck += item.size_count
        })
    }


    const handleSizeSelection = (size) => {
        const remainingQuantity = getRemainingQuantity(size);
        const total_quantity = getQuantityForSize(size)
        console.log("remainingQuantity", remainingQuantity, "Total Quantity", total_quantity)
        // const itemIndex = orderItems.findIndex(item => item.size === size);
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        const currentDate = formatDate(new Date())

        if (remainingQuantity <= 0) {
            toast.error("No remaining quantity available for this size.");
            setIsUndoDisabled(false);

        } else if (total_quantity >= remainingQuantity) {
            toast.error("No remaining quantity available for this size.");
            setIsUndoDisabled(false);

        } else {
            dispatch(passOrder({ size: size, quantity: 1, entry_time: currentTime, entry_date: currentDate }));
        }
    };


    const resetPassStorage2 = () => {
        dispatch(passResetProduct2());
    }

    const resetPassStorage1 = () => {
        dispatch(passUndo());
        setIsUndoDisabled(true);
    }



    const handleSave = async () => {
        // console.log("saved redux data ", orderItems);
        // console.log("buyer_data_mt", sewingPlanData);
        setIsButtonDisabled(true);
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
                toast.success('Pass created successfully!');
                navigate('/qms-tab/qc-section');
                resetPassStorage2();
                setSelectedSize('')
            } else {
                toast.error('Failed to Add Pass  .');
                setIsUndoDisabled(false);
                setIsButtonDisabled(false);

            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to Add Pass.');
            setIsUndoDisabled(false);
            setIsButtonDisabled(false);

        }
    };

    const backButton = () => {
        // dispatch(passResetProduct2())
        // dispatch(passResetProduct1())
        navigate('/qms-tab/qc-section')
    }

    const helpButton = () => {
        navigate('/qms-tab/help-button')
    }

    return (
        <div className="flex flex-col w-full border rounded-md p-4 m-2">
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
                </div>
            </div>

            <div className="flex justify-normal w-full h-72 black-border-1">
                <div className="w-full">
                    <div className="gap-2">

                    </div>
                    <div className='flex flex-wrap mt-1 bg-slate-100 justify-between'>
                        <div className='flex flex-wrap w-auto  justify-around'>
                            <div className='w-44 flex justify-around'>
                                <p >Total Checked : </p>
                                {/* <badge>{totalPastQuantity}</badge> */}
                                <badge>{totalTodayCheck}</badge>
                            </div>
                            <div className='w-44 flex justify-around'>
                                <p >Total Add Now : </p>
                                <badge>{totalAddQuantity}</badge>
                            </div>
                        </div>
                        <div className='flex flex-wrap w-auto justify-around space-x-4'>
                            <button className='px-4 py-2 bg-blue-900 w-28 float-start text-white rounded hover:bg-blue-600 mr-2' onClick={helpButton}> Help </button>
                            <button className='btn bg-blue-900 w-24 text-white rounded' disabled={isUndoDisabled} onClick={resetPassStorage1}> Undo </button>
                        </div>
                    </div>
                    <div className="gap-6 mt-2">
                        {sizeData.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {renderSizeButtons()}
                            </div>
                        ) : (
                            <p>No size data available</p>
                        )}
                    </div>


                    <div className='mt-20'>
                        <button
                            className="px-4 py-2 bg-blue-900 w-28 float-start text-white rounded hover:bg-blue-600 mr-2"
                            onClick={() => handleBackNavigation('/qms-tab/qc-section')}
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
                    {isConfirmOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                            <div className="bg-white p-4 rounded shadow-md">
                                <p className="mb-4">You have unsaved changes. Are you sure you want to leave?</p>
                                <div className="flex justify-end space-x-4">
                                    <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleConfirmNavigation}>Yes</button>
                                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={handleCancelNavigation}>No</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PassSizeInput;

