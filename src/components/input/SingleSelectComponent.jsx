
// import Select from 'react-select';

// import { Select} from "@material-tailwind/react";
import Select from 'react-select';
import { useState,useEffect } from "react";


const customStyles = {
  container: (provided) => ({
    ...provided,
    width: 'full',
    // height: '24px'
  }),
  control: (provided) => ({
    ...provided,
    height: '2.0rem',  // Adjust the height here
    minHeight: '2.0rem', 
    backgroundColor: '#00000',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: 'none',
    '&:hover': {
      border: '1px solid #aaa',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#007bff' : '#fff',
    color: state.isSelected ? '#fff' : '#333',
    '&:hover': {
      backgroundColor: '#007bff',
      color: '#fff',
    },
  }),
};




const SingleSelectComponent = ({ options = [], value, onChange, label, name, id, placeholder, disabled  }) => {
  const [internalValue, setInternalValue] = useState(null);

  const formattedOptions = (options || []).map(option => ({
    value: option.value,
    label: option.label,
    
}));

useEffect(() => {
  setInternalValue(formattedOptions.find(option => option.value === value) || null);
}, [options, value, formattedOptions]);


const handleChange = (selectedOption) => {
  setInternalValue(selectedOption);
  onChange(selectedOption ? selectedOption.value : '');
};

  return (
    <>
    <div className="w-[200px] p-4">
      {label && <label htmlFor={id} className="text-sm ml-[12px] ">{label}</label>}
      <Select
        id={id}
        name={name}
        value={internalValue}
        onChange={handleChange}
        options={formattedOptions}
        styles={customStyles}
        placeholder={placeholder}
        isDisabled={disabled} 
      />
      </div>

    </>
  );
};

export default SingleSelectComponent;
