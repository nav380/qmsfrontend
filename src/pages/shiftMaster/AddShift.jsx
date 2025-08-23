import axios from 'axios';
import { useEffect, useState } from 'react';
import DjangoConfig from '../../config/Config';
import { Button } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'

const AddShift = () => {
    const [unitData, setUnitData] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [floorData, setFloorData] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [start_time, setStartTime] = useState('');
    const [end_time, setEndTime] = useState('');
    const [shiftName, setShiftName] = useState('');
    const [applicable_date, setApplicableDate] = useState('');
    const [shiftDtData, setShiftDtData] = useState([
        { dtStartTime: '', dtEndTime: '', type: 'Work'  } 
    ]);

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
            setUnitData(response.data.location_data.map(item => ({ value: item.id, label: item.name })));
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleUnitChange = (selectedValue) => {
        setSelectedUnit(selectedValue);
        fetchUniteData(selectedValue);
    };

    const fetchUniteData = (selectedValue) => {
        const userData = {
            unit_id: selectedValue.value,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const floorOptions = response.data.common_master_data.map(item => ({ value: item.id, label: item.name }));
                setFloorData(floorOptions);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const data = {
            unit_id: selectedUnit.value,
            floor_id: selectedFloor.value,
            name: shiftName,
            start_time: start_time,
            end_time: end_time,
            applicable_date: applicable_date,
            shift_dt_data: shiftDtData 
        };

        axios.post(`${DjangoConfig.apiUrl}/rtqm/shift_master_view/`, data)
            .then(response => {
                console.log('ShiftMt created successfully:', response.data);
                toast.success('Shift Master created successfully')

                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error creating ShiftMt:', error);
                setIsLoading(false);
            });
    };


    const handleAddRow = () => {
        // Calculate new start_time and end_time
        let newStartTime = '';
        let newEndTime = '';

        // Get the last row's end_time and calculate new start_time and end_time
        if (shiftDtData.length > 0) {
            const lastRow = shiftDtData[shiftDtData.length - 1];
            if (lastRow.dtEndTime !== '') {
                const lastEndTime = new Date(`2000-01-01T${lastRow.dtEndTime}`);
                const nextStartTime = new Date(lastEndTime.getTime() + 1 * 60000); // Add 1 minute
                newStartTime = `${nextStartTime.getHours()}:${('0' + nextStartTime.getMinutes()).slice(-2)}`;

                const nextEndTime = new Date(nextStartTime.getTime() + 1 * 3600000); // Add 1 hour
                newEndTime = `${nextEndTime.getHours()}:${('0' + nextEndTime.getMinutes()).slice(-2)}`;
            }
        }

        // Add new row with calculated start_time and end_time
        setShiftDtData([...shiftDtData, { dtStartTime: newStartTime, dtEndTime: newEndTime, type: 'Work' }]);
    };

    // Handle removing a row for ShiftDt data
    const handleRemoveRow = (index) => {
        const updatedShiftDtData = [...shiftDtData];
        updatedShiftDtData.splice(index, 1);
        setShiftDtData(updatedShiftDtData);
    };

    // Handle change in ShiftDt data inputs
    const handleShiftDtChange = (index, field, value) => {
        const updatedShiftDtData = [...shiftDtData];
        updatedShiftDtData[index][field] = value;
        setShiftDtData(updatedShiftDtData);
    };

    const navigate = useNavigate()
    const shiftHistory=()=>{
        navigate('/dashboard/master/sift-master')
    }
    

    return (
        <div className="max-w-5xl mx-auto">
           <div className='w-full h-12 text-center flex items-center justify-between'>
                <h1 className='text-balance font-semibold flex-grow'>Create Shift Master</h1>
                <button onClick={shiftHistory} className='btn btn-primary h-10 w-32'>Shift History</button>
            </div>

            <div className='first-line:form-container mt-2 transition-all duration-500 ease-in-out'>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                        <label htmlFor="unitData">Unit</label>
                        <Select
                            options={unitData}
                            value={selectedUnit}
                            onChange={handleUnitChange}
                            placeholder="Unit"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!unitData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="floorData">Floor</label>
                        <Select
                            options={floorData}
                            value={selectedFloor}
                            onChange={setSelectedFloor}
                            placeholder=" Floor"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!floorData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                }),
                            }}
                        />
                    </div>
                    <div className="col-span-1">
                        <label htmlFor="shift_name" className="block text-sm font-medium text-gray-700">Shift Name</label>
                        <input
                            type="text"
                            value={shiftName}
                            onChange={(e) => setShiftName(e.target.value)}
                            className="w-full mt-1 border-2 border-gray-300 rounded-md shadow-sm px-2 py-1"
                        />
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            type="time"
                            value={start_time}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full mt-1 border-2 border-gray-300 rounded-md shadow-sm px-2 py-1"
                        />
                    </div>
                    <div className="col-span-1">
                        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                            type="time"
                            value={end_time}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full mt-1 border-2 border-gray-300 rounded-md shadow-sm px-2 py-1"
                        />
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="applicable_date" className="block text-sm font-medium text-gray-700">Applicable Date</label>
                        <input
                            type="date"
                            value={applicable_date}
                            onChange={(e) => setApplicableDate(e.target.value)}
                            className="w-full mt-1 border-2 border-gray-300 rounded-md shadow-sm px-2 py-1"
                        />
                    </div>
                    <div className='mt-6'>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            className="w-full h-10 mt-14 "
                        >
                            {isLoading ? 'Loading...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 px-6 text-left">Start Time</th>
                            <th className="py-3 px-6 text-left">End Time</th>
                            <th className="py-3 px-6 text-left">Type</th>
                            <th className="py-3 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {shiftDtData.map((shiftDt, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <input
                                        type="time"
                                        name="dtStartTime"
                                        value={shiftDt.dtStartTime}
                                        onChange={(e) => handleShiftDtChange(index, 'dtStartTime', e.target.value)}
                                        className="w-full border-2 border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                    />
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <input
                                        type="time"
                                        name="dtEndTime"
                                        value={shiftDt.dtEndTime}
                                        onChange={(e) => handleShiftDtChange(index, 'dtEndTime', e.target.value)}
                                        className="w-full border-2 border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                    />
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <select
                                        name="type"
                                        value={shiftDt.type}
                                        onChange={(e) => handleShiftDtChange(index, 'type', e.target.value)}
                                        className="w-full border-2 border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                    >
                                        <option value="Work">Work</option>
                                        <option value="Break">Break</option>
                                        <option value="OT">Extra Work</option>
                                    </select>
                                </td>

                                <td className="py-3 px-6 text-center">
                                    {index === shiftDtData.length - 1 ? (
                                        <button onClick={handleAddRow} className="text-green-400 hover:text-green-600 focus:outline-none">
                                            <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                        </button>
                                    ) : (
                                        <button onClick={() => handleRemoveRow(index)} className="text-red-400 hover:text-red-600 focus:outline-none">
                                            <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AddShift;
