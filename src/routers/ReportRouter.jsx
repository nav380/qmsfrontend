
import { Route, Routes } from 'react-router-dom';
import RtqmRetport from '../pages/Reports/RtqmRetport';
import SizeWiseReport from '../pages/Reports/SizeWiseReport';
import DailyProductionReport from '../pages/Reports/DailyProductionReport'
import ProductionMaster from '../pages/Reports/ProductionMaster'
import ProductionHelper from '../pages/Reports/ProductionHelper'
import DailyProcessReports from '../pages/Reports/DailyProcessReports';


const ReportRouter = () => {
    return (
        <Routes>
            <Route path="rtqm-report" element={<RtqmRetport/>}/>
            <Route path="size-wise-report" element={<SizeWiseReport/>}/>
            <Route path="daily-production-report" element={<DailyProductionReport/>}/>
            <Route path="date-wise-report" element={<ProductionMaster />} />
            <Route path="pro-help" element={<ProductionHelper />} />
            <Route path="daily-process-reports" element={<DailyProcessReports />} />
        </Routes>
    );
}

export default ReportRouter;
