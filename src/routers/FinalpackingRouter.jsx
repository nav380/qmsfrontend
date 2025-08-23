import { Route, Routes } from 'react-router-dom';
import FinalpackingMaster from '../pages/finalpacking/FinalpackingMaster';
import FinalpackingInput from '../pages/finalpacking/FinalpackingInput';
import FinalpackingHelper from '../pages/finalpacking/FinalpackingHelper';
// import ProductionMaster from '../pages/Reports/ProductionMaster';
// import ProductionHelper from '../pages/Reports/ProductionHelper';
// import FinalpackingMaster from '../pages/finalpacking/FinalpackMaster';
// import FinalpackingInput from '../pages/finalpacking/FinalpackInput';
// import FinalpackingHelper from '../pages/finalpacking/FinalpackHerper';





const FinalpackingRouter = () => {
    return (
        <Routes>
           <Route path="finalpack-master" element={<FinalpackingMaster/>}/>
           <Route path="finalpack-input" element={<FinalpackingInput/>}/>
           <Route path="finalpack-help" element={<FinalpackingHelper/>}/>
           {/* production report route */}
           {/* <Route path="pro-master" element={<ProductionMaster/>}/>
           <Route path="pro-help" element={<ProductionHelper/>}/> */}
        </Routes>
    );
}

export default FinalpackingRouter;