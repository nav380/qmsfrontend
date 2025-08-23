import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DjangoConfig from '../../config/Config';
import { toast } from 'react-toastify';

const FinishingPlaningDt = () => {
    const { planingId } = useParams();
    const [planingDataArray, setPlaningDataArray] = useState([
        { date: '', day: '', quantity: '', eff_plan: '', hour_plan: '', cumulative_quantity: '', is_active: true }
    ]);
    const [planingDataMt, setPlaningDataMt] = useState([]);
    const [otherPlanData, setOtherPlanData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!planingId) return;
                const url = `${DjangoConfig.apiUrl}/rtqm/finishing_planing/?id=${planingId}`;

                const response = await axios.get(url);
                setPlaningDataMt(response.data.match_plan);
                if (response.data.match_plan.plan_dt.length !== 0) {
                    setPlaningDataArray(response.data.match_plan.plan_dt);
                }

                if (response.data.match_plan.other_plan.length !== 0) {
                    setOtherPlanData(response.data.match_plan.other_plan);

                }
                console.log(response.data.match_plan.other_plan)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [planingId]);

    const handleAddRow = () => {
        const lastRow = planingDataArray[planingDataArray.length - 1];
        const planDateString = planingDataMt.planing_date; 
        const planDate = new Date(planDateString);
        const maxQuantity = planingDataMt.order_ex_qty;

        let newDate = calculateNewDate(lastRow.date);
        const newDay = getDayName(newDate);

        const newCumulativeQuantity = Number(lastRow.cumulative_quantity) + Number(lastRow.quantity);

        while (isSunday(newDate)) {
            newDate = calculateNewDate(newDate);
        }
        if (lastRow.eff_plan === '') {
            toast.error("Please set Efficiency Plan.");
            return; 
        }
        let totalQuantity = 0
        planingDataArray.forEach((item) => {
            totalQuantity += Number(item.quantity)
        })

        if (totalQuantity  >= planingDataMt.order_ex_qty) {
            const excessQuantity = Number(totalQuantity) - Number(planingDataMt.order_ex_qty);
            toast.error(`Cannot add row: Quantity condition not met. ${excessQuantity} units.`);
            return;
        }

        if (new Date(newDate).getTime() < planDate.getTime()) {
            toast.error("Cannot add row: Date condition not met (after delivery date).");
        }
        //  else if (newCumulativeQuantity > maxQuantity) {
        //     
        // } 
        else {
            const newRow = {
                date: newDate,
                day: newDay,
                quantity: Number(lastRow.quantity),
                eff_plan: '',
                hour_plan: '8',
                cumulative_quantity: newCumulativeQuantity,
                is_active: true,
            };
            setPlaningDataArray([...planingDataArray, newRow]);
        }
    };

    const calculateNewDate = (prevDate) => {
        if (!prevDate) return '';

        const currentDate = new Date(prevDate);
        currentDate.setDate(currentDate.getDate() + 1);

        while (isSunday(currentDate)) {
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const formattedDate = currentDate.toISOString().slice(0, 10);
        return formattedDate;
    };

    const isSunday = (date) => {
        const dayOfWeek = new Date(date).getDay();
        return dayOfWeek === 0;
    };

    const getDayName = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = new Date(date).getDay();
        return days[dayIndex];
    };

    const handleRemoveRow = (index, dtId) => {
        const isRowEmpty = (row) => {
            return !row.date && !row.day && !row.quantity && !row.eff_plan && !row.hour_plan;
        };
    
        const rowToRemove = planingDataArray[index];
    
        if (isRowEmpty(rowToRemove)) {
            toast.error("Cannot remove row: Row is empty.");
            return;
        }
    
        const updatedPlaningDataArray = planingDataArray.filter((_, i) => i !== index);
    
        if (updatedPlaningDataArray.length === 0) {
            updatedPlaningDataArray.push({
                date: '',
                day: '',
                quantity: '',
                eff_plan: '',
                hour_plan: '',
                cumulative_quantity: '',
                is_active: true,
            });
        }
    
        setPlaningDataArray(updatedPlaningDataArray);
    
        if (dtId) {
            axios.get(`${DjangoConfig.apiUrl}/rtqm/finishing_planing_dt/?dt_id=${dtId}`)
                .then(response => {
                    toast.success('Delete Response:', response.data.message);
                })
                .catch(error => {
                    console.error('Error deleting row:', error);
                });
        }
    };
    

    const handleInputChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedPlaningDataArray = [...planingDataArray];

        updatedPlaningDataArray[index] = {
            ...updatedPlaningDataArray[index],
            [name]: type === 'checkbox' ? checked : value
        };

        if (name === 'eff_plan') {
            const maxEff = 100;
            const effValue = type === 'checkbox' ? checked : parseFloat(value); // Ensure to parse numeric input
            updatedPlaningDataArray[index].eff_plan = Math.min(effValue, maxEff);

        }

        if (name === 'date') {
            updatedPlaningDataArray[index].day = getDayName(value);
            if (isSunday(value)) {
                updatedPlaningDataArray[index].quantity = 0;
                updatedPlaningDataArray[index].eff_plan = 0;
                updatedPlaningDataArray[index].hour_plan = 0;
                // updatedPlaningDataArray[index].is_disabled = true;
            } else {
                // updatedPlaningDataArray[index].is_disabled = false;
            }
        }

        updatedPlaningDataArray.forEach((row, i) => {
            if (i === 0) {
                row.cumulative_quantity = row.quantity;
            } else {
                row.cumulative_quantity = Number(updatedPlaningDataArray[i - 1].cumulative_quantity) + Number(row.quantity);
            }
        });

        setPlaningDataArray(updatedPlaningDataArray);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (planingDataArray.some(row => row.eff_plan === '')) {
            toast.error("Please set Efficiency Plan for all rows.");
            return;
        }
        let totalQuantity = 0
        planingDataArray.forEach((item) => {
            totalQuantity += Number(item.quantity)
        })

        if (totalQuantity > planingDataMt.order_ex_qty) {
            const excessQuantity = Number(totalQuantity) - Number(planingDataMt.order_ex_qty);
            toast.error(`Total quantity exceeds Remove ${excessQuantity} units.`);
            return;
        }
        try {
            const data = {
                planingDataArray: planingDataArray,
                id: planingDataMt.id
            };
            const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/finishing_planing_dt/`, data,{withCredentials:true});
            toast.success('Data saved successfully');
            console.log('Post Data:', response.data);
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };
    let alreadyPlanQuantity = 0
    if(planingDataArray.length !== 0){
        planingDataArray.map((item)=>{
            alreadyPlanQuantity += parseInt(item.quantity, 10)
        })
    }


   

    return (
        <div className="container mx-auto p-4">
            <div className="p-4 bg-white shadow-md rounded-md">
                <div className='flex justify-between'>
                <h2 className="text-xl font-semibold mb-4">Finishing Planning Data Details</h2>
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span className="font-medium">Back</span>
                </button>

                </div>
               
                <div className="grid grid-cols-8 gap-4">
                    <div>
                        <p className="text-gray-600">Buyer Name:</p>
                        <p className="font-medium">{planingDataMt.buyer_name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Style Number:</p>
                        <p className="font-medium">{planingDataMt.style}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Planning Date:</p>
                        <p className="font-medium">{planingDataMt.planing_date}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Line:</p>
                        <p className="font-medium">{planingDataMt.line}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Order Quantity:</p>
                        <p className="font-medium">{planingDataMt.order_qty}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Order EX Quantity:</p>
                        <p className="font-medium">{planingDataMt.order_ex_qty}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Already Plan Quantity:</p>
                        <p className="font-medium">{alreadyPlanQuantity}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Balance Plan Quantity:</p>
                        <p className="font-medium">{planingDataMt.order_ex_qty - alreadyPlanQuantity}</p>
                    </div>


                </div>
            </div>

            <h1 className="text-2xl font-bold mt-1 mb-4">Edit Planning Data</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="overflow-x-auto">
                    <table className='table table-sm w-full *:!text-center [&>*_th]:border [&>*_th]:border-black  [&>*_td]:border [&>*_td]:border-black'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Quantity</th>
                                <th>Efficiency Plan</th>
                                <th>Hour Plan</th>
                                <th>Cumulative Quantity</th>
                                <th>Other Style Plan</th>
                                <th>Total Plan of the day</th>

                                <th colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {planingDataArray.map((row, index) => {
                                // Find the matching data in otherPlanData
                                let otherData = otherPlanData.find(key => row.date === key.date) || {}; 

                                return (
                                    <tr key={index} className="border-t">
                                        <td>
                                            <input
                                                type="date"
                                                name="date"
                                                value={row.date}
                                                onChange={(e) => handleInputChange(index, e)}
                                                className="border rounded"
                                                min={planingDataMt.planing_date}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="day"
                                                value={row.day}
                                                readOnly
                                                className="border w-20 rounded p-1"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={row.quantity}
                                                onChange={(e) => handleInputChange(index, e)}
                                                className="border w-20 text-center rounded p-1"
                                                disabled={row.is_disabled}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="eff_plan"
                                                value={row.eff_plan}
                                                onChange={(e) => handleInputChange(index, e)}
                                                className="border w-14 rounded p-1"
                                                disabled={row.is_disabled}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="hour_plan"
                                                value={row.hour_plan}
                                                onChange={(e) => handleInputChange(index, e)}
                                                className="border w-14 rounded p-1"
                                                disabled={row.is_disabled}
                                            />
                                        </td>
                                        <td>{row.cumulative_quantity}</td>
                                        <td>{otherData.quantity || 0}</td>
                                        <td>{Number(row.quantity || 0) + Number(otherData.quantity || 0) }</td>

                                        <td>
                                            <button
                                                type="button"
                                                onClick={handleAddRow}
                                                className="text-green-400 hover:text-green-600 focus:outline-none"
                                            >
                                                <svg
                                                    className="w-5 h-5 inline-block"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRow(index, row.id)}
                                                className="text-red-400 hover:text-red-600 focus:outline-none"
                                            >
                                                <svg
                                                    className="w-5 h-5 inline-block"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                    <div className='w-full h-24 p-3'>
                        <button className='btn btn-primary w-28 float-end' type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FinishingPlaningDt;

