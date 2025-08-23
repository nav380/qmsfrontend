// import React, { useEffect, useState, useRef } from 'react';
// import logo from './favicon.ico';
// import DjangoConfig from '../../config/Config';
// import axios from 'axios';

// const FinTvDashboard3 = () => {
//     const [time, setTime] = useState('');
//     const [formulasData, setFormulasData] = useState({})
//     const [planData, setPlanData] = useState({})
//     const [hourlyData, setHourlyData] = useState([])
//     const [loading, setLoading] = useState(true);

//     const dashboardRef = useRef(null);
//     const toggleFullScreen = () => {
//         if (!document.fullscreenElement) {
//             if (dashboardRef.current.requestFullscreen) {
//                 dashboardRef.current.requestFullscreen();
//             } else if (dashboardRef.current.mozRequestFullScreen) { /* Firefox */
//                 dashboardRef.current.mozRequestFullScreen();
//             } else if (dashboardRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
//                 dashboardRef.current.webkitRequestFullscreen();
//             } else if (dashboardRef.current.msRequestFullscreen) { /* IE/Edge */
//                 dashboardRef.current.msRequestFullscreen();
//             }
//         } else {
//             if (document.exitFullscreen) {
//                 document.exitFullscreen();
//             } else if (document.mozCancelFullScreen) { /* Firefox */
//                 document.mozCancelFullScreen();
//             } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
//                 document.webkitExitFullscreen();
//             } else if (document.msExitFullscreen) { /* IE/Edge */
//                 document.msExitFullscreen();
//             }
//         }
//     };

//     useEffect(() => {
//         const updateTime = () => {
//             const now = new Date();
//             let hours = now.getHours();
//             const minutes = now.getMinutes().toString().padStart(2, '0');
//             const seconds = now.getSeconds().toString().padStart(2, '0');
//             const ampm = hours >= 12 ? 'PM' : 'AM';
//             hours = hours % 12;
//             hours = hours ? hours : 12; // the hour '0' should be '12'
//             const hoursStr = hours.toString().padStart(2, '0');
//             setTime(`${hoursStr}:${minutes}:${seconds} ${ampm}`);
//         };

//         const timerId = setInterval(updateTime, 1000);
//         updateTime();

//         return () => clearInterval(timerId);
//     }, []);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const queryParams = new URLSearchParams(location.search);
//                 const line_id = queryParams.get('line_id');
//                 const process_id = queryParams.get('process_id');
//                 const section_id = queryParams.get('section_id');
//                 const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/final_tv_dashboard/?line_id=${line_id}&process_id=${process_id}&section_id=${section_id}`, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 });
//                 const { formulas, plan_data,
//                     shift_data_list } = response.data;
//                 setFormulasData(formulas);
//                 setPlanData(plan_data);
//                 setHourlyData(shift_data_list)
//                 console.log("sewing tv data", response.data);
//                 saveDataToLocalStorage(formulas);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const saveDataToLocalStorage = (newData) => {
//         const existingData = JSON.parse(localStorage.getItem('formulasData')) || [];

//         const { hour_no, real_time_target, hourly_target, actual_hourly_pass, hourly_difference, standard_efficiency, eff_percentage, difference_eff, actual_eff, dhu_percentage, hourly_dhu, plan_dhu, hourly_efficiency, difference_dhu } = newData;

//         const index = existingData.findIndex(item => item.hour_no === hour_no);

//         if (index !== -1) {
//             existingData[index] = { hour_no, real_time_target, hourly_target, actual_hourly_pass, hourly_difference, standard_efficiency, difference_eff, eff_percentage, actual_eff, hourly_efficiency, dhu_percentage, plan_dhu, hourly_dhu, difference_dhu };
//         } else {
//             existingData.push({ hour_no, real_time_target, hourly_target, actual_hourly_pass, hourly_difference, standard_efficiency, difference_eff, eff_percentage, actual_eff, hourly_efficiency, dhu_percentage, plan_dhu, hourly_dhu, difference_dhu });
//         }

//         localStorage.setItem('formulasData', JSON.stringify(existingData));
//     };

//     const [data, setData] = useState([]);

//     useEffect(() => {
//         const fetchData = () => {
//             const storedData = JSON.parse(localStorage.getItem('formulasData')) || [];
//             setData(storedData);
//         };
//         // localStorage.clear();
//         fetchData();
//     }, []);

//     // <td>{formulasData.real_time_target}</td>
//     // <td>{formulasData.actual_pass}</td>
//     // <td>{formatValue(cumulativeOutput)}</td>
//     // <td>{formulasData.standard_efficiency}</td>
//     // <td>{formulasData.eff_percentage}</td>
//     // <td>{formatToTwoDecimals(cumulativeEff)}</td>
//     // <td>{formulasData.plan_dhu}</td>
//     // <td>{formulasData.dhu_percentage}</td>

//     let cumulativeEff = formulasData.standard_efficiency - formulasData.eff_percentage || 0.0
//     let cumulativeDhu = formulasData.plan_dhu - formulasData.dhu_percentage || 0.0
//     let totalTarget = 0
//     let totalActual = 0
//     let cumulativeOutput = 0
//     let totalPlanEff = 0.0
//     let totalActualEff = 0.0
//     let totalDhu = 0.0
//     let totalActualDhu = 0.0

//     if (Array.isArray(data)) {
//         hourlyData.forEach((item) => {
//             totalTarget += (item.hourly_target || 0);
//             totalActual += (item.actual_hourly_pass || 0);
//             totalPlanEff += (item.hourly_efficiency || 0);
//             totalActualEff += (item.actual_eff || 0);
//             totalDhu += (item.plan_dhu || 0);
//             totalActualDhu += (item.hourly_dhu || 0);

//         });
//     }




//     const formatValue = (value) => {
//         const numericValue = Number(value);
//         if (isNaN(numericValue)) {
//             // Handle non-numeric values
//             return <span style={{ color: 'gray' }}>Invalid</span>;
//         }

//         const color = numericValue < 0 ? 'green' : 'red';
//         const displayValue = numericValue < 0 ? Math.abs(numericValue) : numericValue;

//         return (
//             <span style={{ color }}>
//                 {displayValue}
//             </span>
//         );
//     };

//     const formatValueDhu = (value) => {
//         const numericValue = Number(value);
//         if (isNaN(numericValue)) {
//             // Handle non-numeric values
//             return <span style={{ color: 'gray' }}>Invalid</span>;
//         }

//         const color = numericValue < 0 ? 'red' : 'green';
//         const displayValue = numericValue < 0 ? Math.abs(numericValue) : numericValue;

//         return (
//             <span style={{ color }}>
//                 {displayValue}
//             </span>
//         );
//     };


//     const sortedData = hourlyData
//         .filter(item => item.hour_no !== 'Break')
//         .sort((a, b) => {
//             const hourA = parseFloat(a.hour_no.replace(/[^0-9.]/g, ''));
//             const hourB = parseFloat(b.hour_no.replace(/[^0-9.]/g, ''));
//             return hourA - hourB;
//         });

//     const formatToTwoDecimals = (value) => parseFloat(value).toFixed(2);



//     let breakIndex = sortedData.length; // Default to the end
//     for (let i = 0; i < sortedData.length; i++) {

//         if (sortedData[i].hour_no === 'Break' || sortedData[i].hour_no === 'T-Break') {

//             continue;
//         }
//         if (sortedData[i].hour_no === formulasData.hour_no) {
//             breakIndex = i + 1;
//             break;
//         }
//     }

//     if (breakIndex > sortedData.length) {
//         breakIndex = sortedData.length;
//     }


//     const rows = sortedData.slice(0, breakIndex).map((item) => {
//         if (item.hour_no === 'Break' || item.hour_no === 'T-Break') {
//             return null; // Skip rendering this item
//         }
//         return (
//             <tr key={item.hour_no}>
//                 <td>{item.hour_no}</td>
//                 <td>{item.hourly_target}</td>
//                 <td>{item.actual_hourly_pass}</td>
//                 <td>{formatValue(item.hourly_difference)}</td>

//                 <td>{formulasData.standard_efficiency}</td>
//                 <td>{formatToTwoDecimals(item.actual_eff)}</td>
//                 <td>{formatToTwoDecimals(item.difference_eff)}</td>

//                 <td>{item.plan_dhu}</td>
//                 <td>{formatValueDhu(item.hourly_dhu)}</td>
//                 <td>{formatValueDhu(item.difference_dhu)}</td>
//             </tr>
//         );
//     });


//     return (
//         <section id="dashboard" className="bg-black h-screen"  ref={dashboardRef}>
//             <header>
//                 <nav className="bg-[#070F2B] border-2 border-slate-500 w-full h-15 flex items-center justify-between">
//                     <div className="flex items-center justify-center border-r border-black w-1/5 h-full">
//                         <a href="#" className="flex items-center justify-center">
//                             <img src={logo} alt="logo" className="mr-2" />
//                             <span className="text-goldenrod text-2xl text-white font-semibold">IntelliSYNC</span>
//                         </a>
//                     </div>
//                     <div className="flex-grow flex items-center justify-center border-r border-black w-3/5 h-full">
//                         <span className="text-goldenrod font-bold text-white text-3xl">Production DashBoard</span>
//                     </div>
//                     <div className="flex items-center justify-center w-1/5 h-full">
//                         <div id="time" className="text-goldenrod mt-6 text-white text-2xl font-bold ml-10">{time}</div>
//                     </div>
//                 </nav>
//                 <div className="w-full h-16 bg-black">
//                     <div className="flex justify-center items-center w-full h-[8vh]">
//                         {/* <div className="w-[300px] h-[6vh]text-left text-2xl text-white font-bold">Selection Criteria</div> */}
//                         <div className="w-[215px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-xl text-white font-bold">{planData.date}</div>
//                         <div className="w-[215px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-xl text-white font-bold">{planData.unit}</div>
//                         <div className="w-[215px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-xl text-white font-bold">{planData.floor}</div>
//                         <div className="w-[215px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-xl text-white font-bold">{planData.line}</div>
//                         <div className="w-[340px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-3xl text-white font-bold">Projected : {formulasData.projected_output || '0'}</div>
//                     </div>
//                     <div className="overflow-x-auto bg-black">

//                         <table className='table table-sm w-full *:!text-white *:!text-center [&>*_th]:border [&>*_th]:border-white [&>*_td]:text-xl  [&>*_th]:text-xl  [&>*_td]:border [&>*_td]:border-white'>
//                             <thead>
//                                 <tr>
//                                     <th>Hour</th>
//                                     <th colSpan={3} >Output</th>
//                                     <th colSpan={3}>Efficiency</th>
//                                     <th colSpan={3}>DHU</th>
//                                 </tr>
//                                 <tr>
//                                     <th>Hour</th>
//                                     <th>Plan</th>
//                                     <th>Actual</th>
//                                     <th>Variance</th>
//                                     <th>Plan</th>
//                                     <th>Actual</th>
//                                     <th>Variance</th>
//                                     <th>Plan</th>
//                                     <th>Actual</th>
//                                     <th>Variance</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {/* {sortedData.map(item => {
//                                     if (item.hour_no === 'Break'  || item.hour_no ==='T-Break') {
//                                         return null;
//                                     }
//                                     if (item.hour_no === formulasData.hour_no) {
//                                          break
//                                     }
//                                     return (
//                                  <tr key={item.hour_no}>
//                                     <td>{item.hour_no}</td>
//                                     <td>{item.hourly_target}</td>
//                                     <td>{item.actual_hourly_pass}</td>
//                                     <td>{formatValue(item.hourly_difference)}</td>

//                                     <td>{formulasData.standard_efficiency}</td>
//                                     <td>{item.actual_eff}</td>
//                                     <td>{formatValue(item.difference_eff)}</td>
//                                     <td>{item.plan_dhu}</td>
//                                     <td>{formatValueDhu(item.hourly_dhu)}</td>
//                                     <td>{formatValueDhu(item.difference_dhu)}</td>
//                                 </tr>
//                                   )
//                                 }
//                                 )} */}
//                                 {rows}

//                             </tbody>
//                             <tfoot>
//                                 <tr>
//                                     <td>Total</td>
//                                     <td>{formulasData.real_time_target}</td>
//                                     <td>{formulasData.actual_pass}</td>
//                                     <td>{formulasData.difference}</td>
//                                     <td>{formulasData.standard_efficiency}</td>
//                                     <td>{formulasData.eff_percentage}</td>
//                                     <td>{formatToTwoDecimals(cumulativeEff)}</td>
//                                     <td>{formulasData.plan_dhu}</td>
//                                     <td>{formulasData.dhu_percentage}</td>
//                                     <td>{formatValueDhu(formatToTwoDecimals(cumulativeDhu))}</td>
//                                 </tr>
//                             </tfoot>
//                         </table>
//                     </div>
//                 </div>
//             </header>
//             <button
//                 className="absolute top-[90px] left-1 transform -translate-y-1/2 bg-transparent text-white px-4 py-2 text-xl  focus:outline-none hover:bg-gray-700"
//                 onClick={toggleFullScreen}
//             >
//                 [&nbsp;&nbsp;]
//             </button>
//         </section>

//     );
// };

// export default FinTvDashboard3;

import React, { useEffect, useState, useRef } from 'react';
import logo from './favicon.ico';
import DjangoConfig from '../../config/Config';
import axios from 'axios';

const FinTvDashboard3 = () => {
    const [time, setTime] = useState('');
    const [formulasData, setFormulasData] = useState({})
    const [planData, setPlanData] = useState({})
    const [hourlyData, setHourlyData] = useState([])
    const [loading, setLoading] = useState(true);
    const [responseData, setResponseData] = useState([]);

    const [limitCount, setLimitCount] = useState(0);
    const [count, setCount] = useState(0);
    const dashboardRef = useRef(null);
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            if (dashboardRef.current.requestFullscreen) {
                dashboardRef.current.requestFullscreen();
            } else if (dashboardRef.current.mozRequestFullScreen) { /* Firefox */
                dashboardRef.current.mozRequestFullScreen();
            } else if (dashboardRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                dashboardRef.current.webkitRequestFullscreen();
            } else if (dashboardRef.current.msRequestFullscreen) { /* IE/Edge */
                dashboardRef.current.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; 
            const hoursStr = hours.toString().padStart(2, '0');
            setTime(`${hoursStr}:${minutes}:${seconds} ${ampm}`);
        };

        const timerId = setInterval(updateTime, 1000);
        updateTime();

        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const line_id = queryParams.get('line_id');
                const process_id = queryParams.get('process_id');
                const section_id = queryParams.get('section_id');
                const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/finishing_tv_dashboard3/?line_id=${line_id}&process_id=${process_id}&section_id=${section_id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log("Finishing data", response.data);

                setLimitCount(response.data.length);
                setResponseData(response.data);

                if (response.data.length > 0) {
                    updateData(response.data[0]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const intervalId = setInterval(() => {
            setCount(prevCount => {
                const newCount = (prevCount + 1) % limitCount;
                if (responseData.length > 0) {
                    updateData(responseData[newCount]);
                }
                return newCount;
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [limitCount, responseData]);

    const updateData = (data) => {
        const { plan_data, shift_data_list } = data;
        setPlanData(plan_data);
        setHourlyData(shift_data_list)
    };




    const formatValue = (value) => {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            // Handle non-numeric values
            return <span style={{ color: 'gray' }}>Invalid</span>;
        }

        const color = numericValue < 0 ? 'green' : 'red';
        const displayValue = numericValue < 0 ? Math.abs(numericValue) : numericValue;

        return (
            <span style={{ color }}>
                {displayValue}
            </span>
        );
    };

    const formatValueDhu = (value) => {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            // Handle non-numeric values
            return <span style={{ color: 'gray' }}>Invalid</span>;
        }

        const color = numericValue < 0 ? 'red' : 'green';
        const displayValue = numericValue < 0 ? Math.abs(numericValue) : numericValue;

        return (
            <span style={{ color }}>
                {displayValue}
            </span>
        );
    };


    const sortedData = hourlyData
        .filter(item => item.hour_no !== 'Break')
        .sort((a, b) => {
            const hourA = parseFloat(a.hour_no.replace(/[^0-9.]/g, ''));
            const hourB = parseFloat(b.hour_no.replace(/[^0-9.]/g, ''));
            return hourA - hourB;
        });

    const formatToTwoDecimals = (value) => parseFloat(value).toFixed(2);



    let breakIndex = sortedData.length; // Default to the end
    for (let i = 0; i < sortedData.length; i++) {

        if (sortedData[i].hour_no === 'Break' || sortedData[i].hour_no === 'T-Break') {

            continue;
        }
        if (sortedData[i].hour_no === formulasData.hour_no) {
            breakIndex = i + 1;
            break;
        }
    }

    if (breakIndex > sortedData.length) {
        breakIndex = sortedData.length;
    }


    const rows = sortedData.slice(0, breakIndex).map((item) => {
        if (item.hour_no === 'Break' || item.hour_no === 'T-Break') {
            return null; // Skip rendering this item
        }
        return (
            <tr key={item.hour_no}>
                <td>{item.hour_no}</td>
                <td>{item.hourly_target}</td>
                <td>{item.actual_hourly_pass}</td>
                <td>{formatValue(item.hourly_difference)}</td>

                <td>{planData.plan_eff}</td>
                <td>{formatToTwoDecimals(item.actual_eff)}</td>
                <td>{formatToTwoDecimals(item.difference_eff)}</td>

                <td>{item.plan_dhu}</td>
                <td>{formatValueDhu(item.hourly_dhu)}</td>
                <td>{formatValueDhu(item.difference_dhu)}</td>
            </tr>
        );
    });



    return (
        <section id="dashboard" className="bg-black h-screen" ref={dashboardRef}>
            <header>
                <nav className="bg-[#070F2B] border-2 border-slate-500 w-full h-15 flex items-center justify-between">
                    <div className="flex items-center justify-center border-r border-black w-1/5 h-full">
                        <a href="#" className="flex items-center justify-center">
                            <img src={logo} alt="logo" className="mr-2" />
                            <span className="text-goldenrod text-2xl text-white font-semibold">IntelliSYNC</span>
                        </a>
                    </div>
                    <div className="flex-grow flex items-center justify-center border-r border-black w-3/5 h-full">
                        <span className="text-goldenrod font-bold text-white text-3xl">Production DashBoard</span>
                    </div>
                    <div className="flex items-center justify-center w-1/5 h-full">
                        <div id="time" className="text-goldenrod mt-6 text-white text-2xl font-bold ml-10">{time}</div>
                    </div>
                </nav>
                <div className="w-full h-16 bg-black">
                    <div className="flex justify-center items-center w-full h-[8vh]">
                        {/* <div className="w-[300px] h-[6vh]text-left text-2xl text-white font-bold">Selection Criteria</div> */}
                        <div className="w-[215px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-xl text-white font-bold">{planData.date || 'Date'}</div>
                        <div className="w-[215px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-xl text-white font-bold">{planData.unit || 'Unit'}</div>
                        <div className="w-[215px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-xl text-white font-bold">{planData.floor || 'Floor'}</div>
                        <div className="w-[215px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-xl text-white font-bold">{planData.line || 'Line'}</div>
                        {/* <div className="w-[340px] h-[7vh] border border-solid border-white text-center flex justify-center items-center text-3xl text-white font-bold">Projected : {formulasData.projected_output || '0'}</div> */}
                    </div>
                    <div className="overflow-x-auto bg-black">

                        <table className='table table-sm w-full *:!text-white *:!text-center [&>*_th]:border [&>*_th]:border-white [&>*_td]:text-xl  [&>*_th]:text-xl  [&>*_td]:border [&>*_td]:border-white'>
                            <thead>
                                <tr>
                                    <th>Hour</th>
                                    <th colSpan={3} >Output</th>
                                    <th colSpan={3}>Efficiency</th>
                                    <th colSpan={3}>DHU</th>
                                </tr>
                                <tr>
                                    <th>Hour</th>
                                    <th>Plan</th>
                                    <th>Actual</th>
                                    <th>Variance</th>
                                    <th>Plan</th>
                                    <th>Actual</th>
                                    <th>Variance</th>
                                    <th>Plan</th>
                                    <th>Actual</th>
                                    <th>Variance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                            {/* <tfoot>
                                <tr>
                                    <td>Total</td>
                                    <td>{formulasData.real_time_target}</td>
                                    <td>{formulasData.actual_pass}</td>
                                    <td>{formulasData.difference}</td>
                                    <td>{formulasData.standard_efficiency}</td>
                                    <td>{formulasData.eff_percentage}</td>
                                    <td>{formatToTwoDecimals(cumulativeEff)}</td>
                                    <td>{formulasData.plan_dhu}</td>
                                    <td>{formulasData.dhu_percentage}</td>
                                    <td>{formatValueDhu(formatToTwoDecimals(cumulativeDhu))}</td>
                                </tr>
                            </tfoot> */}
                        </table>
                    </div>
                </div>
            </header>
            <button
                className="absolute top-[90px] left-1 transform -translate-y-1/2 bg-transparent text-white px-4 py-2 text-xl  focus:outline-none hover:bg-gray-700"
                onClick={toggleFullScreen}
            >
                [&nbsp;&nbsp;]
            </button>
        </section>

    );
};

export default FinTvDashboard3;
