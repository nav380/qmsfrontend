import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import DjangoConfig from '../../config/Config';
import 'tailwindcss/tailwind.css';
import { Input } from "@material-tailwind/react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const AuditPage = () => {
  const [buyerList, setBuyerList] = useState([]);
  const [refData, setRefData] = useState([]);
  const [styleNoData, setStyleNoData] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [floorData, setFloorData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedAuditType, setSelectedAuditType] = useState(null);
  const [selectedRef, setSelectedRef] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oldAuditList, setOldAuditList] = useState([]);
  const [DisabledOldAudit, setDisabledOldAudit] = useState(true);
  const [selectedAuditNumber, setSelectedAuditNumber] = useState(null);
  const [reAuditNumber, setReAuditNumber] = useState(null);
  const [selectedReAuditNumber, setSelectedReAuditNumber] = useState(null);
  const [colorData, setColorData] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState('');
  const [ExQuantity, setExQuantity] = useState('');
  const [pcsReceived, setPcsReceived] = useState(0);
  const [IssuedQty, setIssuedQty] = useState(0);
  const [sampleSize, setSampleSize] = useState('');
  const [sampleAccept, setSampleAccept] = useState('');
  const [hourData, setHourData] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [supervisorData, setSupervisorData] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [qaData, setQaData] = useState('');
  const [selectedQa, setSelectedQa] = useState(null);
  const [checkerData, setCheckerData] = useState([]);
  const [selectedChecker, setSelectedChecker] = useState(null);
  const [passCounterData, setPassCounter] = useState(0);
  const [failCounter, setFailCounter] = useState(0);
  const [defectTypeList, setDefectTypeList] = useState([]);
  const [operationTypeList, setOperationTypeList] = useState([]);
  const [pcsCheckedCounter, setPcsCheckedCounter] = useState(0);
  const [passDisabled, setPassDisabled] = useState(true);
  const [failDisabled, setFailDisabled] = useState(true);
  const [finalFailData, setFinalFailData] = useState([]);
  const [totalCounter, setTotalCounter] = useState('');
  const [finalPassDisabled, setFinalPassDisabled] = useState(true);
  const [finalFailDisabled, setFinalFailDisabled] = useState(true);
  const [comment, setComment] = useState('');
  // const [venderType,setVenderType] = useState('');
  const [selectedVenderType, setSelectedVenderType] = useState(null);
  const [selectedDefectType, setSelectedDefectType] = useState([]);
  const [selectedOperationsList, setSelectedOperationsList] = useState([]);
  const [section, setSection] = useState(0);
  const [size, setSize] = useState(null);
  const [auditTypeFinOrSewing, setAuditTypeFinOrSewing] = useState('');
  const [processID, setProcessID] = useState(0);
  const [auditPcs, setAuditPcs] = useState(0)
  const [auditListDisabled, setAuditListDisabled] = useState(true);
  const [helpButton, setHelpButton] = useState(true);
  const [auditNumberID, setAuditNumberID] = useState(0);
  const navigate = useNavigate();


  const { type, id,pid,audit_no_id } = useParams();

  const auditTypeOptions = [
    { value: 'Fresh', label: 'Fresh' },
    { value: 'Re-audit', label: 'Re-audit' },
  ];

  const venderTypeOptions = [
    { value: '1', label: 'In-House' },
    { value: '2', label: 'Out-House' },
    { value: '3', label: 'PCS-Rate' },

  ]

  useEffect(() => {
    if (selectedColor) {
      setHelpButton(false);
    }
    else{
      setHelpButton(true);
    }
   },[selectedColor])

   useEffect(() => {
    setSection(id);
    setAuditTypeFinOrSewing(type);
    setProcessID(pid);
    setAuditNumberID(audit_no_id);
  }, [id, type, audit_no_id]);
   
  useEffect(() => {
    if (id && type && audit_no_id) {
      fetchDataOfAudit();
    }
  },[section,processID,auditNumberID])
  

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch units
        const unitResponse = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
          params: { call: 'get_unit' },
        });
        setUnitList(unitResponse.data.map(item => ({ value: item.payroll_code, label: item.name })));
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const closeModels = () => {
    document.getElementById('operation_type_model').close();
    document.getElementById('defect_type_model').close();
    setDefectTypeList([]);
    setOperationTypeList([]);
    setFinalFailData([]);
  }

  const fetchData = async () => {
    setIsLoading(true);
    const userData = {
      buyer_filter: selectedBuyer?.value || '',
      audit_filter: selectedAuditType?.value || '',
      ref_filter: selectedRef?.value || '',
      style_filter: selectedStyle?.value || '',
      unit_filter: selectedUnit?.value || '',
      floor_filter: selectedFloor?.value || '',
      line_filter: selectedLine?.value || '',
      old_audit_filter: selectedAuditNumber?.value || '',
      color_filter: selectedColor?.value || '',
      quantity_filter: quantity?.value || '',
      pcs_filter: pcsReceived?.value || '',
      issued_qty_filter: IssuedQty?.value || '',
      sample_size_filter: sampleSize?.value || '',
      sample_accept_filter: sampleAccept?.value || '',
      hour_filter: selectedHour?.value || '',
      product_filter: selectedProduct?.value || '',
      supervisor_filter: selectedSupervisor?.value || '',
      qa_filter: selectedQa?.value || '',
      checker_filter: selectedChecker?.value || '',
      defect_type_filter: selectedDefectType?.value || '',
      vender_type_filter: selectedVenderType?.value || '',

    };
    setIsLoading(false);
  };

  // fetch floor data
  const fetchFloorData = async (unit) => {
    if (!unit) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_floor',
          unit_filter: unit.value,
        },
      });

      setFloorData(response.data.map(floor => ({ value: floor.floor_id, label: floor.floor_name })));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchFloorData(3);
  }, []);

  // fetch buyer data
  const fetchBuyerData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_buyer',
          line_id: selectedLine?.value,
          section_id: section,
          process_id: processID,
          audit_type: auditTypeFinOrSewing
        },
      });
      setBuyerList(response.data.map(buyer => ({ value: buyer.buyer, label: buyer.buyer_name })));
    } catch (error) {
    }
    finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBuyerData();
  }, [selectedLine, selectedUnit]);

  // Fetch old Audit List
  const fetchOldAuditList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: { call: 'get_old_audit_list', section_id: section, process_id: processID },
      });
      // setOldAuditList(response.data.map(audit => ({ value: audit.audit_no, label: audit.audit_no })));
      setReAuditNumber(response.data.map(audit => ({ value: audit.audit_no, label: audit.audit_no })));
    } catch (error) {
    }
    finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (section && processID) {
      // Call the function only when section and processID are available
      fetchOldAuditList();
    }
  }, [section, processID]);

  // fetch line data
  const fetchLineData = async (floor) => {
    if (!floor) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_line',
          floor_filter: floor.value,
        },
      });

      setLineData(response.data.map(line => ({ value: line.line_id, label: line.line_name })));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchLineData(selectedFloor);
  }, [selectedFloor]);

  // fetch style data
  const fetchStyles = async (buyer) => {
    if (!buyer) return;
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_style',
          buyer_filter: buyer.value,
          unit_id: selectedUnit?.value || '',
          line_id: selectedLine?.value || '',
          section_id: section
        }
      });
      if (response.data) {
        const uniqueStyles = [...new Set(response.data.map(item => item.style))];
        setStyleNoData(uniqueStyles.map(style => ({ value: style, label: style })));
      }
    } catch (error) {
    }
  }
  useEffect(() => {
    if (selectedBuyer) fetchStyles(selectedBuyer);
  }, [selectedBuyer]);

  // fetch ref data
  const fetchRefData = async (buyer, style) => {
    if (!buyer || !style) return;
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_ref',
          buyer_filter: buyer.value,
          style_filter: style.value,
          line_id: selectedLine.value || '',
          unit_id: selectedUnit.value || '',
          section_id: section,

        }
      });
      setRefData(response.data.map(ref => ({ value: ref.ourref, label: ref.ourref })));
    } catch (error) {
    }
  };
  useEffect(() => {
    if (selectedBuyer && selectedStyle) {
      fetchRefData(selectedBuyer, selectedStyle);
    }
  }, [selectedBuyer, selectedStyle]);

  // fetch color data
  const fetchColorData = async (buyer, style, ref) => {
    if (!buyer || !style || !ref) return;
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_color',
          buyer_filter: buyer.value,
          style_filter: style.value,
          ref_filter: ref.value,
          line_id: selectedLine.value || '',
          section_id: section,

        }
      });
      setColorData(response.data.map(color => ({ value: color.color, label: color.color })));
    } catch (error) {
    }
  };
  useEffect(() => {
    if (selectedBuyer && selectedStyle && selectedRef) {
      fetchColorData(selectedBuyer, selectedStyle, selectedRef);
    }
  }, [selectedBuyer, selectedStyle, selectedRef]);

  // fetch issued QTY
  const fetchIssuedQTY = async (buyer, style, ref, color) => {
    if (!buyer || !style || !ref || !color) return;
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_issued_qty',
          buyer_id: selectedBuyer.value,
          line_id: selectedLine.value,
          style_id: selectedStyle.value,
          ref_id: selectedRef.value,
          color_id: selectedColor.value,
          process_id: processID,
          section_id: section,
        }
      });
      console.log('thjois jkhskjhs', response.data);
      // setIssuedQty(response.data);
      setIssuedQty(response.data.issued_qty);
      setAuditPcs(response.data.total_QTY)

    } catch (error) {
      console.error('Error fetching issued QTY:', error);
    }

  }

  useEffect(() => {
    if (selectedBuyer && selectedStyle && selectedRef && selectedColor) {
      fetchIssuedQTY(selectedBuyer, selectedStyle, selectedRef, selectedColor);
    }
  }, [selectedBuyer, selectedStyle, selectedRef, selectedColor]);


  // fetch Quantity Data
  const fetchQuantityData = async (buyer, style, ref, color) => {
    if (!buyer || !style || !ref || !color) return;
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_qty',
          buyer_filter: buyer.value,
          style_filter: style.value,
          ref_filter: ref.value,
          color_filter: color.value
        }
      });
      setQuantity(response.data.qty); // Assuming the response has a `qty` field
      setExQuantity(response.data.ex_qty);
    } catch (error) {
    }
  };
  useEffect(() => {
    if (selectedBuyer && selectedStyle && selectedRef && selectedColor) {
      fetchQuantityData(selectedBuyer, selectedStyle, selectedRef, selectedColor);
    }
  }, [selectedBuyer, selectedStyle, selectedRef, selectedColor]);

  const fetchSampleData = async (pcsReceivedValue, buyerValue) => {
    if (!pcsReceivedValue || !buyerValue) return;
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_sample',
          buyer_filter: buyerValue,
          pcs_filter: pcsReceivedValue,
          audit_type: processID
        }
      });
      setSampleSize(response.data.sample);
      setSampleAccept(response.data.accept);
    } catch (error) {
    }
  };
  useEffect(() => {
    if (selectedBuyer && pcsReceived) {
      fetchSampleData(pcsReceived, selectedBuyer.value); // Use the selectedBuyer’s value property
    }
  }, [selectedBuyer, pcsReceived]);

  // Fetch Hour Data
  const fetchHourData = async () => {
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_hour',
        },
      });
      setHourData(response.data.map(hour => ({ value: hour.ID, label: hour.HOUR_NAME })));
    }
    catch (error) {
    }
  };

  useEffect(() => {
    fetchHourData();
  }, []);

  // Fetch Product Data
  const fetchProductData = async () => {
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_product',
        },
      });
      setProductData(response.data.map(product => ({ value: product.id, label: product.name })));
    }
    catch (error) {
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  // Fetch supervisor data 
  const fetchSupervisorData = async () => {
    const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
      params: {
        call: 'get_supervisor',
        unit_id: selectedUnit?.value || null,
      },
    })
    setSupervisorData(response.data.map(supervisor => ({ value: supervisor.emp_paycode, label: supervisor.emp_name })));
  };
  useEffect(() => {
    fetchSupervisorData();
    fetchQaData();
    fetchCheckerData();
  }, []);

  // fetch QA data 
  const fetchQaData = async () => {
    const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
      params: {
        call: 'get_qa',
        unit_id: selectedUnit?.value || null,
      },
    })
    setQaData(response.data.map(qa => ({ value: qa.emp_paycode, label: qa.emp_name })));
  };

  // fetch checker data
  const fetchCheckerData = async () => {
    const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
      params: {
        call: 'get_checker',
        unit_id: selectedUnit?.value || null,
      },
    })
    setCheckerData(response.data.map(checker => ({ value: checker.emp_paycode, label: checker.emp_name })));
  };

  // Fetch Default Data 
  const fetchDefectData = async () => {
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_defect',
        },
      });
      setDefectTypeList(response.data);
    }
    catch (error) {
    }
  }
  useEffect(() => {
    fetchDefectData();
  }, []);

  const FetchOperationData = async () => {
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_operation',
        },
      });
      setOperationTypeList(response.data);
    }
    catch (error) {
    }
  }
  useEffect(() => {
    FetchOperationData();
  }, []);

  const checkFields = () => {
    if (selectedAuditType && selectedUnit && selectedFloor && selectedLine && selectedBuyer && selectedStyle && selectedRef && selectedColor && quantity && pcsReceived && IssuedQty && selectedHour && selectedProduct && selectedSupervisor && selectedQa && selectedChecker) {
      document.getElementById('passCounter').disabled = false;
      setPassDisabled(false);
      setFailDisabled(false);
    }
    else {
      setPassDisabled(true);
      setFailDisabled(true);
    }
  }

  const CheckPcsRecQty = (newPcsReceived) => {
    const pcsRec = parseFloat(newPcsReceived);
    const issued_qty = parseFloat(auditPcs);

    if (pcsRec >= issued_qty) {
      setPcsReceived(issued_qty);
    } else {
      setPcsReceived(pcsRec);
    }
  };

  useEffect(() => {
    checkFields();
    totalCounterCheck();

    handleFinalFailCountButton();
  })

  const handlePassButton = () => {
    if (selectedAuditType && selectedUnit && selectedFloor && selectedLine && selectedBuyer && selectedStyle && selectedRef && selectedColor && quantity && pcsReceived && IssuedQty && selectedHour && selectedProduct && selectedSupervisor && selectedQa && selectedChecker) {
      saveFinalData('Pending');
      setPassCounter(passCounterData + 1);
    }
    else {
      toast.error('Please fill in all required fields.');
    }
  };

  const handleFailButton = () => {
    if (selectedAuditType && selectedUnit && selectedFloor && selectedLine && selectedBuyer && selectedStyle && selectedRef && selectedColor && quantity && pcsReceived && IssuedQty && selectedHour && selectedProduct && selectedSupervisor && selectedQa && selectedChecker) {
      document.getElementById('defect_type_model').showModal()
    }
    else {
      toast.error('Please fill in all required fields.');
    }
  };

  const checkAllPass = () => {
    var passCount = passCounterData
    var failCount = failCounter
    var totalCount = passCount + failCount
    if (passCount === totalCount) {
      setFinalFailDisabled(true);
    }
  }

  const enableFinalFailButton = () => {
    if (sampleAccept <= failCounter) {
      setFinalFailDisabled(false);
    }
  };

  useEffect(() => {
    enableFinalFailButton();
    checkAllPass();
  })

  const handleFinalFailCountButton = () => {
    var sampleAcpt = sampleAccept || 0
    var failCount = failCounter || 0
    if (sampleAcpt < failCount) {
      setFinalPassDisabled(true);
    }
  }

  const totalCounterCheck = () => {
    var passCount = passCounterData
    var failCount = failCounter
    var totalCount = passCount + failCount
    setTotalCounter(totalCount)
    setPcsCheckedCounter(totalCount)
    if (totalCount === sampleSize) {
      setPassDisabled(true);
      setFailDisabled(true);
      setFinalFailDisabled(false);
      setFinalPassDisabled(false);
    }
    else {
      setFinalFailDisabled(true);
      setFinalPassDisabled(true);
    }
  }

  const resetForm = () => {
    // setSelectedAuditType(null);
    setSelectedAuditNumber(null);
    setSelectedUnit(null);
    setSelectedFloor(null);
    setSelectedLine(null);
    setSelectedBuyer(null);
    setSelectedStyle(null);
    setQuantity(0);
    setAuditPcs(0);
    setExQuantity(0);
    setSelectedRef(null);
    setSelectedColor(null);
    setQuantity(0);
    setPcsReceived(0);
    setIssuedQty(0);
    setSampleSize(0);
    setSampleAccept(0);
    setPcsCheckedCounter(0);
    setSelectedHour(null);
    setSelectedProduct(null);
    setSelectedSupervisor(null);
    setSelectedQa(null);
    setSelectedChecker(null);
    setComment('');
    setPassCounter(0);
    setFailCounter(0);
    setFailData([]);
    setFinalFailData([]);
    setFinalPassData([]);
    setPassDisabled(true);
    setFailDisabled(true);
    setFinalFailDisabled(true);
    setFinalPassDisabled(true);
  };

  const resetFields = () => {
    setStyleNoData(null);
    setSelectedStyle(null);
    setRefData(null);
    setSelectedRef(null);
    setColorData(null);
    setSelectedColor(null);
    setQuantity(0);
    setPcsReceived(0);
    setIssuedQty(0);
    setSampleSize(0);
    setSampleAccept(0);
    setExQuantity('')
    setAuditPcs('')
  }

  // Function to handle defect selection
  const handleDefectModelSelection = (defect) => {
    setSelectedDefectType((prev) => [...prev, defect.id]); // Collect only defect IDs
  };

  // Function to handle operation selection
  const handleOperationSelection = (operation) => {
    setSelectedOperationsList((prev) => [...prev, operation.id]); // Collect only operation IDs
  };


  const addFinalFailData = () => {
    const newEntry = {
      oid: selectedOperationsList,
      did: selectedDefectType, 
      counter: failCounter, 
    };

    setFinalFailData((prevData) => [...prevData, newEntry]); 
  };

  // Function to close defect model and move to operation selection
  const closeDefectModel = () => {
    document.getElementById('defect_type_model').close();
    document.getElementById('operation_type_model').showModal();
  };

  // Function to close operation model and save data
  const closeOperationModel = () => {
    document.getElementById('operation_type_model').close();
    addFinalFailData();
    setFailCounter(failCounter + 1);
    saveFinalData('Pending');
    setSelectedOperationsList([]); // Reset operations after saving
    setSelectedDefectType([]); // Reset defects after saving
  };

  // Call this when saving defect data
  const saveDefectData = () => {
    closeDefectModel();
  };

  // Call this when saving operation data
  const saveOperationData = () => {
    closeOperationModel();
  };

  const saveFinalData = async (val) => {
    const auditTypeAT = selectedAuditType?.value || 'NULL';
    const auditNumAN = selectedAuditNumber?.value || 'NULL';
    const re_audit_no = selectedReAuditNumber?.value || 'NULL';
    const unitU = selectedUnit?.value || 'Unit 1';
    const floorF = selectedFloor?.value || 'Floor 1';
    const lineL = selectedLine?.value || 'Line 1';
    const buyerB = selectedBuyer?.value || 'Buyer 1';
    const styleS = selectedStyle?.value || 'Style 1';
    const refR = selectedRef?.value || 'Ref 1';
    const colorC = selectedColor?.value || 'Color 1';
    const quantityQ = quantity || 0;
    const pcsReceivedP = pcsReceived || 0;
    const issuedQtyI = IssuedQty || 0;
    const sampleSizeS = sampleSize || 0;
    const sampleAcceptS = sampleAccept || 0;
    const pcsChecked = pcsCheckedCounter || 0;
    const hourH = selectedHour.value;
    const productP = selectedProduct?.value || 'Product 1';
    const supervisorS = selectedSupervisor?.value || 'Supervisor 1';
    const qaQ = selectedQa?.value || 'QA 1';
    const checkerC = selectedChecker?.value || 'Checker 1';
    const commentC = comment || 'Comment 1';
    const finalResult = val || 'NULL';
    const process_id = processID || 'NULL';
    const pass_counter = passCounterData || 0;
    const fail_counter = failCounter || 0;
    const fail_data = finalFailData || [];
    const ex_order_qty = ExQuantity || 0;
    const sizeValue = size?.value || 'NULL';
    const sectionValue = section || 0;
    const TypeOfAudit = auditTypeFinOrSewing || 'NULL';

    try {
      const response = await axios.post(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        audit_type: auditTypeAT,
        audit_num: auditNumAN,
        re_audit_no: re_audit_no,
        unit: unitU,
        floor: floorF,
        line: lineL,
        buyer: buyerB,
        style: styleS,
        ref: refR,
        color: colorC,
        quantity: quantityQ,
        pcs_received: pcsReceivedP,
        issued_qty: issuedQtyI,
        sample_size: sampleSizeS,
        sample_accept: sampleAcceptS,
        pcs_checked: pcsChecked,
        hour: hourH,
        size: sizeValue,
        product: productP,
        supervisor: supervisorS,
        qa: qaQ,
        section_id: sectionValue,
        checker: checkerC,
        comment: commentC,
        call: 'save_final_data',
        fail_data: finalFailData,
        final_result: finalResult,
        pass_data: pass_counter,
        fail_counter: fail_counter,
        pass_counter: pass_counter,
        TypeOfAudit: TypeOfAudit,
        ex_order_qty: ex_order_qty,
        process_id: process_id
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setSelectedAuditNumber({ value: response.data.audit_number, label: response.data.audit_number });
        setAuditListDisabled(false);
        var final_result = response.data.final_result
        if (final_result === 'Pass' || final_result === 'Fail') {
          window.location.refresh()
        }
      } else {
        toast.error(response.data.error || 'An unexpected error occurred.');
      }
    } catch (error) {
    }
  };
  const checkIfPendingDataExists = async () => {
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'check_if_pending_data_exists',
          unit_id: selectedUnit?.value || null,
          line_id: selectedLine?.value || null,
          floor_id: selectedFloor?.value || null,
        },
      });
  
      if (response && Array.isArray(response.data) && response.data.length > 0) {
        const data = response.data[0];
  
        setQuantity(data.order_qty || 0);
        setExQuantity(data.ex_order_qty || 0);
        setIssuedQty(data.issued_qty || 0);
        setPcsReceived(data.pcs_received || 0);
        setSampleSize(data.sample_size || 0);
        setSampleAccept(data.sample_accept || 0);
        setPcsCheckedCounter(data.pcs_checked || 0);
        setSection(data.section_id || '');
        setProcessID(data.process_id || '');
        setPassCounter(data.pass_counter || 0);
        setFailCounter(data.fail_counter || 0);
        setSelectedAuditNumber({ value: data.audit_no, label: data.audit_no });
  
        productData.forEach((product) => {
          if (String(product.value).trim() === String(data.product)?.trim()) {
            setSelectedProduct({ value: product.value, label: product.label });
          }
        });
  
        hourData.forEach((hour) => {
          if (parseFloat(hour.value) === parseFloat(data.hours)) {
            setSelectedHour({ value: hour.value, label: hour.label });
          }
        });
  
        supervisorData.forEach((supervisor) => {
          if (supervisor.value.trim() === data.supervisor?.trim()) {
            setSelectedSupervisor({ value: supervisor.value, label: supervisor.label });
          }
        });
  
        qaData.forEach((qa) => {
          if (qa.value.trim() === data.qa?.trim()) {
            setSelectedQa({ value: qa.value, label: qa.label });
          }
        });
  
        checkerData.forEach((checker) => {
          if (checker.value.trim() === data.checker?.trim()) {
            setSelectedChecker({ value: checker.value, label: checker.label });
          }
        });
  
        unitList.forEach((unit) => {
          if (unit.value.trim() === data.unit?.trim()) {
            setSelectedUnit({ value: unit.value, label: unit.label });
          }
        });
  
      }
    } catch (error) {
    }
  };
  
  useEffect(() => {
    checkIfPendingDataExists();
  }, [selectedUnit, selectedLine, selectedFloor]);

  // useEffect(() => {
  //   // Clear the buyer when the selected line changes
  //   setSelectedBuyer(null);
  //   setSelectedStyle(null);
  //   setSelectedRef(null);
  //   setSelectedColor(null);
  // }, [selectedLine]);

  const getReAuditData = async (value) => {
    const auditTypeAT = selectedAuditType ? selectedAuditType.value : 'NULL';
    const auditNumAN = value ? value.value : 'NULL';

    if (auditTypeAT === 'NULL' || auditTypeAT === 'Fresh' || auditNumAN === 'NULL') {
      return;
    }

    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_re_audit_data',
          audit_type: auditTypeAT,
          audit_num: auditNumAN,
        },
      });

      if (response?.data?.length > 0) {
        const data = response.data[0]; // Access the first data entry

        setSelectedBuyer({ value: data.buyer, label: data.buyer_name });
        setSelectedStyle({ value: data.style, label: data.style });
        setSelectedRef({ value: data.order_no, label: data.order_no });
        setSelectedColor({ value: data.color, label: data.color });
        setIssuedQty(data.issued_qty);
        setSelectedLine({ value: data.line, label: data.line_name });
        setSection(data.section_id);
        setPcsReceived(data.pcs_received);
        floorData.forEach((floor) => {
          if (String(floor.value).trim() === String(data.floors).trim()) {
            setSelectedFloor({ value: floor.value, label: floor.label });
          }
        });

        productData.forEach((product) => {
          if (String(product.value).trim() === String(data.product)?.trim()) {
            setSelectedProduct({ value: product.value, label: product.label });
          }
        })

        hourData.forEach((hour) => {
          if (parseFloat(hour.value) === parseFloat(data.hours)) {
            setSelectedHour({ value: hour.value, label: hour.label });
          }
        });

        supervisorData.forEach((supervisor) => {
          if (supervisor.value.trim() === data.supervisor?.trim()) {
            setSelectedSupervisor({ value: supervisor.value, label: supervisor.label });
          }
        });

        qaData.forEach((qa) => {
          if (qa.value.trim() === data.qa?.trim()) {
            setSelectedQa({ value: qa.value, label: qa.label });
          }
        });

        checkerData.forEach((checker) => {
          if (checker.value.trim() === data.checker?.trim()) {
            setSelectedChecker({ value: checker.value, label: checker.label });
          }
        });

        unitList.forEach((unit) => {
          if (unit.value.trim() === data.unit?.trim()) {
            setSelectedUnit({ value: unit.value, label: unit.label });
          }
        });

        productData.forEach((product) => {
          if (product.value === data.product) {
            setSelectedProduct({ value: product.value, label: product.label });
          }
        });

      } else {
        // toast.error(response.data?.error || 'No data found');
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (selectedReAuditNumber && selectedAuditType.value === 'Re-audit') {
      getReAuditData(selectedReAuditNumber);
    }
  }, [selectedReAuditNumber,selectedAuditType]);


  const checkReAuditList = async () => {
    if (!selectedAuditNumber){
      return;
    }
    if (selectedAuditType.value === 'Re-audit') {
      setDisabledOldAudit(false);
      setAuditListDisabled(true);
    }
  }
  useEffect(() => {
    checkReAuditList();
  }, [selectedAuditType]);
 
  const fetchDataOfAudit = async () => {
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_audit_data',
          audit_no_id: auditNumberID,
          process_id: processID,
          section_id: section,
        },
      });
  
      if (response && response.data) {
        const data = response.data[0];
        const audit_type = data.audit_type;
        const final_result = data.final_result;
        const num = data.audit_no;
        console.log('all data:', data, 'audit_type:', audit_type, 'final_result:', final_result, 'audit_no:', num);
  
        // Handle 'Fresh' cases
        if (audit_type === 'Fresh' && final_result === 'Pending') {
          console.log('Handling: Fresh - Pending');
          setAuditListDisabled(false);
          setSelectedAuditType({ value: 'Fresh', label: 'Fresh' });
          setSelectedAuditNumber({ value: num, label: num });
          // getPendingAuditData(num);
          setSelectedBuyer({ value: data.buyer, label: data.buyer_name });
          setSelectedColor({ value: data.color, label: data.color });
          setSelectedRef({ value: data.order_no, label: data.order_no });
          setSelectedStyle({ value: data.style, label: data.style });
          setPcsReceived(data.pcs_received);
          setIssuedQty(data.issued_qty)
          setPassCounter(data.pass_counter);
          setFailCounter(data.fail_counter);

          productData.forEach((product) => {
              if (String(product.value).trim() === String(data.product)?.trim()) {
                  setSelectedProduct({ value: product.value, label: product.label });
              }
          });
      
          hourData.forEach((hour) => {
              if (parseFloat(hour.value) === parseFloat(data.hours)) {
                  setSelectedHour({ value: hour.value, label: hour.label });
              }
          });
      
          supervisorData.forEach((supervisor) => {
              if (supervisor.value.trim() === data.supervisor?.trim()) {
                  setSelectedSupervisor({ value: supervisor.value, label: supervisor.label });
              }
          });
      
          qaData.forEach((qa) => {
              if (qa.value.trim() === data.qa?.trim()) {
                  setSelectedQa({ value: qa.value, label: qa.label });
              }
          });
      
          checkerData.forEach((checker) => {
              if (checker.value.trim() === data.checker?.trim()) {
                  setSelectedChecker({ value: checker.value, label: checker.label });
              }
          });
      
          unitList.forEach((unit) => {
              if (unit.value.trim() === data.unit?.trim()) {
                  setSelectedUnit({ value: unit.value, label: unit.label });
              }
          });

          floorData.forEach((floor) => {
            if (floor.value.trim() === data.floor?.trim()) {
              setSelectedFloor({ value: floor.value, label: floor.label });
            }
          })
          

        
        } else if (audit_type === 'Fresh' && final_result === 'Fail') {
          console.log('Handling: Fresh - Fail');
          setSelectedAuditType({ value: 'Re-audit', label: 'Re-audit' });
          setSelectedReAuditNumber({ value: num, label: num });
          setDisabledOldAudit(false);
          getReAuditData(num);
        }
  
        // Handle 'Re-audit' cases
        if (audit_type === 'Re-audit' && final_result === 'Fail') {
          console.log('Handling: Re-audit - Fail');
          setSelectedAuditType({ value: 'Re-audit', label: 'Re-audit' });
          setSelectedReAuditNumber({ value: num, label: num });
          getReAuditData(num);
          setAuditListDisabled(false);
        } else if (audit_type === 'Re-audit' && final_result === 'Pending') {
          console.log('Handling: Re-audit - Pending');
          setSelectedAuditType({ value: 'Re-audit', label: 'Re-audit' });
          setSelectedAuditNumber({ value: num, label: num });
          getPendingAuditData(num);
          setDisabledOldAudit(false);
        }
      }
    } catch (error) {
      console.error('Error fetching audit data:', error);
    }
  };
  
  useEffect(() => {
    if (auditNumberID && processID && section) {
      fetchDataOfAudit();
      console.log('Section:', section, 'ProcessID:', processID);
    }
  }, [auditNumberID, processID, section]); 
  
  const getPendingAuditData = async (value) => {
    const auditTypeAT = selectedAuditType ? selectedAuditType.value : 'NULL';
    const auditNumAN = value ? value.value : 'NULL';  
    if (auditTypeAT === 'NULL' || auditTypeAT === 'Re-Audit' || auditNumAN === 'NULL') {
      return;
    }
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: {
          call: 'get_pending_audit_data',
          audit_type: auditTypeAT,
          audit_num: auditNumAN,
        },
      });
  
      if (response && response.data) {
        console.log(response.data)
        console.log(response.data.audit_details)
        setSelectedBuyer({ value: response.data.audit_details.buyer, label: response.data.audit_details.buyer_name });
        setSelectedUnit({ value: response.data.audit_details.unit, label: response.data.location_name });
        setSelectedFloor({ value: response.data.audit_details.floors, label: response.data.floor_name });
        setSelectedLine({ value: response.data.audit_details.line, label: response.data.line_name });
        setSelectedStyle({ value: response.data.audit_details.style, label: response.data.audit_details.style });
        setSelectedRef({ value: response.data.audit_details.order_no, label: response.data.audit_details.order_no });
        setSelectedColor({ value: response.data.audit_details.color, label: response.data.audit_details.color });
        setSelectedHour({ value: response.data.audit_details.hours, label: response.data.hours });
        setSelectedProduct({ value: response.data.audit_details.product, label: response.data.product_name });
        setQuantity(response.data.audit_details.order_qty);
        setExQuantity(response.data.audit_details.ex_order_qty);
        setIssuedQty(response.data.audit_details.issued_qty);
        setPcsReceived(response.data.audit_details.pcs_received);
        setSampleSize(response.data.audit_details.sample_size);
        setSampleAccept(response.data.audit_details.sample_accept);
        setPcsCheckedCounter(response.data.audit_details.pcs_checked);
        setSelectedSupervisor({ value: response.data.audit_details.supervisor, label: response.data.audit_details.supervisor });
        setSelectedQa({ value: response.data.audit_details.qa, label: response.data.audit_details.qa });
        setSelectedChecker({ value: response.data.audit_details.checker, label: response.data.audit_details.checker });
        setSection(response.data.audit_details.section);
        setPassCounter(response.data.audit_details.pass_counter);
        setFailCounter(response.data.audit_details.fail_counter);
  }
    } catch (error) {
    } 
  };

  // useEffect(() => {
  //   if (selectedAuditNumber && selectedAuditType.value === 'Fresh') {
  //     getPendingAuditData(selectedAuditNumber);
  //   }
  // }, [selectedAuditNumber,selectedAuditType]);

  return (
    <>
      <div className="p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className='text-2xl font-bold mb-4 '> {type} </h1>
          <div className='p-4 space-x-4'>
            <button
              className="btn btn-l w-20 font-bold"
              disabled={helpButton}
              onClick={() => navigate(`/dashboard/audit/help`, {
                state: {
                  selectedUnit,
                  selectedFloor,
                  selectedLine,
                  selectedBuyer,
                  selectedStyle,
                  selectedRef,
                  selectedColor,
                  section,
                  processID
                }
              })}
            >
              Help
            </button>
            <button
              className="btn btn-l w-20 font-bold" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </div>
        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <label className='label flex-col items-start'>
            <span className='label-text'>Select Audit Type</span>
            <Select
              options={auditTypeOptions}
              value={selectedAuditType}
              onChange={(value) => {
                setSelectedAuditType(value);
              }}
              className="w-full"
              isClearable
              noOptionsMessage={() => <Skeleton count={5} />}
            />
          </label>
          {!auditListDisabled && (
            <label className='label flex-col items-start'>
              <span className='label-text'> Audit Number</span>
              <Select
                options={oldAuditList}
                value={selectedAuditNumber}
                onChange={(value) => {
                  setSelectedAuditNumber(value);
                  getReAuditData(value);
                  // getPendingAuditData(value);
                }}
                className="w-full"
                isClearable
                noOptionsMessage={() => <Skeleton count={5} />}
              />
            </label>
          )}

          {!DisabledOldAudit && (
            <label className='label flex-col items-start'>
              <span className='label-text'>Re-Audit Numbers</span>
              <Select
                options={reAuditNumber}
                value={selectedReAuditNumber}
                onChange={(value) => {
                  setSelectedReAuditNumber(value);
                  getReAuditData(value);
                }}
                className="w-full"
                isClearable
                noOptionsMessage={() => <Skeleton count={5} />}
              />
            </label>
          )}
          {/* <Select
          options={venderTypeOptions}
          value={selectedVenderType}
          onChange={setSelectedVenderType}
          placeholder="Select Vendor Type"
          className="w-full"
          
          isClearable
          noOptionsMessage={() => <Skeleton count={5} />}
        /> */}
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Unit </span>
            <Select
              options={unitList}
              value={selectedUnit}
              onChange={(value) => {
                setSelectedUnit(value);
                fetchFloorData(value);
                resetFields();
              }}
              className="w-full"
              isClearable
              noOptionsMessage={() => <Skeleton count={5} />}
            />
          </label>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Floor </span>
            <Select
              options={floorData}
              value={selectedFloor}
              onChange={(value) => {
                setSelectedFloor(value);
                resetFields();
                setSelectedLine(null); // Reset line selection
              }}
              className="w-full"
              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
            />
          </label>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Line </span>
            <Select
              options={lineData}
              value={selectedLine}
              onChange={(value) => {
                setSelectedLine(value);
                resetFields();
                setSelectedBuyer(null);
              }}
              className="w-full"

              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
            />
          </label>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Buyer </span>
            <Select
              options={buyerList}
              value={selectedBuyer}
              onChange={(value) => {
                setSelectedBuyer(value);
                fetchData();
                resetFields();
              }}
              className="w-full"

              isClearable
              noOptionsMessage={() => <Skeleton count={5} />}
              isLoading={isLoading}
            />
          </label>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Style </span>
            <Select
              options={styleNoData}
              value={selectedStyle}
              onChange={setSelectedStyle}
              className="w-full"

              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
              isLoading={isLoading}
            />
          </label>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Ref </span>
            <Select
              options={refData}
              value={selectedRef}
              onChange={(value) => {
                setSelectedRef(value);
                fetchData();
              }}
              className="w-full"

              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
              isLoading={isLoading}
            />
          </label>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Color </span>
            <Select
              options={colorData}
              value={selectedColor}
              onChange={setSelectedColor}
              className="w-full"

              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
              isLoading={isLoading}
            />
          </label>
          <div className="relative">
            <label className='label flex-col items-start'>
              <span className='label-text'> Order QTY </span>
              <Input
                type="number"
                color="blue"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                readOnly
                className="relative bg-white"
              />
            </label>
          </div>

          <div className="relative">
            <label className='label flex-col items-start'>
              <span className='label-text'> Ex Order QTY </span>
              <Input
                type="number"
                color="blue"
                value={ExQuantity}
                onChange={(e) => setExQuantity(e.target.value)}
                readOnly
                className="relative bg-white"
              />
            </label>
          </div>


          <div className="relative">
            <label className='label flex-col items-start'>
              <span className='label-text'> Issued QTY </span>
              <Input
                type="number"
                color="blue"
                value={IssuedQty}
                readOnly
                className="relative bg-white"
              />
            </label>
          </div>
          <div className="relative">
            <label className='label flex-col items-start'>
              <span className='label-text'> Audit Pcs Balance </span>
              <Input
                type="number"
                color="blue"
                value={auditPcs}
                // onChange={(e) => setIssuedQty(e.target.value)}
                readOnly
                className="relative bg-white"
              />
            </label>
          </div>

          <div className="relative">
            <label className='label flex-col items-start'>
              <span className='label-text'> PCS Recieved </span>
              <Input
                type="number"
                color="blue"
                value={pcsReceived}
                onChange={(e) => {
                  setPcsReceived(e.target.value);
                  CheckPcsRecQty(e.target.value);
                }}

                className="relative bg-white"
              />
            </label>
          </div>

          <div className="relative">
            <label className='label flex-col items-start'>
              <span className='label-text'> Sample Size </span>
              <Input
                type="number"
                readOnly
                color="blue"
                value={sampleSize}
                className="relative bg-white"
              />
            </label>
          </div>

          <div className="relative">
            <label className='label flex-col items-start'>
              <span className='label-text'> Select Accept </span>
              <Input
                type="number"
                color="blue"
                value={sampleAccept}
                onChange={(e) => setQuantity(e.target.value)}
                readOnly
                className="relative bg-white"
              />
            </label>
          </div>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select HOUR </span>
            <Select
              value={selectedHour}
              options={hourData}
              onChange={(value) => setSelectedHour(value)}
              className="w-full"

              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
              isLoading={isLoading}
            />
          </label>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Product </span>
            <Select
              className="w-full"

              value={selectedProduct}
              options={productData}
              onChange={(value) => setSelectedProduct(value)}
              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
              isLoading={isLoading}
            />
          </label>
          <div className="relative">
            <label className='label flex-col items-start'>
              <span className='label-text'> PCS Checked </span>
              <Input
                type="number"
                color="blue"
                readOnly
                value={pcsCheckedCounter}
                onChange={(e) => setPcsCheckedCounter(e.target.value)}
                className="relative bg-white"
              />
            </label>
          </div>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Supervisor </span>
            <Select
              className="w-full  "

              value={selectedSupervisor}
              options={supervisorData}
              onChange={(value) => setSelectedSupervisor(value)}
              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
              isLoading={isLoading}
            />
          </label>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select QA </span>
            <Select
              className="w-full  "
              value={selectedQa}
              options={qaData}
              onChange={(value) => setSelectedQa(value)}
              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
              isLoading={isLoading}
            />
          </label>
          <label className='label flex-col items-start'>
            <span className='label-text'> Select Checker </span>
            <Select
              className="w-full  "
              value={selectedChecker}
              options={checkerData}
              onChange={(value) => setSelectedChecker(value)}
              noOptionsMessage={() => <Skeleton count={5} />}
              isClearable
              isLoading={isLoading}
            />
          </label>
        </form>
        <div className='flex justify-center items-center p-4 md:p-8'>
          <div className='w-screen md:w-1/2'>
            <div className="relative m-5 md:mb-10">
              <label className='label flex-col items-start'>
                <span className='label-text'> Comment </span>
                <Input
                  color="blue"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white"
                  style={{ height: '3.6rem' }} // Adjust height here
                />
              </label>
            </div>

            <div className='btn-container flex flex-col md:flex-row justify-between md:justify-evenly w-full mb-5'>
              <button
                id='passCounter'
                className='btn bg-green-500 border-green-500 text-white w-full md:w-1/2 md:w-1/3 mb-2 md:mb-0 hover:bg-green-500 hover:border-green-500 hover:text-white'
                onClick={handlePassButton}
                disabled={passDisabled}
              >
                PASS {passCounterData}
              </button>
              <button
                id='failCounter'
                className='btn bg-red-500 border-red-500 text-white w-full md:w-1/3 md:w-1/2 hover:bg-red-500 hover:border-red-500 hover:text-white'
                onClick={handleFailButton}
                disabled={failDisabled}
              >
                FAIL {failCounter}
              </button>
            </div>

            <div className='btn-container flex flex-col md:flex-row justify-between md:justify-evenly'>
              <button
                className="btn bg-green-500 border-green-500 text-white w-full md:w-1/3 md:w-1/2 mb-2 md:mb-0 hover:bg-green-500 hover:border-green-500 hover:text-white"
                onClick={() => {
                  saveFinalData('Pass');
                  resetForm();
                }}
                disabled={finalPassDisabled}
              >
                Final Pass
              </button>
              <button
                className="btn bg-red-500 border-red-500 text-white w-full md:w-1/3 md:w-1/2 hover:bg-red-500 hover:border-red-500 hover:text-white"
                onClick={() => {
                  saveFinalData('Fail');
                  resetForm();
                }}
                disabled={finalFailDisabled}
              >
                Final Fail
              </button>
            </div>

          </div>
        </div>

        {/* // Defect Type Model */}
        <dialog id="defect_type_model" className="modal">
          <div className="modal-box w-full max-w-6xl pt-4 pb-6 px-6 rounded-lg shadow-lg bg-white">
            <div className="flex justify-between items-center sticky top-0 bg-white py-2 border-b border-gray-200">
              <h3 className="font-bold text-lg">Please Select Defect Type</h3>
              <div className="flex space-x-2">
                <button onClick={saveDefectData} className="btn btn-success btn-sm">
                  Save Defects
                </button>
                <button onClick={closeModels} className="btn btn-error btn-sm">
                  Close
                </button>
              </div>
            </div>
            <div className="modal-action flex flex-col space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {defectTypeList.map((defect) => (
                  <button
                    key={defect.id}
                    type="button"
                    className="btn btn-success w-full rounded-lg p-2 text-auto flex flex-col items-center justify-center space-y-1"
                    value={defect.id}
                    onClick={() => handleDefectModelSelection(defect)}
                  >
                    <span>{defect.name}</span>
                    <span>{defect.hindi_name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </dialog>

        {/* // Operation Type Model */}
        <dialog id="operation_type_model" className="modal">
          <div className="modal-box w-full max-w-5xl pt-4 pb-6 px-6 rounded-lg shadow-lg bg-white">
            <div className="flex justify-between items-center sticky top-0 bg-white py-2 border-b border-gray-200">
              <h3 className="font-bold text-lg">Please Select Operations</h3>
              <div className="flex space-x-2">
                <button onClick={saveOperationData} className="btn btn-success btn-sm">
                  Save Operations
                </button>
                <button onClick={closeModels} className="btn btn-error btn-sm">
                  Close
                </button>
              </div>
            </div>
            <div className="modal-action flex flex-col space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {operationTypeList.map((operation) => (
                  <button
                    key={operation.id}
                    type="button"
                    className="btn btn-success w-full rounded-lg p-1 text-sm"
                    value={operation.operation}
                    onClick={() => handleOperationSelection(operation)}
                  >
                    {operation.operation}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </dialog>

      </div>
    </>
  );
};
export default AuditPage;