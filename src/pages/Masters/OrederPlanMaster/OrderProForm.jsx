import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DjangoConfig from '../../../config/Config';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function OrderProForm() {
    const [formData, setFormData] = useState({
        qms_track: false,
        size_wise_tracking: false,
        sequence: '',
        tracking: 100,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [proData, setProData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null);
    const [selectedSec, setSelectedSec] = useState(null);
    const [buyerList, setBuyerList] = useState([]);
    const [refData, setRefData] = useState([]);
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedRef, setSelectedRef] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [colorData, setColorData] = useState([])
    const [selectedColor, setSelectedColor] = useState(null)
    const [tableData, setTableData] = useState([])


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            formData: formData,
            process: selectedPro.value,
            section: selectedSec.value,
            buyer: selectedBuyer.value,
            buyer_name: selectedBuyer.label,
            ourref: selectedRef.value,
            styleno: selectedStyle.value,
            ...(selectedColor && { color: selectedColor.value }) 
        };
        console.log(data)


        axios.post(`${DjangoConfig.apiUrl}/rtqm/order_process_view/`, data,{withCredentials:true})
            .then(response => {
                console.log('Data saved:', response.data);
                toast.success(`${response.data.message}`)
                fetchProcessesPlan(selectedBuyer.value, selectedRef.value, selectedStyle.value,selectedColor ? selectedColor.value : null)
                setSelectedSec(null)
            })
            .catch(error => {
                console.error('Error saving data:', error.message);
                toast.success("Error ")
            });
    };

    // let buyer = selectedBuyer.value || "no"
    // let buyer_name = selectedBuyer.label || "no"
    // let ourref = selectedRef.value || "no"
    // let style = selectedStyle.value || "no"
    // let color = selectedColor.value || "no"

    const fetchProcessesData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view/?`);
            setProData(response.data.pro_data.map(item => ({ value: item.id, label: item.name })));
            console.log("Process data", response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred');
            setMessage('');
        }
    };

    const fetchInitialData = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
            setIsLoading(false)
            setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    useEffect(() => {


        fetchInitialData();
    }, []);

    const handleBuyerChange = (selectedValue) => {
        setSelectedBuyer(selectedValue);
        setSelectedRef(null)
        fatchDataSelect(selectedValue);
    };

    const handleRefChange = (selectedValue) => {
        setSelectedRef(selectedValue);
        fatchByRefDataSelect(selectedValue)

    };


    const fatchDataSelect = (selectedValue) => {
        // setIsLoading(true);

        console.log("selected Value", selectedValue);
        setRefData([])
        const userData = {
            buyer_filter: selectedValue.value,
            ref_filter: selectedRef?.value || "",
            style_filter: selectedStyle?.value || ""
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const responseData = response.data.data;
                const uniqueRefs = [...new Set(responseData.map(item => item.ourref))];
                const refOptions = uniqueRefs.map(ref => ({ value: ref, label: ref }));
                setRefData(refOptions);
                // setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer, label: item.party_name })));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const fatchByRefDataSelect = (selectedValue) => {
        setStyleNoData([])
        const userData = {
            buyer_filter: selectedBuyer.value,
            ref_filter: selectedValue.value || "",
            style_filter: selectedStyle?.value || ""
        }
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const responseData = response.data.data
            const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
            const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
            setStyleNoData(styleOptions);
            setColorData(response.data.data.map(item => ({ value: item.color, label: item.color })))

            setIsLoading(false);


        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    }

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
            setError(err.response?.data?.error || 'An unexpected error occurred');
            setMessage('');
        }
    };

    useEffect(() => {
        fetchProcessesData();
    }, []);



    const fetchProcessesPlan = async (buyer, ourref, style,color) => {
        try {
            const params = new URLSearchParams({
                buyer: buyer || '',
                style: style || '',
                color: color || '',
                ourref: ourref || '',
                fun_call: 'op_data'
            });
            console.log(buyer, style, ourref)

            let response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/order_process_view/`, { params });
            console.log(response.data);

            if (Array.isArray(response.data.op_data)) {
                setTableData(response.data.op_data);
            } else {
                console.error('Expected an array but got:', response.data.op_data);
                setTableData([]);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const navigate = useNavigate()

    const backToTablePlan = () => {
        navigate('/dashboard/master/o-p-master/')
    }

    return (
        <>
         <div className="w-full h-16 flex items-center justify-between bg-white p-4  shadow-md">
                <h1 className="text-xl font-semibold text-gray-800"> Order Process PLan</h1>
                <Button
                    onClick={backToTablePlan}
                    variant="contained"
                    color="primary"
                    className="ml-4"
                >
                    Back To Plan Table
                </Button>
            </div><hr className='h-1'/>
            <form onSubmit={handleSubmit} className="space-y-6 p-2 max-w-5xl mx-auto bg-white  shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                    <div>
                        <label htmlFor="buyerList" className="block text-sm font-medium text-gray-700 mb-2"> Buyer :</label>
                        <Select
                            options={buyerList}
                            value={selectedBuyer}
                            onChange={handleBuyerChange}
                            placeholder="Select Buyer"
                            className="w-full border-2 z-50 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!buyerList.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="refdata" className="block text-sm font-medium text-gray-700 mb-2">Our Ref :</label>
                        <Select
                            options={refData}
                            value={selectedRef}
                            onChange={handleRefChange}
                            placeholder="Select Ref"
                            className="w-full border-2 z-40 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!refData.length}
                            isClearable
                            loadingMessage={() => <Skeleton count={5} />}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    fontSize: '12px',
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="styleNoData" className="block text-sm font-medium text-gray-700 mb-2">Style No :</label>
                        <Select
                            options={styleNoData}
                            value={selectedStyle}
                            onChange={setSelectedStyle}
                            placeholder="Select Style"
                            className="w-full border-2 z-30 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!styleNoData.length}
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
                    </div>
                    <div>
                        <label htmlFor="colorData" className="block text-sm font-medium text-gray-700 mb-2">Color :</label>
                        <Select
                            options={colorData}
                            value={selectedColor}
                            onChange={setSelectedColor}
                            placeholder="Select Color"
                            className="w-full border-2 z-20 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!colorData.length}
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
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="proData" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Processes :
                        </label>
                        <Select
                            options={proData}
                            value={selectedPro}
                            onChange={handleProcessSelect}
                            placeholder="Select Processes"
                            className="w-full border-2 z-20 border-gray-400 rounded-md"
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
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="sectionData" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Section :
                        </label>
                        <Select
                            options={sectionData}
                            value={selectedSec}
                            onChange={setSelectedSec}
                            placeholder="Select Section"
                            className="w-full border-2 z-20 border-gray-400 rounded-md"
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
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">


                    <label className="block text-sm font-medium text-gray-700">
                        Sequence :
                        <input
                            type="number"
                            name="sequence"
                            value={formData.sequence}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            required
                        />
                    </label>

                    <label className="block text-sm font-medium text-gray-700">
                        Tracking :
                        <input
                            type="number"
                            step="0.01"
                            name="tracking"
                            value={formData.tracking}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            // required
                        />
                    </label>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">

                        <span>QMS Track : </span>
                        <input
                            type="checkbox"
                            name="qms_track"
                            checked={formData.qms_track}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                    </label>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <span>Size Wise Tracking : </span>
                        <input
                            type="checkbox"
                            name="size_wise_tracking"
                            checked={formData.size_wise_tracking}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white h-10 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit
                    </button>
                </div>
            </form><hr className='h-3'/>

            <div className='bg-white space-y-2'>
                <table className='table   table-sm w-full *:!text-black *:!text-center [&>*_th]:border [&>*_th]:border-black [&>*_th]:text-xl [&>*_td]:border [&>*_td]:border-black'>
                    <thead>
                        <tr>
                            <th>Process</th>
                            <th>Section</th>
                            <th>QMS Track</th>
                            <th>Size Wise Tracking</th>
                            <th>Section Seq.</th>
                            <th>Track %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, rowIndex) => (
                            row.section.map((sec, index) => (
                                <tr key={`${row.process}-${index}`}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={row.section.length}>{row.process}</td>
                                        </>
                                    )}
                                    <td>{sec.section}</td>
                                    <td>{sec.qmsTrack === true ? "Yes" : "No"}</td>
                                    <td>{sec.sizeWiseTracking  === true ? "Yes" : "No"}</td>
                                    <td>{sec.sectionSeq}</td>
                                    <td>{sec.trackPercentage}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>


        </>


    );
}

export default OrderProForm;
