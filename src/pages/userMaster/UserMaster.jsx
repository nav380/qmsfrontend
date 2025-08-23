import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Skeleton from 'react-loading-skeleton';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { toast } from 'react-toastify';
import DjangoConfig from '../../config/Config';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
const UserMaster = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unitData, setUnitData] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [proData, setProData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [selectedPro, setSelectedPro] = useState([]);
    const [selectedSec, setSelectedSec] = useState([]);
    // const [lineData, setLineDate] = useState([])
    const [lineData, setLineData] = useState([])

    const [selectedLine, setSelectedLine] = useState([])
    const [floorData, setFloorData] = useState([])
    const [selectedFloor, setSelectedFloor] = useState([])
    const navigate = useNavigate()



    const fetchUserMasterData = async () => {
        setIsLoading(true);

        try {
            const url = `${DjangoConfig.apiUrl}/rtqm/qms_user_master/`;
            const response = await axios.get(url);
            if (response.status === 200) {
                setTableData(response.data.active_users);
                console.log(response.data)
            } else {
                console.warn("Received unexpected status code:", response.status);
            }
        } catch (err) {
            console.error("Error fetching user master data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing/`);
            setUnitData(response.data.location_data.map(item => ({ value: item.id, label: item.name })));
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProcessesData = async () => {
        try {
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/processes_master_view/?`);
            setProData(response.data.pro_data.map(item => ({ value: item.id, label: item.name })));
        } catch (err) {
            toast.error("Error fetching process data");
        }
    };



    const fetchSectionData = async (selectedValue) => {
        try {
            const userData = {
                id: selectedValue.value,
            };
            const queryParams = new URLSearchParams(userData).toString();
            const response = await axios.get(`${DjangoConfig.apiUrl}/rtqm/section_master_view/?${queryParams}`);
            setSectionData(response.data.sec_data.map(item => ({ value: item.id, label: item.name, section_group: item.section_group ,process_id :item.pro_master_id})));
            // console.log(" Section Data ", response.data.sec_data);

        } catch (err) {
            toast.error("Error fetching section data");
        }
    };





 const handleProcessSelect = (selectedProcesses) => {
    setSelectedPro(selectedProcesses);
    if (selectedProcesses.length > 0) {
        fetchSectionData(selectedProcesses[selectedProcesses.length - 1]);
    } else {
        setSectionData([]);
        setSelectedSec([]);
    }
};



const handleSectionSelect = (selectedSections) => {
    setSelectedSec(selectedSections);
};

const filteredSectionData = useMemo(() => {
    // Ensure selectedSec is an array
    const secArray = selectedSec || [];

    const hasInSelected = secArray.some(sec => sec.section_group === 'IN');
    const hasOutSelected = secArray.some(sec => sec.section_group === 'OUT');

    return sectionData.filter(sec => {
        if (hasInSelected && sec.section_group === 'OUT') {
            return false;
        }
        if (hasOutSelected && sec.section_group === 'IN') {
            return false;
        }
        return true; 
    });
}, [sectionData, selectedSec]);



    const handleUnitChange = (selectedValue) => {
        setSelectedUnit(selectedValue);
        fetchFloorData(selectedValue)
    };


    const fetchFloorData = (selectedValue) => {
        // console.log("selected Value", selectedValue);
        const userData = {
            unit_id: selectedValue.value,
        };
        const queryParams = new URLSearchParams(userData).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const floorOptions = response.data.common_master_data.map(item => ({ value: item.id, label: item.name }));
                setFloorData(floorOptions)
                console.log("floor Data",response.data.common_master_data)
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };


  
    const handleFloorChange = (selectedValue) => {
        setSelectedFloor(selectedValue);
        fetchLineData(selectedValue);
    };

    const fetchLineData = (selectedFloor) => {
        const commonIds = selectedFloor.map(id => id.value).join(','); // Convert to comma-separated string
        const queryParams = new URLSearchParams({ common_ids: commonIds }).toString();
        axios.get(`${DjangoConfig.apiUrl}/rtqm/qms_planing2/?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const lineOptions = response.data.line_master_data.map(item => ({ value: item.id, label: item.name ,floor:item.common_master_id}));
                setLineData(lineOptions)
                console.log("Line Data Value", response.data.line_master_data);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
            });
    };
    


    useEffect(() => {
        fetchInitialData();
        fetchProcessesData();
        fetchUserMasterData()
    }, []);



    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    const handleExportData = (data) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    const deleteMt = (id) => {
        // Implement delete functionality
    };

    const openDeleteConfirm = (row) => {
        if (window.confirm(`Are you sure you want to delete?`)) {
            deleteMt(row.original.id);
        }
    };

    const getRowStyle = (row) => {
        return row.original.is_active ? {} : { backgroundColor: 'red', color: 'white' };
    };
    const StatusOptions = [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'In Active' },
        // { value: 'true', label: 'Active' },
    ];

 
    const columns = useMemo(
        () => [
            // Hidden ID column
            // { accessorKey: 'id', header: 'ID', enableHiding: true, enableEditing: false, size: 0 },
            {
                accessorKey: 'id',
                header: 'Add',
                enableEditing: false,
                size: 10,
                Cell: ({ row }) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleButtonClick(row.original.id)}
                    >
                        View
                    </Button>
                ),
            },
            { accessorKey: 'username', header: 'Username', size: 10 },
            // { accessorKey: 'unit_name', header: 'Unit', size: 10, enableEditing: false, },
            // { accessorKey: 'floor_name', header: 'Floor', size: 10, enableEditing: false, },
            // { accessorKey: 'line_name', header: 'Line', size: 10, enableEditing: false, },

            // { accessorKey: 'process__name', header: 'Process', size: 10, enableEditing: false, },
            // { accessorKey: 'section__name', header: 'Section', size: 10, enableEditing: false, },
            { accessorKey: 'password', header: 'Password', size: 10 },
            {
                accessorKey: 'is_active',
                header: 'Status',
                size: 20,
                editVariant: 'select',
                editSelectOptions: StatusOptions,

                muiEditTextFieldProps: {
                    select: true,
                },
                Cell: ({ cell }) => (
                    <span>
                        {cell.getValue() ? (
                            // <CheckIcon  checked={cell.getValue()} />
                            <span>Active</span>
                        ) : (
                            // <CloseIcon color="error" />
                            <span>In Active</span>

                        )}
                    </span>
                ),

            },
        ],
        []
    );

    const handleUpdateUser = async ({ values, row }) => {
        if (!row || !row.original) {
            console.error('Row data is undefined');
            return;
        }
        console.log("data id ", row.original.id)
        let formData = {
            username: values.username,
            password: values.password,
        };

        const userData = {
            action: 'update',
            id: row.original.id,
            formData: formData,
            is_active: values.is_active,
        };

        try {
            const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_user_master/`, userData);
            console.log('Update successful:', response.data);
            toast.success(`${response.data.message}`);
            fetchUserMasterData()
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(`${error}`);
        }
    };



    const table = useMaterialReactTable({
        columns: columns,
        data: tableData,
        enableHiding: false,
        enableRowSelection: true,
        enablePagination: false,
        enableStickyHeader: true,
        enableStickyFooter: true,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        onEditingRowSave: handleUpdateUser,
        // initialState: {
        //     showGlobalFilter: true,
        //     density: 'compact',
        // },
        state: {
            showGlobalFilter: true,
            density: 'compact',
            isLoading: isLoading ? <Skeleton count={5} /> : null,
        },
        muiTableBodyCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
            },
        },
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                {/* <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirm(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip> */}
            </Box>
        ),
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '12px',
                    padding: '4px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    aria-controls="export-menu"
                    aria-haspopup="true"
                    onClick={() => handleExportData(tableData)}
                    startIcon={<FileDownloadIcon />}
                >
                    Export
                </Button>
            </Box>
        ),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data = {
                formData,
                action: 'create',
                unit_id: selectedUnit ? selectedUnit.value : null,
                line_ids: selectedLine.map(line => ({ line: line.value, floor: line.floor })),
                process_ids: selectedPro.map(pro => pro.value),
                section_ids: selectedSec.map(sec => ({section_id :sec.value,process_id:sec.process_id})),

            };

            let url = `${DjangoConfig.apiUrl}/rtqm/qms_user_master/`;

            const response = await axios.post(url, data);

            if (response.status === 200 || response.status === 201) {
                toast.success(`${response.data.message}`);
                setFormData({
                    username: '',
                    password: '',
                });
                setSelectedUnit(null);
                setSelectedPro(null);
                setSelectedSec(null);
                fetchUserMasterData()
            } else {
                toast.warning("Received unexpected status code.");
            }
        } catch (err) {
            toast.error("An error occurred while submitting the data.");
            console.error("Error details:", err);
        }
    };
    const handleButtonClick = (userId) => {
        navigate(`/dashboard/master/view-user-permission/${userId}`);
    };

        

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold mb-6">Create User Master</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                        />
                    </div>


                    <div>
                        <label htmlFor="unitData">Unit</label>
                        <Select
                            options={unitData}
                            value={selectedUnit}
                            onChange={handleUnitChange}
                            placeholder="Unit"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!unitData.length}
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
                        <label htmlFor="floorData">Floor</label>
                        <Select
                            options={floorData}
                            value={selectedFloor}
                            onChange={handleFloorChange}
                            placeholder=" Floor"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!floorData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            isMulti={true}

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
                        <label htmlFor="lineData">Line</label>
                        <Select
                            options={lineData}
                            value={selectedLine}
                            onChange={setSelectedLine}
                            placeholder=" Line"
                            className="w-full border-2 z-10 border-gray-400 rounded-md"
                            isSearchable
                            isLoading={!lineData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            isMulti={true}

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
                        <label className="text-sm font-medium text-gray-700 mb-1">Select Processes</label>
                        <Select
                            options={proData}
                            value={selectedPro}
                            onChange={handleProcessSelect}
                            placeholder="Select Processes"
                            className="w-full border-2 z-10 border-gray-300 rounded-md"
                            isSearchable
                            isLoading={!proData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            isMulti={true}
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
                        <label className="text-sm font-medium text-gray-700 mb-1">Select Section</label>
                        <Select
                            options={filteredSectionData}
                            value={selectedSec}
                            onChange={handleSectionSelect}
                            placeholder="Select Section"
                            className="w-full border-2 z-10 border-gray-300 rounded-md"
                            isSearchable
                            isLoading={!filteredSectionData.length}
                            loadingMessage={() => <Skeleton count={5} />}
                            isClearable
                            isMulti
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
                        <label htmlFor="">Submit</label>
                        <button type="submit" className="btn-primary py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md">
                            Submit
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-2">
                <MaterialReactTable table={table} muiTableBodyRowProps={({ row }) => ({
                    sx: getRowStyle(row),
                })} />
            </div>
        </div>
    );
}

export default UserMaster;

