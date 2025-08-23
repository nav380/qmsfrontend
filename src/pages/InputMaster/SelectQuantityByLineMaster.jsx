import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, resetProduct, decrementQuantity } from '../../utils/slices/LineMasterSlice';
import axios from 'axios';
import DjangoConfig from '../../config/Config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
// import { userLogout } from '../../utils/slice/UserSlice';

const SelectQuantityByLineMaster = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const userData = useSelector(state => state.user.userData);
    const [sizeQuantityData, setSizeQuantityData] = useState([])
    const [quantity, setQuantity] = useState(null);
    const [quantityLimit, setQuantityLimit] = useState(null)
    const [counter, setCounter] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const orderItems = useSelector((state) => state.order.items);
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);
    const [sizeData, setSizeData] = useState([])
    const [totalInput, setTotalInput] = useState([])
    const [finishingQuantityLimit, setfinishingQuantityLimit] = useState(0)
    const [orderProcessPlan, setOrderProcessPlan] = useState({ size_wise_tracking: false });

    const fetchOrderProcessesPlan = async () => {
        try {
            const userData2 = {
                line_id: sewingPlanData.line_id,
                process_id: sewingPlanData.process_id,
                section_id: sewingPlanData.section_id,
                buyer: sewingPlanData.buyer,
                style: sewingPlanData.style,
                color: sewingPlanData.color,
                ourref: sewingPlanData.ourref,
                buyer_name: sewingPlanData.buyer_name,
                fun_call : 'order_obj'
            };
            const queryParams = new URLSearchParams(userData2).toString();

            console.log("sewingPlanData", sewingPlanData);
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/order_process_view/?${queryParams}`);
            setOrderProcessPlan(response.data.order_obj);
            console.log("Order Process matching", response.data.order_obj)
            // if (!response.data.order_obj.qms_track) {
            //     alert("QMS Tracking is disabled. Redirecting to line selection.");
            //     navigate('/line-selection');
            // }
            console.log("orderProcessPlan Data", response.data.order_obj);
        } catch (err) {
            toast.error('Failed to load processes data');
        }
    };


    useEffect(() => {
        fetchSizeQuantityData()
        fetchSizeData();
        fetchOrderProcessesPlan()
    }, [])

    const fetchSizeData = () => {
        const userData2 = {
            buyer: sewingPlanData.buyer,
            style: sewingPlanData.style,
            ourref: sewingPlanData.ourref,
            color: sewingPlanData.color,
            process_id: userData.process_id,
            section_id: userData.section_id,
            cutting_id: sewingPlanData.id,
            line_id: userData.line_id,
            id: sewingPlanData?.id || "",

        };
        console.log("userData Data ", userData)
        const queryParams = new URLSearchParams(userData2).toString();
        setfinishingQuantityLimit(sewingPlanData.totalqty)

        let url = '';

        if (userData.section_name === 'Finishing - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/finishing_input_view/?${queryParams}`;
        }
        else if (userData.section_name === 'Stitching - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_input/?${queryParams}`;
        }
        else if (userData.section_name === 'Kaj Button - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/?${queryParams}`;
        }
        else if (userData.section_name === 'Washing - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/?${queryParams}`;
        }
        else if (userData.section_name === 'Packing - MD Point') {
            url = `${DjangoConfig.apiUrl}/rtqm/finishing_input_view?${queryParams}`;
        }
        else {
            console.error('Unknown process_name:', userData.section_name);
            return;
        }

        axios.get(url, {
            headers: {
                'Content-Type': 'application/json',

            },
        }).then(response => {
            console.log("Size mt  Data", response.data)

            setSizeData(response.data.size_list)

        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }


    const fetchSizeQuantityData = () => {
        const userData2 = {
            id: sewingPlanData?.id || "",
            process_id: userData.process_id,
            section_id: userData.section_id,
            buyer: sewingPlanData.buyer,
            style: sewingPlanData.style,
            ourref: sewingPlanData.ourref,
            color: sewingPlanData.color,
        };
        console.log("data userData2", userData2)
        const queryParams = new URLSearchParams(userData2).toString();

        let url = '';

        if (userData.section_name === 'Finishing - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/?${queryParams}`;
        }
        else if (userData.section_name === 'Stitching - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`;
        }
        else if (userData.section_name === 'Kaj Button - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view?${queryParams}`;
        }
        else if (userData.section_name === 'Washing - Input') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view?${queryParams}`;
        }
        else if (userData.section_name === 'Packing - MD Point') {
            url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view?${queryParams}`;
        }
        else {
            console.error('Unknown process_name:', userData.section_name);
            return;
        }
        axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log("Size wise Quantity", response.data)
            setSizeQuantityData(response.data.size_dt_list)
            setTotalInput(response.data.size_mt_list)

        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }


    let totalQuantityBackEnd = 0;

    if (Array.isArray(sizeQuantityData)) {
        sizeQuantityData.forEach(item => {
            totalQuantityBackEnd += item.quantity;

        });
    }
    let totalQuantityInput = 0
    if (Array.isArray(totalInput)) {
        totalInput.forEach((item) => {
            totalQuantityInput += item.total_input_qty

        })
    }


    const handleQuantityChange = (event) => {
        const value = event.target.value;
        setQuantity(value === '' ? '' : parseInt(value, 10) || '');
    };


    const incrementCounter = () => {
        let sQuantity = 0
        if (Array.isArray(sizeQuantityData)) {
            const quantityObj = totalInput.find(item => item.size === selectedSize);
            sQuantity = quantityObj ? quantityObj.total_input_qty : 0;
        }
        if (userData.section_name === 'Finishing - Input' || userData.section_name === 'Packing - MD Point' ) {
          
            
            let qtySize = 0
            let limitproduct = sewingPlanData.totalqty - qtySize
            // console.log("sQuantity", sewingPlanData.totalqty, qtySize.quantity);

            let limitproducts = finishingQuantityLimit - totalQuantityInput
            // console.log("Quantity is will be limited",finishingQuantityLimit,"-----------", sQuantity,"----------",totalQuantityInput,"----",limitproducts);


            if (quantity > limitproducts) {
                toast.error(`Cannot increment . Total product limit  reached. left for add----------- ${limitproducts}`);
                return;
            }
            if (selectedSize) {


                if (!quantity || isNaN(quantity)) {
                    setCounter(1);
                    // saveSizeInput(1);


                } else {
                    if (quantity > limitproducts) {
                        toast.error(`Cannot increment . Total product limit  reached. left for add ${limitproducts}`);
                        return;
                    }
                    setCounter(quantity);
                    saveSizeInput(quantity);

                }
            }

        }
        else {
            let limitproduct = quantityLimit - sQuantity

            if (quantity > limitproduct) {
                toast.error(`Cannot increment . Total product limit  reached. left for add ${limitproduct}`);
                return;
            }
            if (selectedSize) {
                if (!quantity || isNaN(quantity)) {
                    setCounter(1);
                    // saveSizeInput(1);


                } else {
                    if (quantity > limitproduct) {
                        toast.error("Cannot increment further. Total product limit reached.");
                        return;
                    }
                    setCounter(quantity);
                    saveSizeInput(quantity);

                }
            }

        }

    };


    const QuantityIncrementCounter = () => {
        if (selectedSize) {
            if (!quantity || isNaN(quantity)) {
                setQuantity(1);
            } else {
                setQuantity(quantity + 1);
            }
        }
    };
    
    const QuantityDecrementCounter = () => {
        if (selectedSize) {
            if (!quantity || isNaN(quantity)) {
                setQuantity(0);
            } else {
                setQuantity(quantity - 1);
            }
        }
    };

    const handleSizeSelection = (size, total_input_qty) => {
        if (selectedSize === size) {
            setSelectedSize('');
        } else {
            setSelectedSize(size);
            setQuantityLimit(total_input_qty)
            document.getElementById('my_modal_5').showModal()
        }
    };

    // const saveSizeInput = (quantityToSave) => {
    //     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
    //     const currentDate = new Date().toLocaleDateString();
    //     if (selectedSize && quantityToSave > 0) {
    //         const mtData = {
    //             size: selectedSize,
    //             quantity: quantityToSave,
    //             id: sewingPlanData.id,
    //             entry_time: currentTime,
    //             entry_date: currentDate,
    //             process_id: userData.process_id,
    //             section_id: userData.section_id,
    //             line_id: userData.line_id,
    //             cutting_id: sewingPlanData.cutting_id,
    //             buyer: sewingPlanData.buyer,
    //             buyer_name: sewingPlanData.buyer_name,
    //             style: sewingPlanData.style,
    //             ourref: sewingPlanData.ourref,
    //             color: sewingPlanData.color,

    //         }
    //         console.log("mt Data",mtData)
    //         let url = '';

    //         if (userData.section_name === 'Finishing - Input') {
    //             url = `${DjangoConfig.apiUrl}/rtqm/finishing_input_view/`;
    //         }
    //         else if (userData.section_name === 'Stitching - Input') {
    //             url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_input/`;
    //         }
    //         else if (userData.section_name === 'Kaj Button - Input') {
    //             url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/`;
    //         }
    //         else if (userData.section_name === 'Washing - Input') {
    //             url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/`;
    //         }
    //         else if (userData.section_name === 'Packing - MD Point') {
    //             url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/`;
    //         }
            
    //         else {
    //             console.error('Unknown process_name:', userData.section_name);
    //             return;
    //         }
    //         axios.post(url, mtData
    //         ).then(response => {
    //             toast.success(`${response.data.message}`);
    //             dispatch(addOrder({ size: selectedSize, quantity: quantityToSave }));
    //             fetchSizeQuantityData()
    //             setQuantity(null)
    //         })
    //             .catch(error => {
    //                 console.error('Error fetching filtered data:', error);
    //             });

    //     }
    //     if (quantityToSave < 0) {
    //         dispatch(addOrder({ size: selectedSize, quantity: -1 }));
    //     }
    // };



    const saveSizeInput = (quantityToSave) => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const currentDate = new Date().toLocaleDateString();
    
        if (selectedSize && quantityToSave > 0) {
            const mtData = {
                size: selectedSize,
                quantity: quantityToSave,
                id: sewingPlanData.id,
                entry_time: currentTime,
                entry_date: currentDate,
                process_id: sewingPlanData.process_id,
                section_id: sewingPlanData.section_id,
                line_id: sewingPlanData.line_id,
                cutting_id: sewingPlanData.cutting_id,
                buyer: sewingPlanData.buyer,
                buyer_name: sewingPlanData.buyer_name,
                style: sewingPlanData.style,
                ourref: sewingPlanData.ourref,
                color: sewingPlanData.color,
                exists: false // Initialize with false
            };
    
            let url = '';
            switch (sewingPlanData.section_name) {
                case 'Finishing - Input':
                case 'Packing - MD Point':

                    url = `${DjangoConfig.apiUrl}/rtqm/finishing_input_view/`;
                    break;
                case 'Stitching - Input':
                    url = `${DjangoConfig.apiUrl}/rtqm/sewing_line_input/`;
                    break;
                case 'Kaj Button - Input':
                case 'Washing - Input':
                    url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/`;
                    break;
                default:
                    console.error('Unknown section_name:', sewingPlanData.section_name);
                    return;
            }
    
            axios.post(url, mtData)
                .then(response => {
                    if (response.data.exists) {
                        const userConfirmed = window.confirm(response.data.message + " Do you want to continue?");
                        if (userConfirmed) {
                            mtData.exists = true; 
                            axios.post(url, mtData)
                                .then(response => {
                                    toast.success(`${response.data.message}`);
                                    dispatch(addOrder({ size: selectedSize, quantity: quantityToSave }));
                                    fetchSizeQuantityData();
                                    setQuantity(null);
                                })
                                .catch(error => {
                                    console.error('Error saving data after confirmation:', error);
                                });
                        }
                    } else {
                        toast.success(`${response.data.message}`);
                        dispatch(addOrder({ size: selectedSize, quantity: quantityToSave }));
                        fetchSizeQuantityData();
                        setQuantity(null);
                    }
                })
                .catch(error => {
                    console.error('Error checking existing data:', error);
                });
        } else if (quantityToSave < 0) {
            dispatch(addOrder({ size: selectedSize, quantity: -1 }));
        }
    };
    






    const handelChangePLan = () => {
        // handleClearStore()
        navigate('/input-master/line-master');
    }


    const renderSizeButtons = () => {
        return sizeData.map((size, index) => {
            let sQuantity = 0
            let limitQuantity = 0
            if (Array.isArray(sizeQuantityData)) {
                const quantityObj = sizeQuantityData.find(item => item.size === size.size);
                sQuantity = quantityObj ? quantityObj.quantity : 0;
            }
            // console.log(size.size,size.total_input_qty)

            const matchData = totalInput.find((so) => so.size === size.size);
            const totalQuantity = matchData ? matchData.total_input_qty : 0;
            // console.log(size.size,matchData.total_input_qty)
            if (matchData) {
                console.log(limitQuantity = size.total_input_qty - matchData.total_input_qty
                )
            }
            else {
                limitQuantity = size.total_input_qty
            }


            return (

                <div key={index} className="relative w-full bg-blue-500 p-4 h-20 mt-1 rounded-lg shadow-md">
                    {/* <p className="absolute text-white z-10">
                        {sQuantity}
                    </p> */}
                    <p className="absolute top-0 left-0 p-4 z-10 text-white text-lg">{totalQuantity}</p>
                    <p className="absolute top-0 right-0 p-4 z-10 text-white text-lg">{sQuantity}</p>
                    <button
                        className="absolute inset-0 w-full h-full text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none"
                        onClick={() => handleSizeSelection(size.size, size.total_input_qty)}
                    >
                        {size.size}
                    </button>
                </div>
            );
        });
    };

    const handelChangeLine = () => {
        navigate('/line-selection')
        // dispatch(userLogout())
        //         navigate()

    }

    const handleIncrementWitoutSize = () => {
        // const { totalInputQuantity, totalOutputQuantity ,} = validationWithoutSize();
        // let totalAddQuantity = 0;

        const totalOutputQuantity = totalInput.reduce((accumulator, item) => {
            return accumulator + item.total_input_qty;
        }, 0);
        let limitproduct = sewingPlanData.totalqty - totalOutputQuantity
        // toast.success(`${limitproduct} "----------" ${sewingPlanData.totalqty} "-----------${totalOutputQuantity}`)

        if (quantity > limitproduct) {
            toast.error(`Cannot increment . Total product limit  reached. left for add ${limitproduct}`);
            return;
        }

        if (!quantity || isNaN(quantity)) {
            setCounter(1);
            // saveSizeInput(1);


        } else {
            if (quantity > limitproduct) {
                toast.error("Cannot increment further. Total product limit reached.");
                return;
            }
            // setCounter(quantity);
            saveWithoutSizeInput(quantity);
        }

    }

    const saveWithoutSizeInput = (quantityToSave) => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        const currentDate = new Date().toLocaleDateString();
        if (quantityToSave > 0) {
            const mtData = {
                quantity: quantityToSave,
                id: sewingPlanData.id,
                entry_time: currentTime,
                entry_date: currentDate,
                process_id: userData.process_id,
                section_id: userData.section_id,
                line_id: userData.line_id,
                cutting_id: sewingPlanData.cutting_id,
                buyer: sewingPlanData.buyer,
                buyer_name: sewingPlanData.buyer_name,
                style: sewingPlanData.style,
                ourref: sewingPlanData.ourref,
                color: sewingPlanData.color,
            }

            let url = '';

            // if (userData.section_name === 'Finishing - Input') {
            //     url = `${DjangoConfig.apiUrl}/rtqm/finishing_input_view/`;
            // }
            console.log("mt Data",mtData)


            if (userData.section_name === 'Kaj Button - Input') {
                url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/`;
            }
            else if (userData.section_name === 'Washing - Input') {
                url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/`;
            }
            else if (userData.section_name === 'Packing - MD Point') {
                url = `${DjangoConfig.apiUrl}/rtqm/kaj_button_input_view/`;
            }
            else {
                console.error('Unknown process_name:', userData.section_name);
                return;
            }
            axios.post(url, mtData
            ).then(response => {
                toast.success(`${response.data.message}`);
                dispatch(addOrder({ size: selectedSize, quantity: quantityToSave }));
                fetchSizeQuantityData()
                setQuantity(null)
            })
                .catch(error => {
                    console.error('Error fetching filtered data:', error);
                });

        }
        if (quantityToSave < 0) {
            dispatch(addOrder({ size: selectedSize, quantity: -1 }));
        }
    };


    const [decremented, setDecremented] = useState(false);
    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 0 && !decremented) {
            setQuantity(quantity - 1);
            setDecremented(true);
        }
    };

    // const navigate = useNavigate()

    const HistoryPage = () => {
        navigate('/input-master/input-help')
    };



    return (
        <div className="flex flex-col w-full h-full border rounded-md p-4 m-2">
            <div className="flex justify-evenly">
                {/* Display sewingPlanData details */}
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Buyer</p>
                    <p className="text-sm">{sewingPlanData.buyer_name}</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Style</p>
                    <p className="text-sm">{sewingPlanData.style}</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Color</p>
                    <p className="text-sm">{sewingPlanData.color}</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Total Quantity</p>
                    <p className="text-sm">{sewingPlanData.totalqty}</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Process & Section</p>
                    <p className="text-sm">{userData.process_name}</p>
                    <p className="text-sm">{userData.section_name}</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Line</p>
                    <p className="text-sm">{userData.line_name}</p>
                </div>
            </div>
            <div className="flex justify-normal w-full h-72 black-border-1 mt-2">
                <div className="w-full">
                    <div className='flex flex-wrap mt-1 bg-slate-100 justify-between'>
                        <div className='flex flex-wrap w-auto justify-around'>
                            <div className='w-44 flex justify-around'>
                                <p>Total Input Pieces: </p>
                                <badge>{totalQuantityInput}</badge>
                            </div>
                            <div className='w-44 flex justify-around'>
                                <p>Total Add Now: </p>
                                <badge>{totalQuantityBackEnd}</badge>
                            </div>
                        </div>
                        <div>
                            <Button
                                onClick={HistoryPage}
                                variant="contained"
                                color="primary"
                                className="float-right mr-2"
                            >
                                HELP
                            </Button>
                        </div>
                    </div>
                    <div className="gap-2">
                        <div className="px-4 py-3 rounded">
                            {orderProcessPlan.size_wise_tracking ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {renderSizeButtons()}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 mt-2">
                                    <div className="modal-box p-4">
                                        <h3 className="font-bold text-lg"></h3>
                                        <div className="flex items-center mt-4 w-full">
                                            <input
                                                type="number"
                                                value={quantity === null ? '' : quantity}
                                                onChange={handleQuantityChange}
                                                className="border rounded py-1 px-2 text-center flex-grow mr-2"
                                            />
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <button
                                                className="w-full py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
                                                onClick={handleIncrement}
                                            >
                                                +
                                            </button>
                                            <button
                                                className="w-full py-2 bg-red-700 text-white rounded hover:bg-blue-600 ml-2"
                                                onClick={handleDecrement}
                                                disabled={decremented}
                                            >
                                                -
                                            </button>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <form method="dialog">
                                                <button
                                                    className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600 mr-2"
                                                    onClick={handleIncrementWitoutSize}
                                                >
                                                    Save
                                                </button>
                                                <button className="btn">Close</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full mt-10 justify-around">
                        <button className="px-4 py-2 bg-blue-900 w-28 float-end text-white rounded hover:bg-blue-600 mr-2" onClick={handelChangePLan}>
                            Change Plan
                        </button>
                        <button className="px-4 py-2 bg-blue-900 w-28 float-end text-white rounded hover:bg-blue-600 mr-2" onClick={handelChangeLine}>
                            Select Another Line
                        </button>
                    </div>

                    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box p-4">
                            <h3 className="font-bold text-lg">Size: {selectedSize}</h3>
                            <div className="flex items-center mt-4 w-full">
                                <input
                                    type="number"
                                    value={quantity === null ? '' : quantity}
                                    onChange={handleQuantityChange}
                                    className="border rounded py-1 px-2 text-center flex-grow mr-2"
                                />
                            </div>
                            <div className="flex items-center mt-4">
                                <button
                                    className="w-full py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
                                    onClick={QuantityIncrementCounter}
                                >
                                    +
                                </button>
                                <button
                                    className="w-full py-2 bg-red-700 text-white rounded hover:bg-blue-600 ml-2"
                                    onClick={QuantityDecrementCounter}
                                >
                                    -
                                </button>
                            </div>
                            <div className="flex justify-end mt-4">
                                <form method="dialog">
                                    <button
                                        className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600 mr-2"
                                        onClick={incrementCounter}
                                    >
                                        Save
                                    </button>
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>



                </div>
            </div>
        </div>
    );

};

export default SelectQuantityByLineMaster;







