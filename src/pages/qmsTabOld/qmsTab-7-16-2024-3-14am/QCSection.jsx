import {  ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
// import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import DjangoConfig from '../../config/Config';
import { useEffect, useState } from 'react';
import { resetOperations } from '../../utils/slice/DefectMasterSlice';
import { passResetProduct1,passResetProduct2 } from '../../utils/slice/PassMasterSlice';
import { resetRejectOperations } from '../../utils/slice/RejectMasterSlice';
import { userLogout } from '../../utils/slice/UserSlice';
import { clearRows } from '../../utils/slice/SewingInputSlice';
const QCSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userData = useSelector(state => state.User.userData);
  const orderItems = useSelector((state) => state.passMaster.items1);
  const sewingPlanData = useSelector(state => state.sewingInput.rowData);
  const [passCount, setPassCount] = useState(null);
  const [rejectCount, setRejectCount] = useState(null);
  const [rectifiedCount, setRectifiedCount] = useState(null);
  const [defectCount, setDefectCount] = useState(null);

  console.log("sewingPlanData",sewingPlanData)


  // const clearLoacl=()=>{
  //   localStorage.clear()
  //   // localStorage.clear(rejectq)
  // }

  const handleLogout = () => {
    dispatch(resetOperations());
    dispatch(passResetProduct1());
    dispatch(passResetProduct2());
    dispatch(resetRejectOperations());
    dispatch(userLogout());
    dispatch(clearRows())
    navigate('/')
  };


  if (userData === null){
    const uData=localStorage.getItem('userData');
    console.log(uData) 
  }
  console.log("userData",userData) 

  useEffect(() => {
    fetchPlaningData();

}, [])



const fetchPlaningData = () => {
    const userData2 = {
        id: sewingPlanData.id,
    };
    const queryParams = new URLSearchParams(userData2).toString();
    axios.get(`${DjangoConfig.apiUrl}/rtqm/rtqm_api/?${queryParams}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            const totalCounter = response.data.total_counter_data
            const todayCounterData = response.data.today_counter_pdrr
            console.log("today Counter Data",todayCounterData)
            console.log("total data",response.data.total_counter_data)
            setPassCount(totalCounter.pass_count);
            setRejectCount(totalCounter.reject_count);
            setRectifiedCount(totalCounter.rectified_count);
            setDefectCount(totalCounter.defect_count);
        })
        .catch(error => {
            console.error('Error fetching filtered data:', error);
        });
};
// console.log("pass count",passCount)
// console.log("setRejectCount count",rejectCount)
// console.log("setRectifiedCount count",rectifiedCount)
// console.log("setDefectCount count",defectCount)




  // let totalPassQuantity = 0
  // if(orderItems){
  //   orderItems.forEach(item => {
  //     totalPassQuantity += item.quantity;
  //   });
  // }
 
  const handelOnClick =()=>{
    navigate('/qms-tab/rectified-defect-dt-list')
  }
  const handelDefectOnClick =()=>{
    navigate('/qms-tab/defect-size-master')
  }
  const handelPassOnClick =()=>{
    navigate('/qms-tab/pass-size-input')
  }
  const handelRejectOnClick =()=>{
    navigate('/qms-tab/reject-size-master')
  }
  
  return (
        <div className="flex flex-col bg-gray-100 rounded-lg border border-gray-200 p-4">
          {/* <div className="flex first-letter w-full bg-gray-300 h-20 rounded-lg "> */}
          <div className="flex justify-evenly">
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Buyer</p>
                    <p className="text-sm">{sewingPlanData.buyer_name}</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Style</p>
                    <p className="text-sm">{sewingPlanData.styleno}</p>
                </div>
               
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Color</p>
                    <p className="text-sm">{sewingPlanData.color}</p>
                </div>
                <div className="border-2 w-full items-center pb-2">
                    <p className="text-sm font-medium">Quantity</p>
                    <p className="text-sm">{sewingPlanData.quantity}</p>
                </div>
                <div className="border-2 w-full pb-2">
                    <button className="btn btn-outline w-full h-full" onClick={ handleLogout}>Logout</button>
                </div>

            {/* </div> */}
    
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* First Column */}
            <div className="bg-green-500 rounded-lg p-4 grid grid-cols-5 gap-4 cursor-pointer"  onClick={handelPassOnClick}>
              <div className="col-span-4 h-20 md:h-32 flex items-center justify-between text-white">
                <button className="flex-grow text-4xl font-bold bg-transparent focus:outline-none rounded-lg p-2" onClick={handelPassOnClick} >
                 PASS  (RFT)
                </button>
                <span className="ml-1 md:ml-2 text-4xl">{passCount}</span>
              </div>
              <div className="col-span-1 md:col-span-1 bg-gray-200 items-center justify-center rounded-lg">
                <button className="btn bg-transparent w-full h-full text-left" >
                  <ArrowUturnLeftIcon className="w-8 h-8 text-black" />
                </button>
                {/* <button className="btn bg-transparent w-full mt-2 text-left" onClick={() => increaseQuantity('pass')}>
                  <ArrowLongRightIcon className="w-8 h-8 text-black" />
                </button> */}
              </div>
            </div>
    
            {/* Second Column */}
            <div className="bg-yellow-500 rounded-lg p-4 grid grid-cols-5 gap-4">
              <div className="col-span-4 h-20 md:h-32 flex items-center justify-between text-white">
                <button className="flex-grow text-4xl font-bold bg-transparent focus:outline-none rounded-lg p-2" onClick={handelDefectOnClick} >
                  DEFECTED
                </button>
                <span className="ml-1 md:ml-2 text-4xl">{defectCount}</span>
              </div>
              {/* <div className="col-span-1 md:col-span-1 bg-gray-200 items-center justify-center rounded-lg">
                <button className="btn bg-transparent w-full h-full text-left" >
                  <ArrowUturnLeftIcon className="w-8 h-8 text-black" />
                </button>
                <button className="btn bg-transparent w-full mt-2 text-left" onClick={() => increaseQuantity('pass')}>
                  <ArrowLongRightIcon className="w-8 h-8 text-black" />
                </button>
              </div> */}
            </div>
    
            {/* Third Column */}
            <div className="bg-red-500 rounded-lg p-4 grid grid-cols-5 gap-4">
              <div className="col-span-4 h-20 md:h-32 flex items-center justify-between text-white">
                <button className="flex-grow text-4xl font-bold bg-transparent focus:outline-none rounded-lg p-2" onClick={handelRejectOnClick} >
                  REJECT
                </button>
                <span className="ml-1 md:ml-2 text-4xl">{rejectCount}</span>
              </div>
              <div className="col-span-1 md:col-span-1 bg-gray-200 items-center justify-center rounded-lg">
                <button className="btn bg-transparent w-full h-full text-left" >
                  <ArrowUturnLeftIcon className="w-8 h-8 text-black" />
                </button>
                
              </div>
            </div>
    
            {/* Fourth Column */}
            <div className="bg-blue-500 rounded-lg p-4 grid grid-cols-5 gap-4">
              <div className="col-span-4 h-20 md:h-32 flex items-center justify-between text-white">
                <button className="flex-grow text-4xl font-bold bg-transparent focus:outline-none rounded-lg p-2" onClick={handelOnClick}>
                  RECTIFIED
                </button>
                <span className="ml-1 md:ml-2 text-4xl">{rectifiedCount}</span>
              </div>
              <div className="col-span-1 md:col-span-1 bg-gray-200 items-center justify-center rounded-lg">
                <button className="btn bg-transparent w-full h-full text-left" >
                  <ArrowUturnLeftIcon className="w-8 h-8 text-black" />
                </button>
                
              </div>
            </div>

            {/* <button onClick={clearLoacl}>clearLoacl</button> */}
          </div>
        </div>
      );
};

export default QCSection;





