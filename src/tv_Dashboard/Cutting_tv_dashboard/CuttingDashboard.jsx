import React, { useEffect, useState } from 'react';
// import './output.css';
import logo from './logo-low.png';
import DjangoConfig from '../../config/Config';
import axios from 'axios';
import { useRef } from 'react';

const CuttingDashboard = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [formulasData, setFormulasDate] = useState({})
    const [loading, setLoading] = useState(true);
    // const [planData, setPlanData] = useState({})

    const dashboardRef = useRef(null);
    // const fullscreenButtonRef = useRef(null);
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
        // Set a timeout to enable full screen after 5 seconds (5000 milliseconds)
        const timeoutId = setTimeout(() => {
            toggleFullScreen();
            window.addEventListener('onClick', toggleFullScreen);
            console.log("Fullscreen enabled")
            dashboardRef.current.requestFullscreen()
        }, 1000); // 5 seconds delay

        // Clean up the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, []);

   

    useEffect(() => {
        // toggleFullScreen()
        const updateDateTime = () => {
            const dt = new Date();
            setCurrentTime(dt.toLocaleTimeString());
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const queryParams = new URLSearchParams(location.search);
                const floor_id = queryParams.get('floor_id');
                // const process_id = queryParams.get('process_id');
                const unit_id = queryParams.get('unit_id');
                console.log(floor_id, unit_id)
                const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/cutting_tv_dashboard/?floor_id=${floor_id}&unit_id=${unit_id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                setFormulasDate(response.data.cutdashboardData);
                // setPlanData(response.data.plan_data)
                console.log("Cutting tv data", response.data)
                setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
        // const timer = setInterval(updateTime, 1000);
        // return () => clearInterval(timer);
    }, []);

    const customStyles = {
        "--value": formulasData.actual_eff,
        "--size": "12rem",
        "--thickness": "1.2rem",
        width: "var(--size)",
        height: "var(--size)",
        color: formulasData.actual_eff >= 50 ? 'green' : 'red'
    };


    return (
        <>
            <body className="h-[100vh] bg-black text-white space-y-1 text-3xl font-semibold" ref={dashboardRef}>
                <div className="header flex justify-between px-4 py-1 border-indigo-50 border">
                    <div className=" flex space-x-2 items-center">
                        <img src={logo} alt="" height="50px" width="50px" />
                        <p>IntelliSYNC</p>
                    </div>
                    <div className="">Cutting Dashboard</div>
                    <div className="" id="datetime">Time :{currentTime}</div>
                </div>
                <div className="subheader flex justify-between px-4 py-1 border-indigo-50 border">
                    <button id="fullscreenmyButton"
                        className="absolute top-[80px] left-1 transform -translate-y-1/2 bg-transparent text-white px-4 py-2 text-xl  focus:outline-none hover:bg-gray-700"
                        onClick={toggleFullScreen}
                    >
                        [&nbsp;&nbsp;]
                    </button>
                    <div className=" ml-20">Unit : {formulasData.unit_name}</div>
                    <div>Location : {formulasData.floor_name}</div>
                    <div>Hour No.</div>
                </div>
                <div className="h-[65vh] main_div w-full flex justify-between space-x-0">
                    <div className="w-[28%] h-[65vh] border-indigo-50 border flex flex-col justify-around px-5">
                        <div className="flex justify-between items-center">
                            <p style={{ fontSize: '20px' }}>Day Target :</p>
                            <p className=" text-[90px] font-bold">{formulasData.day_target || '00'}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p style={{ fontSize: '20px' }}>Real Time Taget :</p>
                            <p className="text-[90px] font-bold">{formulasData.real_time_target || '00'}</p>
                        </div>
                        <div className="flex justify-between items-center ">
                            <p style={{ fontSize: '20px' }}>Difference : <br /><span className="text-lg">(Target VS Actual)</span></p>
                            <p className="text-[90px] font-bold">{formulasData.difference_percentage || '00'}</p>
                        </div>
                    </div>

                    <div className="w-[45%] h-[65vh] border border-indigo-50">
                        <div className="flex justify-between items-center">
                            <div className='w-[33.33%] h-[7vh]  border-r text-lg text-center border-indigo-50 p-2'>Actual Cutting</div>
                            <div className='w-[33.33%] h-[7vh]  border-r text-lg text-center border-indigo-50 p-2'>Ready To Load</div>
                            <div className='w-[33.33%] h-[7vh]  text-lg text-center p-2'>Issue To Floor</div>
                        </div>
                        <div className="flex justify-between items-center border-t border-b border-indigo-50">
                            <div className='w-[33.33%] h-[28vh] text-[80px]  border-r border-indigo-50 flex justify-center items-center'>{formulasData.actual_cutting || '00'}</div>
                            <div className='w-[33.33%] h-[28vh]  text-[80px] border-r border-indigo-50 flex justify-center items-center'>{formulasData.ready_to_load || '00'}</div>
                            <div className='w-[33.33%] h-[28vh]  text-[80px] border-indigo-50 flex justify-center items-center'>{formulasData.issue_to_floor || '00'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className='w-[33.33%] h-[30vh] text-lg border-r border-indigo-50 text-center'>Re-cutting Qty<br /><br /><br />
                                <div className="text-center  text-[80px]">{formulasData.recutting_qty || '00'}</div>
                            </div>
                            <div className='w-[66.66%] h-[30vh]'>
                                <div className='h-[10vh] border-b border-indigo-50 flex justify-center items-center '>WIP</div>
                                <div className="flex justify-between items-center">
                                    <div className='w-[50%] h-[20vh] border-r border-indigo-50 text-[80px] flex justify-center items-center'>{formulasData.wip_first || '00'}</div>
                                    <div className='w-[50%] h-[20vh]  text-[80px] flex justify-center items-center'>{formulasData.wip_second || '00'}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="w-[26%] h-[65vh] border border-indigo-50 ">
                        <div className=" space-y-2 p-3 items-center">
                            <div>
                                <p className="text-lg">EFF% Actual :</p>
                            </div>
                            <div className="text-center">
                                <div className="radial-progress " style={customStyles}
                                    role="progressbar">
                                    <p className="text-5xl ">{formulasData.actual_eff || '00'}%</p>
                                </div>
                            </div>
                            <div className=" flex flex-col justify-between px-2 space-y-1 ">
                                <p className="text-lg items-start">Planned&nbsp;:</p><br/>
                                <p className="text-[80px] items-center text-center">{formulasData.plan_eff || '00'}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
                <div className="lower_div flex h-[15vh] space-x-1">
                    <div className=" w-full ">
                        <div className="h-[15vh] border-indigo-50 border flex justify-between p-2 items-center">
                            <p className="text-[20px] text-center ">Layerman :</p>
                            <p className="text-[90px]  text-center">{formulasData.layer_man || '00'}</p>
                        </div>
                    </div>
                    <div className=" w-full">
                        <div className="h-[15vh] border-indigo-50 border flex justify-between p-2 items-center">
                            <p className="text-[20px] text-center">Stickerman :</p>
                            <p className="text-[90px] text-center">{formulasData.sticker_man || '00'}</p>
                        </div>
                    </div>
                    <div className=" w-full">
                        <div className="h-[15vh] border-indigo-50 border flex justify-between p-2 items-center">
                            <p className="text-[20px] text-center">Re-Cutter :</p>
                            <p className="text-[90px] text-center">{formulasData.re_cutter || '00'}</p>
                        </div>
                    </div>
                    <div className=" w-full">
                        <div className="h-[15vh] border-indigo-50 border flex justify-between p-2 items-center">
                            <p className="text-[20px] text-center">Helper :</p>
                            <p className="text-[90px] text-center">{formulasData.helper_man || '00'}</p>
                        </div>
                    </div>
                </div>
            </body >
        </>
    );
};

export default CuttingDashboard;
