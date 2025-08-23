import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DjangoConfig from '../../config/Config';
import axios from 'axios';

const AuditHelpPage = () => {
  const [helpData, setHelpData] = useState([]);

  const location = useLocation();
  const { selectedUnit, selectedFloor, selectedLine, selectedBuyer, selectedStyle, selectedColor, selectedRef, section, processID } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${DjangoConfig.apiUrl}/sewing_audit/sewing_audit_history/`, {
          params: {
            call: 'get_style_wise_data',
            unit_id: selectedUnit?.value || null,
            floor_id: selectedFloor?.value || null,
            line_id: selectedLine?.value || null,
            buyer_id: selectedBuyer?.value || null,
            style_id: selectedStyle?.value || null,
            color_id: selectedColor?.value || null,
            ref_id: selectedRef?.value || null,
            section_id: section,
            process_id: processID
          },
        });
        setHelpData(response.data);
      } catch (error) {
        console.error('Error fetching help data:', error);
      }
    };

    fetchData();
  }, [selectedUnit, selectedFloor, selectedLine, selectedBuyer, selectedStyle, selectedColor, selectedRef, section, processID]);

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-6">Help Page</h1>
        <button className='btn btn-primary' onClick={() => window.history.back()}>Back</button>
      </div>

      {/* Top Section */}
      <div className="mb-4">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Unit</th>
              <th className="border px-4 py-2">Floor</th>
              <th className="border px-4 py-2">Line</th>
              <th className="border px-4 py-2">Buyer</th>
              <th className="border px-4 py-2">Style</th>
              <th className="border px-4 py-2">Our Ref</th>
              <th className="border px-4 py-2">Colour</th>
              <th className="border px-4 py-2">Del Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center">{selectedUnit?.label || selectedUnit || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{selectedFloor?.label || selectedFloor || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{selectedLine?.label || selectedLine || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{selectedBuyer?.label || selectedBuyer || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{selectedStyle?.label || selectedStyle || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{selectedRef?.label || selectedRef || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{selectedColor?.label || selectedColor || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{/* Add Delivery Date Here */}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Style Wise Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Style Wise</h3>
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Order Qty</th>
              <th className="border px-4 py-2">Order + Ex Qty</th>
              <th className="border px-4 py-2">Cut Qty</th>
              <th className="border px-4 py-2">Stitching Input Qty</th>
              <th className="border px-4 py-2">Stitching Output Qty</th>
              <th className="border px-4 py-2">Stitching Audit Qty (Pass)</th>
              <th className="border px-4 py-2">Balance to Audit</th>
            </tr>
          </thead>
          <tbody>
            {helpData && helpData.length > 0 ? (
              helpData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center">{item.orderqty}</td>
                  <td className="border px-4 py-2 text-center">{item.order_exe_qty}</td>
                  <td className="border px-4 py-2 text-center">{item.totalcutqty}</td>
                  <td className="border px-4 py-2 text-center">{item.stitching_input_qty}</td>
                  <td className="border px-4 py-2 text-center">{item.stitching_output_qty}</td>
                  <td className="border px-4 py-2 text-center">{item.stitching_audit_qty_pass}</td>
                  <td className="border px-4 py-2 text-center">{item.stitching_output_qty - item.stitching_audit_qty_pass}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Line Wise Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Line Wise</h3>
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Line</th>
              <th className="border px-4 py-2">Stitching Input Qty</th>
              <th className="border px-4 py-2">Stitching Output Qty</th>
              <th className="border px-4 py-2">Stitching Audit Qty (Pass)</th>
              <th className="border px-4 py-2">Balance to Audit</th>
            </tr>
          </thead>
          <tbody>
            {/* Assuming line-wise data also comes from helpData */}
            <tr>
              <td className="border px-4 py-2 text-center">A</td>
              <td className="border px-4 py-2 text-center">D</td>
              <td className="border px-4 py-2 text-center">E</td>
              <td className="border px-4 py-2 text-center">F</td>
              <td className="border px-4 py-2 text-center">{/* Calculation E-F */}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditHelpPage;
