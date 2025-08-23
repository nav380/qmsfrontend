import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setRejectSize } from '../../../utils/slice/RejectMasterSlice';
import axios from 'axios';
import DjangoConfig from '../../../config/Config';
const RejectSizeMaster = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [selectedSize, setSelectedSize] = useState('');
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);
    const [sizeData ,setSizeData] = useState([])



    useEffect(() => {
        fetchSizeData();
    }, [])

    const fetchSizeData = () => {
        const userData = {
            id: sewingPlanData.id,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/sewing_line_dt_input/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log("Size wise Quantity",response.data)
            setSizeData(response.data)

        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }


    const handleSizeSelection = (size) => {
        if (selectedSize === size) {
            setSelectedSize('');
        } else {
            setSelectedSize(size);
            dispatch(setRejectSize(size))
            navigate('/qms-tab/reject-Operation-master')


        }
        console.log(size)
    };
    const renderSizeButtons = () => {
        return sizeData.map((size, index) => {
            return (
                <div key={index} className="relative w-full bg-blue-500 p-4 h-16 mt-1 rounded-lg">
                    <button
                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === size.size ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                        onClick={() => handleSizeSelection(size.size)}>
                        {size.size}
                    </button>
                </div>
            );
        });
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
                    <p className="text-sm">{sewingPlanData.styleno}</p>
                </div>
                {/* <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">PO</p>
                    <p className="text-sm">{sewingPlanData.buyer}</p>
                </div> */}
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

    );
};

export default RejectSizeMaster;

