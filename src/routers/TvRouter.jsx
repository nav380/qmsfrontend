import { Route, Routes } from 'react-router-dom';
import TvDashboard1 from '../tv_Dashboard/TvDashboard1';
import TVDashboard2 from '../tv_Dashboard/TvDashboard2';
import TvDashboard from '../tv_Dashboard/TvDashboard';
import TVDashboard3 from '../tv_Dashboard/TvDashboard3';
import FinTvDashboard from '../tv_Dashboard/Finishing_tv_Dashboard/FinTvDashboard';
import FinTvDashboard1 from '../tv_Dashboard/Finishing_tv_Dashboard/FinTvDashboard1';
import FinTvDashboard2 from '../tv_Dashboard/Finishing_tv_Dashboard/FinTvDashboard2';
import FinTvDashboard3 from '../tv_Dashboard/Finishing_tv_Dashboard/FinTvDashboard3';
import CuttingDashboard from '../tv_Dashboard/Cutting_tv_dashboard/CuttingDashboard';


const TvRouter = () => {
  return (
    <Routes>
      <Route path="dashboard1" element={<TvDashboard1 />} />
      <Route path="dashboard2" element={<TVDashboard2 />} />
      <Route path="dashboard" element={<TvDashboard />} />
      <Route path="dashboard3" element={<TVDashboard3 />} />

      <Route path="ftdashboard" element={<FinTvDashboard/>} />
      <Route path="ftdashboard1" element={<FinTvDashboard1 />} />
      <Route path="ftdashboard2" element={<FinTvDashboard2 />} />
      <Route path="ftdashboard3" element={<FinTvDashboard3 />} />


      <Route path="cutdashboard1" element={<CuttingDashboard />} />


    </Routes>
  );
}

export default TvRouter;
