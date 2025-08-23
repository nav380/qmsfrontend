import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, resetProduct, decrementQuantity } from '../../utils/slices/LineMasterSlice';
import { Link } from 'react-router-dom';

const SelectQuantityByLineMaster = () => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(0);
    const [counter, setCounter] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const orderItems = useSelector((state) => state.order.items);

    const getQuantityForSize = (size) => {
        const item = orderItems.find(item => item.size === size);
        return item ? item.quantity : 0;
    };

    let totalQuantity = 0
    orderItems.forEach(item => {
        totalQuantity += item.quantity;
    });
    console.log("Total Quantity (Method 3):", totalQuantity);

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value);
        setQuantity(value >= 0 ? value : 0);
    };
    let totalProduct = 100;
    const incrementCounter = () => {
        if (totalQuantity >= totalProduct) {
            alert("Cannot increment further. Total product limit reached.");
            return;
        }
        if (selectedSize) {

            if (!quantity || isNaN(quantity)) {
                setCounter(1);
                saveOrder(1);
            } else {
                if (totalQuantity + quantity >= totalProduct) {
                    alert("Cannot increment further. Total product limit reached.");
                    return;
                }
                setCounter(quantity);
                saveOrder(quantity);
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

    const decrementCounter = () => {
        if (selectedSize) {
            if (!quantity || isNaN(quantity)) {
                if (counter > 0) {
                    setCounter(1);
                    dispatch(decrementQuantity({ size: selectedSize }));
                }
            } else {
                if (counter > 0) {
                    setCounter(quantity);
                    dispatch(decrementQuantity({ size: selectedSize, quantity }));
                }
            }
        }
    };

    const handleSizeSelection = (size) => {
        if (selectedSize === size) {
            setSelectedSize('');
        } else {
            setSelectedSize(size);
        }
    };

    const saveOrder = (quantityToSave) => {
        if (selectedSize && quantityToSave > 0) {
            dispatch(addOrder({ size: selectedSize, quantity: quantityToSave }));
        }
        if (quantityToSave < 0) {
            dispatch(addOrder({ size: selectedSize, quantity: -1 }));
        }
    };

    const handleClearStore = () => {
        dispatch(resetProduct());
    };
    const handelChangePLan = () =>{
        handleClearStore()
        navigate('/input-master/line-master');
    }

    return (
        <div className="flex flex-col w-full h-full border rounded-md p-4 m-2">
            <div className="flex justify-evenly">
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Buyer</p>
                    <p className="text-sm">KOALA BABY</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Style</p>
                    <p className="text-sm">IPLT20</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">PO</p>
                    <p className="text-sm">12345</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Color</p>
                    <p className="text-sm">RED</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Product Type</p>
                    <p className="text-sm">T-Shirt</p>
                </div>
            </div>

            <div className="flex justify-normal w-full h-72 black-border-1 mt-2">
                <div className="items-center w-1/6 pb-2 border-2 ">
                    <p className="text-sm text-center">Select Quantity</p>
                    
                    
                    <div className="flex items-center justify-center">
                        <button
                            className="px-2 py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
                            onClick={QuantityIncrementCounter}
                        >
                            +
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="border rounded py-1 px-2 text-center flex-grow"
                            style={{ maxWidth: '100px' ,minWidth:'50px' }} // Optional: Set max-width to limit growth
                        />
                        <button
                            className="px-2 py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
                            onClick={QuantityDecrementCounter}
                        >
                            -
                        </button>
                    </div>
                    <div className="flex justify-center mt-4">
                        <h1 className="text-7xl text-red-900 mt-10">{counter}</h1>
                    </div>
                    <div className="flex justify-center mt-10">
                        <button
                            className="px-4 py-2 bg-blue-900 w-28 text-white rounded hover:bg-blue-600 mr-2"
                            onClick={incrementCounter}
                        >
                            + {quantity ? quantity : 1}
                        </button>
                        <button
                            className="px-4 py-2 bg-red-900 w-28 text-white rounded hover:bg-red-600"
                            onClick={decrementCounter}
                        >
                            - 1
                        </button>
                    </div>
                </div>
                
                <div className="w-full">
                    <div className='flex flex-wrap mt-1 bg-slate-500 justify-between'>
                        <div className='flex flex-wrap w-56  justify-around'>
                            <p >Total Add Product : </p>
                            <badge>{totalQuantity}</badge>
                        </div>
                        <div>
                            <button className='btn  btn-primary w-24 float-end' onClick={handleClearStore}> clear </button>
                        </div>


                    </div>
                    <div className="gap-2">
                        <div>
                            <div className="flex flex-wrap w-full h-24 mt-2  justify-evenly">
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>{getQuantityForSize('AAA')}</p>
                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'AAA' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('AAA')}>
                                        AAA
                                    </button>
                                </div>
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>{getQuantityForSize('BBB')}</p>
                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'BBB' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('BBB')}>
                                        BBB
                                    </button>
                                </div>
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>{getQuantityForSize('XXS')}</p>
                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'XXS' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('XXS')}>
                                        XXS
                                    </button>
                                </div>
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>{getQuantityForSize('XS')}</p>
                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'XS' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('XS')}>
                                        XS
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap w-full h-24 mt-2 justify-evenly">
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>{getQuantityForSize('S')}</p>
                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'S' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('S')}>
                                        S
                                    </button>
                                </div>
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>{getQuantityForSize('M')}</p>
                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'M' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('M')}>
                                        M
                                    </button>
                                </div>
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>{getQuantityForSize('L')}</p>
                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'L' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('L')}>
                                        L
                                    </button>
                                </div>
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>{getQuantityForSize('XL')}</p>
                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'XL' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('XL')}>
                                        XL
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap w-full h-24 mt-2  justify-evenly">
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>{getQuantityForSize('XXL')}</p>
                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'XXL' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('XXL')}>
                                        XXL
                                    </button>
                                </div>
                                <div className="relative w-1/5 bg-blue-500  rounded-lg">
                                    <p className='absolute top-0 right-0 z-10 bg-black text-white text-center border-1 rounded-md flex justify-center items-center whitespace-nowrap px-2 py-1'>
                                        {getQuantityForSize('XXXL')}
                                    </p>

                                    <button
                                        className={`btn btn-primary absolute inset-0 w-full h-full text-lg ${selectedSize === 'XXXL' ? 'bg-blue-800 text-white' : 'bg-blue-400 text-white'}`}
                                        onClick={() => handleSizeSelection('XXXL')}>
                                        XXXL
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="w-full mt-4  justify-around">
                        <Link to='line-master'>
                        <button className="px-4 py-2 bg-blue-900 w-28 float-end text-white rounded hover:bg-blue-600 mr-2" onClick={saveOrder}>
                        Done_By_ME
                        </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SelectQuantityByLineMaster;


