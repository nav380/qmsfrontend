// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DefectMaster from '../pages/Masters/DefectMaster';
import OperationMaster from '../pages/Masters/OperationMaster';
import StyleSilhouettes from  '../pages/Masters/StyleSilhouettes';
import ObHistory from '../pages/Masters/ObHistory';
import SilhouettesList from '../pages/Masters/SilhouettesList';
import ShiftMaster from '../pages/shiftMaster/ShiftMaster';
import AddShift from '../pages/shiftMaster/AddShift';
import ViewObData from '../pages/Masters/ViewObData';
import OPMaster from '../pages/Masters/OrederPlanMaster/OPMaster';
import OrderProForm from '../pages/Masters/OrederPlanMaster/OrderProForm';
import OrderProPlan from '../pages/Masters/OrederPlanMaster/OrderProPlan';
import UserMaster from '../pages/userMaster/UserMaster';
import SectionMaster from '../pages/Masters/OrederPlanMaster/SectionMaster';
import ProcessMaster from '../pages/Masters/OrederPlanMaster/ProcessMaster';
import ViewUserPermission from '../pages/userMaster/ViewUserPermission';

const MastersRouter = () => {
  return (
    <Routes>
      <Route path="defect-master" element={<DefectMaster />} />
      <Route path="operation-master" element={<OperationMaster />} />
      <Route path="style-silhouettes" element={<StyleSilhouettes />} />
      <Route path="ob-history" element={<ObHistory />} />
      <Route path="silhouettes-list" element={<SilhouettesList />} />
      <Route path="sift-master" element={<ShiftMaster />} />
      <Route path="add-sift-master" element={<AddShift />} />
      <Route path="view-saved" element={<ViewObData />} />

      <Route path="o-p-master" element={<OPMaster />} />
      <Route path="o-p-plan" element={<OrderProPlan />} />
      <Route path="o-p-plan-form" element={<OrderProForm />} />
      <Route path="section-master" element={<SectionMaster />} />
      <Route path="process-master" element={<ProcessMaster />} />

      <Route path="user-master" element={<UserMaster />} />
      <Route path="view-user-permission/:userId" element={<ViewUserPermission />} />


    </Routes>
  );
}

export default MastersRouter;
