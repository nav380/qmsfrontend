import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DjangoConfig from '../../config/Config';

const Audit = () => {
  const navigate = useNavigate();
  const [auditData, setAuditData] = useState([]);

  const GetAuditType = async () => {
    try {
      const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_api/`, {
        params: { 
          call: 'get_audit_type',
        },
      });
      console.log('Audit Type response:', response.data);
      setAuditData(response.data.data); // Assuming response.data.data is the array
    } catch (error) {
      console.error('Error fetching Audit data:', error);
      // toast.error('Error fetching buyer data.');  
    }
  };

  useEffect(() => {
    GetAuditType();
  }, []);

  return (
    <div className='flex justify-center items-center h-[50vh]'>
      <div className='space-x-4'>
        {auditData.map(audit => (
          <button
            key={audit.id}
            className='btn bg-blue-500 text-white text-center py-8 px-20 h-20 p-20 rounded-lg text-xl'
            onClick={() => navigate(`/dashboard/audit/audit-selection/${audit.name.replace(/\s+/g, '-').toLowerCase()}/${audit.id}`)}
          >
            {audit.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Audit;
