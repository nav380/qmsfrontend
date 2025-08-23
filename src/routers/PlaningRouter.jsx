import { Route, Routes } from 'react-router-dom';
import Planing from '../pages/plan/Planing';
import SelectPlaningDt from '../pages/plan/SelectPlaningDt';

import FinishingPlaning from '../pages/plan/FinishingPlaning';
import FinishingPlaningDt from '../pages/plan/FinishingPlaningDt';


const PlaningRouter = () => {
    return (
        <Routes>
            <Route path="planing-input" element={<Planing/>}/>
            <Route path="planing-size-quantity/:planingId" element={<SelectPlaningDt/>}/>
            <Route path="finishing-planing" element={<FinishingPlaning />} />
            <Route path="finishing-planing-dt/:planingId" element={<FinishingPlaningDt />} />
        </Routes>
    );
}

export default PlaningRouter;
