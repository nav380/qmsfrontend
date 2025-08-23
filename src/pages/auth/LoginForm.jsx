import React, { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loginAnimation from '../../assets/animation.json';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import DjangoConfig from '../../config/Config';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../utils/slices/userSlice';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordVisible: false,
        process: '',
        section: '',
        line: '',
        floor: '',
        errorMessage: ''
    });

    const [isLoading, setIsLoading] = useState(false)
    const [proData, setProData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null);
    const [selectedSec, setSelectedSec] = useState(null)
    const [lineData, setLineDate] = useState([])
    const [selectedLine, setSelectedLine] = useState(null)
    const [floorData, setFloorData] = useState([])
    const [selectedFloor, setSelectedFloor] = useState(null)

    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        fetchProcessesData();
        fetchFloorData()
    }, []);

    const fetchProcessesData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view/?`);
            setProData(response.data.pro_data.map(item => ({ value: item.id, label: item.name })));
            console.log("Process data", response.data);
        } catch (err) {
            toast.error(err)
        }
    };

    const handleProcessSelect = (selectedPro) => {
        setSelectedPro(selectedPro);
        setSectionData([])
        fetchSectionData(selectedPro.value);
    };

    const fetchSectionData = async (id) => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/section_master_view/?id=${id}`);
            setSectionData(response.data.sec_data.map(item => ({ value: item.id, label: item.name })));
            console.log("Section data", response.data);
        } catch (err) {
            toast.error(err)
        }
    };

    const fetchFloorData = () => {
        const userData = {
            unit_id: 8,
        };

        const queryParams = new URLSearchParams(userData).toString();

        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const floorOptions = response.data.common_master_data.map(item => ({ value: item.id, label: item.name }));
            setFloorData(floorOptions)
        }).catch(error => {
            console.error('Error fetching filtered data:', error);
        });
    };

    const handleFloorChange = (selectedValue) => {
        setSelectedFloor(selectedValue);
        fetchLineData(selectedValue)
    };

    const fetchLineData = (selectedValue) => {
        const userData = {
            common_id: selectedValue.value,
        };

        const queryParams = new URLSearchParams(userData).toString();
        
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const lineOptions = response.data.line_master_data.map(item => ({ value: item.id, label: item.name }));
            setLineDate(lineOptions)
        }).catch(error => {
            console.error('Error fetching filtered data:', error);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const params = new URLSearchParams({
            username: formData.username,
            password: formData.password,
        });

        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_user_master/?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = response.data.user_data;

            if (result.username) {
                dispatch(userLogin(result))
                navigate('/line-selection');
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
            setFormData({
                ...formData,
                errorMessage: 'Failed to fetch data'
            });
        }

        setFormData({
            username: '',
            password: '',
            errorMessage: ''
        });
    };

    const togglePasswordVisibility = () => {
        setFormData(prevState => ({
            ...prevState,
            passwordVisible: !prevState.passwordVisible
        }));
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
            <div className="background backdrop-blur-lg">
                {[...Array(20)].map((_, i) => (
                    <span key={i}></span>
                ))}
            </div>
            <div className="relative w-full max-w-4xl shadow-lg md:rounded-lg overflow-hidden">
                <div className="relative w-full md:flex">
                    <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                        <Player autoplay loop src={loginAnimation} className="w-64 md:w-auto mb-6" />
                        <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
                        <p className="text-lg mb-4">We're glad to see you back.</p>
                    </div>
                    <div className="w-full bg-[#ffffff] text-center md:w-1/2 p-8">
                        <h2 className="text-3xl font-bold mb-6 gradient-text"> IntelliSYNC</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <FaUser className="absolute left-4 top-3 text-gray-500" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    className="pl-12 w-full h-12 p-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-3 text-gray-500" />
                                <input
                                    type={formData.passwordVisible ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    className="pl-12 w-full h-12 p-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-3 text-gray-500"
                                >
                                    {formData.passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {/* <FormControl fullWidth className="mb-4">
                                <Select
                                    options={proData}
                                    value={selectedPro}
                                    onChange={handleProcessSelect}
                                    placeholder="Select Processes"
                                    className="w-full border-2  border-gray-400 rounded-md"
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
                                    className="w-full border-2  border-gray-400 rounded-md"
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
                            <FormControl fullWidth className="mb-4">
                                <Select
                                    options={floorData}
                                    value={selectedFloor}
                                    onChange={handleFloorChange}
                                    placeholder=" Floor"
                                    className="w-full border-2  border-gray-400 rounded-md"
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
                            </FormControl>
                            <FormControl fullWidth className="mb-4">
                                <Select
                                    options={lineData}
                                    value={selectedLine}
                                    onChange={setSelectedLine}
                                    placeholder=" Line"
                                    className="w-full border-2  border-gray-400 rounded-md"
                                    isSearchable
                                    isLoading={!lineData.length}
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
                            </FormControl> */}

                            {formData.errorMessage && (
                                <p className="text-red-500 text-sm mb-4">{formData.errorMessage}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-orange-400 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:scale-95 transition-transform duration-300 ease-in-out"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
