import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { addRejectOperation } from "../../../utils/slice/RejectMasterSlice";
import DjangoConfig from "../../../config/Config";

const RejectDefectMaster = () => {
  const defectSize = useSelector(state => state.rejectMaster.size);
  const operations = useSelector(state => state.rejectMaster.operations);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [defectMasterData, setDefectMasterData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [operation ,setOperation] = useState({})

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDefectOperations();
    loadStoredData()

  }, []);
   

  // console.log("operations data redux toolkit",operations)


  useEffect(() => {
    localStorage.setItem('defectMasterData', JSON.stringify(defectMasterData));
  }, [defectMasterData]);



  const loadStoredData = () => {
    // const storedData = JSON.parse(localStorage.getItem('data')) || [];
    const operationData = JSON.parse(localStorage.getItem('userData') || [])
    setOperation(operationData)
    // setStoredData(storedData);
    // console.log(storedData)
  };

  const fetchDefectOperations = () => {
    axios.get(`${DjangoConfig.apiUrl}/masters/defect_master/`)
      .then(response => {
        const formattedOptions = response.data.dp_data.map(item => ({
          id: item.id, 
          name: item.name,
          hindi_name : item.hindi_name
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
      navigate("/qms-tab/reject-operation-master");
    };
    
    const handleSaveAndNext = () => {
      const operationToAdd = {
        id: operation.id,
        name: operation.name,
        defects: selectedOptions,
        frontCoordinates:[],
        backCoordinates:[],
      };
      dispatch(addRejectOperation(operationToAdd));
      navigate("/qms-tab/reject-mark-location");
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
                className={`border border-gray-300 px-3 py-2 rounded-md cursor-pointer ${
                  selectedOperation && selectedOperation.id === operation.id ? "bg-blue-200" : "bg-white"
                }`}
              >
                {operation.name}
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
                className={`border border-gray-300 px-3 py-2 rounded-md cursor-pointer ${
                  selectedOptions.some((opt) => opt.id === option.id) || matchedOptions.some((opt) => opt.id === option.id)
                    ? "bg-blue-200"
                    : "bg-white"
                }`}
              >
                {option.name}<br/>
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

export default RejectDefectMaster;

