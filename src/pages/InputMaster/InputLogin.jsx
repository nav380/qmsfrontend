import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { userLogin } from '../../utils/slices/UserSlice';
import { userLogin } from '../../utils/slices/userSlice';
import DjangoConfig from '../../config/Config';
import { toast } from 'react-toastify';

const InputLogin = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [lineData, setLineData] = useState([])
    const [lineId, setLineId] = useState(null);
    const [password, setPassword] = useState('');


    useEffect(() => {
        fatchTabLine()
    }, [])

    const fatchTabLine = () => {
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_tab_login/`).then((response) => {
            setLineData(response.data.line_master_data)
        }).catch((error) => {
            console.log("error is ", error)
        })
    }


    const handleSubmit = async (e) => {
        console.log(lineId, password)
        e.preventDefault();
        try {
            const userData = lineData.find((key) => key.id === parseInt(lineId));
            if (userData) {
                if (userData.value === password) {
                    const uData = { ...userData };
                    localStorage.setItem('userData', JSON.stringify(uData)); 
                    dispatch(userLogin(userData));
                    navigate('/input-master/line-master');
                }
                else {
                    toast.error('Invalid  password');

                }

            } else {
                toast.error('Invalid email or password');
            }
        } catch (error) {
            toast.error('Invalid email or password');
        }
    };


    return (

        <div className="bg-yellow-400 dark:bg-gray-800 h-screen overflow-hidden flex items-center justify-center">
            <div className="bg-white lg:w-5/12 md:w-5/12 w-6/12 shadow-3xl rounded-xl">
                <div className="bg-gray-100 shadow shadow-gray-200 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full  md:p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                        <path d="M 30 5 C 22.838262 5 17 10.838262 17 18 C 17 18.882345 17.182742 19.703331 17.351562 20.527344 L 5.4394531 32.439453 A 1.50015 1.50015 0 0 0 5 33.5 L 5 41.5 A 1.50015 1.50015 0 0 0 6.5 43 L 14.5 43 A 1.50015 1.50015 0 0 0 16 41.5 L 16 39 L 19.5 39 A 1.50015 1.50015 0 0 0 21 37.5 L 21 34 L 24.5 34 A 1.50015 1.50015 0 0 0 26 32.5 L 26 30.294922 C 27.271145 30.709396 28.595703 31 30 31 C 37.161738 31 43 25.161738 43 18 C 43 10.838262 37.161738 5 30 5 z M 30 8 C 35.540262 8 40 12.459738 40 18 C 40 23.540262 35.540262 28 30 28 C 28.262518 28 26.639202 27.56058 25.21875 26.785156 A 1.50015 1.50015 0 0 0 23 28.101562 L 23 31 L 19.5 31 A 1.50015 1.50015 0 0 0 18 32.5 L 18 36 L 14.5 36 A 1.50015 1.50015 0 0 0 13 37.5 L 13 40 L 8 40 L 8 34.121094 L 19.988281 22.132812 A 1.50015 1.50015 0 0 0 20.373047 20.669922 C 20.133878 19.809089 20 18.919659 20 18 C 20 12.459738 24.459738 8 30 8 z M 32 13 A 3 3 0 0 0 32 19 A 3 3 0 0 0 32 13 z"></path>
                    </svg>
                </div>


                <div className="p-12 md:p-24">
                    <div className="flex items-center text-lg mb-6 md:mb-8">
                        <svg className="absolute ml-3" width="24" viewBox="0 0 24 24"><path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z"></path></svg>
                        <select
                            name="lineId"
                            onChange={(e) => setLineId(e.target.value)}
                            className="bg-gray-200 rounded pl-12 py-2 md:py-4  focus:outline-none w-full"
                        >
                            {lineData.map((item) => (
                                <option key={item.id} value={item.id} >
                                    {item.name}
                                </option>
                            ))}
                            {/* <option value={ 1} >
                  C-54 Line 1
                </option>
                <option  value={ 1} >
                  C-54 Line 2
                </option>
                <option value={ 1} >
                  C-54 Line 3
                </option>
                <option  value={ 1} >
                  C-54 Line 4
                </option> */}
                        </select>
                    </div>
                    <div className="flex items-center text-lg mb-6 md:mb-8">
                        <svg className="absolute ml-3" viewBox="0 0 24 24" width="24"><path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z"></path></svg>
                        <input type="password" id="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-200 rounded pl-12 py-2 md:py-4  focus:outline-none w-full" placeholder="Password" />
                    </div>
                    <button className="bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-full rounded" onClick={handleSubmit}>Login</button>
                </div>

            </div>
        </div>
    );
};

export default InputLogin;
