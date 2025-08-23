import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { passOrder, passResetProduct1, passResetProduct2, passDecrementQuantity } from '../../../utils/slice/PassMasterSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import DjangoConfig from '../../../config/Config';
const PassSizeInput = () => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const orderItems = useSelector((state) => state.passMaster.items1);
    const orderItems2 = useSelector((state) => state.passMaster.items2);

    const sewingPlanData = useSelector(state => state.sewingInput.rowData);
    const navigate = useNavigate()
    const [sizeData, setSizeData] = useState([])


    useEffect(() => {
        fetchSizeData();
    }, [])

    const fetchSizeData = () => {
        const userData = {
            mt_id: sewingPlanData.id,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            setSizeData(response.data)

        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }


    const renderSizeButtons = () => {
        return sizeData.map((size, index) => (
            <div key={index} className="relative w-full bg-blue-500 p-4 h-20 mt-1 rounded-lg shadow-md">
                <p className="absolute text-white z-10">{getQuantityForSize(size.size)}</p>
                <button
                    className="absolute inset-0 w-full h-full text-white text-xl font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none"
                    onClick={() => handleSizeSelection(size.size)}
                >
                    {size.size}
                </button>
            </div>
        ));
    };


    const getQuantityForSize = (size) => {
        const item = orderItems.find(item => item.size === size);
        return item ? item.quantity : 0;
    };

    let limitedQuantity = sewingPlanData?.quantity || 0
    let totalQuantity = 0
    if (orderItems) {
        orderItems.forEach(item => {
            totalQuantity += item.quantity;
        });
    }


    const handleSizeSelection = (size) => {
        const itemIndex = orderItems.findIndex(item => item.size === size);
        if (limitedQuantity <= totalQuantity) {
            toast.error("Reached Limit");
        } else {

            if (itemIndex !== -1) {
                dispatch(passOrder({ size: size, quantity: 1 }));
                saveOrder(1)

            } else {
                dispatch(passOrder({ size: size, quantity: 1 }));
            }
        }
    };

    const saveOrder = (quantityToSave) => {
        if (selectedSize && quantityToSave !== 0) {
            if (quantityToSave > 0) {
                dispatch(passOrder({ size: selectedSize, quantity: quantityToSave  }));
            } else {
                dispatch(passOrder({ size: selectedSize, quantity: -1 }));
            }
        }
    };
    // console.log('orderItems2',orderItems2)
    // console.log('orderItems1',orderItems)

    const resetPassStorage2 = () => {
        dispatch(passResetProduct2());
    }

    const resetPassStorage1 = () => {
        dispatch(passResetProduct1());
    }

    const handelSave = async () => {
        // console.log("saved redux data ", orderItems);
        // console.log("buyer_data_mt", sewingPlanData);
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
            } else {
                toast.error('Failed to Add Pass .');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to Add Pass.');
        }
    };



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
            </div>

            <div className="flex justify-normal w-full h-72 black-border-1">
                <div className="w-full">
                    <div className="gap-2">

                    </div>
                    <div className='flex flex-wrap mt-1 bg-slate-100 justify-between'>
                        <div className='flex flex-wrap w-56  justify-around'>
                            <p >Total Add Product : </p>
                            <badge>{totalQuantity}</badge>
                        </div>
                        <div>
                            {/* <button className='btn  btn-primary w-24 float-end' onClick={resetPassStorage1}> clear </button> */}
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
                    <div className='mt-10'>
                        <button className="px-4 py-2 bg-blue-900 w-28 float-end text-white rounded hover:bg-blue-600 mr-2" onClick={handelSave}>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassSizeInput;

