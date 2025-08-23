import { useEffect, useRef, useState } from "react";
import axios from "axios";
import DjangoConfig from "../../config/Config";
import Select from 'react-select';
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const CuttingEntryForm = () => {
    const navigate = useNavigate()
    // const currentDatetime1 = new Date().toLocaleString();
    // console.log("currentDatetime", currentDatetime1)

    //     const getCookie = (name) => {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; ${name}=`);
    //     if (parts.length === 2) return parts.pop().split(';').shift();
    // }

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    const currentDatetime = formatDateForInput(new Date())
    console.log("currentTimeObject", currentDatetime)

    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [buyerList, setBuyerList] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState('');
    const [styleNoData, setStyleNoData] = useState([]);
    const [selectedOrderno, setSelectedOrderno] = useState('');
    const [orderData, setOrderData] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [colorData, setColorData] = useState([]);
    const [fabricDetail, setFabricDetail] = useState('');
    const [fabricData, setFabricData] = useState([]);
    const [selectedcuttingmaster, setSelectedCuttingMaster] = useState('');
    const [cuttingmasData, setCuttingMasData] = useState([]);
    const [orderQuantity, setOrderQuantity] = useState(0);
    const [order_ex_qty, setOrder_ex_qty] = useState(0);
    const [orderDate, setOrderDate] = useState('');
    const [layerNumber, setLayerNumber] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [fabricUsed, setFabricUsed] = useState('');
    const [grossAverage, setGrossAverage] = useState('');

    const [layerStartDateTime, setLayerStartDateTime] = useState(' ');
    const [layerEndDateTime, setLayerEndDateTime] = useState(' ');
    const [layerCutStart, setLayerCutStart] = useState(' ');
    const [layerCutEnd, setLayerCutEnd] = useState(' ');

    const [plies, setPlies] = useState("" || 0);
    const [totalCutPcs, setTotalCutPcs] = useState(0);
    const [selectedcuttingtype, setSelectedCuttingtype] = useState('');
    const [deliveryDate, setDeliveryDate] = useState([]);
    const [selectedDeliveryDates, setSelectedDeliveryDates] = useState([]);
    const formRef = useRef(null);
    //================ second form data ================================================
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [sizeData, setSizeData] = useState([]);
    const [selectedRatios, setSelectedRatios] = useState([]);
    const [sizeWiseBreakup, setSizeWiseBreakup] = useState([]);
    const [preqcutMtData, setPreqcutMtData] = useState([]);
    const [preqsizebreakup, setPreqSizeBreakup] = useState([]);
    const [savebtnshow, setSaveBtnShow] = useState(false)
    const [mainbodyfabric, setMainbodyfabric] = useState('')  //  for fabric validation
    // const [selectedline, setSelectedLine] = useState('');
    // const [lineData, setLineData] = useState([]);
    const [selectedfloor, setSelectedFloor] = useState('');
    const [floorData, setFloorData] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [unitData, setUnitData] = useState([]);


    const ShowSubmitbtn = () => {
        if (savebtnshow === true) {
            document.getElementById("submitbtn").style.display = "none";
            submittingData()
        }
        else {
            document.getElementById("submitbtn").style.display = "block";
        }
    }
    useEffect(() => {
        ShowSubmitbtn()
    }, [savebtnshow])

    console.log('sizeData=========>', sizeData, layerEndDateTime)
    console.log('selectedRatios=========>', selectedSizes, fabricDetail)

    const array1 = () => {
        setSelectedBuyer(null),
            setSelectedStyle(null),
            setStyleNoData([]),
            setSelectedOrderno(null),
            setOrderData([]),
            setSelectedColor(null),
            setColorData([]),
            setFabricDetail(null),
            setFabricData([]),
            setSelectedCuttingMaster(null),
            setOrderQuantity(0),
            setOrder_ex_qty(0),
            setOrderDate(' '),
            setLayerNumber(' '),
            setTableNumber(' '),
            setFabricUsed(' '),
            setGrossAverage(' '),
            setLayerStartDateTime(' '),
            setLayerEndDateTime(' '),
            setLayerCutStart(' '),
            setLayerCutEnd(' '),
            setPlies("" || 0),
            setTotalCutPcs(0),
            setSelectedCuttingtype(null),
            setSelectedDeliveryDates([]),
            setDeliveryDate([])
        setSelectedSizes([]),
            setSizeData([])
        setSelectedRatios([])
        setSizeWiseBreakup([])
    }

    // ============================================ First form function ==================================================================

    const saveData = (event) => {
        event.preventDefault();
        // -------------------------- start from here ----------  fabric validation -----------
        if (mainbodyfabric) {
            if (selectedcuttingtype.value === 'Main body') {
                console.log('fabric testing ================> 2')
                if (mainbodyfabric) {
                    if (mainbodyfabric !== fabricDetail.value) {
                        console.log(mainbodyfabric, "====", fabricDetail.label)
                        toast.error(`You Can Not Select Cutting Type ${selectedcuttingtype.value} For This Fabric`);
                        setSelectedCuttingtype('')
                        return;
                    }
                }
            }
            else if (selectedcuttingtype.value == 'trim') {
                if (mainbodyfabric) {
                    if (mainbodyfabric === fabricDetail.value) {
                        console.log(mainbodyfabric, "====", fabricDetail)
                        toast.error(`You Can Not Select Cutting Type ${selectedcuttingtype} For This Fabric`);
                        setSelectedCuttingtype('')
                        return;
                    }
                }
            }
        }
        // -------------------------- End from here ----------  fabric validation -----------


        if (!selectedBuyer || !selectedStyle || !selectedOrderno || !selectedColor || !layerStartDateTime || !layerEndDateTime || !layerCutStart || !layerCutEnd || !layerNumber || !tableNumber || !fabricUsed || orderQuantity === 0 || order_ex_qty === 0 || !orderDate || !grossAverage || totalCutPcs === 0 || selectedSizes.length === 0 || selectedRatios.length === 0 || selectedDeliveryDates.length === 0 || selectedcuttingtype === null || selectedcuttingmaster === null) {
            toast.error("Please fill out all required fields");
            return;
        }

        if (selectedSizes.length !== selectedRatios.length) {
            toast.error("Size and ratio values should be equal");
            return;
        }

        let totalvalid = preqcutMtData ? preqcutMtData.map(val => val.totalqty).reduce((acc, curr) => acc + curr, 0) : 0;
        let totalpcscutnow = totalvalid + totalCutPcs;

        if (totalpcscutnow > order_ex_qty) {
            toast.error("cut pcs Quantity is greater then orderQuantity");
            return;
        }

        let isValid = true;
        let invalidSize = null;
        let moreQty = 0;

        sizeWiseBreakup.forEach(item1 => {
            const matchtedpreqty = preqsizebreakup?.find(item3 => item3.size === item1.size);
            const matchedItem = sizeData.find(item2 => item2.value === item1.size);

            if (matchedItem) {
                const totalQty = item1.quantity + (matchtedpreqty?.cutpcs || 0);
                if (totalQty > matchedItem.ex_qty) {
                    isValid = false;
                    invalidSize = item1.size;
                    moreQty = totalQty - matchedItem.ex_qty;
                }
            }
        });

        if (!isValid) {
            toast.error(`${invalidSize} size Quantity is more than ${moreQty} from required quantity`);
            return;
        }

        if (savebtnshow === false) {
            setSaveBtnShow(true)
        }
    };

    const submittingData = () => {
        const userData = {
            buyer: selectedBuyer.value,
            buyer_name: selectedBuyer.label,
            style: selectedStyle.value,
            orderno: selectedOrderno.value,
            color: selectedColor?.value || "",
            orderQuantity: orderQuantity,
            order_ex_qty: order_ex_qty,
            orderDate: orderDate,
            deliveryDate: deliveryDate,
            layerNumber: layerNumber,
            tableNumber: tableNumber,
            fabricUsed: fabricUsed,
            grossAverage: grossAverage,
            layerStartDateTime: layerStartDateTime,
            layerEndDateTime: layerEndDateTime,
            layerCutStart: layerCutStart,
            layerCutEnd: layerCutEnd,
            sizelist: selectedSizes,
            ratiolist: selectedRatios,
            pliesquantity: plies,
            fabricDetail: fabricDetail,
            totalCutPcs: totalCutPcs,
            cutpcsquantityBySize: sizeWiseBreakup,
            cutting_master: selectedcuttingmaster.value,
            cutting_master_name: selectedcuttingmaster.label,
            created_by: selectedcuttingmaster.emp_code,
            cuttying_type: selectedcuttingtype.value,
            unit_id: selectedUnit.value,
            unitData: selectedUnit.label,
            floor_id: selectedfloor.value,
            floor_name: selectedfloor.label,
        };
        console.log("sendingData:", userData);
        const url = `${DjangoConfig.apiUrl}/rtqm/layer_cutting/`;
        axios.post(url, userData, { withCredentials: true })
            .then((res) => {
                const cuttingno = res.data.cuttingno;
                const message = res.data.message;
                toast.success(`${cuttingno} ${message}`);
                array1();
                // window.location.reload();
                setSaveBtnShow(false)

            })

    }


    const getprevioussavecutMtData = () => {
        try {
            if (selectedBuyer && selectedStyle && selectedOrderno && selectedColor) {
                let cutting_type = selectedcuttingtype.value || "Main body"
                const userData = {
                    buyer: selectedBuyer.value,
                    style: selectedStyle.value,
                    orderno: selectedOrderno.value,
                    color: selectedColor.value,
                    cutting_type: cutting_type,
                    unit_id: selectedUnit.value,
                };
                const queryParams = new URLSearchParams(userData).toString();
                axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
                    .then(response => {
                        console.log('getprevioussavecutMtData=======>', response.data);
                        const respondData = response.data.getMtDtSaveData;
                        const floordataresponse = response.data.floorData;
                        setPreqcutMtData(respondData.getcuttMtData);
                        setPreqSizeBreakup(respondData.getcutDtData);
                        setMainbodyfabric(respondData.fabric_data)   // setting main body fabric
                        // unit and floor data setting
                        const unitdataresponse = response.data.unitData;
                        const unitOptions = unitdataresponse.map(item => ({ value: item.id, label: item.name }));
                        setUnitData(unitOptions)
                        const floorOptions = floordataresponse.map(item => ({ value: item.id, label: item.name }));
                        setFloorData(floorOptions)
                    })
                    .catch((e) => {
                        console.log("Data fetching error");
                    });
            }
        } catch (e) {
            console.error("Error in getprevioussavecutMtData:", e);
        }
    };

    // ----------------  for fabric validation start here -------------
    useEffect(() => {
        if (mainbodyfabric) {
            if (selectedcuttingtype !== null && selectedcuttingtype.value !== '') {
                if (selectedcuttingtype.value === 'Main body') {
                    if (mainbodyfabric && fabricDetail && fabricDetail.value) { // Ensure fabricDetail and its value exist
                        if (mainbodyfabric !== fabricDetail.value) {
                            console.log(mainbodyfabric, "====", fabricDetail.label);
                            toast.error(`You Can Not Select Cutting Type ${selectedcuttingtype.label} For This Fabric`);
                            setSelectedCuttingtype('');
                            return;
                        }
                    }
                } else if (selectedcuttingtype.value === 'trim') {
                    if (mainbodyfabric && fabricDetail && fabricDetail.value) { // Ensure fabricDetail and its value exist
                        if (mainbodyfabric === fabricDetail.value) {
                            toast.error(`You Can Not Select Cutting Type ${selectedcuttingtype.label} For This Fabric`);
                            setSelectedCuttingtype('');
                            return;
                        }
                    }
                }
            }
        }

    }, [selectedcuttingtype])

    // ----------------  for fabric validation End here -------------

    useEffect(() => {
        getprevioussavecutMtData()
    }, [selectedColor, selectedcuttingtype, selectedUnit])



    // fetch buyer initiall data 
    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
            setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));
            // console.log('initialresponse', response.data.buyer_list)
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    // useState hook
    useEffect(() => {
        fetchInitialData();
        fetchCuttingMaster()
    }, []);

    // handle buyer selection
    const handleBuyerChange = (selectedValue) => {
        setSelectedBuyer(selectedValue);
        fetchByBuyer(selectedValue);
        setSelectedStyle(null)
        setSelectedOrderno(null)
        setSelectedColor(null)
        setFabricDetail(null)
        setFabricData([])
        setOrderQuantity(0)
        setOrder_ex_qty(0)
        setOrderDate(' ')
        setSelectedCuttingMaster(' ')
        setLayerNumber(' ')
        setTableNumber('')
        setFabricUsed(' ')
        setGrossAverage(' ')
        setLayerStartDateTime(' ')
        setLayerEndDateTime(' ')
        setLayerCutStart(' ')
        setLayerCutEnd(' ')
        setPlies("" || 0)
        setSelectedCuttingtype(null)
        setSelectedDeliveryDates([])
        setSelectedSizes([])
        setSelectedRatios([])
        setSizeData([])
        setSizeWiseBreakup([])
        setPreqcutMtData([])
        setDeliveryDate([])
    };

    //fetch style by buyer
    const fetchByBuyer = (selectedValue) => {
        const userData = { buyer_filter: selectedValue.value };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/excel_data_show_view/?${queryParams}`, { withCredentials: true })
            .then(response => {
                const responseData = response.data.data;
                // console.log('fetchByBuyer----->', responseData)
                const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
                const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
                setStyleNoData(styleOptions);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };
    // handle style selection
    const handleStyleChange = (selectedValue) => {
        setSelectedStyle(selectedValue);
        fetchByStyle(selectedValue);
        setSelectedOrderno(null)
        setSelectedColor(null)
        setFabricDetail(null)
        setFabricData([])
        setOrderQuantity(0)
        setOrder_ex_qty(0)
        setOrderDate(' ')
        setSelectedCuttingMaster(' ')
        setLayerNumber(' ')
        setTableNumber('')
        setFabricUsed(' ')
        setGrossAverage(' ')
        setLayerStartDateTime(' ')
        setLayerEndDateTime(' ')
        setLayerCutStart(' ')
        setLayerCutEnd(' ')
        setPlies("" || 0)
        setSelectedCuttingtype(null)
        setSelectedDeliveryDates([])
        setSelectedSizes([])
        setSelectedRatios([])
        setSizeData([])
        setSizeWiseBreakup([])
        setPreqcutMtData([])
        setDeliveryDate([])
    };

    //fetch orderno by buyer and style 
    const fetchByStyle = (selectedValue) => {
        const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedValue.value };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
            .then(response => {
                const responseData = response.data.data;
                // console.log('fetchByStyle-------->', responseData);
                const uniqueOrderno = [...new Set(responseData.map(item => item.ourref))];
                const orderOptions = uniqueOrderno.map(order => ({ value: order, label: order }));
                setOrderData(orderOptions);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    // handle orderno selection
    const handleOrderno = (selectedValue) => {
        setSelectedOrderno(selectedValue);
        fetchByOrderno(selectedValue);
        setSelectedColor(null)
        setFabricDetail(null)
        setFabricData([])
        setOrderQuantity(0)
        setOrder_ex_qty(0)
        setOrderDate(' ')
        setSelectedCuttingMaster(' ')
        setLayerNumber(' ')
        setTableNumber('')
        setFabricUsed(' ')
        setGrossAverage(' ')
        setLayerStartDateTime(' ')
        setLayerEndDateTime(' ')
        setLayerCutStart(' ')
        setLayerCutEnd(' ')
        setPlies("" || 0)
        setSelectedCuttingtype(null)
        setSelectedDeliveryDates([])
        setSelectedSizes([])
        setSelectedRatios([])
        setSizeData([])
        setSizeWiseBreakup([])
        setPreqcutMtData([])
        setDeliveryDate([])
    };

    // Fetch color,total quantityData, orderDate by buyer, style and orderno 
    const fetchByOrderno = (selectedValue) => {
        const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedStyle.value, orderno_filter: selectedValue.value };
        // console.log('userData ---------->', userData);
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
            .then(response => {
                const responseData = response.data.data;
                const responseData1 = response.data.data1
                // console.log('fetchByOrderno------->', responseData1);
                //  color list maping 
                const uniqueColor = [...new Set(responseData.map(item => item.color))];
                const colorOptions = uniqueColor.map(color => ({ value: color, label: color }));
                setColorData(colorOptions);
                //  Delivery date list maping        
                const uniquedelvdate = [...new Set(responseData1.delvdate.map(item => item.ExDelvDate.split('T')[0]))];
                const delvdateOptions = uniquedelvdate.map(ExDelvDate => ({ value: ExDelvDate, label: ExDelvDate }));
                setDeliveryDate(delvdateOptions)
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };
    //  handle color selection
    const handleColor = (selectedValue) => {
        setSelectedColor(selectedValue);
        fetchByColor(selectedValue);
        setFabricDetail(null)
        setFabricData([])
        setOrderQuantity(0)
        setOrder_ex_qty(0)
        setOrderDate(' ')
        setSelectedCuttingMaster(' ')
        setLayerNumber(' ')
        setTableNumber('')
        setFabricUsed(' ')
        setGrossAverage(' ')
        setLayerStartDateTime(' ')
        setLayerEndDateTime(' ')
        setLayerCutStart(' ')
        setLayerCutEnd(' ')
        setPlies("" || 0)
        setSelectedCuttingtype(null)
        setSelectedDeliveryDates([])
        setSelectedSizes([])
        setSelectedRatios([])
        setSizeData([])
        setSizeWiseBreakup([])
        setPreqcutMtData([])
        // setDeliveryDate([])
    };

    // Fetch size data by buyer, style and orderno and color 
    const fetchByColor = (selectedValue) => {
        const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedStyle.value, orderno_filter: selectedOrderno.value, color_filter: selectedValue.value };
        // console.log('userData ---------->', userData);
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
            .then(response => {
                const responseData = response.data.data1;
                console.log('fetchByColor-------->', responseData)
                // order Quantity setting
                setOrderQuantity(responseData.totalqty)
                setOrder_ex_qty(responseData.order_ex_qty)
                // orderdate setting
                if (responseData.orderdaye.length > 0) {
                    setOrderDate(responseData.orderdaye[0].orderdate)
                }
                // color by size maping
                const sizeOptions = responseData.colorbysize.map(size => ({ value: size.sizeval, label: size.sizeval, qty: size.qty, ex_qty: size.ex_qty }));
                setSizeData(sizeOptions);
                //  Fabric list maping
                const fabricOptions = responseData.fabricdetail.map(item => ({ value: item.ITEM, label: `${item.description}` }));
                setFabricData(fabricOptions)
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    // fabric detail selection handling 
    const handleFabricDetailChange = (selectedOption) => {
        setFabricDetail(selectedOption);
    };

    // fetching  cutting master 
    const fetchCuttingMaster = () => {
        axios.get(`${DjangoConfig.apiUrl}/rtqm/cutting_master_data/`, { withCredentials: true })
            .then(response => {
                // console.log("cutingmaster-------->", response.data);
                const responseData = response.data.cutting_master;
                const masterOptions = responseData.map(item => ({ value: item.emp_paycode, label: `${item.emp_name} (${item.emp_paycode})`, emp_code: item.emp_code }));
                setCuttingMasData(masterOptions);

            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };

    // DateTime field validation
    const handleStartDateTimeChange = (e) => {
        const value = e.target.value;
        setLayerStartDateTime(value);
    };

    const handleEndDateTimeChange = (e) => {
        const value = (e.target.value);
        const valueTimeObject = new Date(value);
        const startTimeObject = new Date(layerStartDateTime);
        if (valueTimeObject > startTimeObject) {
            setLayerEndDateTime(value);
        } else {
            toast.error('Layer End DateTime must be after Layer Start DateTime.');
        }
    };

    const handleCutStartDateTimeChange = (e) => {
        const value = e.target.value;
        const valueTimeObject = new Date(value);
        const endTimeObject = new Date(layerEndDateTime);
        if (valueTimeObject > endTimeObject) {
            setLayerCutStart(value);
        } else {
            toast.error('Layer Cut Start DateTime must be after Layer End DateTime.');
        }
    };

    const handleCutEndDateTimeChange = (e) => {
        const value = e.target.value;
        const valueTimeObject = new Date(value);
        const cutstartTimeObject = new Date(layerCutStart);
        const currentTimeObject = new Date(currentDatetime);
        if (valueTimeObject > cutstartTimeObject && valueTimeObject < currentTimeObject) {
            setLayerCutEnd(value);
        } else {
            toast.error('Layer Cut End DateTime must be after Layer Cut Start DateTime before current time.');
        }
    };

    //=============================== second form function ================================

    //  ratio selection 
    const maxRatio = 20; // Maximum ratio value
    const ratioOptions = Array.from({ length: maxRatio }, (_, index) => ({
        label: (index + 1).toString(),
        value: index + 1,
    }));

    const cuttingtypeOptions = [
        { label: "Main body", value: "Main body" },
        { label: "trim", value: "trim" },
    ];

    // Total cutpcs calculation
    const calculateTotalCutPcs = () => {
        const totalRatio = selectedRatios.reduce((sum, item) => sum + item.value, 0);
        const totalCut = (plies || 0) * totalRatio;
        setTotalCutPcs(isNaN(totalCut) ? 0 : totalCut);
    };

    // cutpcs size wise breakup
    const calculateSizeBreakup = () => {
        const sizeBreakup = selectedSizes.map((size, index) => {
            const ratioValue = selectedRatios[index] ? selectedRatios[index].value : 0;
            return {
                size: size.label,
                quantity: (plies || 0) * ratioValue
            };
        });
        // const sizeqnty = sizeData.find((item) => item.size === selectedSize)
        setSizeWiseBreakup(sizeBreakup);
    };


    // size selection Handling
    const handleSizeChange = (selectedOption) => {
        setSelectedSizes((prevSelectedSizes) => [...prevSelectedSizes, selectedOption]);
    };

    // delivery date selection handling 
    const handleDeliveryDateChange = (selectedOption) => {
        if (selectedOption && !selectedDeliveryDates.some(date => date.value === selectedOption.value)) {
            setSelectedDeliveryDates((prevSelectedDeliveryDates) => [...prevSelectedDeliveryDates, selectedOption]);
        }
    };

    // size selection management
    const availableSizeOptions = sizeData.filter(option =>
        !selectedSizes.some(selected => selected.value === option.value)
    );
    // ration change handling
    const handleRatioChange = (selectedOption) => {
        setSelectedRatios((prevSelectedRatios) => [...prevSelectedRatios, selectedOption]);
    };
    // select size removing handle
    const removeSize = (index) => {
        setSelectedSizes((prevSelectedSizes) => prevSelectedSizes.filter((_, i) => i !== index));
    };
    // select ratio removing handle
    const removeRatio = (index) => {
        setSelectedRatios((prevSelectedRatios) => prevSelectedRatios.filter((_, i) => i !== index));
    };
    // select deliverydate removing handle
    const removeDeliveryDate = (index) => {
        setSelectedDeliveryDates((prevSelectedDeliveryDates) => prevSelectedDeliveryDates.filter((_, i) => i !== index));
    };
    // select deliverydate management
    // const availableDeliveryDateOptions = deliveryDateOptions.filter(option =>
    //     !selectedDeliveryDates.some(selected => selected.value === option.value)
    // );

    // useEffect hook
    useEffect(() => {
        calculateTotalCutPcs();
        calculateSizeBreakup();

    }, [plies, selectedRatios, selectedSizes]);

    useEffect(() => {
        //  Size wise Validations
        try {
            if (totalCutPcs > order_ex_qty) {
                document.getElementById('submitbtn').style.display = 'none';
                document.getElementById('vldmsg').style.display = 'block';
            } else {
                document.getElementById('submitbtn').style.display = 'block';
                document.getElementById('vldmsg').style.display = 'none';
            }

            sizeWiseBreakup.forEach(item1 => {
                if (preqsizebreakup !== null) {
                    const matchtedpreqty = preqsizebreakup.find(item3 => item3.size === item1.size); // Matching based on size
                    const matchedItem = sizeData.find(item2 => item2.value === item1.size); // Matching based on size

                    if (matchedItem) {
                        if (matchtedpreqty) {
                            if ((item1.quantity + matchtedpreqty.cutpcs) > matchedItem.ex_qty) {
                                document.getElementById('submitbtn').style.display = 'none';
                                document.getElementById('vldmsg').style.display = 'block';
                                const more_qty = item1.quantity + matchtedpreqty.cutpcs - matchedItem.ex_qty;
                                document.getElementById('vldmsg').innerHTML = `${item1.size} size Quantity is more than ${more_qty} from required quantity`;
                            } else {
                                document.getElementById('submitbtn').style.display = 'block';
                                document.getElementById('vldmsg').style.display = 'none';
                            }
                        } else {
                            if (item1.quantity > matchedItem.ex_qty) {
                                document.getElementById('submitbtn').style.display = 'none';
                                document.getElementById('vldmsg').style.display = 'block';
                                const more_qty = item1.quantity - matchedItem.ex_qty;
                                document.getElementById('vldmsg').innerHTML = `${item1.size} size Quantity is more than ${more_qty} from required quantity`;
                            } else {
                                document.getElementById('submitbtn').style.display = 'block';
                                document.getElementById('vldmsg').style.display = 'none';
                            }
                        }
                    } else {
                        console.warn(`No matching item found in sizeData for size ${item1.size}`);
                    }
                }
            });
        } catch (e) {
            console.error(e);
        }
    }, [totalCutPcs, order_ex_qty, preqsizebreakup, sizeWiseBreakup, sizeData]);


    const obTablePage = () => {
        navigate('/dashboard/cutting_route/history/')
    }
    const cuttinghelpPage = () => {
        navigate('/dashboard/cutting_route/cutting-helper/')
    }

    return (
        <>
            <div className='w-full h-10 flex items-center justify-between rounded-lg pl-3 pr-4 mb-3 '>
                <div className="text-2xl mb-2 text-slate-950 font-bold">
                    Actual Cutting Entry (Layer)
                </div>
                <div className="w-[200px] flex items-center justify-between">
                    <div >
                        <Button
                            onClick={obTablePage}
                            variant="contained"
                            color="primary"
                            className="h-10 float-right mr-2 mb-1 "
                        >
                            History
                        </Button>
                    </div>

                    <div>
                        <Button
                            onClick={cuttinghelpPage}
                            variant="contained"
                            color="primary"
                            className="h-10 float-right mr-2 mb-1 "
                        >
                            Help
                        </Button>
                    </div>
                </div>
            </div>
            {/*=============================== first form =================================== */}
            <div className="p-6 bg-white">

                <form onSubmit={saveData} ref={formRef} className="pb-5">
                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-5 mb-3">
                        <div>
                            <label htmlFor="buyerList">Buyer</label>
                            <Select
                                options={buyerList}
                                value={selectedBuyer}
                                onChange={handleBuyerChange}
                                name="buyer"
                                placeholder="Select Buyer"
                                className="w-full border-2 border-gray-300 rounded-md outline-none"
                                isSearchable
                                isLoading={!buyerList.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '12px',
                                        borderColor: '#d1d5db', // Light gray border color
                                    }),
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="styleNoData">Style No</label>
                            <Select
                                options={styleNoData}
                                value={selectedStyle}
                                onChange={handleStyleChange}
                                name="style_no"
                                placeholder="Select Style"
                                className="w-full border-2 border-gray-300 rounded-md"
                                isSearchable
                                isLoading={!styleNoData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '12px',
                                        borderColor: '#d1d5db', // Light gray border color
                                    }),
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="orderData">Order No</label>
                            <Select
                                options={orderData}
                                value={selectedOrderno}
                                onChange={handleOrderno}
                                placeholder="Select Order No"
                                className="w-full border-2 border-gray-300 rounded-md"
                                isSearchable
                                isLoading={!orderData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '12px',
                                        borderColor: '#d1d5db', // Light gray border color
                                    }),
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="colorData">Color</label>
                            <Select
                                options={colorData}
                                value={selectedColor}
                                onChange={handleColor}
                                placeholder="Select Color"
                                className="w-full border-2 border-gray-300 rounded-md"
                                isSearchable
                                isLoading={!colorData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '12px',
                                        borderColor: '#d1d5db', // Light gray border color
                                    }),
                                }}
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-3 mb-3">
                        <div className="form-group">
                            <label htmlFor="fabric_detail" className="block text-sm font-normal mb-2">Fabric Detail</label>
                            <Select
                                options={fabricData}
                                value={fabricDetail}
                                onChange={handleFabricDetailChange}
                                name="fabric_name"
                                placeholder="Fabric Detail"
                                className="border-2 w-full border-gray-400 rounded-md"
                                isSearchable
                                isLoading={!fabricData.length}
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
                            <label htmlFor="colorData">Cutting Master</label>
                            <Select
                                options={cuttingmasData}
                                value={selectedcuttingmaster}
                                onChange={setSelectedCuttingMaster}
                                placeholder="Select Cutmaster"
                                className="w-full border-2 border-gray-300 rounded-md"
                                isSearchable
                                isLoading={!cuttingmasData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '12px',
                                        borderColor: '#d1d5db', // Light gray border color
                                    }),
                                }}
                            />
                        </div>
                        <div className="flex justify-center ">
                            <div>
                                <label htmlFor="orderQuantity">Order Quantity</label>
                                <input
                                    type="number"
                                    id="orderQuantity"
                                    value={orderQuantity}
                                    // onChange={(e) => setOrderQuantity(e.target.value)}
                                    className="w-24 border-2 border-gray-300 rounded-md p-2 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="orderQuantity">Order_ex_Qty</label>
                                <input
                                    type="number"
                                    id="orderQuantity"
                                    value={order_ex_qty}
                                    // onChange={(e) => setOrderQuantity(e.target.value)}
                                    className="w-24 border-2 border-gray-300 rounded-md p-2 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="orderDate">Order Date</label>
                            <input
                                type="datetime-local"
                                id="orderDate"
                                value={orderDate}
                                // onChange={(e) => setOrderDate(e.target.value)}
                                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                                readOnly
                            />
                        </div>

                        <div>
                            <label htmlFor="layerNumber">Layer Number</label>
                            <input
                                type="text"
                                id="layerNumber"
                                value={layerNumber}
                                placeholder="0"
                                onChange={(e) => setLayerNumber(e.target.value)}
                                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="tableNumber">Table Number</label>
                            <input
                                type="text"
                                id="tableNumber"
                                value={tableNumber}
                                placeholder="0"

                                onChange={(e) => setTableNumber(e.target.value)}
                                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="fabricUsed">Fabric Used</label>
                            <input
                                type="number"
                                step="0.01"
                                id="fabricUsed"
                                placeholder="0.00"
                                value={fabricUsed}
                                onChange={(e) => setFabricUsed(e.target.value || '')}
                                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="grossAverage">Gross Average</label>
                            <input
                                type="number"
                                step="0.01"
                                id="grossAverage"
                                placeholder="0.00"
                                value={grossAverage}
                                onChange={(e) => setGrossAverage(e.target.value)}
                                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"

                            />
                        </div>
                        <div>
                            <label htmlFor="layerStartDateTime">Layer Start DateTime</label>
                            <input
                                type="datetime-local"
                                id="layerStartDateTime"
                                value={layerStartDateTime}
                                onChange={handleStartDateTimeChange}
                                max={currentDatetime}
                                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                            />

                        </div>
                        <div>
                            <label htmlFor="layerEndDateTime">Layer End DateTime</label>
                            <input
                                type="datetime-local"
                                id="layerEndDateTime"
                                value={layerEndDateTime}
                                onChange={handleEndDateTimeChange}
                                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                                min={layerStartDateTime}
                                // max={currentDatetime}
                                disabled={!layerStartDateTime}
                            />

                        </div>
                        <div>
                            <label htmlFor="layerCutStart">Layer Cut Start</label>
                            <input
                                type="datetime-local"
                                id="layerCutStart"
                                value={layerCutStart}
                                onChange={handleCutStartDateTimeChange}
                                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                                min={layerEndDateTime}
                            // max={currentDatetime}
                            />

                        </div>
                        <div>
                            <label htmlFor="layerCutEnd">Layer Cut End</label>
                            <input
                                type="datetime-local"
                                id="layerCutEnd"
                                value={layerCutEnd}
                                onChange={handleCutEndDateTimeChange}
                                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                                min={layerCutStart}
                                // max={currentDatetime}
                                disabled={!layerCutStart}
                            />

                        </div>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 gap-4 mb-3">
                        <div className="form-group">
                            <label className="block text-sm font-normal mb-1">Plies</label>
                            <input
                                type="number"
                                className="border border-gray-300 w-full rounded-md p-2 pl-3"
                                value={plies}
                                onChange={(e) => setPlies(Number(e.target.value) || "")}
                                onFocus={(e) => e.target.value === "0" && setPlies("")}
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-normal mb-2">No of PCS Cut</label>
                            <input
                                type="text"
                                className="border border-gray-300 w-full rounded-md p-2"
                                value={totalCutPcs}
                                readOnly
                            />
                        </div>
                        <div>
                            <label htmlFor="colorData">Cutting Type</label>
                            <Select
                                options={cuttingtypeOptions}
                                value={selectedcuttingtype}
                                onChange={setSelectedCuttingtype}
                                placeholder="Select cutting type"
                                className="w-full border-2 border-gray-300 rounded-md"
                                isSearchable
                                isLoading={!cuttingtypeOptions.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '12px',
                                        borderColor: '#d1d5db', // Light gray border color
                                    }),
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">Delivery Dates</label>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={deliveryDate}

                                onChange={handleDeliveryDateChange}
                                className="border border-gray-300 rounded-md"
                                placeholder="Delivery Dates"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderColor: '#d1d5db',
                                        boxShadow: 'none',
                                        fontSize: '12px',
                                        width: '100%',
                                        '&:hover': {
                                            borderColor: '#d1d5db',
                                        },
                                    }),
                                }}
                            />
                        </div>

                        <div className="flex flex-wrap mb-2 ">
                            {(selectedDeliveryDates.length > 0) ? (selectedDeliveryDates.map((date, index) => (
                                <div key={index} className="h-8 bg-gray-200 rounded px-1 py-1 m-1 flex items-center">
                                    {date.label}
                                    <button
                                        type="button"
                                        className="ml-2 text-red-500"
                                        onClick={() => removeDeliveryDate(index)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))) : (<div className='h-8  bg-gray-200 rounded px-2 py-1 m-1 flex items-center'>
                                Select delivery date <button type="button" className="ml-2 text-red-500"> &times;
                                </button></div>)}
                        </div>

                        <div>
                            <label htmlFor="colorData">Select Unit</label>
                            <Select
                                options={unitData}
                                value={selectedUnit}
                                onChange={setSelectedUnit}
                                placeholder="Select Unit"
                                className="w-full border-2 border-gray-300 rounded-md"
                                isSearchable
                                isLoading={!unitData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '12px',
                                        borderColor: '#d1d5db', // Light gray border color
                                    }),
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="colorData">Select Floor</label>
                            <Select
                                options={floorData}
                                value={selectedfloor}
                                onChange={setSelectedFloor}
                                placeholder="Select Floor"
                                className="w-full border-2 border-gray-300 rounded-md"
                                isSearchable
                                isLoading={!floorData.length}
                                loadingMessage={() => <Skeleton count={5} />}
                                isClearable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '40px',
                                        fontSize: '12px',
                                        borderColor: '#d1d5db', // Light gray border color
                                    }),
                                }}
                            />
                        </div>

                    </div>

                    {/* =============================================== Second form starting  ========================================= */}

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">Select Sizes</label>
                            <div className="flex flex-wrap mb-2">
                                {(selectedSizes.length > 0) ? (selectedSizes.map((size, index) => (
                                    <div key={index} className="inline-block bg-gray-200 rounded px-2 py-1 m-1 flex items-center">
                                        {size.label}
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500"
                                            onClick={() => removeSize(index)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))) : (<div className='bg-gray-200 rounded px-2 py-1 m-1 flex items-center'>
                                    Select a size <button type="button" className="ml-2 text-red-500"> &times;
                                    </button></div>)}
                            </div>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={availableSizeOptions}
                                onChange={handleSizeChange}
                                className="border border-gray-300 rounded-md"
                                placeholder="Select Sizes"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderColor: '#d1d5db',
                                        boxShadow: 'none',
                                        fontSize: '12px',
                                        width: '100%',
                                        '&:hover': {
                                            borderColor: '#d1d5db',
                                        },
                                    }),
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">Ratio</label>
                            <div className="flex flex-wrap mb-1">
                                {(selectedRatios.length > 0) ? (selectedRatios.map((ratio, index) => (
                                    <div key={index} className="inline-block bg-gray-200 rounded px-2 py-1 m-1 flex items-center">
                                        {ratio.label}
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500"
                                            onClick={() => removeRatio(index)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))) : ((<div className='bg-gray-200 rounded px-2 py-1 m-1 flex items-center'>
                                    Select a Ratio <button type="button" className="ml-2 text-red-500"> &times;
                                    </button></div>))}
                            </div>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={ratioOptions}
                                onChange={handleRatioChange}
                                className="border border-gray-300 rounded-md"
                                placeholder="Select Ratios"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderColor: '#d1d5db',
                                        boxShadow: 'none',
                                        width: '100%',
                                        fontSize: '12px',
                                        '&:hover': {
                                            borderColor: '#d1d5db',
                                        },
                                    }),
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">Size Wise Breakup</label>
                            <div className="border border-gray-300 w-full rounded-md p-2">
                                {sizeWiseBreakup.length > 0 ? (
                                    <ul className="flex justify-start items-center">
                                        {sizeWiseBreakup.map((item, index) => (
                                            <li key={index} className="ml-3">
                                                {item.size}: {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No data available</p>
                                )}
                            </div>
                        </div>
                        <div className="text-center mt-8 ml-4">
                            <button
                                type="submit" id="submitbtn"
                                className="w-36 bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700"
                            >
                                Save
                            </button>
                            <div id="vldmsg" className="w-full h-8 flex justify-center font-bold text-red-600">
                                !Cutpcs Quantity is less then orderQuantity
                            </div>
                        </div>
                        {/* <div className="mt-3"><ResetForm data ={array} /></div> */}
                    </div>
                </form>
            </div>

        </>
    );
};
export default CuttingEntryForm;



















//  ------------------------ old form  -------------------------------------

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import DjangoConfig from "../../config/Config";
// import Select from 'react-select';
// import Skeleton from "react-loading-skeleton";
// import { toast } from "react-toastify";
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@mui/material';
// import makeAnimated from 'react-select/animated';

// const animatedComponents = makeAnimated();

// const CuttingEntryForm = () => {
//     const navigate = useNavigate()
//     // const currentDatetime1 = new Date().toLocaleString();
//     // console.log("currentDatetime", currentDatetime1)

//     //     const getCookie = (name) => {
//     //     const value = `; ${document.cookie}`;
//     //     const parts = value.split(`; ${name}=`);
//     //     if (parts.length === 2) return parts.pop().split(';').shift();
//     // }

//     function formatDateForInput(date) {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const hours = String(date.getHours()).padStart(2, '0');
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         return `${year}-${month}-${day}T${hours}:${minutes}`;
//     }
//     const currentDatetime = formatDateForInput(new Date())
//     console.log("currentTimeObject", currentDatetime)
  
//     const [selectedBuyer, setSelectedBuyer] = useState(null);
//     const [buyerList, setBuyerList] = useState([]);
//     const [selectedStyle, setSelectedStyle] = useState(null);
//     const [styleNoData, setStyleNoData] = useState([]);
//     const [selectedOrderno, setSelectedOrderno] = useState(null);
//     const [orderData, setOrderData] = useState([]);
//     const [selectedColor, setSelectedColor] = useState(null);
//     const [colorData, setColorData] = useState([]);
//     const [fabricDetail, setFabricDetail] = useState(null);
//     const [fabricData, setFabricData] = useState([]);
//     const [selectedcuttingmaster, setSelectedCuttingMaster] = useState(null);
//     const [cuttingmasData, setCuttingMasData] = useState([]);
//     const [orderQuantity, setOrderQuantity] = useState(0);
//     const [order_ex_qty, setOrder_ex_qty] = useState(0);
//     const [orderDate, setOrderDate] = useState('');
//     const [layerNumber, setLayerNumber] = useState(null);
//     const [tableNumber, setTableNumber] = useState(null);
//     const [fabricUsed, setFabricUsed] = useState(null);
//     const [grossAverage, setGrossAverage] = useState(null);

//     const [layerStartDateTime, setLayerStartDateTime] = useState(' ');
//     const [layerEndDateTime, setLayerEndDateTime] = useState(' ');
//     const [layerCutStart, setLayerCutStart] = useState(' ');
//     const [layerCutEnd, setLayerCutEnd] = useState(' ');

//     const [plies, setPlies] = useState("" || 0);
//     const [totalCutPcs, setTotalCutPcs] = useState(0);
//     const [selectedcuttingtype, setSelectedCuttingtype] = useState(null);
//     const [deliveryDate, setDeliveryDate] = useState([]);
//     const [selectedDeliveryDates, setSelectedDeliveryDates] = useState([]);
//     const formRef = useRef(null);
//     //================ second form data ================================================
//     const [selectedSizes, setSelectedSizes] = useState([]);
//     const [sizeData, setSizeData] = useState([]);
//     const [selectedRatios, setSelectedRatios] = useState([]);
//     const [sizeWiseBreakup, setSizeWiseBreakup] = useState([]);
//     const [preqcutMtData, setPreqcutMtData] = useState([]);
//     const [preqsizebreakup, setPreqSizeBreakup] = useState([]);

//     const [savebtnshow, setSaveBtnShow] = useState(false)


//     const ShowSubmitbtn = () => {
//         if (savebtnshow === true) {
//             document.getElementById("submitbtn").style.display = "none";
//             submittingData()
//         }
//         else {
//             document.getElementById("submitbtn").style.display = "block";
//         }
//     }
//     useEffect(() => {
//         ShowSubmitbtn()
//     }, [savebtnshow])
    
//     console.log('sizeData=========>', sizeData, layerEndDateTime)
//     console.log('selectedRatios=========>', selectedRatios)

//     const array1 = () => {
//         setSelectedBuyer(null),
//             setSelectedStyle(null),
//             setSelectedOrderno(null),
//             setSelectedColor(null),
//             setFabricDetail(null),
//             setSelectedCuttingMaster(null),
//             setOrderQuantity(0),
//             setOrder_ex_qty(0),
//             setOrderDate(' '),
//             setLayerNumber(' '),
//             setTableNumber(' '),
//             setFabricUsed(' '),
//             setGrossAverage(' '),
//             setLayerStartDateTime(' '),
//             setLayerEndDateTime(' '),
//             setLayerCutStart(' '),
//             setLayerCutEnd(' '),
//             setPlies("" || 0),
//             setSelectedCuttingtype(null),
//             setSelectedDeliveryDates([]),
//             setSelectedSizes([]),
//             setSelectedRatios([])
//     }

//     // ============================================ First form function ====================================================================


//     const saveData = (event) => {
//         event.preventDefault();
//         if (!selectedBuyer || !selectedStyle || !selectedOrderno || !selectedColor || !layerStartDateTime || !layerEndDateTime || !layerCutStart || !layerCutEnd || !layerNumber || !tableNumber || !fabricUsed || !grossAverage || totalCutPcs===0 ||selectedSizes.length === 0 || selectedRatios.length === 0 || selectedDeliveryDates.length === 0 || selectedcuttingtype === null || selectedcuttingmaster === null) {
//             toast.error("Please fill out all required fields");
//             return;
//         }

//         if (selectedSizes.length !== selectedRatios.length) {
//             toast.error("Size and ratio values should be equal");
//             return;
//         }

//         let totalvalid = preqcutMtData ? preqcutMtData.map(val => val.totalqty).reduce((acc, curr) => acc + curr, 0) : 0;
//         let totalpcscutnow = totalvalid + totalCutPcs;

//         if (totalpcscutnow > order_ex_qty) {
//             toast.error("cut pcs Quantity is greater then orderQuantity");
//             return;
//         }

//         let isValid = true;
//         let invalidSize = null;
//         let moreQty = 0;

//         sizeWiseBreakup.forEach(item1 => {
//             const matchtedpreqty = preqsizebreakup?.find(item3 => item3.size === item1.size);
//             const matchedItem = sizeData.find(item2 => item2.value === item1.size);

//             if (matchedItem) {
//                 const totalQty = item1.quantity + (matchtedpreqty?.cutpcs || 0);
//                 if (totalQty > matchedItem.ex_qty) {
//                     isValid = false;
//                     invalidSize = item1.size;
//                     moreQty = totalQty - matchedItem.ex_qty;
//                 }
//             }
//         });

//         if (!isValid) {
//             toast.error(`${invalidSize} size Quantity is more than ${moreQty} from required quantity`);
//             return;
//         }
//         if (savebtnshow === false){
//             setSaveBtnShow(true)
//         } 

//         // const userData = {
//         //     buyer: selectedBuyer.value,
//         //     buyer_name: selectedBuyer.label,
//         //     style: selectedStyle.value,
//         //     orderno: selectedOrderno.value,
//         //     color: selectedColor?.value || "",
//         //     orderQuantity: orderQuantity,
//         //     order_ex_qty: order_ex_qty,
//         //     orderDate: orderDate,
//         //     deliveryDate: deliveryDate,
//         //     layerNumber: layerNumber,
//         //     tableNumber: tableNumber,
//         //     fabricUsed: fabricUsed,
//         //     grossAverage: grossAverage,
//         //     layerStartDateTime: layerStartDateTime,
//         //     layerEndDateTime: layerEndDateTime,
//         //     layerCutStart: layerCutStart,
//         //     layerCutEnd: layerCutEnd,
//         //     sizelist: selectedSizes,
//         //     ratiolist: selectedRatios,
//         //     pliesquantity: plies,
//         //     fabricDetail: fabricDetail,
//         //     totalCutPcs: totalCutPcs,
//         //     cutpcsquantityBySize: sizeWiseBreakup,
//         //     cutting_master: selectedcuttingmaster.value,
//         //     cutting_master_name: selectedcuttingmaster.label,
//         //     created_by: selectedcuttingmaster.emp_code,
//         //     cuttying_type: selectedcuttingtype.value
//         // };

//         // console.log("sendingData:", userData);
//         // const url = `${DjangoConfig.apiUrl}/rtqm/layer_cutting/`;

//         // axios.post(url, userData, { withCredentials: true })
//         //     .then((res) => {
//         //         const cuttingno = res.data.cuttingno;
//         //         const message = res.data.message;
//         //         toast.success(`${cuttingno} ${message}`);
//         //         array1();
//         //     })
//         // // .catch((e) => {
//         // //     toast.error("data not fetched during save");
//         // // });
//     };

//     const submittingData=()=>{
        
//         const userData = {
//             buyer: selectedBuyer.value,
//             buyer_name: selectedBuyer.label,
//             style: selectedStyle.value,
//             orderno: selectedOrderno.value,
//             color: selectedColor?.value || "",
//             orderQuantity: orderQuantity,
//             order_ex_qty: order_ex_qty,
//             orderDate: orderDate,
//             deliveryDate: deliveryDate,
//             layerNumber: layerNumber,
//             tableNumber: tableNumber,
//             fabricUsed: fabricUsed,
//             grossAverage: grossAverage,
//             layerStartDateTime: layerStartDateTime,
//             layerEndDateTime: layerEndDateTime,
//             layerCutStart: layerCutStart,
//             layerCutEnd: layerCutEnd,
//             sizelist: selectedSizes,
//             ratiolist: selectedRatios,
//             pliesquantity: plies,
//             fabricDetail: fabricDetail,
//             totalCutPcs: totalCutPcs,
//             cutpcsquantityBySize: sizeWiseBreakup,
//             cutting_master: selectedcuttingmaster.value,
//             cutting_master_name: selectedcuttingmaster.label,
//             created_by: selectedcuttingmaster.emp_code,
//             cuttying_type: selectedcuttingtype.value,
//         };

//         console.log("sendingData:", userData);
//         const url = `${DjangoConfig.apiUrl}/rtqm/layer_cutting/`;

//         axios.post(url, userData, { withCredentials: true })
//             .then((res) => {
//                 const cuttingno = res.data.cuttingno;
//                 const message = res.data.message;
//                 toast.success(`${cuttingno} ${message}`);
//                 array1();
//                 setSaveBtnShow(false)
//             })
//     }



//     const getprevioussavecutMtData = () => {
//         try {
//             if (selectedBuyer && selectedStyle && selectedOrderno && selectedColor) {
//                 const userData = {
//                     buyer: selectedBuyer.value,
//                     style: selectedStyle.value,
//                     orderno: selectedOrderno.value,
//                     color: selectedColor.value,
//                     cutting_type:selectedcuttingtype.value
//                 };
//                 const queryParams = new URLSearchParams(userData).toString();
//                 axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
//                     .then(response => {
//                         const respondData = response.data.getMtDtSaveData;
//                         // console.log('getprevioussavecutMtData=======>',response.data);
//                         setPreqcutMtData(respondData.getcuttMtData);
//                         setPreqSizeBreakup(respondData.getcutDtData);
//                     })
//                     .catch((e) => {
//                         console.log("Data fetching error");
//                     });
//             } 
//         } catch (e) {
//             console.error("Error in getprevioussavecutMtData:", e);
//         }
//     };


//     // fetch buyer initiall data 
//     const fetchInitialData = async () => {
//         try {
//             const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
//             setBuyerList(response.data.buyer_list.map(item => ({ value: item.buyer_code, label: item.buyer_name })));
//             // console.log('initialresponse', response.data.buyer_list)
//         } catch (error) {
//             console.error('Error fetching initial data:', error);
//         }
//     };

//     // useState hook
//     useEffect(() => {
//         fetchInitialData();
//         fetchCuttingMaster()
//     }, []);

//     // handle buyer selection
//     const handleBuyerChange = (selectedValue) => {
//         setSelectedBuyer(selectedValue);
//         fetchByBuyer(selectedValue);
//         setSelectedStyle(null)
//         setSelectedOrderno(null)
//         setSelectedColor(null)
//         setFabricDetail(null)
//         setOrderQuantity(0)
//         setOrder_ex_qty(0)
//         setOrderDate(' ')
//     };

//     //fetch style by buyer
//     const fetchByBuyer = (selectedValue) => {
//         const userData = { buyer_filter: selectedValue.value };
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/excel_data_show_view/?${queryParams}`, { withCredentials: true })
//             .then(response => {
//                 const responseData = response.data.data;
//                 // console.log('fetchByBuyer----->', responseData)
//                 const uniqueStyles = [...new Set(responseData.map(item => item.styleno))];
//                 const styleOptions = uniqueStyles.map(style => ({ value: style, label: style }));
//                 setStyleNoData(styleOptions);
//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };
//     // handle style selection
//     const handleStyleChange = (selectedValue) => {
//         setSelectedStyle(selectedValue);
//         fetchByStyle(selectedValue);
//         setSelectedOrderno(null)
//         setSelectedColor(null)
//         setFabricDetail(null)
//         setOrderQuantity(0)
//         setOrder_ex_qty(0)
//         setOrderDate(' ')
//     };

//     //fetch orderno by buyer and style 
//     const fetchByStyle = (selectedValue) => {
//         const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedValue.value };
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
//             .then(response => {
//                 const responseData = response.data.data;
//                 // console.log('fetchByStyle-------->', responseData);
//                 const uniqueOrderno = [...new Set(responseData.map(item => item.ourref))];
//                 const orderOptions = uniqueOrderno.map(order => ({ value: order, label: order }));
//                 setOrderData(orderOptions);
//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };

//     // handle orderno selection
//     const handleOrderno = (selectedValue) => {
//         setSelectedOrderno(selectedValue);
//         fetchByOrderno(selectedValue);
//         setSelectedColor(null)
//         setFabricDetail(null)
//         setOrderQuantity(0)
//         setOrder_ex_qty(0)
//         setOrderDate(' ')
//     };

//     // Fetch color,total quantityData, orderDate by buyer, style and orderno 
//     const fetchByOrderno = (selectedValue) => {
//         const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedStyle.value, orderno_filter: selectedValue.value };
//         // console.log('userData ---------->', userData);
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
//             .then(response => {
//                 const responseData = response.data.data;
//                 const responseData1 = response.data.data1
//                 // console.log('fetchByOrderno------->', responseData1);
//             //  color list maping 
//                 const uniqueColor = [...new Set(responseData.map(item => item.color))];
//                 const colorOptions = uniqueColor.map(color => ({ value: color, label: color }));
//                 setColorData(colorOptions);
//                 //  Delivery date list maping        
//                 const uniquedelvdate = [...new Set(responseData1.delvdate.map(item => item.ExDelvDate.split('T')[0]))];
//                 const delvdateOptions = uniquedelvdate.map(ExDelvDate => ({ value: ExDelvDate, label: ExDelvDate }));
//                 setDeliveryDate(delvdateOptions)
//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };
//     //  handle color selection
//     const handleColor = (selectedValue) => {
//         setSelectedColor(selectedValue);
//         fetchByColor(selectedValue);
//         setFabricDetail(null)
//         setOrderQuantity(0)
//         setOrder_ex_qty(0)
//         setOrderDate(' ')
//     };

//     // Fetch size data by buyer, style and orderno and color 
//     const fetchByColor = (selectedValue) => {
//         const userData = { buyer_filter: selectedBuyer.value, style_filter: selectedStyle.value, orderno_filter: selectedOrderno.value, color_filter: selectedValue.value };
//         // console.log('userData ---------->', userData);
//         const queryParams = new URLSearchParams(userData).toString();
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/?${queryParams}`, { withCredentials: true })
//             .then(response => {
//                 const responseData = response.data.data1;
//                 console.log('fetchByColor-------->', responseData)
//             // order Quantity setting
//                 setOrderQuantity(responseData.totalqty)
//                 setOrder_ex_qty(responseData.order_ex_qty)
//             // orderdate setting
//                 setOrderDate(responseData.orderdaye[0].orderdate)
//             // color by size maping
//                 const sizeOptions = responseData.colorbysize.map(size => ({ value: size.sizeval, label: size.sizeval, qty: size.qty, ex_qty: size.ex_qty }));
//                 setSizeData(sizeOptions);
//             //  Fabric list maping
//                 const fabricOptions = responseData.fabricdetail.map(item => ({ value: item.ITEM, label: `${item.description}(${item.fabcolor})` }));
//                 setFabricData(fabricOptions)
//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };

//     // fabric detail selection handling 
//     const handleFabricDetailChange = (selectedOption) => {
//         setFabricDetail(selectedOption);
//     };

//     // fetching  cutting master 
//     const fetchCuttingMaster = () => {
//         axios.get(`${DjangoConfig.apiUrl}/rtqm/layer_cutting/`, { withCredentials: true })
//             .then(response => {
//                 // console.log("cutingmaster-------->", response.data);
//                 const responseData = response.data.cutting_master;
//                 const masterOptions = responseData.map(item => ({ value: item.emp_paycode, label: `${item.emp_name} (${item.emp_paycode})`, emp_code: item.emp_code }));
//                 setCuttingMasData(masterOptions);
//             })
//             .catch(error => {
//                 console.error('Error fetching filtered data:', error);
//             });
//     };

//     // DateTime field validation
//     const handleStartDateTimeChange = (e) => {
//         const value = e.target.value;
//         setLayerStartDateTime(value);
//     };

//     const handleEndDateTimeChange = (e) => {
//         const value = (e.target.value);
//         const valueTimeObject = new Date(value);
//         const startTimeObject = new Date(layerStartDateTime);
//         if (valueTimeObject > startTimeObject) {
//             setLayerEndDateTime(value);
//         } else {
//             toast.error('Layer End DateTime must be after Layer Start DateTime.');
//         }
//     };

//     const handleCutStartDateTimeChange = (e) => {
//         const value = e.target.value;
//         const valueTimeObject = new Date(value);
//         const endTimeObject = new Date(layerEndDateTime);
//         if (valueTimeObject > endTimeObject) {
//             setLayerCutStart(value);
//         } else {
//             toast.error('Layer Cut Start DateTime must be after Layer End DateTime.');
//         }
//     };

//     const handleCutEndDateTimeChange = (e) => {
//         const value = e.target.value;
//         const valueTimeObject = new Date(value);
//         const cutstartTimeObject = new Date(layerCutStart);
//         const currentTimeObject = new Date(currentDatetime);
//         if (valueTimeObject > cutstartTimeObject && valueTimeObject < currentTimeObject) {
//             setLayerCutEnd(value);
//         } else {
//             toast.error('Layer Cut End DateTime must be after Layer Cut Start DateTime before current time.');
//         }
//     };


//     useEffect(() => {
//         getprevioussavecutMtData()
//     },[selectedColor, selectedcuttingtype])

//     //=============================== second form function ================================

//     //  ratio selection 
//     const maxRatio = 20; // Maximum ratio value
//     const ratioOptions = Array.from({ length: maxRatio }, (_, index) => ({
//         label: (index + 1).toString(),
//         value: index + 1,
//     }));

//     const cuttingtypeOptions = [
//         { label: "Main body", value: "Main body" },
//         { label: "trim", value: "trim" },

//     ];

//     // Total cutpcs calculation
//     const calculateTotalCutPcs = () => {
//         const totalRatio = selectedRatios.reduce((sum, item) => sum + item.value, 0);
//         const totalCut = (plies || 0) * totalRatio;
//         setTotalCutPcs(isNaN(totalCut) ? 0 : totalCut);
//     };

//     // cutpcs size wise breakup
//     const calculateSizeBreakup = () => {
//         const sizeBreakup = selectedSizes.map((size, index) => {
//             const ratioValue = selectedRatios[index] ? selectedRatios[index].value : 0;
//             return {
//                 size: size.label,
//                 quantity: (plies || 0) * ratioValue
//             };
//         });
//         // const sizeqnty = sizeData.find((item) => item.size === selectedSize)
//         setSizeWiseBreakup(sizeBreakup);
//     };


//     // size selection Handling
//     const handleSizeChange = (selectedOption) => {
//         setSelectedSizes((prevSelectedSizes) => [...prevSelectedSizes, selectedOption]);
//     };

//     // delivery date selection handling 
//     const handleDeliveryDateChange = (selectedOption) => {
//         if (selectedOption && !selectedDeliveryDates.some(date => date.value === selectedOption.value)) {
//             setSelectedDeliveryDates((prevSelectedDeliveryDates) => [...prevSelectedDeliveryDates, selectedOption]);
//         }
//     };

//     // size selection management
//     const availableSizeOptions = sizeData.filter(option =>
//         !selectedSizes.some(selected => selected.value === option.value)
//     );
//     // ration change handling
//     const handleRatioChange = (selectedOption) => {
//         setSelectedRatios((prevSelectedRatios) => [...prevSelectedRatios, selectedOption]);
//     };
//     // select size removing handle
//     const removeSize = (index) => {
//         setSelectedSizes((prevSelectedSizes) => prevSelectedSizes.filter((_, i) => i !== index));
//     };
//     // select ratio removing handle
//     const removeRatio = (index) => {
//         setSelectedRatios((prevSelectedRatios) => prevSelectedRatios.filter((_, i) => i !== index));
//     };
//     // select deliverydate removing handle
//     const removeDeliveryDate = (index) => {
//         setSelectedDeliveryDates((prevSelectedDeliveryDates) => prevSelectedDeliveryDates.filter((_, i) => i !== index));
//     };
//     // select deliverydate management
//     // const availableDeliveryDateOptions = deliveryDateOptions.filter(option =>
//     //     !selectedDeliveryDates.some(selected => selected.value === option.value)
//     // );

// // useEffect hook
//     useEffect(() => {
//         calculateTotalCutPcs();
//         calculateSizeBreakup();

//     }, [plies, selectedRatios, selectedSizes]);

//     useEffect(() => {

//         //  Size wise Validations
//         try {
//             if (totalCutPcs > order_ex_qty) {
//                 document.getElementById('submitbtn').style.display = 'none';
//                 document.getElementById('vldmsg').style.display = 'block';
//             } else {
//                 document.getElementById('submitbtn').style.display = 'block';
//                 document.getElementById('vldmsg').style.display = 'none';
//             }

//             sizeWiseBreakup.forEach(item1 => {
//                 if (preqsizebreakup !== null) {
//                     const matchtedpreqty = preqsizebreakup.find(item3 => item3.size === item1.size); // Matching based on size
//                     const matchedItem = sizeData.find(item2 => item2.value === item1.size); // Matching based on size

//                     if (matchedItem) {
//                         if (matchtedpreqty) {
//                             if ((item1.quantity + matchtedpreqty.cutpcs) > matchedItem.ex_qty) {
//                                 document.getElementById('submitbtn').style.display = 'none';
//                                 document.getElementById('vldmsg').style.display = 'block';
//                                 const more_qty = item1.quantity + matchtedpreqty.cutpcs - matchedItem.ex_qty;
//                                 document.getElementById('vldmsg').innerHTML = `${item1.size} size Quantity is more than ${more_qty} from required quantity`;
//                             } else {
//                                 document.getElementById('submitbtn').style.display = 'block';
//                                 document.getElementById('vldmsg').style.display = 'none';
//                             }
//                         } else {
//                             if (item1.quantity > matchedItem.ex_qty) {
//                                 document.getElementById('submitbtn').style.display = 'none';
//                                 document.getElementById('vldmsg').style.display = 'block';
//                                 const more_qty = item1.quantity - matchedItem.ex_qty;
//                                 document.getElementById('vldmsg').innerHTML = `${item1.size} size Quantity is more than ${more_qty} from required quantity`;
//                             } else {
//                                 document.getElementById('submitbtn').style.display = 'block';
//                                 document.getElementById('vldmsg').style.display = 'none';
//                             }
//                         }
//                     } else {
//                         console.warn(`No matching item found in sizeData for size ${item1.size}`);
//                     }
//                 }
//             });
//         } catch (e) {
//             console.error(e);
//         }
//     }, [totalCutPcs, order_ex_qty, preqsizebreakup, sizeWiseBreakup, sizeData]);


//     const obTablePage = () => {
//         navigate('/dashboard/cutting_route/history/')
//     }
//     const cuttinghelpPage = () => {
//         navigate('/dashboard/cutting_route/cutting-helper/')
//     }

//     return (
//         <>
//             <div className='w-full h-10 flex items-center justify-between rounded-lg pl-3 pr-4 mb-3 '>
//                 <div className="text-2xl mb-2 text-slate-950 font-bold">
//                     Actual Cutting Entry (Layer)
//                 </div>
//                 <div className="w-[200px] flex items-center justify-between">
//                     <div >
//                         <Button
//                             onClick={obTablePage}
//                             variant="contained"
//                             color="primary"
//                             className="h-10 float-right mr-2 mb-1 "
//                         >
//                             History
//                         </Button>
//                     </div>

//                     <div>
//                         <Button
//                             onClick={cuttinghelpPage}
//                             variant="contained"
//                             color="primary"
//                             className="h-10 float-right mr-2 mb-1 "
//                         >
//                             Help
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//             {/*=============================== first form =================================== */}
//             <div className="p-6 bg-white">

//                 <form onSubmit={saveData} ref={formRef} className="pb-5">
//                     <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-5 mb-3">
//                         <div>
//                             <label htmlFor="buyerList">Buyer</label>
//                             <Select
//                                 options={buyerList}
//                                 value={selectedBuyer}
//                                 onChange={handleBuyerChange}
//                                 name="buyer"
//                                 placeholder="Select Buyer"
//                                 className="w-full border-2 border-gray-300 rounded-md outline-none"
//                                 isSearchable
//                                 isLoading={!buyerList.length}
//                                 loadingMessage={() => <Skeleton count={5} />}
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         height: '40px',
//                                         fontSize: '12px',
//                                         borderColor: '#d1d5db', // Light gray border color
//                                     }),
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="styleNoData">Style No</label>
//                             <Select
//                                 options={styleNoData}
//                                 value={selectedStyle}
//                                 onChange={handleStyleChange}
//                                 name="style_no"
//                                 placeholder="Select Style"
//                                 className="w-full border-2 border-gray-300 rounded-md"
//                                 isSearchable
//                                 isLoading={!styleNoData.length}
//                                 loadingMessage={() => <Skeleton count={5} />}
//                                 isClearable
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         height: '40px',
//                                         fontSize: '12px',
//                                         borderColor: '#d1d5db', // Light gray border color
//                                     }),
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="orderData">Order No</label>
//                             <Select
//                                 options={orderData}
//                                 value={selectedOrderno}
//                                 onChange={handleOrderno}
//                                 placeholder="Select Order No"
//                                 className="w-full border-2 border-gray-300 rounded-md"
//                                 isSearchable
//                                 isLoading={!orderData.length}
//                                 loadingMessage={() => <Skeleton count={5} />}
//                                 isClearable
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         height: '40px',
//                                         fontSize: '12px',
//                                         borderColor: '#d1d5db', // Light gray border color
//                                     }),
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="colorData">Color</label>
//                             <Select
//                                 options={colorData}
//                                 value={selectedColor}
//                                 onChange={handleColor}
//                                 placeholder="Select Color"
//                                 className="w-full border-2 border-gray-300 rounded-md"
//                                 isSearchable
//                                 isLoading={!colorData.length}
//                                 loadingMessage={() => <Skeleton count={5} />}
//                                 isClearable
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         height: '40px',
//                                         fontSize: '12px',
//                                         borderColor: '#d1d5db', // Light gray border color
//                                     }),
//                                 }}
//                             />
//                         </div>

//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-3 mb-3">
//                         <div className="form-group">
//                             <label htmlFor="fabric_detail" className="block text-sm font-normal mb-2">Fabric Detail</label>
//                             <Select
//                                 options={fabricData}
//                                 value={fabricDetail}
//                                 onChange={handleFabricDetailChange}
//                                 name="fabric_name"
//                                 placeholder="Fabric Detail"
//                                 className="border-2 w-full border-gray-400 rounded-md"
//                                 isSearchable
//                                 isLoading={!fabricData.length}
//                                 loadingMessage={() => <Skeleton count={5} />}
//                                 isClearable
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         height: '40px',
//                                         fontSize: '12px',
//                                     }),
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="colorData">Cutting Master</label>
//                             <Select
//                                 options={cuttingmasData}
//                                 value={selectedcuttingmaster}
//                                 onChange={setSelectedCuttingMaster}
//                                 placeholder="Select Cutmaster"
//                                 className="w-full border-2 border-gray-300 rounded-md"
//                                 isSearchable
//                                 isLoading={!cuttingmasData.length}
//                                 loadingMessage={() => <Skeleton count={5} />}
//                                 isClearable
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         height: '40px',
//                                         fontSize: '12px',
//                                         borderColor: '#d1d5db', // Light gray border color
//                                     }),
//                                 }}
//                             />
//                         </div>
//                         <div className="flex justify-center ">
//                             <div>
//                                 <label htmlFor="orderQuantity">Order Quantity</label>
//                                 <input
//                                     type="number"
//                                     id="orderQuantity"
//                                     value={orderQuantity}
//                                     // onChange={(e) => setOrderQuantity(e.target.value)}
//                                     className="w-24 border-2 border-gray-300 rounded-md p-2 outline-none"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="orderQuantity">Order_ex_Qty</label>
//                                 <input
//                                     type="number"
//                                     id="orderQuantity"
//                                     value={order_ex_qty}
//                                     // onChange={(e) => setOrderQuantity(e.target.value)}
//                                     className="w-24 border-2 border-gray-300 rounded-md p-2 outline-none"
//                                 />
//                             </div>
//                         </div>
//                         <div>
//                             <label htmlFor="orderDate">Order Date</label>
//                             <input
//                                 type="datetime-local"
//                                 id="orderDate"
//                                 value={orderDate}
//                                 // onChange={(e) => setOrderDate(e.target.value)}
//                                 className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
//                                 readOnly
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="layerNumber">Layer Number</label>
//                             <input
//                                 type="text"
//                                 id="layerNumber"
//                                 value={layerNumber}
//                                 placeholder="0"
//                                 onChange={(e) => setLayerNumber(e.target.value)}
//                                 className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="tableNumber">Table Number</label>
//                             <input
//                                 type="text"
//                                 id="tableNumber"
//                                 value={tableNumber}
//                                 placeholder="0"

//                                 onChange={(e) => setTableNumber(e.target.value)}
//                                 className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="fabricUsed">Fabric Used</label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 id="fabricUsed"
//                                 placeholder="0.00"
//                                 value={fabricUsed}
//                                 onChange={(e) => setFabricUsed(e.target.value || '')}
//                                 className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="grossAverage">Gross Average</label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 id="grossAverage"
//                                 placeholder="0.00"
//                                 value={grossAverage}
//                                 onChange={(e) => setGrossAverage(e.target.value)}
//                                 className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"

//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="layerStartDateTime">Layer Start DateTime</label>
//                             <input
//                                 type="datetime-local"
//                                 id="layerStartDateTime"
//                                 value={layerStartDateTime}
//                                 onChange={handleStartDateTimeChange}
//                                 max={currentDatetime}
//                                 className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
//                             />

//                         </div>
//                         <div>
//                             <label htmlFor="layerEndDateTime">Layer End DateTime</label>
//                             <input
//                                 type="datetime-local"
//                                 id="layerEndDateTime"
//                                 value={layerEndDateTime}
//                                 onChange={handleEndDateTimeChange}
//                                 className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
//                                 min={layerStartDateTime}
//                                 // max={currentDatetime}
//                                 disabled={!layerStartDateTime}
//                             />

//                         </div>
//                         <div>
//                             <label htmlFor="layerCutStart">Layer Cut Start</label>
//                             <input
//                                 type="datetime-local"
//                                 id="layerCutStart"
//                                 value={layerCutStart}
//                                 onChange={handleCutStartDateTimeChange}
//                                 className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
//                                 min={layerEndDateTime}
//                                 // max={currentDatetime}
//                             />

//                         </div>
//                         <div>
//                             <label htmlFor="layerCutEnd">Layer Cut End</label>
//                             <input
//                                 type="datetime-local"
//                                 id="layerCutEnd"
//                                 value={layerCutEnd}
//                                 onChange={handleCutEndDateTimeChange}
//                                 className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
//                                 min={layerCutStart}
//                                 // max={currentDatetime}
//                                 disabled={!layerCutStart}
//                             />

//                         </div>




//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-5 gap-4 mb-3">
//                         <div className="form-group">
//                             <label className="block text-sm font-normal mb-1">Plies</label>
//                             <input
//                                 type="number"
//                                 className="border border-gray-300 w-full rounded-md p-2 pl-3"
//                                 value={plies}
//                                 onChange={(e) => setPlies(Number(e.target.value) || "")}
//                                 onFocus={(e) => e.target.value === "0" && setPlies("")}
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label className="block text-sm font-normal mb-2">No of PCS Cut</label>
//                             <input
//                                 type="text"
//                                 className="border border-gray-300 w-full rounded-md p-2"
//                                 value={totalCutPcs}
//                                 readOnly
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="colorData">Cutting Type</label>
//                             <Select
//                                 options={cuttingtypeOptions}
//                                 value={selectedcuttingtype}
//                                 onChange={setSelectedCuttingtype}
//                                 placeholder="Select cutting type"
//                                 className="w-full border-2 border-gray-300 rounded-md"
//                                 isSearchable
//                                 isLoading={!cuttingtypeOptions.length}
//                                 loadingMessage={() => <Skeleton count={5} />}
//                                 isClearable
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         height: '40px',
//                                         fontSize: '12px',
//                                         borderColor: '#d1d5db', // Light gray border color
//                                     }),
//                                 }}
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label className="block text-sm font-medium mb-2">Delivery Dates</label>
//                             <Select
//                                 closeMenuOnSelect={false}
//                                 components={animatedComponents}
//                                 options={deliveryDate}

//                                 onChange={handleDeliveryDateChange}
//                                 className="border border-gray-300 rounded-md"
//                                 placeholder="Delivery Dates"
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         borderColor: '#d1d5db',
//                                         boxShadow: 'none',
//                                         fontSize: '12px',
//                                         width: '100%',
//                                         '&:hover': {
//                                             borderColor: '#d1d5db',
//                                         },
//                                     }),
//                                 }}
//                             />
//                         </div>

//                         <div className="flex flex-wrap mb-2 ">
//                             {(selectedDeliveryDates.length > 0) ? (selectedDeliveryDates.map((date, index) => (
//                                 <div key={index} className="h-8 bg-gray-200 rounded px-1 py-1 m-1 flex items-center">
//                                     {date.label}
//                                     <button
//                                         type="button"
//                                         className="ml-2 text-red-500"
//                                         onClick={() => removeDeliveryDate(index)}
//                                     >
//                                         &times;
//                                     </button>
//                                 </div>
//                             ))) : (<div className='h-8  bg-gray-200 rounded px-2 py-1 m-1 flex items-center'>
//                                 Select delivery date <button type="button" className="ml-2 text-red-500"> &times;
//                                 </button></div>)}
//                         </div>
//                     </div>

//                     {/* =============================================== Second form starting  ========================================= */}

//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-4">
//                         <div className="form-group">
//                             <label className="block text-sm font-medium mb-2">Select Sizes</label>
//                             <div className="flex flex-wrap mb-2">
//                                 {(selectedSizes.length > 0) ? (selectedSizes.map((size, index) => (
//                                     <div key={index} className="inline-block bg-gray-200 rounded px-2 py-1 m-1 flex items-center">
//                                         {size.label}
//                                         <button
//                                             type="button"
//                                             className="ml-2 text-red-500"
//                                             onClick={() => removeSize(index)}
//                                         >
//                                             &times;
//                                         </button>
//                                     </div>
//                                 ))) : (<div className='bg-gray-200 rounded px-2 py-1 m-1 flex items-center'>
//                                     Select a size <button type="button" className="ml-2 text-red-500"> &times;
//                                     </button></div>)}
//                             </div>
//                             <Select
//                                 closeMenuOnSelect={false}
//                                 components={animatedComponents}
//                                 options={availableSizeOptions}
//                                 onChange={handleSizeChange}
//                                 className="border border-gray-300 rounded-md"
//                                 placeholder="Select Sizes"
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         borderColor: '#d1d5db',
//                                         boxShadow: 'none',
//                                         fontSize: '12px',
//                                         width: '100%',
//                                         '&:hover': {
//                                             borderColor: '#d1d5db',
//                                         },
//                                     }),
//                                 }}
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label className="block text-sm font-medium mb-2">Ratio</label>
//                             <div className="flex flex-wrap mb-1">
//                                 {(selectedRatios.length > 0) ? (selectedRatios.map((ratio, index) => (
//                                     <div key={index} className="inline-block bg-gray-200 rounded px-2 py-1 m-1 flex items-center">
//                                         {ratio.label}
//                                         <button
//                                             type="button"
//                                             className="ml-2 text-red-500"
//                                             onClick={() => removeRatio(index)}
//                                         >
//                                             &times;
//                                         </button>
//                                     </div>
//                                 ))) : ((<div className='bg-gray-200 rounded px-2 py-1 m-1 flex items-center'>
//                                     Select a Ratio <button type="button" className="ml-2 text-red-500"> &times;
//                                     </button></div>))}
//                             </div>
//                             <Select
//                                 closeMenuOnSelect={false}
//                                 components={animatedComponents}
//                                 options={ratioOptions}
//                                 onChange={handleRatioChange}
//                                 className="border border-gray-300 rounded-md"
//                                 placeholder="Select Ratios"
//                                 styles={{
//                                     control: (provided) => ({
//                                         ...provided,
//                                         borderColor: '#d1d5db',
//                                         boxShadow: 'none',
//                                         width: '100%',
//                                         fontSize: '12px',
//                                         '&:hover': {
//                                             borderColor: '#d1d5db',
//                                         },
//                                     }),
//                                 }}
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label className="block text-sm font-medium mb-2">Size Wise Breakup</label>
//                             <div className="border border-gray-300 w-full rounded-md p-2">
//                                 {sizeWiseBreakup.length > 0 ? (
//                                     <ul className="flex justify-start items-center">
//                                         {sizeWiseBreakup.map((item, index) => (
//                                             <li key={index} className="ml-3">
//                                                 {item.size}: {item.quantity}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p>No data available</p>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="text-center mt-8 ml-4">
//                             <button
//                                 type="submit" id="submitbtn"
//                                 className="w-36 bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700"
//                             >
//                                 Save
//                             </button>
//                             <div id="vldmsg" className="w-full h-8 flex justify-center font-bold text-red-600">
//                                 !Cutpcs Quantity is less then orderQuantity
//                             </div>
//                         </div>
//                         {/* <div className="mt-3"><ResetForm data ={array} /></div> */}
//                     </div>
//                 </form>
//             </div>

//         </>
//     );
// };
// export default CuttingEntryForm;
