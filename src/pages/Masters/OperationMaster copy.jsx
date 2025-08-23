// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import DjangoConfig from "../../config/Config";
// import Select from 'react-select';
// import Skeleton from "react-loading-skeleton";
// import { toast } from "react-toastify";

// const OB = () => {
//     const [data, setData] = useState([]);
//     const [sendData, setSendData] = useState([])
//     const [buyerList, setBuyerList] = useState([]);
//     const [refData, setRefData] = useState([]);
//     const [styleNoData, setStyleNoData] = useState([]);
//     const [selectedBuyer, setSelectedBuyer] = useState(null);
//     const [selectedRef, setSelectedRef] = useState(null);
//     const [selectedStyle, setSelectedStyle] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const header = data[0]

//     // console.log(sendData)

   
    
//   const saveData=()=>{
//     let url=`${DjangoConfig.apiUrl}/rtqm/excel_data_show_view/`
//     axios.post(url,{sendData, header}).then((res)=>{
//       alert(res.data)
//       toast.success("Data Saved")
//     }).catch((e)=>{
//       toast.error("Data Not Selected")
//     })
//   }

//     const sendRows = (e) => {

//         if (e.target.checked) {
//             const value = JSON.parse(e.target.value);

//             setSendData(values => ([...values, value]));




//         }

//         else {
//             let valueData = sendData.filter((key) => key[0] !== e.target.value[0])
//             setSendData(valueData)
//         }
//     }

//     // console.log("value =",value)

//     const handleFile = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();
//         reader.readAsBinaryString(file);

//         reader.onload = (e) => {
//             const binaryString = e.target.result;
//             const workbook = XLSX.read(binaryString, { type: "binary" });
//             const sheetName = workbook.SheetNames[0];
//             const sheet = workbook.Sheets[sheetName];
//             const parseData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//             setData(parseData);
//         };


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
//         setSelectedRef(null)
//         fatchDataSelect(selectedValue);
//     };

//     const handleRefChange = (selectedValue) => {
//         setSelectedRef(selectedValue);
//         fatchByRefDataSelect(selectedValue)

//     };


//     const fatchDataSelect = (selectedValue) => {
//         // setIsLoading(true);

//         console.log("selected Value", selectedValue);
//         setRefData([])
//         const userData = {
//             buyer_filter: selectedValue.value,
//             ref_filter: selectedRef?.value || "",
//             style_filter: selectedStyle?.value || ""
//         };
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => {
//                 const responseData = response.data.data;
//                 const uniqueRefs = [...new Set(responseData.map(item => item.ourref))];
//                 const refOptions = uniqueRefs.map(ref => ({ value: ref, label: ref }));
//                 setRefData(refOptions);
//                 // setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer, label: item.party_name })));
//                 setIsLoading(false);
//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };

//     const fatchByRefDataSelect = (selectedValue) => {
//         setStyleNoData([])
//         const userData = {
//             buyer_filter: selectedBuyer.value,
//             ref_filter: selectedValue.value || "",
//             style_filter: selectedStyle?.value || ""
//         }
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         }).then(response => {
//             const responseData = response.data.data
//             const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
//             const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
//             setStyleNoData(styleOptions);
           
//             setIsLoading(false);


//         })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     }



    


//     return (
//         <>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5  gap-4 mb-4">
//           <div>
//             <label htmlFor=".xls"> Upload Excel File</label>
//             <input type="file" accept=".xlsx, .xls" onChange={handleFile}  className="w-full h-11 border-2 border-gray-400 rounded-md" />
//           </div>

//           <div>
//               <label htmlFor="buyerList"> Buyer</label>
//               <Select
//                   options={buyerList}
//                   value={selectedBuyer}
//                   onChange={handleBuyerChange}
//                   name="buyer"
//                   placeholder="Select Buyer"
//                   className="w-full border-2  border-gray-400 rounded-md"
//                   isSearchable
//                   isLoading={!buyerList.length}
//                   loadingMessage={() => <Skeleton count={5} />}
//                   styles={{
//                       control: (provided) => ({
//                           ...provided,
//                           height: '40px',
//                           fontSize: '12px',
//                       }),
//                   }}
//               />
//           </div>

//           <div>
//               <label htmlFor="refdata"> Ref</label>
//               <Select
//                   options={refData}
//                   value={selectedRef}
//                   onChange={handleRefChange}
//                   placeholder="Select Ref"
//                   className="w-full border-2 z-40 border-gray-400 rounded-md"
//                   isSearchable
//                   isLoading={!refData.length}
//                   isClearable
//                   loadingMessage={() => <Skeleton count={5} />}
//                   styles={{
//                       control: (provided) => ({
//                           ...provided,
//                           height: '40px',
//                           fontSize: '12px',
//                       }),
//                   }}
//               />
//           </div>

//           <div>
//               <label htmlFor="styleNoData">Style No</label>
//               <Select
//                   options={styleNoData}
//                   value={selectedStyle}
//                   onChange={setSelectedStyle}
//                   name="style_no"
//                   placeholder="Select Style"
//                   className="w-full border-2  border-gray-400 rounded-md"
//                   isSearchable
//                   isLoading={!styleNoData.length}
//                   loadingMessage={() => <Skeleton count={5} />}
//                   isClearable
//                   styles={{
//                       control: (provided) => ({
//                           ...provided,
//                           height: '40px',
//                           fontSize: '12px',
//                       }),
//                   }}
//               />
//           </div>

//           <div>
//               <label htmlFor="styleNoData">OB Date</label>
//              <input type="date" name="ob_date" placeholder="Ob-Date"  className="w-full border-2 h-11  border-gray-400 rounded-md"/>
//           </div>

//           <div>
//               <label htmlFor="">Re-Cutting</label>
//               <input type="number" name="recutting" placeholder="Re-Cutting" className="w-full border-2 h-11 border-gray-400 rounded-md"/>
//           </div>

//           <div>
//               <label htmlFor="styleNoData">Kaz-Button</label>
//               <input type="number"  name="kaz_button" placeholder="Kaz-Button"  className="w-full border-2 h-11 border-gray-400 rounded-md"/>

//           </div>
//           <div>
//             <button type="submit" onClick={saveData} className="btn w-full mt-5 btn-primary">Save Data</button>
//           </div>
                  

//         </div>
//             <div>
//                 {data.length > 0 && (
//                     <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
//                         <thead className="bg-white divide-y divide-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300" >Checkbox</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300" >Edit</th>
//                                 {data[0].map((header, index) => (
//                                     <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {data.slice(1).map((row, rowIndex) => (
//                                 <tr key={rowIndex}>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
//                                         <input type="checkbox" value={JSON.stringify(row)} onChange={(e) => sendRows(e)} checked/>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
//                                         <button>Edit</button>
//                                     </td>
//                                     {data[0].map((header, cellIndex) => (
//                                         <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
//                                             {row[cellIndex]}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </>
//     );
// };

// export default OB;







import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import DjangoConfig from "../../config/Config";
import Select from 'react-select';
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

const OB = () => {
    const [data, setData] = useState([]);
    const [sendData, setSendData] = useState([]);
    const [buyerList, setBuyerList] = useState([]);
    const [refData, setRefData] = useState([]);
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedRef, setSelectedRef] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [obDate, setObDate] = useState("");
    const [reCutting, setReCutting] = useState(0);
    const [kazButton, setKazButton] = useState(0);

    const header = data[0];

    const saveData = () => {
        let url = `${DjangoConfig.apiUrl}/rtqm/excel_data_show_view/`;
        axios.post(url, { sendData, header, selectedBuyer, selectedStyle, obDate, reCutting, kazButton }).then((res) => {
            // alert(res.data);
            toast.success("Data Saved");
        }).catch((e) => {
            toast.error("Data Not Selected");
        });
    };

    const sendRows = (e) => {
        if (e.target.checked) {
            const value = JSON.parse(e.target.value);
            setSendData(values => ([...values, value]));
        } else {
            let valueData = sendData.filter((key) => key[0] !== e.target.value[0]);
            setSendData(valueData);
        }
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = (e) => {
            const binaryString = e.target.result;
            const workbook = XLSX.read(binaryString, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parseData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            setData(parseData);
        };
    };

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
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
        setSelectedRef(null);
        fatchDataSelect(selectedValue);
    };

    const handleRefChange = (selectedValue) => {
        setSelectedRef(selectedValue);
        fatchByRefDataSelect(selectedValue);
    };

    const fatchDataSelect = (selectedValue) => {
        setRefData([]);
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
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    const fatchByRefDataSelect = (selectedValue) => {
        setStyleNoData([]);
        const userData = {
            buyer_filter: selectedBuyer.value,
            ref_filter: selectedValue.value || "",
            style_filter: selectedStyle?.value || ""
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const responseData = response.data.data;
            const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
            const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
            setStyleNoData(styleOptions);
            setIsLoading(false);
        })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                    <label htmlFor=".xls"> Upload Excel File</label>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFile} className="w-full h-11 border-2 border-gray-400 rounded-md" />
                </div>

                <div>
                    <label htmlFor="buyerList"> Buyer</label>
                    <Select
                        options={buyerList}
                        value={selectedBuyer}
                        onChange={handleBuyerChange}
                        name="buyer"
                        placeholder="Select Buyer"
                        className="w-full border-2 border-gray-400 rounded-md"
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
                    <label htmlFor="refdata"> Ref</label>
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
                    <label htmlFor="styleNoData">Style No</label>
                    <Select
                        options={styleNoData}
                        value={selectedStyle}
                        onChange={setSelectedStyle}
                        name="style_no"
                        placeholder="Select Style"
                        className="w-full border-2 border-gray-400 rounded-md"
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
                    <label htmlFor="ob_date">OB Date</label>
                    <input type="date" name="ob_date" value={obDate} onChange={(e) => setObDate(e.target.value)} className="w-full border-2 h-11 border-gray-400 rounded-md" />
                </div>

                <div>
                    <label htmlFor="recutting">Re-Cutting</label>
                    <input type="number" name="recutting" value={reCutting} onChange={(e) => setReCutting(e.target.value)} className="w-full border-2 h-11 border-gray-400 rounded-md" />
                </div>

                <div>
                    <label htmlFor="kaz_button">Kaz-Button</label>
                    <input type="number" name="kaz_button" value={kazButton} onChange={(e) => setKazButton(e.target.value)} className="w-full border-2 h-11 border-gray-400 rounded-md" />
                </div>

                <div>
                    <button type="submit" onClick={saveData} className="btn w-full mt-5 btn-primary">Save Data</button>
                </div>
            </div>
            <div>
                {data.length > 0 && (
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                        <thead className="bg-white divide-y divide-gray-200">
                            <tr>
                                <th className="px-6 py-2 text-xs text-gray-500 text-left uppercase">Add</th>
                                {header.map((value, index) => (
                                    <th key={index} className="px-6 py-2 text-xs text-gray-500 text-left uppercase">{value}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox" value={JSON.stringify(row)} onChange={sendRows} className="mr-2" />
                                    </td>
                                    {row.map((value, cellIndex) => (
                                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default OB;
