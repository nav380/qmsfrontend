import { useState } from 'react';

const TabTwo = () => {
    // State to keep track of active tab
    const [activeTab, setActiveTab] = useState(1);

    // Function to handle tab click
    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    return (
        <div className="container mx-auto">
            <div className="border-b border-gray-200">
                {/* Tab buttons */}
                <div className="flex">
                    <button
                        className={`text-gray-600 py-2 px-4 inline-block hover:text-gray-800 focus:outline-none ${activeTab === 1
                                ? 'border-b-2 border-gray-800'
                                : 'border-b-2 border-transparent'
                            }`}
                        onClick={() => handleTabClick(1)}
                    >
                       Today & Yesterday (pieces/tags)
                    </button>
                    <button
                        className={`text-gray-600 py-2 px-4 inline-block hover:text-gray-800 focus:outline-none ${activeTab === 2
                                ? 'border-b-2 border-gray-800'
                                : 'border-b-2 border-transparent'
                            }`}
                        onClick={() => handleTabClick(2)}
                    >
                        Past Pieces & Tags
                    </button>
                    {/* <button
                        className={`text-gray-600 py-2 px-4 inline-block hover:text-gray-800 focus:outline-none ${activeTab === 3
                                ? 'border-b-2 border-gray-800'
                                : 'border-b-2 border-transparent'
                            }`}
                        onClick={() => handleTabClick(3)}
                    >
                        Tab 3
                    </button> */}
                </div>
                
                {/* Tab content */}
                <div className="mt-4">
                    <div className={activeTab === 1 ? '' : 'hidden'}>
                        {/* Tab 1 Content */}
                        <div className="container mx-auto w-full rounded ">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white">
                                <h1 className="text-xl font-bold">To be Rectified</h1>
                                <div className="flex items-center space-x-2">
                                    <button className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600">PREVIOUS</button>
                                    <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-700">TODAY</button>
                                    <button className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600">NEXT</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-7 bg-white gap-4 px-1 py-2">
                                <div className="bg-white rounded  p-4">
                                    <p className="font-bold text-gray-500 dark:text-gray-400  mb-2">Buyer</p>
                                    <p>DEMO1</p>
                                </div>
                                <div className="bg-white rounded  p-4">
                                    <p className="font-bold text-gray-500 dark:text-gray-400  mb-2">Style</p>
                                    <p>STYLE1</p>
                                </div>
                                <div className="bg-white rounded  p-4">
                                    <p className="font-bold text-gray-500 dark:text-gray-400  mb-2">PO</p>
                                    <p>P01</p>
                                </div>
                                <div className="bg-white rounded  p-4">
                                    <p className="font-bold text-gray-500 dark:text-gray-400  mb-2">Color</p>
                                    <p>COLORI</p>
                                </div>
                                <div className="bg-white rounded  p-4">
                                    <p className="font-bold text-gray-500 dark:text-gray-400  mb-2">Product type</p>
                                    <p>TYPE1</p>
                                </div>
                                <div className="bg-white rounded  p-4">
                                    <p className="font-bold text-gray-500 dark:text-gray-400  mb-2">Size</p>
                                    <p>M</p>
                                </div>
                                <div className="bg-white rounded p-4 flex justify-center">
                                    <input type='checkbox' className='w-10 text-center border-gray-300 border rounded-md py-2 px-4'/>
                                </div>

                            </div>
                            <div className="px-4 py-3 flex items-center justify-between bg-gray-200 rounded-b">
                                <div>
                                    <p className="text-lg font-bold">Operations and Issues</p>
                                    <p>1 : sew font & back rise : OPEN SEAM/RUN OFF</p>
                                </div>
                                <div>
                                   <p>Time</p><span>1:12 AM </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={activeTab === 2 ? '' : 'hidden'}>
                        {/* Tab 2 Content */}
                        <div className="p-4">
                            <h2 className="text-lg font-bold">Tab 2 Content</h2>
                            <p>This is the content of Tab 2.</p>
                        </div>
                    </div>
                    {/* <div className={activeTab === 3 ? '' : 'hidden'}>
                        <div className="p-4">
                            <h2 className="text-lg font-bold">Tab 3 Content</h2>
                            <p>This is the content of Tab 3.</p>
                        </div>
                    </div> */}
                </div>
                
                {/* Actions buttons */}
                {/* <div className='flex justify-center mt-4'>
                    <button type="button" className="px-20 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                        RECTIFIDE
                    </button>
                    <button type="button" className="px-20 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 ml-4">
                        REJECT
                    </button>
                    <button type="button" className="px-20 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75 ml-4">
                        DEFECTIVES
                    </button>
                </div> */}
                <div className='flex flex-col md:flex-row justify-center mt-4 space-y-2 md:space-y-0 md:space-x-4'>
                    <button type="button" className="w-full md:w-auto px-20 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                        RECTIFIED
                    </button>
                    <button type="button" className="w-full md:w-auto px-20 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 mt-2 md:mt-0">
                        REJECT
                    </button>
                    <button type="button" className="w-full md:w-auto px-20 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75 mt-2 md:mt-0">
                        DEFECTIVES
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TabTwo;
