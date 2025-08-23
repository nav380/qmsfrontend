// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import QCSection from '../pages/qmsTab/QCSection';
import DefectSizeMaster from '../pages/qmsTab/DefectTab/DefectSizeMaster';
import OperationsMasterSelect from '../pages/qmsTab/DefectTab/OperationsMasterSelect';
import DefectMasterSelect from '../pages/qmsTab/DefectTab/DefectMasterSelect';
import DefectMarkLocation from '../pages/qmsTab/DefectTab/DefectMarkLocation';
import PassSizeInput from '../pages/qmsTab/passRftTab/PassSizeInput';
import EndLineStart from '../pages/qmsTab/EndLineStart';
import RejectSizeMaster from '../pages/qmsTab/RejectTab/RejectSizeMaster';
import RejectOperationMaster from '../pages/qmsTab/RejectTab/RejectOperationMaster';
import RejectDefectMaster from '../pages/qmsTab/RejectTab/RejectDefectSelection';
import RejectMarkLocation from '../pages/qmsTab/RejectTab/RejectMarkLocation';
import RectifiedDefectDtList from '../pages/qmsTab/RectifiedTab/RectifiedDefectDtList';
import RectifiedDefectSelect from '../pages/qmsTab/RectifiedTab/RectifiedDefectSelect';
import RectifiedOperationsMaster from '../pages/qmsTab/RectifiedTab/RectifiedOperationsMt';
import RectifiedMarkLocation from '../pages/qmsTab/RectifiedTab/RectifiedMarkLocation';
import ActivityLog from '../pages/qmsTab/ActivityLog';
import SizeWiseLog from '../pages/qmsTab/SizeWiseLog';
import KajButtonScreen from '../pages/qmsTab/kajButton/KajButtonScreen';
import HelpButton from '../pages/qmsTab/HelpButton';
import DateWiseReport from '../pages/qmsTab/DateWiseReport';


const QmsTabRouter = () => {
    return (
        <Routes>
            <Route path="qc-section" element={<QCSection />} />
            <Route path="end-line-start" element={<EndLineStart/>} />
            <Route path="activity-log" element={<ActivityLog/>} />
            <Route path="size-wise-log" element={<SizeWiseLog/>} />
            <Route path="help-button" element={<HelpButton  />} />
            <Route path="date-wise-report" element={<DateWiseReport/>} />


            {/* Defect Routers */}
            <Route path="operation-master-select" element={<OperationsMasterSelect />} />
            <Route path="defect-size-master" element={<DefectSizeMaster/>} />
            <Route path="defect-master-select" element={<DefectMasterSelect/>} />
            <Route path="defect-mark-location" element={<DefectMarkLocation/>} />

            {/* Pass Routers */}
            <Route path="pass-size-input" element={<PassSizeInput/>} />

            {/* Reject Routers */}
            <Route path="reject-size-master" element={<RejectSizeMaster/>} />
            <Route path="reject-operation-master" element={<RejectOperationMaster/>} />
            <Route path="reject-defect-master" element={<RejectDefectMaster/>} />
            <Route path="reject-mark-location" element={<RejectMarkLocation/>} />


            {/* Rectified Routers */}

            <Route path="rectified-defect-dt-list" element={<RectifiedDefectDtList/>} />
            <Route path="rectified-operation-master" element={<RectifiedOperationsMaster/>} />
            <Route path="rectified-defect-select" element={<RectifiedDefectSelect/>} />
            <Route path="rectified-mark-location" element={<RectifiedMarkLocation/>} />
          
            <Route path="kaj-button-screen" element={<KajButtonScreen/>} />


        </Routes>
    );
}

export default QmsTabRouter;
