// import { Button } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import DjangoConfig from '../../../config/Config';
// import axios from 'axios';
// const OrderProPlan = () => {
//     const navigate = useNavigate()
//     const location = useLocation();
//     const [tableData, setTableData] = useState([])
//     const [isEditing, setIsEditing] = useState(false)
//     const queryParams = new URLSearchParams(location.search);
//     const buyer = queryParams.get('buyer');
//     const style = queryParams.get('style');
//     const color = queryParams.get('color');
//     const ourref = queryParams.get('ourref');


//     useEffect(() => {
//         fetchProcessesPlan();
//     }, [buyer, style, color, ourref]);

//     const fetchProcessesPlan = async () => {
//         try {
//             const params = new URLSearchParams({
//                 buyer,
//                 style,
//                 color,
//                 ourref
//             });

//             let response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/order_process_view/`, { params });
//             console.log(response.data);
//             setTableData(response.data.op_data);
//         } catch (err) {
//             console.error('Error fetching data:', err);
//         }
//     };


//     const [editRowIndex, setEditRowIndex] = useState(null);

//     const handleInputChange = (rowIndex, index, field, value) => {
//         const updatedData = [...tableData];
//         updatedData[rowIndex].section[index][field] = value;
//         setTableData(updatedData);
//     };

//     const handleSave = (id) => {
//         const sectionToUpdate = tableData.flatMap(row => row.section).find(sec => sec.id === id);
//         const data = {
//             formData: {
//                 section: sectionToUpdate.section,
//                 qms_track: sectionToUpdate.qmsTrack,
//                 sequence: sectionToUpdate.sectionSeq,
//                 size_wise_tracking: sectionToUpdate.sizeWiseTracking,
//                 tracking: sectionToUpdate.trackPercentage,
//                 id: sectionToUpdate.id
//             }
//         };
//         console.log("selected data", data)
//         axios.post(`${DjangoConfig.apiUrl}/rtqm/order_process_view/`, data)
//             .then(response => {
//                 console.log(response.data.message)
//                 setIsEditing(false);
//                 fetchProcessesPlan()
//             })
//             .catch(error => console.error(error));
//     };

//     const backToTablePlan = () => {
//         navigate('/dashboard/master/o-p-master/')
//     }

//     return (
//         <>
//             <div className="w-full h-16 flex items-center justify-between bg-white p-4 shadow-md">
//                 <h1 className="text-xl font-semibold text-gray-800">Order Process Plan</h1>
//                 <Button
//                     onClick={backToTablePlan}
//                     variant="contained"
//                     color="primary"
//                     className="ml-4"
//                 >
//                     Back To Plan Table
//                 </Button>
//             </div>

//             <div className="container mx-auto p-4 bg-white">
//                 <div className="overflow-x-auto mb-4">
//                     <table className='min-w-full table-auto text-black text-center border border-black'>
//                         <thead>
//                             <tr className='bg-gray-200'>
//                                 <th className='border border-black p-2'>Buyer</th>
//                                 <th className='border border-black p-2'>Our Ref</th>
//                                 <th className='border border-black p-2'>Style</th>
//                                 <th className='border border-black p-2'>Colour</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td className='border border-black p-2'>{buyer}</td>
//                                 <td className='border border-black p-2'>{ourref}</td>
//                                 <td className='border border-black p-2'>{style}</td>
//                                 <td className='border border-black p-2'>{color}</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className='min-w-full table-auto text-black text-center border border-black'>
//                         <thead>
//                             <tr className='bg-gray-200'>
//                                 <th className='border border-black p-2'>Process</th>
//                                 <th className='border border-black p-2'>Section</th>
//                                 <th className='border border-black p-2'>QMS Track</th>
//                                 <th className='border border-black p-2'>Size Wise Tracking</th>
//                                 <th className='border border-black p-2'>Section Seq.</th>
//                                 <th className='border border-black p-2'>Track %</th>
//                                 <th className='border border-black p-2'>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {tableData.map((row, rowIndex) => (
//                                 row.section.map((sec, index) => (
//                                     <tr key={sec.id}>
//                                         {index === 0 && (
//                                             <td rowSpan={row.section.length} className='border border-black p-2'>{row.process}</td>
//                                         )}
//                                         <td className='border border-black p-2'>
//                                             {isEditing && editRowIndex === index ? (
//                                                 sec.section
                                               
//                                             ) : (
//                                                 sec.section
//                                             )}
//                                         </td>
//                                         <td className='border border-black p-2'>
//                                             {isEditing && editRowIndex === index ? (
//                                                 <select
//                                                     onChange={(e) => handleInputChange(rowIndex, index, 'qmsTrack', e.target.value)}
//                                                     className='w-full p-1 border border-gray-300'
//                                                 >
//                                                     <option value={sec.qmsTrack}>select</option>
//                                                     <option value="True">Yes</option>
//                                                     <option value="False">No</option>
//                                                 </select>
//                                             ) : (
//                                                 sec.qmsTrack === true ? "Yes" : "No"
//                                             )}
//                                         </td>
//                                         <td className='border border-black p-2'>
//                                             {isEditing && editRowIndex === index ? (
//                                                 <select
//                                                     onChange={(e) => handleInputChange(rowIndex, index, 'sizeWiseTracking', e.target.value)}
//                                                     className='w-full p-1 border border-gray-300'
//                                                 >
//                                                     <option value={sec.sizeWiseTracking}>select</option>
//                                                     <option value="True">Yes</option>
//                                                     <option value="False">No</option>
//                                                 </select>
//                                             ) : (
//                                                 sec.sizeWiseTracking === true ? "Yes" : "No"
//                                             )}
//                                         </td>
//                                         <td className='border border-black p-2'>
//                                             {isEditing && editRowIndex === index ? (
//                                                 <input
//                                                     type="text"
//                                                     value={sec.sectionSeq}
//                                                     onChange={(e) => handleInputChange(rowIndex, index, 'sectionSeq', e.target.value)}
//                                                     className='w-full p-1 border border-gray-300'
//                                                 />
//                                             ) : (
//                                                 sec.sectionSeq
//                                             )}
//                                         </td>
//                                         <td className='border border-black p-2'>
//                                             {isEditing && editRowIndex === index ? (
//                                                 <input
//                                                     type="number"
//                                                     value={sec.trackPercentage}
//                                                     onChange={(e) => handleInputChange(rowIndex, index, 'trackPercentage', e.target.value)}
//                                                     className='w-full p-1 border border-gray-300'
//                                                 />
//                                             ) : (
//                                                 sec.trackPercentage
//                                             )}
//                                         </td>
//                                         <td className='border border-black p-2'>
//                                             {isEditing && editRowIndex === index ? (
//                                                 <button onClick={() => handleSave(sec.id)} className='bg-blue-500 text-white px-4 py-1 rounded'>Save</button>
//                                             ) : (
//                                                 <button onClick={() => { setEditRowIndex(index); setIsEditing(true); }} className='bg-green-500 text-white px-4 py-1 rounded'>Edit</button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//         </>

//     );
// };

// export default OrderProPlan;


import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DjangoConfig from '../../../config/Config';
import axios from 'axios';

const OrderProPlan = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tableData, setTableData] = useState([]);
    const [editRowId, setEditRowId] = useState(null); // Track the ID of the row being edited
    const queryParams = new URLSearchParams(location.search);
    const buyer = queryParams.get('buyer');
    const style = queryParams.get('style');
    const color = queryParams.get('color');
    const ourref = queryParams.get('ourref');

    useEffect(() => {
        fetchProcessesPlan();
    }, [buyer, style, color, ourref]);

    const fetchProcessesPlan = async () => {
        try {
            const params = new URLSearchParams({
                buyer,
                style,
                color,
                ourref
            });

            let response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/order_process_view/`, { params });
            setTableData(response.data.op_data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleInputChange = (rowId, index, field, value) => {
        const updatedData = [...tableData];
        const row = updatedData.flatMap(row => row.section).find(sec => sec.id === rowId);
        if (row) {
            row[field] = value;
            setTableData(updatedData);
        }
    };

    const handleSave = () => {
        if (editRowId === null) return;

        const sectionToUpdate = tableData.flatMap(row => row.section).find(sec => sec.id === editRowId);
        const data = {
            formData: {
                section: sectionToUpdate.section,
                qms_track: sectionToUpdate.qmsTrack,
                sequence: sectionToUpdate.sectionSeq,
                size_wise_tracking: sectionToUpdate.sizeWiseTracking,
                tracking: sectionToUpdate.trackPercentage,
                id: sectionToUpdate.id
            }
        };

        axios.post(`${DjangoConfig.apiUrl}/rtqm/order_process_view/`, data)
            .then(response => {
                console.log(response.data.message);
                setEditRowId(null); // Exit edit mode
                fetchProcessesPlan();
            })
            .catch(error => console.error(error));
    };

    const backToTablePlan = () => {
        navigate('/dashboard/master/o-p-master/');
    };

    return (
        <>
            <div className="w-full h-16 flex items-center justify-between bg-white p-4 shadow-md">
                <h1 className="text-xl font-semibold text-gray-800">Order Process Plan</h1>
                <Button
                    onClick={backToTablePlan}
                    variant="contained"
                    color="primary"
                    className="ml-4"
                >
                    Back To Plan Table
                </Button>
            </div>

            <div className="container mx-auto p-4 bg-white">
                <div className="overflow-x-auto mb-4">
                    <table className='min-w-full table-auto text-black text-center border border-black'>
                        <thead>
                            <tr className='bg-gray-200'>
                                <th className='border border-black p-2'>Buyer</th>
                                <th className='border border-black p-2'>Our Ref</th>
                                <th className='border border-black p-2'>Style</th>
                                <th className='border border-black p-2'>Colour</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='border border-black p-2'>{buyer}</td>
                                <td className='border border-black p-2'>{ourref}</td>
                                <td className='border border-black p-2'>{style}</td>
                                <td className='border border-black p-2'>{color}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto">
                    <table className='min-w-full table-auto text-black text-center border border-black'>
                        <thead>
                            <tr className='bg-gray-200'>
                                <th className='border border-black p-2'>Process</th>
                                <th className='border border-black p-2'>Section</th>
                                <th className='border border-black p-2'>QMS Track</th>
                                <th className='border border-black p-2'>Size Wise Tracking</th>
                                <th className='border border-black p-2'>Section Seq.</th>
                                <th className='border border-black p-2'>Track %</th>
                                <th className='border border-black p-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.flatMap((row, rowIndex) =>
                                row.section.map((sec, index) => (
                                    <tr key={sec.id}>
                                        {index === 0 && (
                                            <td rowSpan={row.section.length} className='border border-black p-2'>{row.process}</td>
                                        )}
                                        <td className='border border-black p-2'>
                                            {editRowId === sec.id ? (
                                                sec.section
                                            ) : (
                                                sec.section
                                            )}
                                        </td>
                                        <td className='border border-black p-2'>
                                            {editRowId === sec.id ? (
                                                <select
                                                    onChange={(e) => handleInputChange(sec.id, index, 'qmsTrack', e.target.value)}
                                                    className='w-full p-1 border border-gray-300'
                                                >
                                                    <option  value={sec.qmsTrack}>select</option>

                                                    <option value="True">Yes</option>
                                                    <option value="False">No</option>
                                                </select>
                                            ) : (
                                                sec.qmsTrack === true ? "Yes" : "No"
                                            )}
                                        </td>
                                        <td className='border border-black p-2'>
                                            {editRowId === sec.id ? (
                                                <select
                                                    onChange={(e) => handleInputChange(sec.id, index, 'sizeWiseTracking', e.target.value)}
                                                    className='w-full p-1 border border-gray-300'
                                                >
                                                    <option  value={sec.sizeWiseTracking}>select</option>

                                                    <option value="True">Yes</option>
                                                    <option value="False">No</option>
                                                </select>
                                            ) : (
                                                sec.sizeWiseTracking === true ? "Yes" : "No"
                                            )}
                                        </td>
                                        <td className='border border-black p-2'>
                                            {editRowId === sec.id ? (
                                                <input
                                                    type="text"
                                                    value={sec.sectionSeq}
                                                    onChange={(e) => handleInputChange(sec.id, index, 'sectionSeq', e.target.value)}
                                                    className='w-full p-1 border border-gray-300'
                                                />
                                            ) : (
                                                sec.sectionSeq
                                            )}
                                        </td>
                                        <td className='border border-black p-2'>
                                            {editRowId === sec.id ? (
                                                <input
                                                    type="number"
                                                    value={sec.trackPercentage}
                                                    onChange={(e) => handleInputChange(sec.id, index, 'trackPercentage', e.target.value)}
                                                    className='w-full p-1 border border-gray-300'
                                                />
                                            ) : (
                                                sec.trackPercentage
                                            )}
                                        </td>
                                        <td className='border border-black p-2'>
                                            {editRowId === sec.id ? (
                                                <button onClick={handleSave} className='bg-blue-500 text-white px-4 py-1 rounded'>Save</button>
                                            ) : (
                                                <button onClick={() => setEditRowId(sec.id)} className='bg-green-500 text-white px-4 py-1 rounded'>Edit</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default OrderProPlan;
