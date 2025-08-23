import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../utils/slices/userSlice';
import DjangoConfig from '../../config/Config';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import { FormControl } from '@mui/material';

const LineSelection = () => {
    const [lineData, setLineData] = useState([]);
    const [lineId, setLineId] = useState(null);
    const [proData, setProData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null);
    const [selectedSec, setSelectedSec] = useState(null);
    const [permissionsData, setPermissionsData] = useState([]);

    const userData = useSelector(state => state.user.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('User Data in LineSelection:', userData);
        setPermissionsData(userData.permissions || []);

    }, [userData]);



    useEffect(() => {
        const fetchTabLine = async () => {
            try {
                const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_tab_login/`);
                setLineData(response.data.line_master_data);
                console.log("Line Data", response.data.line_master_data)

            } catch (error) {
                console.error("Error fetching line data:", error);
                toast.error('Failed to load line data');
            }
        };

        const fetchProcessesData = async () => {
            try {
                const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view/`);
                setProData(response.data.pro_data.map(item => ({ value: item.id, label: item.name })));
                console.log("permission Data", permissionsData)
            } catch (err) {
                toast.error('Failed to load processes data');
            }
        };
       

        fetchTabLine();
        fetchProcessesData();
    }, [userData.permissions]);

    useEffect(() => {
        if (selectedPro) {
            fetchSectionData(selectedPro.value);
        }
    }, [selectedPro]);

    const fetchSectionData = async (id) => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/section_master_view/?id=${id}`);
            setSectionData(response.data.sec_data.map(item => ({ value: item.id, label: item.name })));
        } catch (err) {
            toast.error('Failed to load section data');
        }
    };

    const handleProcessSelect = (selectedPro) => {
        setSelectedPro(selectedPro);
        setSelectedSec(null);
        setSectionData([]);
    };

    const handleLineClick = async (id) => {
        try {
            const selectedLine = lineData.find(line => line.id === parseInt(lineId));
            const matchPermission = permissionsData.find(item => item.process_id === selectedPro.value && item.section_id === selectedSec.value && item.line_id === selectedLine.id)
            if (selectedLine && selectedPro && selectedSec) {

                if (matchPermission.process__name === "Stitching") {

                    if (matchPermission.section__name === "Stitching - Output") {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id: selectedLine.id,
                            line_name: selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions
                        };

                        const updatedResult = {
                            ...additionalData,
                        };

                        localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))

                        toast.success("End Line Checking");
                        navigate('/qms-tab/end-line-start');
                    } else if (matchPermission.section__name === 'Stitching - Input') {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id: selectedLine.id,
                            line_name: selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions

                        };
                        const updatedResult = {
                            ...additionalData,
                        };
                        localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))
                        toast.success("End Line Checking");
                        navigate('/input-master/line-master');
                    }
                }
                if (matchPermission.process__name === "Finishing") {

                    if (matchPermission.section__name === "Finishing - Output") {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id: selectedLine.id,
                            line_name: selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions
                        };

                        const updatedResult = {
                            ...additionalData,
                        };

                        localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))

                        toast.success("Finishing Output ");
                        navigate('/qms-tab/end-line-start');
                    } 
                    else if (matchPermission.section__name === 'Finishing - Input') {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id: selectedLine.id,
                            line_name: selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions

                        };
                        const updatedResult = {
                            ...additionalData,
                        };
                        // localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))
                        toast.success("Finishing Input Checking");
                        navigate('/input-master/line-master');
                    }
                }
                else if (selectedPro.label === 'Kaj Button') {
                    if (matchPermission.section__name === "Kaj Button - Output") {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id: selectedLine.id,
                            line_name: selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions
                        };

                        const updatedResult = {
                            ...additionalData,
                        };

                        localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))

                        toast.success("Kaj Button Output");

                        navigate('/qms-tab/end-line-start');
                    } 
                    else if (matchPermission.section__name === 'Kaj Button - Input') {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id: selectedLine.id,
                            line_name: selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions

                        };
                        const updatedResult = {
                            ...additionalData,
                        };
                        // localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))
                        toast.success("Kaj Button Page");
                        navigate('/input-master/line-master');
                    }


                }
                else if (selectedPro.label === 'Washing') {
                    if (matchPermission.section__name === "Washing - Output") {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id: selectedLine.id,
                            line_name: selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions
                        };

                        const updatedResult = {
                            ...additionalData,
                        };

                        localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))

                        toast.success("Kaj Button Output");

                        navigate('/qms-tab/end-line-start');
                    } 
                    else if (matchPermission.section__name === 'Washing - Input') {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id: selectedLine.id,
                            line_name: selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions

                        };
                        const updatedResult = {
                            ...additionalData,
                        };
                        // localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))
                        toast.success("Kaj Button Page");
                        navigate('/input-master/line-master');
                    }


                }
                else if (selectedPro.label === 'Packing') {
                    if (matchPermission.section__name === 'Packing - MD Point') {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id: selectedLine.id,
                            line_name: selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions
    
                        };
                        const updatedResult = {
                            ...additionalData,
                        };
                        // localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))
                        toast.success("Packing Page");
                        navigate('/input-master/line-master');
                    }
                    // toast.success("Packing Page");
                }
                else if (selectedPro.label === 'Cutting') {
                    if (matchPermission.section__name === 'Cutting - Ready to load') {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,

                            section_id: selectedSec.value,
                            line_id : selectedLine.id,
                            line_name : selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permissions: userData.permissions

                        };

                        const updatedResult = {
                            ...additionalData,
                        };

                        localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))
                        toast.success(" Cutting");
                        navigate('/cutting-input/cut-master/');
                    }
                    else if (matchPermission.section__name === 'Re-Cutting') {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id : selectedLine.id,
                            line_name : selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permission: userData.permissions

                        };

                        const updatedResult = {
                            ...additionalData,
                        };

                        dispatch(userLogin(updatedResult))
                        toast.success(" Cutting");
                      
                        navigate('/cutting-input/cut-master/');

                    }
                }
                // else {
                //     toast.error("Error");
                // }

            }
             else if (selectedPro && selectedSec ) {
                if (selectedPro.label === 'Cutting') {
                    if (matchPermission.section__name === 'Cutting - Ready to load') {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id : selectedLine.id,
                            line_name : selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permission: userData.permissions

                        };

                        const updatedResult = {
                            ...additionalData,
                        };

                        localStorage.setItem('userData', JSON.stringify(updatedResult));
                        dispatch(userLogin(updatedResult))
                        toast.success("End Line Checking");

                        toast.success(" Cutting");

                        navigate('/cutting-input/cut-master/');
                    }
                    else if (matchPermission.section__name === 'Re-Cutting') {
                        const additionalData = {
                            process_name: selectedPro.label,
                            process_id: selectedPro.value,
                            section_name: selectedSec.label,
                            section_id: selectedSec.value,
                            line_id : selectedLine.id,
                            line_name : selectedLine.name,
                            user_id: userData.id,
                            username: userData.username,
                            permission: userData.permissions

                        };

                        const updatedResult = {
                            ...additionalData,
                        };

                        dispatch(userLogin(updatedResult))
                        toast.success(" Cutting");
                        navigate('/cutting-input/cut-master/');
                    }
                }

                // toast.error('Invalid Line');
            } else {
                toast.error('Invalid Line');
            }
        } catch (error) {
            toast.error('Error processing selection');
        }
    };

    // useEffect(() => {
    //     if (selectedSec !== null) {
    //         if (selectedSec.label === 'Cutting - Ready to load') {
    //             document.getElementById('linesection_btn').style.display = 'none';
    //             console.log('selectedSec=======>', selectedSec.label)
    //         }
    //     }
    // })
    const filteredLineData = lineData.filter(item =>
        permissionsData.some(permission => permission.line_id === item.id)
    );

    const matchPermission = permissionsData.filter(
        item => item.process_id === selectedPro?.value && item.section_id === selectedSec?.value
    );

    const finalFilteredData = filteredLineData.filter(lineItem =>
        matchPermission.some(permission => permission.line_id === lineItem.id)
    );

    // Determine which data to display
    const dataToDisplay = selectedPro && selectedSec ? finalFilteredData : filteredLineData;


    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
            <div className="background">
                {[...Array(20)].map((_, i) => (
                    <span key={i}></span>
                ))}
            </div>
            <div className="relative w-full max-w-4xl shadow-lg md:rounded-lg overflow-hidden">
                <div className="bg-white w-full shadow-3xl rounded-xl p-6 md:p-12">
                    <h1 className="text-2xl font-bold mb-6 text-center">Select a Line   {userData.username}</h1>
                    <p>  </p>
                    <div className="flex flex-wrap gap-4">
                        <FormControl fullWidth className="mb-4">
                            <Select
                                options={proData}
                                value={selectedPro}
                                onChange={handleProcessSelect}
                                placeholder="Select Processes"
                                className="w-full border-2 border-gray-400 rounded-md"
                                isSearchable
                                isLoading={!proData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '14px',
                                    }),
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth className="mb-4">
                            <Select
                                options={sectionData}
                                value={selectedSec}
                                onChange={setSelectedSec}
                                placeholder="Select Section"
                                className="w-full border-2 border-gray-400 rounded-md"
                                isSearchable
                                isLoading={!sectionData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '14px',
                                    }),
                                }}
                            />
                        </FormControl>
                        <div id="linesection_btn" className="flex flex-wrap gap-4">
                            {dataToDisplay.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`w-1/5 min-w-[150px] py-3 px-4 text-left rounded-md border ${lineId === item.id ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                                    onClick={() => setLineId(item.id)}
                                    disabled={!selectedPro || !selectedSec}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="w-1/5 min-w-[150px] py-3 px-4 text-left rounded-md border btn btn-primary m-auto"
                            onClick={handleLineClick}
                            disabled={!selectedPro || !selectedSec}
                        >
                            Check Line
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineSelection;
