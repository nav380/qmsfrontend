import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DjangoConfig from '../../../config/Config';
import axios from 'axios';
const OrderProPlan = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const [tableData, setTableData] = useState([])
    const [isEditing, setIsEditing] = useState(false)
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
            console.log(response.data);
            setTableData(response.data.op_data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleInputChange = (rowIndex, index, field, value) => {
        const newTableData = [...tableData];
        newTableData[rowIndex].section[index][field] = value;
        setTableData(newTableData);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try{
            let url = `${DjangoConfig.apiUrl}/rtqm/order_process_view`
            let response = await axios.post(url,tableData)
            if (response){
                console.log(response.data.message)
                
            }

        }
        catch(err){
            setIsEditing(false);

        }
    };

    const backToTablePlan = () => {
        navigate('/dashboard/master/o-p-master/')
    }

    return (
        <>
            <div className="w-full h-16 flex items-center justify-between bg-white p-4  shadow-md">
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
            <div className="container mx-auto p-4  bg-white">
                <table className='table table-sm w-full *:!text-black *:!text-center [&>*_th]:border [&>*_th]:border-black [&>*_th]:text-xl   [&>*_td]:border [&>*_td]:border-black'>
                    <thead>
                        <tr>
                            <th >Buyer</th>
                            <th >Our Ref</th>
                            <th >Style</th>
                            <th >Colour</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{buyer}</td>
                            <td>{style}</td>
                            <td>{color}</td>
                            <td>{ourref}</td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <table className='table table-sm w-full *:!text-black *:!text-center [&>*_th]:border [&>*_th]:border-black [&>*_th]:text-xl [&>*_td]:border [&>*_td]:border-black'>
                        <thead>
                            <tr>
                                <th>Process</th>
                                <th>Section</th>
                                <th>QMS Track</th>
                                <th>Size Wise Tracking</th>
                                <th>Section Seq.</th>
                                <th>Track %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, rowIndex) => (
                                row.section.map((sec, index) => (
                                    <tr key={`${row.process}-${index}`}>
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={row.section.length}>{row.process}</td>
                                            </>
                                        )}
                                        <td>
                                            {isEditing ? (
                                                // <input
                                                //     type="text"
                                                //     value={sec.section}
                                                //     onChange={(e) => handleInputChange(rowIndex, index, 'section', e.target.value)}
                                                // />
                                                sec.section

                                            ) : (
                                                sec.section
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <select
                                                    value={sec.qmsTrack}
                                                    onChange={(e) => handleInputChange(rowIndex, index, 'qmsTrack', e.target.value)}
                                                >
                                                    <option value="True">Yes</option>
                                                    <option value="False">No</option>
                                                </select>
                                            ) : (
                                                sec.qmsTrack
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <select
                                                    value={sec.sizeWiseTracking}
                                                    onChange={(e) => handleInputChange(rowIndex, index, 'sizeWiseTracking', e.target.value)}
                                                >
                                                    <option value="True">Yes</option>
                                                    <option value="False">No</option>
                                                </select>
                                            ) : (
                                                sec.sizeWiseTracking
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={sec.sectionSeq}
                                                    onChange={(e) => handleInputChange(rowIndex, index, 'sectionSeq', e.target.value)}
                                                />
                                            ) : (
                                                sec.sectionSeq
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={sec.trackPercentage}
                                                    onChange={(e) => handleInputChange(rowIndex, index, 'trackPercentage', e.target.value)}
                                                />
                                            ) : (
                                                sec.trackPercentage
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                    <div className='h-16 w-full  p-2'>
                        {isEditing ? (
                            <Button
                                onClick={handleSaveClick}
                                variant="contained"
                                color="primary"
                                className="ml-4 float-end"
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                onClick={handleEditClick}
                                variant="contained"
                                color="primary"
                                className="ml-4 float-end"
                            >
                                Edit
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </>

    );
};

export default OrderProPlan;
