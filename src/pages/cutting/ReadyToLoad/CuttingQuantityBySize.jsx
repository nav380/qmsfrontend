import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, resetProduct, decrementQuantity } from '../../../utils/slices/LineMasterSlice';
import axios from 'axios';
import DjangoConfig from '../../../config/Config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const CuttingQuantityBySize = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [sizeQuantityData, setSizeQuantityData] = useState([])

    const [sizetotalqty, setSizetotalqty] = useState(0)
    const [sizepreqty, setSizepreqty] = useState(0)
    const [tilladdqty, settilladdqty] = useState(0)
    // const [validadd_qty,setValidadd_Qty] = useState([])
    const [quantity, setQuantity] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const cuttingMtData = useSelector(state => state.sewingInput.rowData);
    const userlogData = useSelector(state => state.user.userData);
    const [sizeData, setSizeData] = useState([])
    const [totalInput, setTotalInput] = useState([])
     useEffect(() => {
        if (userlogData === null) {
            alert("Please Login First");
            navigate('/');
        }
    }, [userlogData, navigate]);

    useEffect(() => {
        fetchSizeData()
        fetchSizeQuantityData()
        
    }, [])

    // get sizeData according by cuttingno in setSizeData
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

    // total pcsQuantity counting   (Sewing_input_mt)
    // Total input PCS  
    let totalQuantityBackEnd = 0;
    if (Array.isArray(sizeQuantityData)) {
        sizeQuantityData.forEach(item => {
            totalQuantityBackEnd += item.total_input_qty;
        });
    }
    // console.log("totalQuantityBackEnd",totalQuantityBackEnd)


    // Total add Now
    let totalQuantityInput = 0
    if (Array.isArray(totalInput)) {
        totalInput.forEach((item) => {
            totalQuantityInput += item.input_qty
        })
    }
    // console.log("Total Quantity Input:", totalQuantityInput);

    // console.log("sizeData",sizeData)
    // const getQuantityForSize = (size) => {
    //     const item = orderItems.find(item => item.size === size);
    //     return item ? item.quantity : 0;
    // };

    //  function for input quantity change
    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value);
        const sizeqnty = sizeData.find((item) => item.size === selectedSize)
        setSizetotalqty(sizeqnty.cutpcs)
        const prevqnty = sizeQuantityData.find((item) => item.size === selectedSize)
        let sewdtpreqty = 0
        if (prevqnty === undefined) {
            sewdtpreqty = 0
        }
        else {
            sewdtpreqty = prevqnty.total_input_qty
            settilladdqty(sewdtpreqty)
        }
        setSizepreqty(sewdtpreqty + value)
        setQuantity(value >= 0 ? value : null);
    };


    // total quantity setting  
    let totalProduct = cuttingMtData?.totalqty || 0

    const incrementCounter = () => {
        if (selectedSize) {
            if (!quantity || isNaN(quantity) || quantity === 0) {

                toast.error(`${selectedSize} size add pcs quantity is ${quantity}`)
                // saveSizeInput(1);
            } else {
                if (sizepreqty <= sizetotalqty) {
                    let limitproduct = totalProduct - totalQuantityInput
                    if (quantity > limitproduct) {
                        toast.error(`You Can add only total ${limitproduct} quantity in this style`);
                        return;
                    }
                    else {
                        saveSizeInput(quantity);
                    }
                } else {
                    const nowaddqty = sizetotalqty - tilladdqty
                    toast.error(`${selectedSize} size quantity could not increase more then ${sizetotalqty} and now you can add only ${nowaddqty} quantity`);
                    return;
                }
            }
        }
    };

    const QuantityIncrementCounter = () => {
        if (selectedSize) {
            if (!quantity || isNaN(quantity)) {
                setQuantity(1);
            } else {
                if (quantity <= sizetotalqty) {
                    setQuantity(quantity + 1);
                }
                else {
                    toast.error(`data does not more then ${sizetotalqty}`)
                }
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

    //  set size in size selection (handleSizeSelection function) 
    const handleSizeSelection = (size) => {
        // console.log('handleSizeSelection====',size)
        // console.log('handleSizeSelection==selectedSize==',selectedSize)
        if (selectedSize === size) {
            setSelectedSize('');
        } else {
            setSelectedSize(size);
            document.getElementById('my_modal_5').showModal()
        }
    };

    // data saving in backend
    const saveSizeInput = (quantityToSave) => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const currentDate = new Date().toLocaleDateString();
        if (selectedSize && quantityToSave > 0) {
            const mtData = {
                buyer: cuttingMtData.buyer,
                buyer_name: cuttingMtData.buyer_name,
                style: cuttingMtData.style,
                ourref: cuttingMtData.ourref,
                color: cuttingMtData.color,
                delvdate: cuttingMtData.delvdate,
                size: selectedSize,
                quantity: quantityToSave,
                cutting_id: cuttingMtData.id,
                cuttingno: cuttingMtData.cuttingno,
                entry_time: currentTime,
                entry_date: currentDate,
                process_id: userlogData.process_id,
                section_id: userlogData.section_id,
                user_name: userlogData.username
            }
            console.log("sending data", mtData)
            axios.post(`${DjangoConfig.apiUrl}/rtqm/cutting_master/`, mtData
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

    };

    const handelChangePLan = () => {
        // handleClearStore()
        navigate('/cutting-input/cut-master');
    }
    const MovetoHelpdesk = () => {
        // handleClearStore()
        navigate('/cutting-input/cut-help');
    }


    const renderSizeButtons = () => {
        return sizeData.map((size, index) => {
            let sQuantity = 0
            if (Array.isArray(sizeQuantityData)) {
                const quantityObj = sizeQuantityData.find(item => item.size === size.size);
                sQuantity = quantityObj ? quantityObj.total_input_qty : 0;
                // setValidadd_Qty(sizeQuantityData)
            }
            const matchData = totalInput.filter(so => so.mt_id__size === size.size);
            const dataArray = Object.entries(matchData).map(([key, value]) => ({
                key,
                ...value
            }));
            let sizequant = 0
            const matchDataobject = dataArray.map(item => sizequant += item.input_qty)

            const totalQuantity = matchDataobject ? sizequant : 0;


            return (

                <div key={index} className="relative w-full bg-blue-500 p-4 h-20 mt-1 rounded-lg shadow-md">
                    {/* <p className="absolute text-white z-10">
                        {sQuantity}
                    </p> */}
                    <p className="absolute top-0 left-0 p-4 z-10 text-white text-lg">{sQuantity}</p>
                    <p className="absolute top-0 right-0 p-4 z-10 text-white text-lg">{totalQuantity}</p>
                    <button
                        className="absolute inset-0 w-full h-full text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none"
                        onClick={() => {
                            handleSizeSelection(size.size);
                            setQuantity(' ');
                        }}
                    >
                        {size.size}
                    </button>
                </div>
            );
        });
    };


    return (
        <>

            <div className="flex flex-col w-full h-full border rounded-md p-4 m-2">
                <div className="w-full mt-0 mb-5 flex  justify-between">
                    <div className='text-2xl font-bold pl-5'> Process Name:&nbsp;&nbsp; {(userlogData===null)?"":(userlogData.process_name)}&nbsp;&nbsp;&nbsp;  Section Name :&nbsp;&nbsp; {(userlogData===null)?"":(userlogData.section_name)}</div>
                    <div className='flex justify-end'>
                        <button className="px-4 py-2 bg-blue-900 w-28 float-end text-white rounded hover:bg-blue-600 mr-2" onClick={handelChangePLan}>
                            back
                        </button>
                        <button className="px-4 py-2 bg-blue-900 w-28 float-end text-white rounded hover:bg-blue-600 mr-2" onClick={MovetoHelpdesk}>
                            Help
                        </button>
                    </div>
                </div>
                <div className="flex justify-evenly">
                    <div className="border-2 w-full items-center pb-2 pl-3">
                        <p className="text-sm font-medium">Buyer</p>
                        <p className="text-sm">{cuttingMtData.buyer_name}</p>
                    </div>
                    <div className="border-2 w-full items-center pb-2 pl-3">
                        <p className="text-sm font-medium">Style</p>
                        <p className="text-sm">{cuttingMtData.style}</p>
                    </div>
                    {/* <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium"></p>
                    <p className="text-sm">{cuttingMtData.buyer}</p>
                        </div> */}
                    <div className="border-2 w-full items-center pb-2 pl-3">
                        <p className="text-sm font-medium">Color</p>
                        <p className="text-sm">{cuttingMtData.color}</p>
                    </div>
                    <div className="border-2 w-full items-center pb-2 pl-3">

                        <p className="text-sm font-medium">Total Cut Quantity</p>
                        <p className="text-sm">{cuttingMtData.totalqty}</p>
                    </div>
                    <div className="border-2 w-full items-center pb-2 pl-3">

                        <p className="text-sm font-medium">Order Quantity</p>
                        <p className="text-sm">{cuttingMtData.orderqty}</p>
                    </div>
                </div>
                <div className="flex justify-normal w-full h-72 black-border-1 mt-2">
                    <div className="w-full">
                        <div className='flex flex-wrap mt-1 bg-slate-100 justify-between'>
                            <div className='flex flex-wrap w-auto  justify-around'>
                                <div className='w-44 flex justify-around'>
                                    <p >Total Input Pieces : </p>
                                    <badge>{totalQuantityBackEnd}</badge>
                                </div>
                                <div className='w-44 flex justify-around'>
                                    <p >Total Add Now : </p>
                                    <badge>{totalQuantityInput}</badge>
                                </div>
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


                        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                            <div className="modal-box p-4">
                                <h3 className="font-bold text-lg">Size: {selectedSize}</h3>

                                <div className="flex items-center mt-4 w-full">
                                    <input
                                        type="number"
                                        value={quantity}
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
        </>
    );
};

export default CuttingQuantityBySize;





