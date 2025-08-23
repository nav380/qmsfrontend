import { Route, Routes } from 'react-router-dom';
import CuttingEntryForm from "../pages/cutting/Cutting_entry"
import Cutting_History from '../pages/cutting/Cutting_History';
import Cutting_Details from '../pages/cutting/Cutting_Details';
import CuttingEntryHelper from '../pages/cutting/CuttingEntryHelper';
const CuttingRouter=()=>{

    return(
        <>
        <Routes>
            <Route path="cutting1" element={<CuttingEntryForm/>} />           
            <Route path="history" element={<Cutting_History/>} />           
            <Route path="detail" element={<Cutting_Details/>} />     
            <Route path="cutting-helper" element={<CuttingEntryHelper/>} />   
          
        </Routes>
        </>
    )
}

export default CuttingRouter