import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { addOperation } from "../../../utils/slice/DefectMasterSlice";
import DjangoConfig from "../../../config/Config";

const RectifiedDefectSelect = () => {
    const defectSize = useSelector(state => state.defectMaster.size);
    const operations = useSelector(state => state.defectMaster.operations);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [defectMasterData, setDefectMasterData] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [storedData, setStoredData] = useState([]);
    const [operation, setOperation] = useState({})

    // console.log('userId',userId)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const operationId = operation.id;

    useEffect(() => {
        loadStoredData()
        fetchDefectOperations(operationId);
    }, [operationId]);

    // console.log("operations data redux toolkit",operations)


    useEffect(() => {
        localStorage.setItem('defectMasterData', JSON.stringify(defectMasterData));
    }, [defectMasterData]);

   

    const loadStoredData = () => {
        // const storedData = JSON.parse(localStorage.getItem('data')) || [];
        const operationData = JSON.parse(localStorage.getItem('obData') || [])
        setOperation(operationData)
        // setStoredData(storedData);
        // console.log(storedData)
        
    };
    console.log("operation Data", operation.id, operation.name)
    const fetchDefectOperations = (opId) => {
        axios.get(`${DjangoConfig.apiUrl}/masters/defect_master/`)
            .then(response => {
                const formattedOptions = response.data.dp_data.map(item => ({
                    id: item.id,
                    name: item.name,
                    hindi_name: item.hindi_name,
                    opId: opId
                }));
                setOptions(formattedOptions);
            })
            .catch(error => {
                console.error('Error fetching operations:', error);
            });
    };

    const handleItemClick = (id, name) => {
        setSelectedOperation({ id: id, name: name });
    };

    const toggleOption = (option) => {
        const isSelected = selectedOptions.some(op => op.id === option.id);

        if (isSelected) {
            setSelectedOptions(selectedOptions.filter(op => op.id !== option.id));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };


    const handleSaveAddMore = () => {
        navigate("/qms-tab/rectified-operation-master");
    };

    const handleSaveAndNext = () => {
        const operationToAdd = {
            id: operation.id,
            name: operation.name,
            defects: selectedOptions,
            frontCoordinates: [],
            backCoordinates: [],
        };
        dispatch(addOperation(operationToAdd));
        navigate("/qms-tab/rectified-mark-location");
    };



    const handleClearLocalStorage = () => {
        localStorage.removeItem('userData');
    };
    let matchedOptions = [];

    return (
        <div className="flex flex-wrap">
            {/* Left Panel for Operations */}
            <div className="h-screen w-full sm:w-auto md:w-1/3 lg:w-1/4 xl:w-1/4">
                <div className="h-auto px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">

                        <li
                            key={operation.id}
                            onClick={() => handleItemClick(operation.id, operation.name)}
                            className={`border border-gray-300 px-3 py-2 rounded-md cursor-pointer ${selectedOperation && selectedOperation.id === operation.id ? "bg-blue-200" : "bg-white"
                                }`}
                        >
                            {operation.name}<br />
                        </li>

                    </ul>
                </div>
            </div>

            {/* Right Panel for Options */}
            <div className="w-full sm:w-auto md:w-2/3 lg:w-3/4 xl:w-3/4 p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <div className="flex flex-wrap">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2"
                            onClick={() => toggleOption(option)}
                        >
                            <div
                                className={`border border-gray-300 px-3 py-2 rounded-md cursor-pointer ${selectedOptions.some((opt) => opt.id === option.id) || matchedOptions.some((opt) => opt.id === option.id)
                                        ? "bg-blue-200"
                                        : "bg-white"
                                    }`}
                            >
                                {option.name}<br />
                                {option.hindi_name}

                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-4">
                    {/* <button className="btn btn-success mr-2" onClick={handleSaveAddMore}>
            Add More
          </button> */}
                    <button className="btn btn-success mr-2" onClick={handleSaveAndNext}>
                        Next
                    </button>
                    <button className="btn btn-warning" onClick={handleClearLocalStorage}>
                        Clear
                    </button>
                </div>
            </div>
        </div>


    );
};

export default RectifiedDefectSelect;


