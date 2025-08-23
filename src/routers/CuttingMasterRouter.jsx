
import { Route, Routes } from 'react-router-dom';
import CuttingMaster from '../pages/cutting/ReadyToLoad/CuttingMaster'
import CuttingQuantityBySize from '../pages/cutting/ReadyToLoad/CuttingQuantityBySize'


// import ReCuttingMaster from '../pages/cutting/ReCuttingOld/RecuttingMaster';
// import ReCuttingInput from '../pages/cutting/ReCuttingOld/ReCuttingInput';
import ReadytoLoadHelp from '../pages/cutting/ReadyToLoad/ReadytoLoadHelp'
const CuttingMasterRouter = () => {

    return (
        <>
            <Routes>
                <Route path="cut-master" element={<CuttingMaster />} />
                <Route path="cut-input" element={<CuttingQuantityBySize />} />
                {/* <Route path="recuttingmaster" element={<ReCuttingMaster/>} />            */}
                {/* <Route path="recuttinginput" element={<ReCuttingInput/>} />    */}
                <Route path="cut-help" element={<ReadytoLoadHelp />} />

            </Routes>
        </>
    )
}

export default CuttingMasterRouter;