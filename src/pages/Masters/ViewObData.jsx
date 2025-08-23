import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import Select from 'react-select';
import DjangoConfig from "../../config/Config";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const ViewObData = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const { id, buyer_name, style, color, ob_date, re_cutting, kaz_button, other } = location.state || {};
    const [isLoading, setIsLoading] = useState(false)
    const [obShowData, setObShowData] = useState([])
    const [machinequnt, setMachineQunt] = useState([])

    // ============================= columnHelper  ======================

    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor((row, index) => index + 1, { header: 'S/N', size: 40 }),
        columnHelper.accessor('ob_no', { header: 'OB/NO', size: 20 }),
        columnHelper.accessor('parts', { header: 'SECTION', size: 20 }),
        columnHelper.accessor('operation', { header: 'OPERATION NAME', size: 20 }),
        columnHelper.accessor('sam', { header: 'SAM', size: 20 }),
        columnHelper.accessor('type_of_machine', { header: 'TYPE OF M/Cs', size: 20 }),
        columnHelper.accessor('attachments', { header: 'ATTACHMENT', size: 20 }),
        columnHelper.accessor('theoretical_manpower', { header: 'THEO. OPTRS ', size: 20 }),
        columnHelper.accessor('planned_work_station', { header: 'THEO. BAL. OPTRS', size: 20 }),
        columnHelper.accessor('target_100_pcs', { header: 'TGT @100%', size: 20 }),
        columnHelper.accessor('target_60_pcs', { header: 'TGT @60%', size: 20 }),
        columnHelper.accessor('seam_length', { header: 'Seam Length', size: 20 }),
        columnHelper.accessor('remark', { header: 'Remarks', size: 20 }),
    ];

    // ========================= Table starting =============================

    const table = useMaterialReactTable({
        columns,
        data: obShowData,

        // enableRowSelection: true,
        state: {
            density: 'compact',
            },
        editDisplayMode: 'modal',
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoading
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '100px',
            },
        },
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        // editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
        muiTableBodyCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '10px',
                    padding: '4px',
                    flexWrap: 'wrap',
                    style: { fontSize: '5px' },
                }}
            />
        ),
    });

    // ======================= useEffect  ============================

    useEffect(() => {
        fetchObDetails(id);
    }, []);
    const fetchObDetails = async (id) => {
        console.log(id)
        try {
            const userData = {
                ob_mt_id: id,
            };
            const queryParams = new URLSearchParams(userData).toString();
            axios.get(`${DjangoConfig.apiUrl}/rtqm/excel_data_show_view/?${queryParams}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                console.log("iiiiiiiiiiiiiii---------->",response.data)
                setMachineQunt(response.data.MCtype_quantity)
                console.log("rrrrrr", response.data.get_ob_no_id_data)
                setObShowData(response.data.get_ob_no_id_data)
            })

        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    const machine_name_list = machinequnt.map((item, index) => {
        return (
            <>
                <tr key={item.id}>
                    <th className='border-x border-solid border-slate-300 pl-9 '>{index+1}</th>
                    <td className='border-x border-solid border-slate-300 pl-9'>{item.type_of_machine}</td>
                    <td className='border-x border-solid border-slate-300 pl-9'>{item.planned_work_station}</td>
                </tr>
            </>
        )
    })
    const obTablePage = () => {
        navigate('/dashboard/master/ob-history')
    }


    return (
        <>
            <div className="w-full h-16 flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md">
                <h1 className="text-xl font-semibold text-gray-800">Operation Bulletin View</h1>
                <Button
                    onClick={obTablePage}
                    variant="contained"
                    color="primary"
                    className="float-right mr-2"
                >
                    Back
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4 ">

                <div>
                    <label htmlFor="buyerList"> Buyer</label>
                    <input type="text" name="buyer" value={buyer_name} className="w-full border-2 h-11 border-gray-400 rounded-md bg-white pl-2" disabled />
                    {/* <Select
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
                    /> */}
                </div>

                <div>
                    <label htmlFor="styleNoData">Style No</label>
                    <input type="text" name="style_no" value={style} className="w-full border-2 h-11 border-gray-400 rounded-md bg-white pl-2" disabled />
                    {/* <Select
                        options={styleNoData}
                        value={selectedStyle}
                        onChange={handleStyleChange}
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
                    /> */}
                </div>


                <div>
                    <label htmlFor="colorData">Color</label>
                    <input type="text" name="color" value={color} className="w-full border-2 h-11 border-gray-400 rounded-md bg-white pl-2" disabled />
                    {/* <Select
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
                    /> */}
                </div>

                <div>
                    <label htmlFor="ob_date">OB Date</label>
                    <input type="date" name="ob_date" value={ob_date} className="w-full border-2 h-11 border-gray-400 rounded-md pl-2" required />
                    {/* <input type="date" name="ob_date" value={obDate} onChange={(e) => setObDate(e.target.value)} className="w-full border-2 h-11 border-gray-400 rounded-md" required /> */}
                </div>

                <div>
                    <label htmlFor="recutting">Re-Cutting</label>
                    <input type="number" name="recutting" value={re_cutting} className="w-full border-2 h-11 border-gray-400 rounded-md pl-2" />
                </div>

                <div>
                    <label htmlFor="kaz_button">Kaz-Button</label>
                    <input type="number" name="kaz_button" value={kaz_button} className="w-full border-2 h-11 border-gray-400 rounded-md pl-2" />
                </div>
                <div>
                    <label htmlFor="other">Others</label>
                    <input type="number" name="other" value={other} className="w-full border-2 h-11 border-gray-400 rounded-md pl-2" />
                </div>
            </div>
            <div className='mt-2'>
                <MaterialReactTable table={table} />
            </div>
            {/* ========================= Machine and planned worknstation ====================== */}
           
            <div className="overflow-x-auto mt-5  ">
                <table className="table bg-white shadow-md shadow-white">
                    <thead className='w-full, h-12 bg-slate-200'>
                        <tr>
                            <th className='border-x border-solid border-slate-300 pl-9 text-base font-bold text-black'>S/No</th>
                            <th className='border-x border-solid border-slate-300 pl-9 text-base font-bold text-black'>Machine Type</th>
                            <th className='border-x border-solid border-slate-300 pl-9 text-base font-bold text-black'>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {machine_name_list}

                    </tbody>
                </table>
            </div>


        </>
    );

}


export default ViewObData;