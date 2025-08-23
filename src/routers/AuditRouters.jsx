import { Route, Routes } from 'react-router-dom';
import AuditPage from '../pages/SewingAudit/AuditPage';
import Audit from '../pages/SewingAudit/Audit';
import History from '../pages/SewingAudit/History';
import AuditHistory from '../pages/SewingAudit/AuditHistory';
// import AuditPermission from '../pages/SewingAudit/AuditPermission';
import AuditHelpPage from '../pages/SewingAudit/AuditHelpPage';

function AuditRouters() {
  return (
    <Routes>
      <Route path="audit-selection" element={<Audit />} />
      <Route path="audit-selection/:type/:id/:pid" element={<AuditPage />} />
      <Route path="audit-selection/:type/:id/:pid/:audit_no_id" element={<AuditPage />} />
      <Route path="audit-history/" element={<History />} />
      <Route path="audit-history/:type/:id/:pid" element={<AuditHistory />} />
      {/* <Route path="audit-permission/" element={<AuditPermission />} /> */}
      <Route path='help/' element={<AuditHelpPage />} />
    </Routes>
  );
}

export default AuditRouters;
