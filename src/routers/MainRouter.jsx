import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import MainDashboard from '../pages/auth/MainDashboard';
import Dashboard from '../pages/auth/Dashboard';
import RTQMRouter from './RTQMRouter';
import Header from '../components/Header';
import MastersRouter from './MastersRouter';
import QmsTabRouter from './QmsTabRouter';
import PlaningRouter from './PlaningRouter';
import AudioLoader from '../utils/Loader';
import InputRouter from './InputRouter';
import TvRouter from './TvRouter';
import CuttingRouter from './CuttingRouter'
import ReportRouter from './ReportRouter';
import CuttingMasterRouter from './CuttingMasterRouter';
import AuditRouters from './AuditRouters';
import LoginForm from '../pages/auth/LoginForm';
import LineSelection from '../pages/auth/LineSelection';
import FileHandOver from '../pages/fileHandOver/FileHandOver';

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="tab-login" element={<LoginForm />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="line-selection" element={<LineSelection />} />


        <Route path="/dashboard/*" element={<Header/>}>
        <Route index path="home" element={<Dashboard />} />
          
        <Route path="file-hand-over" element={<FileHandOver />} />

          <Route path="rtqm/*" element={<RTQMRouter />} />
          <Route path="master/*" element={<MastersRouter/>}/>
          <Route path="planing/*" element={<PlaningRouter/>}/>

          <Route path="loader/" element={<AudioLoader/>}/>
          <Route path="audit/*" element={<AuditRouters />}/>


          <Route path="cutting_route/*" element={<CuttingRouter />} />
          <Route path="reports/*" element={<ReportRouter/>}/>

        </Route>
        <Route path="cutting-input/*" element={<CuttingMasterRouter/>}/>

        <Route path="qms-tab/*" element={<QmsTabRouter/>}/>

        <Route path="input-master/*" element={<InputRouter/>}/>

        <Route path="tv/*" element={<TvRouter/>}/>
        
        {/* Handle unmatched routes (optional) */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default MainRouter;
