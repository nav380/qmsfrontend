import React, { useEffect, useRef, useState } from 'react';
import logo from './favicon.ico';
import DjangoConfig from '../config/Config';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const TVDashboard2 = () => {
  const [time, setTime] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const [planData, setPlanData] = useState({});
  const [loading, setLoading] = useState(true);
  const [defectList, setDefectList] = useState([])
  const [obList, setObList] = useState([])
  const location = useLocation();
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
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const hoursStr = hours.toString().padStart(2, '0');
      setTime(`${hoursStr}:${minutes}:${seconds} ${ampm}`);
    };

    const timerId = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(timerId);
  }, []);

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const line_id = queryParams.get('line_id');
      const process_id = queryParams.get('process_id');
      const section_id = queryParams.get('section_id');
      const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/sewing_tv_dashboard2/?line_id=${line_id}&process_id=${process_id}&section_id=${section_id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });


      const { silhouettes_data, today_defect_list, plan_data, defect_list, ob_list } = response.data;
      const { front_image, back_image } = silhouettes_data;

      setPlanData(plan_data);
      setBackImage(`${DjangoConfig.apiUrl}${back_image.replace('/media/', '/')}`);
      setFrontImage(`${DjangoConfig.apiUrl}${front_image.replace('/media/', '/')}`);
      setCoordinates(today_defect_list);
      setObList(ob_list)
      setDefectList(defect_list)
      console.log("data ", response.data)


      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  // console.log("front Image ",frontImage,"backImage",backImage)


  const getTop3 = (list, key) => {
    return list.sort((a, b) => b[key] - a[key]).slice(0, 3);
  };
  const getTop5 = (list, key) => {
    return list.sort((a, b) => b[key] - a[key]).slice(0, 5);
  };

  // Get top 3 defects and operations
  const topDefects = getTop3(defectList, 'defect_count');
  const topOperations = getTop5(obList, 'ob_count');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const drawRedSpot = (ctx, x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    };

    const drawImagesWithRedSpots = (frontCtx, backCtx, frontImageUrl, backImageUrl, coordinates) => {
      if (frontImageUrl && frontCtx) {
        const frontImage = new Image();
        frontImage.onload = () => {
          frontCtx.drawImage(frontImage, 0, 0, frontCanvasRef.current.width, frontCanvasRef.current.height);
          coordinates.forEach(coord => {
            if (coord.sf_x && coord.sf_y) {
              drawRedSpot(frontCtx, parseFloat(coord.sf_x), parseFloat(coord.sf_y));
            }
          });
        };
        frontImage.src = frontImageUrl;
      }

      if (backImageUrl && backCtx) {
        const backImage = new Image();
        backImage.onload = () => {
          backCtx.drawImage(backImage, 0, 0, backCanvasRef.current.width, backCanvasRef.current.height);
          coordinates.forEach(coord => {
            if (coord.sb_x && coord.sb_y) {
              drawRedSpot(backCtx, parseFloat(coord.sb_x), parseFloat(coord.sb_y));
            }
          });
        };
        backImage.src = backImageUrl;
      }
    };

    const frontCanvas = frontCanvasRef.current;
    const frontCtx = frontCanvas ? frontCanvas.getContext('2d') : null;

    const backCanvas = backCanvasRef.current;
    const backCtx = backCanvas ? backCanvas.getContext('2d') : null;

    if (frontCtx && backCtx) {
      drawImagesWithRedSpots(frontCtx, backCtx, frontImage, backImage, coordinates);
    }
  }, [frontImage, backImage, coordinates]);

  return (
    <section id="dashboard" className="bg-black h-screen" ref={dashboardRef}>
      <header>
        <nav className="bg-[#070F2B] border-2 border-slate-500 w-full h-20 flex items-center justify-between">
          <div className="flex items-center justify-center border-r border-black w-1/5 h-full">
            <a href="#" className="flex items-center justify-center">
              <img src={logo} alt="logo" className="mr-2" />
              <span className="text-goldenrod text-2xl text-white font-semibold">IntelliSYNC</span>
            </a>
          </div>
          <div className="flex-grow flex items-center justify-center border-r border-black w-3/5 h-full">
            <span className="text-goldenrod font-bold text-white text-3xl">Sewing Dashboard (UNDER TESTING)</span>
          </div>
          <div className="flex items-center justify-center w-1/5 h-full">
            <div id="time" className="text-goldenrod mt-6 text-white text-2xl font-bold ml-10">{time}</div>
          </div>
        </nav>

        <div className="bg-black border border-gray-500 w-full h-7vh flex justify-between pt-2 pb-2 items-center mt-1">
          <div className="w-1/5 h-full flex items-center justify-center border-r border-black">
            <span className="text-white text-2xl font-semibold">{planData.line}</span>
          </div>|
          <div className="w-1/5 h-full flex items-center justify-center border-r border-black">
            <span className="text-white text-2xl font-semibold">{planData.buyer}</span>
          </div>|
          <div className="w-1/5 h-full flex items-center justify-center border-r border-black">
            <span className="text-white text-2xl font-semibold"> {planData.style}</span>
          </div>|
          <div className="w-1/5 h-full flex items-center justify-center border-r border-black">
            <span className="text-white text-2xl font-semibold"> {planData.color}</span>
          </div>|
          <div className="w-1/5 h-full flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">{planData.hour_no}</span>
          </div>
        </div>
        <div className="flex h-full">
          <div className="border-2 border-slate-500 w-1/3 h-5/6 text-center  items-center ">
            <span className="text-chocolate text-xl  text-slate-200 font-semibold">Front Silhouettes</span>
            <canvas ref={frontCanvasRef} width={300} height={400} className="border ml-11 border-white mb-4 md:mb-0"></canvas>
          </div>
          <div className="border-2 border-slate-500 w-1/3 h-5/6 mx-3 text-center  items-center ">
            <span className="text-chocolate text-xl text-slate-200 h-80 font-semibold">Back Silhouettes</span>
            <canvas ref={backCanvasRef} width={300} height={400} className="border ml-11 border-white"></canvas>
          </div>

          {/* <div className="w-1/3 h-5/6 flex flex-col items-center justify-between">
            <div className="border-2 border-slate-500 w-full h-1/2  items-center justify-center">
              <span className="text-chocolate text-xl w-full text-slate-200 h-48 font-semibold">Top 3 Defects</span>
              <ul>
                {topDefects.map((defect, index) => (
                  <li key={index} className='text-white'>{index + 1}: {defect.defect_name}  /  Count:- {defect.defect_count}</li>
                ))}
              </ul>
            </div>
            <div className="border-2 border-slate-500 w-full h-1/2 mt-3  items-center justify-center">
              <span className="text-chocolate text-xl text-slate-200 h-48 font-semibold">Top 3 Operations</span>
              <ul>
                {topOperations.map((operation, index) => (
                  <li key={index} className='text-white'>{index + 1}: {operation.ob_name}  / Count:- {operation.ob_count}</li>
                ))}
              </ul>
            </div>
          </div> */}
          <div className="w-1/3 h-full flex flex-col mt-2 items-center justify-between">
            <div className="border-2 border-slate-500 min-h-40 w-full h-1/2 items-center justify-center">
              <span className="text-chocolate text-4xl text-slate-200 font-semibold mb-2">Top 3 Defects</span><hr className='mt-2' />
              <ul className="text-white text-2xl">
                {topDefects.map((defect, index) => (
                  <li key={index} className='mt-1'>
                    {index + 1}: {defect.defect_name} : {defect.defect_count}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-2 border-slate-500 w-full max-h-1/2 min-h-40 mt-3 items-center justify-center">
              <span className="text-chocolate text-4xl text-slate-200 font-semibold mb-2">Critical to Quality</span><hr className='mt-2' />
              <ul className="text-white text-2xl">
                {topOperations.map((operation, index) => (
                  <li key={index} className='mt-1'>
                    {index + 1}: {operation.ob_name} : {operation.ob_count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>
      <button
        className="absolute top-[100px] left-1 transform -translate-y-1/2 bg-transparent text-white px-4 py-2 text-xl  focus:outline-none hover:bg-gray-700"
        onClick={toggleFullScreen}
      >
        [&nbsp;&nbsp;]
      </button>
    </section>
  );
};

export default TVDashboard2;
