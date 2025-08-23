import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LineMaster from '../pages/InputMaster/LineMaster';
import SelectQuantityByLineMaster from '../pages/InputMaster/SelectQuantityByLineMaster';
import InputLogin from '../pages/InputMaster/InputLogin';
import InputHelp from '../pages/InputMaster/InputHelp';


const InputRouter = () => {
    return (
        <Routes>
            <Route path="input-login" element={<InputLogin />} />
            <Route path="line-master" element={<LineMaster />} />
            <Route path="select-quantity-by-master" element={<SelectQuantityByLineMaster />} />
            <Route path="input-help" element={<InputHelp />} />

        </Routes>
    );
}

export default InputRouter;
