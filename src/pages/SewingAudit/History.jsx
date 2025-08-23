import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DjangoConfig from '../../config/Config';

const History = () => {
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
    <div className='flex flex-col h-screen p-4'>
      {/* Heading */}
      <h1 className='text-3xl font-bold mb-4'>
        Audit History
      </h1>
      
      {/* Content */}
      <div className='flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 lg:gap-4'>
        {auditData.length > 0 ? (
          auditData.map(audit => (
            <button
              key={audit.id}
              className='btn bg-blue-500 text-white py-5 px-6 rounded-lg text-lg w-full h-20 flex items-center justify-center'
              onClick={() => navigate(`/dashboard/audit/audit-history/${audit.name.replace(/\s+/g, '-').toLowerCase()}/${audit.id}/${audit.pro_master_id}`)}
            >
              {audit.name} History
            </button>
          ))
        ) : (
          <p className='text-lg text-gray-500 col-span-full'>No audit types available.</p>
        )}
      </div>
    </div>
  );
};

export default History;
