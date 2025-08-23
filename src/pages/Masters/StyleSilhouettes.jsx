// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import DjangoConfig from '../../config/Config';
// import Skeleton from 'react-loading-skeleton';
// import Select from 'react-select';
// import { toast } from 'react-toastify';

// const StyleSilhouettes = () => {
//     const navigate = useNavigate();
//     const [frontImageUrl, setFrontImageUrl] = useState('');
//     const [backImageUrl, setBackImageUrl] = useState('');
//     const [frontSketchImageUrl, setFrontSketchImageUrl] = useState('');
//     const [backSketchImageUrl, setBackSketchImageUrl] = useState('');
//     const [buyerList, setBuyerList] = useState([]);
//     const [styleNoData, setStyleNoData] = useState([]);
//     const [selectedBuyer, setSelectedBuyer] = useState(null);
//     const [selectedStyle, setSelectedStyle] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);





//     const handleFileChange = async (event, setImageUrl, setSketchImageUrl) => {
//         const file = event.target.files[0];
//         if (file) {
//             const formData = new FormData();
//             formData.append('image', file);

//             try {
//                 const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_defect_process/`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 });

//                 if (response.status === 200) {
//                     const imageUrl = URL.createObjectURL(file);
//                     setImageUrl(imageUrl);

//                     // const normalizedSketchImageUrl = response.data.sketch_image_url.replace(/\\/g, '/');
//                     const sketchImagePath = response.data.sketch_image_url;
//                     const sketchImageUrl = `${DjangoConfig.apiUrl}${sketchImagePath}`;
//                     setSketchImageUrl(sketchImagePath);
//                     console.log(sketchImageUrl)
//                 } else {
//                     console.error('Failed to process image:', response.statusText);
//                 }
//             } catch (error) {
//                 console.error('Error processing image:', error);
//             }
//         }
//     };

//     const handleFrontFileChange = (event) => {
//         handleFileChange(event, setFrontImageUrl, setFrontSketchImageUrl);
//     };

//     const handleBackFileChange = (event) => {
//         handleFileChange(event, setBackImageUrl, setBackSketchImageUrl);
//     };

//     const handleSave = async () => {
//         if (!selectedBuyer || !selectedStyle || !frontSketchImageUrl || !backSketchImageUrl) {
//             alert('Please fill all fields');
//             return;
//         }
//         const formData = new FormData();
//         // formData.append('front_image', frontSketchImageUrl.replace(/\\/g, '/')); 
//         // formData.append('back_image', backSketchImageUrl.replace(/\\/g, '/')); 
//         formData.append('front_image', frontSketchImageUrl);
//         formData.append('back_image', backSketchImageUrl);
//         formData.append('buyer', selectedBuyer.value);
//         formData.append('style_no', selectedStyle.value);

//         try {
//             const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/style_silhouettes/`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });

//             if (response.status === 201) {
//                 toast.success('Data Saved successful!');

//             } else {
//                 console.error('Failed to save data:', response.statusText);
//                 toast.error('Failed to save data');

//             }
//         } catch (error) {
//             console.error('Error saving data:', error);
//             alert('Error saving data');
//         }
//     };



//     const fetchInitialData = async () => {
//         try {
//             const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
//             setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));
//         } catch (error) {
//             console.error('Error fetching initial data:', error);
//         }
//     };

//     useEffect(() => {
//         fetchInitialData();
//     }, []);

//     const handleBuyerChange = (selectedValue) => {
//         setSelectedBuyer(selectedValue);
//         fatchByBuyer(selectedValue);
//     };

//     const fatchByBuyer = (selectedValue) => {
//         setStyleNoData([]);
//         const userData = {
//             buyer_filter: selectedValue.value,
//         };
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/excel_data_show_view/?${queryParams}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         }).then(response => {
//             const responseData = response.data.data;
//             const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
//             const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
//             setStyleNoData(styleOptions);
//             setIsLoading(false);
//         })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };

//     const getPageSilhouettesList = () => {
//         navigate('/dashboard/master/silhouettes-list')
//     }



//     return (
//         <div className="flex flex-col items-center w-full  justify-center h-screen bg-gray-100">
//             <div className='flex justify-between w-full'>
//                 <h1 className="text-3xl font-bold mb-8">Upload  Style Silhouettes</h1>
//                 <button className='btn btn-outline' onClick={getPageSilhouettesList}>Silhouettes History</button>

//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md w-full h-full ">
//                 <div className="mb-2 flex justify-around ">

//                     <div>
//                         <label htmlFor="buyerList"> Buyer</label>
//                         <Select
//                             options={buyerList}
//                             value={selectedBuyer}
//                             onChange={handleBuyerChange}
//                             name="buyer"
//                             placeholder="Select Buyer"
//                             className="w-full border-2 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!buyerList.length}
//                             loadingMessage={() => <Skeleton count={5} />}
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="styleNoData">Style No</label>
//                         <Select
//                             options={styleNoData}
//                             value={selectedStyle}
//                             onChange={setSelectedStyle}
//                             name="style_no"
//                             placeholder="Select Style"
//                             className="w-full border-2 border-gray-400 rounded-md"
//                             isSearchable
//                             isLoading={!styleNoData.length}
//                             loadingMessage={() => <Skeleton count={5} />}
//                             isClearable
//                             styles={{
//                                 control: (provided) => ({
//                                     ...provided,
//                                     height: '40px',
//                                     fontSize: '12px',
//                                 }),
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-2 font-bold text-gray-700">Upload Front Side Image:</label>
//                         <input type="file" onChange={handleFrontFileChange} />
//                     </div>
//                     <div>
//                         <label className="block mb-2 font-bold text-gray-700">Upload Back Side Image:</label>
//                         <input type="file" onChange={handleBackFileChange} />
//                     </div>
//                 </div>
//                 {/* <div className="mb-4 flex flex-wrap justify-around">
//                     <div>
//                         {frontImageUrl && (
//                             <img src={frontImageUrl} alt="Uploaded" className="mt-2 max-w-full h-auto rounded-lg" />
//                         )}
//                     </div>
//                     <div>
//                         {backImageUrl && (
//                             <img src={backImageUrl} alt="Uploaded" className="mt-2 max-w-full h-auto rounded-lg" />
//                         )}
//                     </div>
//                 </div> */}
//                 <div className="mb-4 flex flex-wrap justify-around">
//                     <div>
//                         {frontSketchImageUrl && (
//                             <img src={`${DjangoConfig.apiUrl}/frontSketchImageUrl`} alt="Sketch" className="mt-2 max-w-full h-auto rounded-lg" />
//                             // <input type="file" name='front_image' value={frontSketchImageUrl}  className="mt-2 max-w-full h-auto rounded-lg" />

//                         )}
//                     </div>
//                     <div>
//                         {backSketchImageUrl && (
//                             <img src={backSketchImageUrl} alt="Sketch" className="mt-2 max-w-full h-auto rounded-lg" />
//                             // <input type='file' name='back_image' value={frontSketchImageUrl}  className="mt-2 max-w-full h-auto rounded-lg" />

//                         )}
//                     </div>
//                 </div>

//                 <button
//                     onClick={handleSave}
//                     className="px-4 py-2 float-end bg-blue-500 center text-white rounded hover:bg-blue-600 focus:outline-none"
//                 >
//                     Save
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default StyleSilhouettes;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Select from 'react-select';
// import { toast } from 'react-toastify';
// import DjangoConfig from '../../config/Config';

// const StyleSilhouettes = () => {
//     const navigate = useNavigate();
//     const [frontImageUrl, setFrontImageUrl] = useState('');
//     const [backImageUrl, setBackImageUrl] = useState('');
//     const [frontSketchImageUrl, setFrontSketchImageUrl] = useState('');
//     const [backSketchImageUrl, setBackSketchImageUrl] = useState('');
//     const [buyerList, setBuyerList] = useState([]);
//     const [styleNoData, setStyleNoData] = useState([]);
//     const [selectedBuyer, setSelectedBuyer] = useState(null);
//     const [selectedStyle, setSelectedStyle] = useState(null);
//     const [frontContrast, setFrontContrast] = useState(1.0);
//     const [backContrast, setBackContrast] = useState(1.0);
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         fetchInitialData();
//     }, []);

//     const fetchInitialData = async () => {
//         try {
//             const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
//             setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));
//         } catch (error) {
//             console.error('Error fetching initial data:', error);
//         }
//     };

//     const handleBuyerChange = (selectedValue) => {
//         setSelectedBuyer(selectedValue);
//         fetchByBuyer(selectedValue);
//     };

//     const fetchByBuyer = (selectedValue) => {
//         setStyleNoData([]);
//         const userData = {
//             buyer_filter: selectedValue.value,
//         };
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/excel_data_show_view/?${queryParams}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         }).then(response => {
//             const responseData = response.data.data;
//             const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
//             const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
//             setStyleNoData(styleOptions);
//             setIsLoading(false);
//         }).catch(error => {
//             console.error('Error fetching filtered data:', error);
//         });
//     };

//     const handleFrontFileChange = async (event) => {
//         await handleFileChange(event, setFrontImageUrl, setFrontSketchImageUrl, setFrontContrast);
//     };

//     const handleBackFileChange = async (event) => {
//         await handleFileChange(event, setBackImageUrl, setBackSketchImageUrl, setBackContrast);
//     };

//     const handleFileChange = async (event, setImageUrl, setSketchImageUrl, setContrast) => {
//         const file = event.target.files[0];
//         if (file) {
//             const formData = new FormData();
//             formData.append('image', file);
//             formData.append('contrast', setContrast); // Include contrast parameter

//             try {
//                 const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_defect_process/`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 });

//                 if (response.status === 200) {
//                     const imageUrl = URL.createObjectURL(file);
//                     setImageUrl(imageUrl);

//                     const sketchImagePath = response.data.sketch_image_url;
//                     const sketchImageUrl = `${DjangoConfig.apiUrl}${sketchImagePath}`;
//                     setSketchImageUrl(sketchImageUrl);
//                 } else {
//                     console.error('Failed to process image:', response.statusText);
//                 }
//             } catch (error) {
//                 console.error('Error processing image:', error);
//             }
//         }
//     };

//     const handleSave = async () => {
//         if (!selectedBuyer || !selectedStyle || !frontSketchImageUrl || !backSketchImageUrl) {
//             alert('Please fill all fields');
//             return;
//         }
//         const formData = new FormData();
//         formData.append('front_image', frontSketchImageUrl);
//         formData.append('back_image', backSketchImageUrl);
//         formData.append('buyer', selectedBuyer.value);
//         formData.append('style_no', selectedStyle.value);
//         formData.append('front_contrast', frontContrast); // Include contrast values
//         formData.append('back_contrast', backContrast);

//         try {
//             const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/style_silhouettes/`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });

//             if (response.status === 201) {
//                 toast.success('Data Saved successful!');
//             } else {
//                 console.error('Failed to save data:', response.statusText);
//                 toast.error('Failed to save data');
//             }
//         } catch (error) {
//             console.error('Error saving data:', error);
//             toast.error('Error saving data');
//         }
//     };

//     const getPageSilhouettesList = () => {
//         navigate('/dashboard/master/silhouettes-list');
//     };

//     return (
//         <div className="flex flex-col items-center w-full justify-center h-screen bg-gray-100">
//             <div className='flex justify-between w-full'>
//                 <h1 className="text-3xl font-bold mb-8">Upload Style Silhouettes</h1>
//                 <button className='btn btn-outline' onClick={getPageSilhouettesList}>Silhouettes History</button>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md w-full h-full">
//                 <div className="mb-2 flex justify-around">
//                     <div>
//                         <label htmlFor="buyerList">Buyer</label>
//                         <Select
//                             options={buyerList}
//                             value={selectedBuyer}
//                             onChange={handleBuyerChange}
//                             name="buyer"
//                             placeholder="Select Buyer"
//                             className="w-full border-2 border-gray-400 rounded-md"
//                             isSearchable
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="styleNoData">Style No</label>
//                         <Select
//                             options={styleNoData}
//                             value={selectedStyle}
//                             onChange={setSelectedStyle}
//                             name="style_no"
//                             placeholder="Select Style"
//                             className="w-full border-2 border-gray-400 rounded-md"
//                             isSearchable
//                             isClearable
//                         />
//                     </div>

//                     <div>
//                         <label className="block mb-2 font-bold text-gray-700">Upload Front Side Image:</label>
//                         <input type="file" onChange={handleFrontFileChange} />
//                         {frontImageUrl && <img src={frontImageUrl} alt="Front Image" className="mt-2 max-h-48" />}
//                         {frontSketchImageUrl && <img src={frontSketchImageUrl} alt="Front Sketch Image" className="mt-2 max-h-48" />}
//                         <input
//                             type="range"
//                             min="0.1"
//                             max="2.0"
//                             step="0.1"
//                             value={frontContrast}
//                             onChange={(e) => setFrontContrast(parseFloat(e.target.value))}
//                             className="mt-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="block mb-2 font-bold text-gray-700">Upload Back Side Image:</label>
//                         <input type="file" onChange={handleBackFileChange} />
//                         {backImageUrl && <img src={backImageUrl} alt="Back Image" className="mt-2 max-h-48" />}
//                         {backSketchImageUrl && <img src={backSketchImageUrl} alt="Back Sketch Image" className="mt-2 max-h-48" />}
//                         <input
//                             type="range"
//                             min="0.1"
//                             max="2.0"
//                             step="0.1"
//                             value={backContrast}
//                             onChange={(e) => setBackContrast(parseFloat(e.target.value))}
//                             className="mt-2"
//                         />
//                     </div>
//                 </div>

//                 <button
//                     onClick={handleSave}
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
//                 >
//                     Save
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default StyleSilhouettes;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import DjangoConfig from '../../config/Config';

const StyleSilhouettes = () => {
    const navigate = useNavigate();
    const [frontImageUrl, setFrontImageUrl] = useState('');
    const [backImageUrl, setBackImageUrl] = useState('');
    const [frontSketchImageUrl, setFrontSketchImageUrl] = useState('');
    const [backSketchImageUrl, setBackSketchImageUrl] = useState('');
    const [buyerList, setBuyerList] = useState([]);
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [frontContrast, setFrontContrast] = useState(1.0);
    const [backContrast, setBackContrast] = useState(1.0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
            setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    const handleBuyerChange = (selectedValue) => {
        setSelectedBuyer(selectedValue);
        fetchByBuyer(selectedValue);
    };

    const fetchByBuyer = (selectedValue) => {
        setStyleNoData([]);
        const userData = {
            buyer_filter: selectedValue.value,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/excel_data_show_view/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const responseData = response.data.data;
            const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
            const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
            setStyleNoData(styleOptions);
            setIsLoading(false);
        }).catch(error => {
            console.error('Error fetching filtered data:', error);
        });
    };

    const handleFrontFileChange = async (event) => {
        await handleFileChange(event, setFrontImageUrl, setFrontSketchImageUrl, setFrontContrast);
    };

    const handleBackFileChange = async (event) => {
        await handleFileChange(event, setBackImageUrl, setBackSketchImageUrl, setBackContrast);
    };

    const handleFileChange = async (event, setImageUrl, setSketchImageUrl, setContrast) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('contrast', setContrast); // Include contrast parameter

            try {
                const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_defect_process/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    const imageUrl = URL.createObjectURL(file);
                    setImageUrl(imageUrl);

                    const sketchImagePath = response.data.sketch_image_url;
                    const sketchImageUrl = `${DjangoConfig.apiUrl}${sketchImagePath}`;
                    setSketchImageUrl(sketchImageUrl);
                } else {
                    console.error('Failed to process image:', response.statusText);
                }
            } catch (error) {
                console.error('Error processing image:', error);
            }
        }
    };

    const handleSave = async () => {
        if (!selectedBuyer || !selectedStyle || !frontSketchImageUrl || !backSketchImageUrl) {
            alert('Please fill all fields');
            return;
        }
        const formData = new FormData();
        // Extract relative paths
        
        const url1 = new URL(frontSketchImageUrl);
        const url2 = new URL(backSketchImageUrl);
        const frontPath =  url1.pathname;
        const backPath = url2.pathname
        console.log('front ',frontPath)

        formData.append('front_image', frontPath);
        formData.append('back_image', backPath);
        formData.append('buyer', selectedBuyer.value);
        formData.append('style_no', selectedStyle.value);
        formData.append('front_contrast', frontContrast); // Include contrast values
        formData.append('back_contrast', backContrast);
        console.log("frontSketchImageUrl",frontSketchImageUrl)
        try {
            const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/style_silhouettes/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                toast.success('Data Saved successful!');
            } else {
                console.error('Failed to save data:', response.statusText);
                toast.error('Failed to save data');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Error saving data');
        }
    };

    const getPageSilhouettesList = () => {
        navigate('/dashboard/master/silhouettes-list');
    };

    useEffect(() => {
        const fetchFrontSketchImage = async () => {
            if (frontImageUrl) {
                const formData = new FormData();
                formData.append('image_url', frontImageUrl);
                formData.append('contrast', frontContrast);

                try {
                    const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_defect_process/`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (response.status === 200) {
                        const sketchImagePath = response.data.sketch_image_url;
                        const sketchImageUrl = `${DjangoConfig.apiUrl}${sketchImagePath}`;
                        setFrontSketchImageUrl(sketchImageUrl);
                    } else {
                        console.error('Failed to update sketch image:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error updating sketch image:', error);
                }
            }
        };

        const fetchBackSketchImage = async () => {
            if (backImageUrl) {
                const formData = new FormData();
                formData.append('image_url', backImageUrl);
                formData.append('contrast', backContrast);

                try {
                    const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_defect_process/`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (response.status === 200) {
                        const sketchImagePath = response.data.sketch_image_url;
                        const sketchImageUrl = `${DjangoConfig.apiUrl}${sketchImagePath}`;
                        setBackSketchImageUrl(sketchImageUrl);
                    } else {
                        console.error('Failed to update sketch image:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error updating sketch image:', error);
                }
            }
        };

        fetchFrontSketchImage();
        fetchBackSketchImage();
    }, [frontContrast, backContrast]);

    return (
        <div className="w-full min-h-screen justify-center bg-gray-100">
            <div className="flex justify-between w-full px-6 py-4">
                <h1 className="text-3xl font-bold mb-8">Upload Style Silhouettes</h1>
                <button
                    onClick={getPageSilhouettesList}
                    className="btn btn-outline bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none"
                >
                    Silhouettes History
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md w-full">
                <div className="mb-4 flex justify-between">
                    <div className="w-1/5">
                        <label htmlFor="buyerList" className="block mb-1 text-sm font-bold text-gray-700">Buyer</label>
                        <Select
                            options={buyerList}
                            value={selectedBuyer}
                            onChange={handleBuyerChange}
                            name="buyer"
                            placeholder="Select Buyer"
                            className="w-full border-2 border-gray-400 rounded-md"
                            isSearchable
                        />
                    </div>

                    <div className="w-1/5">
                        <label htmlFor="styleNoData" className="block mb-1 text-sm font-bold text-gray-700">Style No</label>
                        <Select
                            options={styleNoData}
                            value={selectedStyle}
                            onChange={setSelectedStyle}
                            name="style_no"
                            placeholder="Select Style"
                            className="w-full border-2 border-gray-400 rounded-md"
                            isSearchable
                            isClearable
                        />
                    </div>

                    <div className="w-1/5">
                        <label htmlFor="frontImage" className="block mb-1 text-sm font-bold text-gray-700">Upload Front Image:</label>
                        <input type="file" onChange={handleFrontFileChange} className="mt-1" />
                        <input
                            type="range"
                            min="0.1"
                            max="2.0"
                            step="0.1"
                            value={frontContrast}
                            onChange={(e) => setFrontContrast(parseFloat(e.target.value))}
                            className="mt-2"
                        />
                    </div>

                    <div className="w-1/5">
                        <label htmlFor="backImage" className="block mb-1 text-sm font-bold text-gray-700">Upload Back Image:</label>
                        <input type="file" onChange={handleBackFileChange} className="mt-1" />
                        <input
                            type="range"
                            min="0.1"
                            max="2.0"
                            step="0.1"
                            value={backContrast}
                            onChange={(e) => setBackContrast(parseFloat(e.target.value))}
                            className="mt-2"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="block px-4 py-2  bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                    Save
                </button>
            </div>

            <div className="w-full flex flex-wrap mt-4">
                <div className="w-1/2 flex justify-around">
                    {frontImageUrl && <img src={frontImageUrl} alt="Front Image" className="mt-2 max-h-48" />}
                    {frontSketchImageUrl && <img src={frontSketchImageUrl} alt="Front Sketch Image" className="mt-2 max-h-48" />}
                </div>
                <div className="w-1/2 flex justify-around">
                    {backImageUrl && <img src={backImageUrl} alt="Back Image" className="mt-2 max-h-48" />}
                    {backSketchImageUrl && <img src={backSketchImageUrl} alt="Back Sketch Image" className="mt-2 max-h-48" />}
                </div>
            </div>
        </div>
    );
};

export default StyleSilhouettes;
