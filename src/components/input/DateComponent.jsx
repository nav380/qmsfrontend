import React, { useState, useEffect } from 'react';

const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); 
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
};

const DateComponent = ({ fromDate, tillDate, onFromDateChange, onTillDateChange, reset}) => {
    const [from, setFrom] = useState(fromDate || '');
    const [till, setTill] = useState(tillDate || '');

    useEffect(() => {
        setFrom(fromDate);
        setTill(tillDate);
        
    }, [fromDate, tillDate]); 


    useEffect(() => {
        if (reset > 0) {
            console.log("COMPONENT reset",reset)
          
            setTill('');
            setFrom('');
        }
        
    }, [reset]);

    const handleFromChange = (e) => {
        const newFrom = e.target.value;
        setFrom(newFrom);
       
    };
    const checkFromDate = () => {
        let adjustedFrom = from;
        if (from >= till && till != '') {
            adjustedFrom = till;
            setFrom(till);
        }
        onFromDateChange(adjustedFrom);
    };    
    const handleTillChange = (e) => {
        const newTill = e.target.value;
        setTill(newTill);
       
    };   
    const checkTillDate = () => {
        let adjustedTill = till;
        if (till <= from ) {
            adjustedTill = from;
            setTill(from);
        }
        onTillDateChange(adjustedTill);
    };
    return (
        <div className="flex gap-4 p-4">
            <div className="flex h-[35px]">
                <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
                    From Date:
                </label>
                <input
                    type="date"
                    id="fromDate"
                    value={from }
                    onChange={handleFromChange}
                    onBlur={checkFromDate}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    max={till || ''}
                />
            </div>
            <div className="flex h-[35px]">
                <label htmlFor="tillDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Till Date:
                </label>
                <input
                    type="date"
                    id="tillDate"
                    value={till}
                    onChange={handleTillChange}
                    onBlur={checkTillDate}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    min={from || ''}
                />
            </div>
        </div>
    );
};
export default DateComponent;
