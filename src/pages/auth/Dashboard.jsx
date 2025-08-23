import React, { useEffect } from 'react'
import DjangoConfig from '../../config/Config';
import axios from 'axios';

function Dashboard() {

  useEffect(() => {
    fetchDefectData();
}, []);

const fetchDefectData = () => {
    axios.get(`${DjangoConfig.apiUrl}/rtqm/home/`)
        .then(response => {
          console.log(response.data)
        
        })
        .catch(error => {
            console.error('Error:', error);
        });
};
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard