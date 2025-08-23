import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import { Box, Button, Menu, MenuItem, FormControl, InputLabel, Select, Input } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import axios from "axios";
// import SingleSelectComponent from '../components/SingleSelectComponent';
// import DateComponent from '../components/DateComponent';
import SingleSelectComponent from '../../components/input/SingleSelectComponent'
import DateComponent from '../../components/input/DateComponent'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import { toast } from 'react-toastify';
import DjangoConfig from '../../config/Config';


function ButtonField(props) {
    const {
        setOpen,
        label,
        id,
        disabled,
        InputProps: { ref } = {},
        inputProps: { 'aria-label': ariaLabel } = {},
    } = props;

    return (
        <Button
            variant="outlined"
            id={id}
            disabled={disabled}
            ref={ref}
            aria-label={ariaLabel}
            onClick={() => setOpen?.((prev) => !prev)}
        >
            {label ? `${label}` : 'Pick a date'}
        </Button>
    );
}

function ButtonDatePicker(props) {
    const [open, setOpen] = React.useState(false);

    return (
        <DatePicker
            slots={{ ...props.slots, field: ButtonField }}
            slotProps={{ ...props.slotProps, field: { setOpen } }}
            {...props}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            minDate={props.minDate}
            maxDate={props.maxDate}
        />
    );
}

const FileHandOver = () => {
    const [data, setData] = useState([]);
    const [dataCheck, setDataCheck] = useState([]);
    const [Units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [options, setOptions] = useState([]);
    const [options2, setOptions2] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [tillDate, setTillDate] = useState(null);
    const [reset, setReset] = useState(0);
    const [permission, setPermission] = useState(1);




    console.log("Data", data);
    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('buyer_name', { header: 'Buyer', size: 20 }),
        columnHelper.accessor('styleno', { header: 'Style No', size: 20 }),
        columnHelper.accessor('Ourref', { header: 'Our Ref No', size: 20 }),
        columnHelper.accessor('garment_color', { header: 'Garment Color', size: 20 }),
        columnHelper.accessor('orderdate', { header: 'Order Date', size: 20 }),
        columnHelper.accessor('delvdate', { header: 'Delivery Date', size: 20 }),
        columnHelper.accessor('totalqty', { header: 'Order Qty', size: 20 }),
        columnHelper.accessor('pcd_status', {
            header: 'PCD Status',
            size: 30,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]['pcd_status'];
                const [status, setStatus] = useState(cell.value || '');
                const handleChange = (event) => {
                    const newStatus = event.target.value;
                    console.log("New Status:", newStatus);
                    updatevalue(row.index, 'pcd_status', newStatus);
                    setStatus(newStatus);
                    if (newStatus == "Meet") {
                        updatevalue(row.index, 'reason_notmeet', null);
                    }
                };
                if (row.original.pcd_status != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth>
                            <InputLabel id={`status-select-${row.index}`}>Status</InputLabel>
                            <Select
                                labelId={`status-select-${row.index}`}
                                value={row.original.pcd_status}
                                onChange={handleChange}
                                label="Status"
                                disabled
                                required
                            >
                                <MenuItem value="Meet">Meet</MenuItem>
                                <MenuItem value="Not Meet">Not Meet</MenuItem>
                            </Select>
                        </FormControl>
                    );
                }
                else {
                    return (
                        <FormControl fullWidth>
                            <InputLabel id={`status-select-${row.index}`}>Status</InputLabel>
                            <Select
                                labelId={`status-select-${row.index}`}
                                value={status}
                                onChange={handleChange}
                                label="Status"
                                required
                                disabled={permission == 1 ? false : true}
                            >
                                <MenuItem value="Meet">Meet</MenuItem>
                                <MenuItem value="Not Meet">Not Meet</MenuItem>
                            </Select>
                        </FormControl>
                    );
                }
            }
        }),
        columnHelper.accessor('reason_notmeet', {
            header: 'Reason For Not Meet',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const [status, setStatus] = useState(null)
                const handleChange = (event) => {
                    const newStatus = event.target.value;
                    setStatus(newStatus);
                    updatevalue(row.index, 'reason_notmeet', newStatus)
                };
                if (row.original.reason_notmeet != null && row.original.handover_id != null) {
                    return (
                        <FormControl fullWidth>
                            <InputLabel id={`status-select-${row.index}`}>Status</InputLabel>
                            <Select
                                labelId={`status-select-${row.index}`}
                                value={row.original.reason_notmeet}
                                onChange={handleChange}
                                label="Status"
                                disabled
                                required
                            >
                                <MenuItem value="Merchant">Merchant</MenuItem>
                                <MenuItem value="Fabric">Fabric</MenuItem>
                                <MenuItem value="Accessories">Accessories</MenuItem>
                            </Select>
                        </FormControl>
                    );
                }
                else {
                    return (
                        <FormControl fullWidth>
                            <InputLabel id={`status-select-${row.index}`}>Reason For Not Meet</InputLabel>
                            <Select
                                labelId={`status-select-${row.index}`}
                                disabled={row.original.pcd_status == "Not Meet" && permission == 1 ? false : true}
                                value={status}
                                onChange={handleChange}
                                label="Reason For Not Meet"
                            >
                                <MenuItem value="Merchant">Merchant</MenuItem>
                                <MenuItem value="Fabric">Fabric</MenuItem>
                                <MenuItem value="Accessories">Accessories</MenuItem>
                            </Select>
                        </FormControl>
                    );
                }
            }
        }),
        columnHelper.accessor('remark', {
            header: 'Remark',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]["remark"];
                const [comment, setComment] = useState(cell.value || '');
                const handleChange = (event) => {
                    const newComment = event.target.value;
                    setComment(newComment);
                };
                const Submit = () => {
                    updatevalue(row.index, 'remark', comment)
                }
                if (row.original.remark != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth>
                            <TextField
                                value={row.original.remark}
                                onChange={handleChange}
                                onBlur={Submit}
                                label="Remark"
                                multiline
                                rows={2}
                                variant="outlined"
                                disabled
                                sx={{
                                    // Apply custom height
                                    '& .MuiInputBase-root': {
                                        height: 60,
                                        // Set a custom height
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        padding: '1', // Remove padding if needed
                                    }
                                }}
                            />
                        </FormControl>
                    );
                }
                return (
                    <FormControl fullWidth>
                        <TextField
                            value={comment}
                            onChange={handleChange}
                            onBlur={Submit}
                            label="Remark"
                            multiline
                            rows={2}
                            variant="outlined"
                            disabled={permission == 1 ? false : true}
                            sx={{
                                // Apply custom height
                                '& .MuiInputBase-root': {
                                    height: 60,
                                    // Set a custom height
                                },
                                '& .MuiOutlinedInput-root': {
                                    padding: '1', // Remove padding if needed
                                }
                            }}
                        />
                    </FormControl>
                );
            }
        }),
        columnHelper.accessor('plan_qty', {
            header: 'Plan Qty',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]["plan_qty"];
                const [status, setStatus] = useState(cell.value || null);
                const orderQty = row.original.totalqty;
                const handleChange = (event) => {
                    const newStatus = event.target.value;
                    if (newStatus > orderQty || newStatus < 0) {
                        setStatus(orderQty);
                    }
                    else {
                        setStatus(newStatus);
                    }
                };
                const Submit = () => {
                    updatevalue(row.index, 'plan_qty', status)
                }



                if (row.original.plan_qty != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth className='text-center' >
                            <InputLabel id={`status-select-${row.index}`}>Plan Qty</InputLabel>
                            <Input className='pl-4' type="number" disabled value={row.original.plan_qty} onBlur={Submit} onChange={handleChange} placeholder='Plan Qty' >
                            </Input>
                        </FormControl>
                    );
                }
                else {
                    return (
                        <FormControl fullWidth className='text-center' >
                            <InputLabel id={`status-select-${row.index}`}>Plan Qty</InputLabel>
                            <Input className='pl-4' type="number" value={status} onBlur={Submit} onChange={handleChange} disabled={permission == 1 ? false : true} placeholder='Plan Qty' required={permission == 1 ? true : false} >
                            </Input>
                        </FormControl>
                    );
                }

            }

        }),
        columnHelper.accessor('handover_date', {
            header: 'File HandOver Date',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]["handover_date"];
                const [value, setValue] = useState();
                const handleChange = (event) => {
                    setValue(event);
                    const formattedDate = event ? dayjs(event).format('YYYY-MM-DD') : null;
                    if (new Date(formattedDate) >= new Date(row.original.orderdate) && new Date(formattedDate) <= new Date(row.original.delvdate)) {
                        const datee = String(formattedDate)
                        updatevalue(row.index, 'handover_date', datee)
                    }
                }
                if (row.original.handover_date != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth className='text-center'>
                            <InputLabel id={`File-HandOver-Date-${row.index}`}></InputLabel>
                            <Input
                                type="date"
                                value={row.original.handover_date}
                                placeholder='File HandOver Date'
                                disabled
                            />
                        </FormControl>
                    );
                }
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ButtonDatePicker
                            label={value == null ? null : value.format('MM/DD/YYYY')}
                            value={value}
                            onChange={handleChange}
                            minDate={dayjs(row.original.orderdate)}
                            maxDate={dayjs(row.original.delvdate)}
                            disabled={permission == 1 ? false : true}
                        />
                    </LocalizationProvider>
                );
            }
        }),
        columnHelper.accessor('unit', {
            header: 'Unit', size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]["unit_id"];
                const [status, setStatus] = useState(cell.value || '');
                const handleChange = (event) => {
                    const newStatus = event.target.value;
                    setStatus(newStatus);
                    updatevalue(row.index, 'unit', newStatus);
                };
                if (row.original.unit_id != null && row.original.handover_id != null && check != null) {
                    const unit = Units.find((unit) => unit.id === row.original.unit_id);
                    console.log("unit", unit.id, unit.name);
                    return (
                        <FormControl fullWidth>
                            <InputLabel id={`status-select-${row.index}`}>Unit</InputLabel>
                            <Select
                                labelId={`status-select-${row.index}`}
                                value={unit.id}
                                onChange={handleChange}
                                label="Unit"
                                required
                                disabled
                            >

                                <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>


                            </Select>
                        </FormControl>
                    );
                }
                else {
                    return (
                        <FormControl fullWidth>
                            <InputLabel id={`status-select-${row.index}`}>Unit</InputLabel>
                            <Select
                                labelId={`status-select-${row.index}`}
                                value={status}
                                onChange={handleChange}
                                label="Unit"
                                required
                                disabled={permission == 1 ? false : true}
                            >
                                {Units.map((unit) => (
                                    <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    );
                }
            }
        }),
        columnHelper.accessor('ppc_comment', {
            header: 'PPC Comment',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]['ppc_comment']
                const [comment, setComment] = useState();
                const handleChange = (event) => {
                    const newComment = event.target.value;
                    setComment(newComment);
                };
                const Submit = () => {
                    updatevalue(row.index, 'ppc_comment', comment)
                }
                if (row.original.ppc_comment != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth>
                            <TextField
                                value={row.original.ppc_comment}
                                onChange={handleChange}
                                // onBlur={Submit}
                                label="PPC Comment"
                                multiline
                                rows={2}
                                variant="outlined"
                                disabled
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: 60,

                                    },
                                    '& .MuiOutlinedInput-root': {
                                        padding: '1',
                                    }
                                }}
                            />
                        </FormControl>
                    );
                }

                return (
                    <FormControl fullWidth>
                        <TextField
                            value={comment}
                            onChange={handleChange}
                            onBlur={Submit}
                            label="PPC Comment"
                            multiline
                            rows={2}
                            variant="outlined"
                            disabled={permission == 1 ? false : true}
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: 60,

                                },
                                '& .MuiOutlinedInput-root': {
                                    padding: '1',
                                }
                            }}
                        />
                    </FormControl>
                );
            }
        }),
        columnHelper.accessor('delivery_status', {
            header: 'Delivery Criticality Status',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]['delivery_status']
                const [status, setStatus] = useState(cell.value || '');
                const handleChange = (event) => {
                    const newStatus = event.target.value;
                    setStatus(newStatus);
                    updatevalue(row.index, 'delivery_status', newStatus);
                };
                if (row.original.delivery_status != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth>
                            <InputLabel id={`status-select-${row.index}`}>Delivery Criticality Status</InputLabel>
                            <Select
                                labelId={`status-select-${row.index}`}
                                value={row.original.delivery_status}
                                onChange={handleChange}
                                label="Delivery Criticality Status"
                                disabled
                            >
                                <MenuItem value="Critical">Critical</MenuItem>
                                <MenuItem value="Non Critical">Non Critical</MenuItem>
                            </Select>
                        </FormControl>
                    );
                }
                return (
                    <FormControl fullWidth>
                        <InputLabel id={`status-select-${row.index}`}>Delivery Criticality Status</InputLabel>
                        <Select
                            labelId={`status-select-${row.index}`}
                            value={status}
                            onChange={handleChange}
                            label="Delivery Criticality Status"
                            disabled={permission == 1 ? false : true}
                        >
                            <MenuItem value="Critical">Critical</MenuItem>
                            <MenuItem value="Non Critical">Non Critical</MenuItem>
                        </Select>
                    </FormControl>
                );
            }
        }),
        columnHelper.accessor('risk_category', {
            header: 'Style Risk Category',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]['risk_category']
                const [status, setStatus] = useState(cell.value || '');
                const handleChange = (event) => {
                    const newStatus = event.target.value;
                    setStatus(newStatus);
                    updatevalue(row.index, 'risk_category', newStatus);
                };
                if (row.original.risk_category != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth>
                            <InputLabel id={`status-select-${row.index}`}>Style Risk Category</InputLabel>
                            <Select
                                labelId={`status-select-${row.index}`}
                                value={row.original.risk_category}
                                onChange={handleChange}
                                label="Style Risk Category"
                                disabled
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </Select>
                        </FormControl>
                    );
                }
                return (
                    <FormControl fullWidth>
                        <InputLabel id={`status-select-${row.index}`}>Style Risk Category</InputLabel>
                        <Select
                            labelId={`status-select-${row.index}`}
                            value={status}
                            onChange={handleChange}
                            label="Style Risk Category"
                            required
                            disabled={permission == 1 ? false : true}
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                    </FormControl>
                );
            }
        }),
        columnHelper.accessor('ppm_date', {
            header: 'PPM Date',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]['ppm_date']
                const [value, setValue] = useState();
                const handleChange = (event) => {
                    setValue(event);
                    const formattedDate = event ? dayjs(event).format('YYYY-MM-DD') : null;
                    if (new Date(formattedDate) >= new Date(row.original.orderdate) && new Date(formattedDate) <= new Date(row.original.delvdate)) {
                        const datee = String(formattedDate)
                        updatevalue(row.index, 'ppm_date', datee)
                    }
                }
                if (row.original.ppm_date != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth className='text-center'>
                            <InputLabel id={`PPM-Date-${row.index}`}></InputLabel>
                            <Input
                                type="date"
                                value={row.original.ppm_date}
                                onChange={handleChange}
                                placeholder='PPM Date'
                                disabled
                            />
                        </FormControl>
                    );
                }
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ButtonDatePicker
                            label={value == null ? null : value.format('MM/DD/YYYY')}
                            value={value}
                            onChange={handleChange}
                            minDate={dayjs(row.original.orderdate)}
                            maxDate={dayjs(row.original.delvdate)}
                            disabled={permission == 1 ? false : true}
                        />
                    </LocalizationProvider>
                );
            }
        }),
        columnHelper.accessor('rnd_comp_date', {
            header: 'RND Completion Date',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]['rnd_comp_date']
                const [value, setValue] = useState();
                const handleChange = (event) => {
                    setValue(event);
                    const formattedDate = event ? dayjs(event).format('YYYY-MM-DD') : null;
                    if (new Date(formattedDate) >= new Date(row.original.orderdate) && new Date(formattedDate) <= new Date(row.original.delvdate)) {
                        const datee = String(formattedDate)
                        updatevalue(row.index, 'rnd_comp_date', datee)
                    }
                }
                if (row.original.rnd_comp_date != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth className='text-center'>
                            <InputLabel id={`RND-Completion-Date-Date-${row.index}`}></InputLabel>
                            <Input
                                type="date"
                                value={row.original.rnd_comp_date}
                                onChange={handleChange}
                                placeholder='RND Completion Date'
                                disabled
                            />
                        </FormControl>
                    );
                }
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ButtonDatePicker
                            label={value == null ? null : value.format('MM/DD/YYYY')}
                            value={value}
                            onChange={handleChange}
                            minDate={dayjs(row.original.orderdate)}
                            maxDate={dayjs(row.original.delvdate)}
                            disabled={permission == 1 ? false : true}
                        />
                    </LocalizationProvider>
                );
            },
        }),
        columnHelper.accessor('factory_comment', {
            header: 'Factory Comment',
            size: 20,
            Cell: ({ row, cell, updateData }) => {
                const check = dataCheck[row.index]['factory_comment']
                const [comment, setComment] = useState(cell.value || '');
                const handleChange = (event) => {
                    const newComment = event.target.value;
                    setComment(newComment);
                };
                const Submit = () => {
                    updatevalue(row.index, 'factory_comment', comment)
                }
                if (row.original.factory_comment != null && row.original.handover_id != null && check != null) {
                    return (
                        <FormControl fullWidth>
                            <TextField
                                value={row.original.factory_comment}
                                onChange={handleChange}
                                onBlur={Submit}
                                label="Factory Comment"
                                multiline
                                rows={2}
                                variant="outlined"
                                sx={{
                                    // Apply custom height
                                    '& .MuiInputBase-root': {
                                        height: 60,
                                        // Set a custom height
                                    },
                                }}
                                disabled
                            />
                        </FormControl>
                    );
                }
                return (
                    <FormControl fullWidth>
                        <TextField
                            value={comment}
                            onChange={handleChange}
                            onBlur={Submit}
                            label="Factory Comment"
                            multiline
                            rows={2}
                            variant="outlined"
                            disabled={permission == 1 ? false : true}
                            sx={{
                                // Apply custom height
                                '& .MuiInputBase-root': {
                                    height: 60,
                                },
                                '& .MuiOutlinedInput-root': {
                                    padding: '1', // Remove padding if needed
                                }
                            }}
                        />
                    </FormControl>
                );
            },
        }),
        columnHelper.accessor('save', {
            header: 'Actions',
            size: 20,
            Cell: ({ row }) => {
                const handleSave = () => {
                    // Function to handle the save logic for the specific row
                    const data = {
                        buyer: row.original.buyer,
                        style: row.original.styleno,
                        ourr_ef: row.original.Ourref,
                        color: row.original.garment_color,
                        order_date: row.original.orderdate,
                        delv_date: row.original.delvdate,
                        order_qty: row.original.totalqty,
                        pcd_status: row.original.pcd_status,
                        reason_notmeet: row.original.reason_notmeet,
                        remark: row.original.remark,
                        plan_qty: row.original.plan_qty,
                        handover_date: row.original.handover_date,
                        unit: row.original.unit,
                        ppc_comment: row.original.ppc_comment,
                        delivery_status: row.original.delivery_status,
                        risk_category: row.original.risk_category,
                        ppm_date: row.original.ppm_date,
                        rnd_comp_date: row.original.rnd_comp_date,
                        factory_comment: row.original.factory_comment,
                    };
                    if ((data.pcd_status == "Meet" && data.reason_notmeet == null) || (data.pcd_status == "Not Meet" && data.reason_notmeet != null)) {

                        if (
                            ((data.pcd_status != null && data.remark != null) || (data.pcd_status == null && data.remark == null)) &&
                            ((data.plan_qty != null && data.handover_date != null && data.unit != null && data.ppc_comment != null) || (data.plan_qty == null && data.handover_date == null && data.unit == null && data.ppc_comment == null)) &&
                            ((data.delivery_status != null && data.risk_category != null) || (data.delivery_status == null && data.risk_category == null))
                        ) {
                            if (row.original.handover_id != null) {
                                axios.put(`${DjangoConfig.isAppUrl}/operation/FileHandOverViewSet/${row.original.handover_id}/`, data)
                                    .then(response => {
                                        alert("Data Updated Successfully")
                                    })
                            }
                            else {
                                axios.post(`${DjangoConfig.isAppUrl}/operation/FileHandOverViewSet/`, data,{ withCredentials: true }  )
                                    .then(response => {
                                        alert("Data Saved Successfully")
                                    })
                            }

                        }
                        else {
                            alert("Please fill all the required fields before saving.")
                        }
                    }
                    else {
                        alert("Please fill reason for not meet")
                    }
                };

                return (
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                    >
                        Save
                    </Button>

                );
            }
        })
    ];
    const updatevalue = (rowIndex, key, newValue) => {
        setData(prevRows =>
            prevRows.map((row, index) =>
                index === rowIndex ? { ...row, [key]: newValue } : row
            )
        );
    }
    const table = useMaterialReactTable({
        columns,
        data,
        columnFilterDisplayMode: 'popover',
        enableGlobalFilter: false,

        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
    });

    // ===============DATA GET AXIOS code start==========================================
    useEffect(() => {
        axios.get(`${DjangoConfig.isAppUrl}/operation/product/`,{ withCredentials: true }  )
            .then(response => {
                setData(response.data.data || []);
                setDataCheck(response.data.data || []);
                setUnits(response.data.Units || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    // =============== DATA GET AXIOS code end==========================================


    // =========================filter data ===========================================
    const handleSelectChange = (value) => {
        console.log('Handle Select Change:', value);
        setSelectedBuyer(value);
    };

    const handleSelectStyle = (value) => {
        console.log('Handle Select Change:', value);
        setSelectedStyle(value);
    };

    useEffect(() => {
        if (selectedBuyer !== null) {
            console.log('Selected Buyers:', selectedBuyer);
            axios.get(`${DjangoConfig.isAppUrl}/operation/stylefilter/`,{ withCredentials: true }  , {
                params: {
                    'buyer_code': selectedBuyer
                }
            })
                .then(response => {
                    console.log('response.data.filterdata:', response.data.filterdata);
                    const transformedOptions = response.data.filterdata.map(item => ({
                        value: item.styleno,
                        label: item.styleno,
                    }));
                    setOptions2(transformedOptions || []);

                })
                .catch(error => {
                    console.error('Error fetching data:', error);

                });
        }

    }, [selectedBuyer])

    useEffect(() => {
        axios.get(`${DjangoConfig.isAppUrl}/operation/filter/`,{ withCredentials: true }  )
            .then(response => {
                const transformedOptions = response.data.filterdata.map(item => ({
                    value: item.buyer_code,
                    label: item.buyer_name,
                }));
                setOptions(transformedOptions || []);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    const handleFromDateChange = (date) => {
        setFromDate(date);
    };
    const handleTillDateChange = (date) => {
        setTillDate(date);
    };
    const handelSearch = () => {
        if (selectedBuyer != null && selectedStyle != null) {
            const filteredData = dataCheck.filter(item => item.buyer === selectedBuyer && item.styleno === selectedStyle);
            setData(filteredData);
        }
        else if (selectedBuyer != null && fromDate != null && tillDate != null) {
            const filteredData = dataCheck.filter(item =>
                item.buyer === selectedBuyer &&
                item.delvdate >= fromDate &&
                item.delvdate <= tillDate
            );
            setData(filteredData);
        }

        else {
            const filtered = dataCheck.filter(item => {
                return item.delvdate >= fromDate && item.delvdate <= tillDate;
            });
            setData(filtered)
        }

    }

    console.log("main page reset", reset)




    const clearSearch = () => {
        setSelectedBuyer(null)
        setSelectedStyle(null)
        setReset(reset + 1)
    }

    // ============================================fiter data end==========================================
    return (
        <>

            <div className="w-full h-screen box-border border-2 border-gray-200 rounded-lg shadow-md overflow-hidden">
                <div className="border-2 border-blue-900  ml-0">
                    <div className="w-full bg-blue-900 text-white py-3 px-4">File HandOver</div>
                    <div>

                        <div className='flex flex-wrap w-full h-auto p-2 sm:space-y-0 sm:space-x-4 sm:items-center'>
                            <div className='flex-1 sm:flex-none'>
                                <SingleSelectComponent
                                    options={options}
                                    value={selectedBuyer}
                                    onChange={handleSelectChange}
                                    placeholder='Buyer'
                                    reset={reset}
                                />
                            </div>
                            <div className='flex-1 sm:flex-none'>
                                <SingleSelectComponent
                                    options={options2}
                                    value={selectedStyle}
                                    onChange={handleSelectStyle}
                                    placeholder='Style'
                                    disabled={selectedBuyer === null}
                                />
                            </div>
                            <div className='flex-1 sm:flex-none'>
                                <DateComponent
                                    onFromDateChange={handleFromDateChange}
                                    onTillDateChange={handleTillDateChange}
                                    reset={reset}
                                />



                            </div>
                            <div className='flex gap-3'>
                                <Button color="primary" variant="contained" onClick={handelSearch}>Search</Button>
                                <Button color="primary" variant="contained" onClick={clearSearch}>clear</Button>
                            </div>

                        </div>



                        <div className='mt-2 overflow-scroll h-[calc(100vh-150px)]'>
                            <MaterialReactTable table={table} />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default FileHandOver;

