import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useNavigate } from 'react-router-dom';



const LineMaster = () => {
    const navigate =useNavigate()

    const handelOnClick =()=>{
        navigate("/dashboard/rtqm/select-quantity-by-master")

    }




    return (
        <div>
            <header className="bg-blue-300 text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        <div className="col-span-1">
                            <h1 className="text-xl font-bold">Buyer </h1>
                            <p className="text-sm">Koala Baby</p>
                        </div>
                        <div className="col-span-1">
                            <h1 className="text-xl font-bold">Style </h1>
                            <p className="text-sm">IPLT20</p>
                        </div>
                        <div className="col-span-1">
                            <h1 className="text-xl font-bold">PO </h1>
                            <p className="text-sm">12345</p>
                        </div>
                        <div className="col-span-1">
                            <h1 className="text-xl font-bold">Color </h1>
                            <p className="text-sm">Black</p>
                        </div>
                    
                        <div className="col-span-1">
                            <h1 className="text-xl font-bold">Product Type</h1>
                            <p className="text-sm">T-Shirt 4</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="line-in-container flex items-center justify-center h-screen">
                <div className="bg-green-500 rounded-lg p-4 grid grid-cols-5 gap-4 w-1/2">
                    <div className="col-span-4 h-20 md:h-32 flex items-center justify-between text-white">
                        <button className="flex-grow bg-transparent focus:outline-none rounded-lg p-2" onClick={handelOnClick}>
                            Line
                        </button>
                        <span className="ml-1 md:ml-2">0</span>
                    </div>
                    <div className="col-span-1 md:col-span-1 bg-gray-200 flex items-center justify-center rounded-lg">
                        <button className="btn bg-transparent w-full h-full text-left" onClick={handelOnClick}>
                            <ArrowUturnLeftIcon className="w-8 h-8 text-black" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineMaster;
