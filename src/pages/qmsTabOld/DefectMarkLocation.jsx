import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { addBackCoordinates, addFrontCoordinates, resetOperations } from '../../utils/slice/DefectMasterSlice';
import { toast } from 'react-toastify';
import DjangoConfig from '../../config/Config';
import axios from 'axios';

const DefectMarkLocation = () => {
    const frontCanvasRef = useRef(null);
    const backCanvasRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const operations = useSelector(state => state.defectMaster.operations);
    const size = useSelector(state => state.defectMaster.size);
    const [operation, setOperation] = useState({});
    const sewingPlanData = useSelector(state => state.sewingInput.rowData);
    const [frontImageUrl, setFrontImageUrl] = useState();
    const [backImageUrl, setBackImageUrl] = useState();
    const [defectOptions, setDefectOptions] = useState();
    const [selectedOptionId, setSelectedOptionId] = useState();
    const [clickedCoordinates, setClickedCoordinates] = useState([]);
    const userData = useSelector(state => state.User.userData);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true); // State to manage Save button disable


    const handleItemClick = (id, name) => {
        setSelectedOptionId(id);
        setDefectOptions(prevOptions => prevOptions.map(option => option.id === id ? { ...option, disabled: true } : option));

    };

    useEffect(() => {
        if (!defectOptions) {
            const operationDefects = operations.find(op => op.id === operation.id);
            if (operationDefects) {
                setDefectOptions(operationDefects.defects);
            }
        }
    }, [defectOptions, operations, operation.id]);

    useEffect(() => {
        if (!sewingPlanData) {
            navigate('/end-line-login');
        } else {
            const fetchSilhouettesData = async () => {
                const userData = {
                    buyer: sewingPlanData.buyer,
                    styleno: sewingPlanData.styleno,
                };
                // console.log("buyer data",sewingPlanData)
                const queryParams = new URLSearchParams(userData).toString();
                try {
                    const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/style_silhouettes/?${queryParams}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    // console.log(response.data)

                    setFrontImageUrl(`${DjangoConfig.apiUrl}${response.data[0].front_image}`);
                    setBackImageUrl(`${DjangoConfig.apiUrl}${response.data[0].back_image}`);
                } catch (error) {
                    console.error('Error fetching silhouettes data:', error);
                }
            };
            fetchSilhouettesData();
        }
    }, [sewingPlanData, navigate]);

    const loadStoredData = () => {
        const operationData = JSON.parse(localStorage.getItem('userData')) || {};
        setOperation(operationData);
    };

    useEffect(() => {
        loadStoredData();

        const drawRedSpot = (ctx, x, y) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        };

        const drawRedSpots = (ctx, coordinates) => {
            coordinates.forEach(coord => {
                ctx.beginPath();
                ctx.arc(coord.x, coord.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
            });
        };

        const frontCanvas = frontCanvasRef.current;
        const frontCtx = frontCanvas.getContext('2d');

        const backCanvas = backCanvasRef.current;
        const backCtx = backCanvas.getContext('2d');

        const drawFrontImage = () => {
            if (frontImageUrl) {
                const frontImage = new Image();
                frontImage.onload = () => {
                    frontCtx.drawImage(frontImage, 0, 0, frontCanvas.width, frontCanvas.height);
                    drawRedSpots(frontCtx, clickedCoordinates.filter(coord => coord.canvas === 'front'));
                };
                frontImage.src = frontImageUrl;
            }
        };

        const drawBackImage = () => {
            if (backImageUrl) {
                const backImage = new Image();
                backImage.onload = () => {
                    backCtx.drawImage(backImage, 0, 0, backCanvas.width, backCanvas.height);
                    drawRedSpots(backCtx, clickedCoordinates.filter(coord => coord.canvas === 'back'));
                };
                backImage.src = backImageUrl;
            }
        };

        drawFrontImage();
        drawBackImage();

        const handleFrontClick = (event) => {
            if (selectedOptionId) {
                const rect = frontCanvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const dfId = selectedOptionId
                dispatch(addFrontCoordinates({ id: operation.id, x, y, canvas: 'back', dfId }));

                drawRedSpot(frontCtx, x, y);
                const newCoordinates = [...clickedCoordinates, { x, y, canvas: 'front', dfId }];
                setClickedCoordinates(newCoordinates);
                setSelectedOptionId(null);
                setIsSaveDisabled(false); // Enable Save button after adding coordinates

            } else {
                toast.error("Please select a defect first.");
            }
        };

        const handleBackClick = (event) => {
            if (selectedOptionId) {
                const rect = backCanvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const dfId = selectedOptionId
                dispatch(addBackCoordinates({ id: operation.id, x, y, canvas: 'back', dfId }));

                drawRedSpot(backCtx, x, y);
                const newCoordinates = [...clickedCoordinates, { x, y, canvas: 'back', dfId }];
                setClickedCoordinates(newCoordinates);
                setSelectedOptionId(null); 
                setIsSaveDisabled(false); // Enable Save button after adding coordinates

            } else {
                toast.error("Please select a defect first.");
            }
        };

        frontCanvas.addEventListener('click', handleFrontClick);
        backCanvas.addEventListener('click', handleBackClick);

        return () => {
            frontCanvas.removeEventListener('click', handleFrontClick);
            backCanvas.removeEventListener('click', handleBackClick);
        };
    }, [clickedCoordinates, frontImageUrl, backImageUrl, selectedOptionId]);

    const saveCoordinates = () => {
        localStorage.setItem('clickedCoordinates', JSON.stringify(clickedCoordinates));
        const frontCoordinates = clickedCoordinates.filter(coord => coord.canvas === 'front');
        const backCoordinates = clickedCoordinates.filter(coord => coord.canvas === 'back');
        if (operation.id) {
            if (frontCoordinates.length > 0) {
                dispatch(addFrontCoordinates({ id: operation.id, frontCoordinates }));
                toast.success("Saved Coordinates");

            }
            if (backCoordinates.length > 0) {
                dispatch(addBackCoordinates({ id: operation.id, backCoordinates }));
            }
        } else {
            alert("Operation ID not found. Please select an operation first.");
        }
        setClickedCoordinates([]);
        setIsSaveDisabled(false); // Disable Save button after saving coordinates

    };

    const saveAddMore = () => {
        navigate("/qms-tab/operation-master-select");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            size: size,
            defect_operation: [operations],
            rtqm_mt_data: sewingPlanData,
            status: "DEFECT",
            quantity: 1,
        }

        try {
            const response = await fetch(`${DjangoConfig.apiUrl}/rtqm/rtqm_dt_mt_view/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                toast.success('DefectOperationData created successfully!');
                let defectq = localStorage.getItem('totalDefectQuantity');
                let totalDefectQuantity = defectq ? JSON.parse(defectq) : 0;
                totalDefectQuantity++;
                localStorage.setItem('totalDefectQuantity', JSON.stringify(totalDefectQuantity));
                navigate('/qms-tab/qc-section');
                handleResetOperations();


            } else {
                toast.error('Failed to create DefectOperationData.');


            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to create DefectOperationData.');
        }
    };

    const handleResetOperations = () => {
        dispatch(resetOperations());
    };

    const clearCoordinates = () => {
        localStorage.removeItem('clickedCoordinates');
        setClickedCoordinates([]);
        const frontCanvas = frontCanvasRef.current;
        const backCanvas = backCanvasRef.current;
        const frontCtx = frontCanvas.getContext('2d');
        const backCtx = backCanvas.getContext('2d');
        frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
        backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
    };

    return (
        <div className="flex flex-wrap">
            {/* //       {/* Left Panel for Operations */}
            <div className="h-screen w-full sm:w-auto md:w-1/3 lg:w-1/4 xl:w-1/4">
                <div className="h-auto px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        {defectOptions && defectOptions.map((option, index) => (
                            <li
                                key={option.id}
                                onClick={() => handleItemClick(option.id, option.name)}
                                className={`border border-gray-300 px-3 py-2 rounded-md cursor-pointer ${option.disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-blue-100'}`}
                                style={{ backgroundColor: option.id === selectedOptionId ? 'lightblue' : 'white' }}
                            >
                                {option.name}
                            </li>
                        ))}

                    </ul>
                </div>
            </div>

            {/* Right Panel for Options */}
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl font-bold mb-8">{operation.name}</h1>
                <div className="flex flex-col md:flex-row md:space-x-4 w-full justify-center max-w-screen-lg">
                    <canvas ref={frontCanvasRef} width={300} height={400} className="border border-gray-400 mb-4 md:mb-0"></canvas>
                    <canvas ref={backCanvasRef} width={300} height={400} className="border border-gray-400"></canvas>
                </div>
                <div className="mt-4 space-y-4 md:space-y-0 md:space-x-4">

                    <button onClick={clearCoordinates} className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
                        Reset
                    </button>
                    <button onClick={saveCoordinates} className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
                        Save Coordinates
                    </button>
                    <button onClick={saveAddMore} className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
                        Add More Operation
                    </button>
                    <button onClick={handleSubmit} disabled={isSaveDisabled} className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
                        Done
                    </button>
                </div>
            </div>
        </div>

    )
}


export default DefectMarkLocation;