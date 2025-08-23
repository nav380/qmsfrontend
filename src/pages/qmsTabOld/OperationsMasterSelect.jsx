import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOperation, resetOperations } from "../../utils/slice/DefectMasterSlice";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import DjangoConfig from '../../config/Config';

const OperationsMasterSelect = () => {
  const defectSize = useSelector(state => state.defectMaster.size);
  const operationsData = useSelector(state => state.defectMaster.operations) || [];
  const sewingPlanData = useSelector(state => state.sewingInput.rowData);

  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = () => {
    const userData = {
      buyer: sewingPlanData.buyer,
      styleno: sewingPlanData.styleno,
      color: sewingPlanData.color
    };
    const queryParams = new URLSearchParams(userData).toString();
    axios.get(`${DjangoConfig.apiUrl}/rtqm/ob_details_view/?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      console.log(response.data.ob_data)
      const formattedOptions = response.data.ob_data.map(item => ({
        id: item.id,
        name: item.operation
      }));
      setOptions(formattedOptions);
    })
      .catch(error => {
        console.error('Error fetching operations:', error);
      });
  };





  const handleViewAll = () => {
    setSelectedOptions(options.map(option => option.id));
  };

  const handleClearAll = () => {
    setSelectedOptions([]);
    dispatch(resetOperations())
  };

  const handleCancel = () => {
    setSelectedOptions([]);
  };



  const handleSave = (id, name) => {
    console.log(id, name)
    if (id && name) {
      const userData = { id, name };
      const userDataJSON = JSON.stringify(userData);
      localStorage.setItem('userData', userDataJSON);
      navigate("/qms-tab/defect-master-select");
    } else {
      console.log("No data provided");
    }
  };

  return (
    <div className="mt-4">
      <div className="container mx-auto w-full rounded">
        <div className="flex items-center justify-between px-4 py-3 bg-white text-black">
          <h1 className="text-l font-bold">DEFECTIVE - Select Operations</h1>
          <div className="flex items-center space-x-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              onClick={handleViewAll}
            >
              View All
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 bg-white gap-4 px-1 py-2">
          <div className="bg-white rounded p-4">
            <p className="font-bold text-gray-500 dark:text-gray-400 mb-2">
              Buyer
            </p>
            <p>{sewingPlanData.buyer_name}</p>
          </div>
          <div className="bg-white rounded p-4">
            <p className="font-bold text-gray-500 dark:text-gray-400 mb-2">
              Style
            </p>
            <p>{sewingPlanData.styleno}</p>
          </div>

          <div className="bg-white rounded p-4">
            <p className="font-bold text-gray-500 dark:text-gray-400 mb-2">
              Color
            </p>
            <p>{sewingPlanData.color}</p>
          </div>
          <div className="bg-white rounded p-4">
            <p className="font-bold text-gray-500 dark:text-gray-400 mb-2">
              Quantity
            </p>
            <p>{sewingPlanData.quantity}</p>
          </div>
          <div className="bg-white rounded p-4">
            <p className="font-bold text-gray-500 dark:text-gray-400 mb-2">
              Size
            </p>
            <p>{defectSize}</p>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-200 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((option, index) => {
              const isDisabled = operationsData.some(op => op.id === option.id);
              // const isDisabled = false
              const isSelected = selectedOptions.includes(option.id);

              const handleClick = () => {
                if (isDisabled) {
                  alert('Option is already performed!');
                } else if (isSelected) {
                  alert('Option is already selected!');
                } else {
                  handleSave(option.id, option.name);
                }
              };

              return (
                <div
                  key={index}
                  className={`border border-gray-300 px-3 py-2 rounded-md cursor-pointer ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-white"
                    }`}
                  onClick={isDisabled ? null : handleClick} // Disable click if option is disabled
                >

                  {option.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
            onClick={handleClearAll}
          >
            Clear All
          </button>
          <div className="flex space-x-4">

            <button
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-md hover:bg-gray-400"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
              onClick={() => handleSave()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsMasterSelect;
