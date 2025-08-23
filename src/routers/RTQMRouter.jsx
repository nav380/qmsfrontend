import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrderProcessPlanMT from '../pages/RTQM/OrderProcessPlanMT';
import OrderProcessPlanDT from '../pages/RTQM/OrderProcessPlanDT';
import LineMaster from '../pages/LineMaster/LineMaster';
import SelectQuantityByLineMaster from '../pages/LineMaster/SelectQuantityByLineMaster';

const RTQMRouter = () => {
  return (
    <Routes>
      <Route path="order-process-plan-mt" element={<OrderProcessPlanMT />} />
      <Route path="order-process-plan-dt" element={<OrderProcessPlanDT />} />
      <Route path="line-master" element={<LineMaster/>}/>
      <Route path="select-quantity-by-master" element={<SelectQuantityByLineMaster/>}/>


    </Routes>
  );
}

export default RTQMRouter;
