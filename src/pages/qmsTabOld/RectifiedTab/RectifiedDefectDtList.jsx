import React, { useEffect, useState } from "react";
import axios from "axios";
import DjangoConfig from "../../../config/Config";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

const RectifiedDefectDtList = () => {
  const sewingPlanData = useSelector((state) => state.sewingInput.rowData);
  const [buyerData, setBuyerData] = useState({});
  const [defectList, setDefectList] = useState([]);
  const [obFilter, setObFilter] = useState([]);
  const [counterDefectData, setCounterDefectData] = useState([]);
  const [id, setId] = useState("")
  console.log("sewingPlanData", sewingPlanData)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = {
      buyer: sewingPlanData.buyer,
      color: sewingPlanData.color,
      style: sewingPlanData.styleno,
    };

    try {
      const response = await axios.get(
        `${DjangoConfig.apiUrl}/rtqm/rtqm_dt_mt_rectified_view/`,
        { params: data }
      );

      const { defect_data_list, defect_mt_data, defect_counter } = response.data;

      // Set buyer data
      setBuyerData(defect_mt_data[0]);

      setDefectList(defect_data_list);
      console.log(defect_counter)

      // Filter unique ob_detail_id combinations for obFilter
      const uniqueObSet = new Set();
      const filteredObFilter = defect_data_list.filter((dt) => {
        const uniqueKey = `${dt.ob_detail_id}`;
        if (!uniqueObSet.has(uniqueKey)) {
          uniqueObSet.add(uniqueKey);
          return true;
        }
        return false;
      });
      setObFilter(filteredObFilter);

      // Set counter defect data
      setCounterDefectData(defect_counter);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const [checkedIndex, setCheckedIndex] = useState(null);

  const handleCheckboxChange = (id) => {
    setCheckedIndex(checkedIndex === id ? null : id);
    setId(id)


  };

  const handleSubmitAction = (status) => {
    console.log("status", status ,"id",id);
   

    if (status === 'REJECT' || status === 'RECTIFIED' ){
      const data={
        'status':status,
        'id' :id,
      }
      axios.post(`${DjangoConfig.apiUrl}/rtqm/rtqm_dt_mt_rectified_view/`,data)
      .then(response => {
          console.log(response.data.message);
          toast.success(response.data.message);
      })
        .catch(error => {
          console.error('Error:', error);
          if (error.response && error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error('Failed to submit action.');
          }
        });
    }
    else{
      const data={
        'status':status,
        'id' :id,
        'sewingPlanData':sewingPlanData
      }
      axios.post(`${DjangoConfig.apiUrl}/rtqm/rtqm_dt_mt_rectified_view/`,data)
      .then(response => {
          console.log(response.data.message);
          toast.success(response.data.message);
      })
        .catch(error => {
          console.error('Error:', error);
          if (error.response && error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error('Failed to submit action.');
          }
        });
    }

  
  };



  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Buyer</th>
            <th className="px-4 py-2">Style</th>
            <th className="px-4 py-2">Color</th>
            <th className="px-4 py-2">Size</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {counterDefectData.map((cd, index) => {
            const matchSize = defectList.find((dl) => dl.rtqm_dt_id === cd.rtqm_dt_id);
            console.log("matchSize", matchSize)
            return (
              <React.Fragment key={index}>
                <tr >
                  <td className="border px-4 py-2">{buyerData.buyer_name}</td>
                  <td className="border px-4 py-2">{buyerData.style}</td>
                  <td className="border px-4 py-2">{buyerData.color}</td>
                  <td className="border px-4 py-2">{matchSize ? matchSize.size : "N/A"}</td>
                  <td className="border px-4 py-2">
                    <div className="form-control">
                      <label className="cursor-pointer label">
                        <input type="checkbox" defaultChecked className="checkbox checkbox-accent" checked={checkedIndex === cd.id}
                          onChange={() => handleCheckboxChange(cd.id)} />


                      </label>
                    </div>
                  </td>
                </tr>
                {
                  [...new Set(
                    defectList
                      .filter(ob => ob.rtqm_counter_id === cd.id)
                      .map(ob => ob.ob_detail_id)
                  )].map((ob_detail_id, obIndex) => {
                    const ob_name = defectList.find(ob => ob.ob_detail_id === ob_detail_id)?.ob_name;

                    return (
                      <React.Fragment key={obIndex}>
                        <tr className="border">
                          <td colSpan="6" className=" px-4 py-2">
                            <strong>{ob_name}</strong>
                            <ol className="list-disc pl-5 flex">
                              {
                                defectList
                                  .filter(ob => ob.rtqm_counter_id === cd.id && ob.ob_detail_id === ob_detail_id)
                                  .map((defect, defectIndex) => (
                                    <li key={defectIndex} className="ml-5">{defect.defect_name}</li>
                                  ))
                              }
                            </ol>
                          </td>

                        </tr>



                      </React.Fragment>
                    );
                  })
                }
                {checkedIndex === cd.id && (
                  <tr>
                    <td colSpan="6" className="px-4 py-2 flex justify-around">
                      <button onClick={() => handleSubmitAction("REJECT")} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mr-2 rounded">
                        Reject
                      </button>
                      <button onClick={() => handleSubmitAction("DEFECT")} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mr-2 rounded">
                        Defect
                      </button>
                      <button onClick={() => handleSubmitAction("RECTIFIED")} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Rectified
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}

        </tbody>
      </table>


      {/* <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Buyer</th>
            <th className="px-4 py-2">Style</th>
            <th className="px-4 py-2">Color</th>
            <th className="px-4 py-2">Size</th>
            <th className="px-4 py-2">OB</th>
            <th className="px-4 py-2"></th>

          </tr>
        </thead>
        <tbody>
          {counterDefectData.map((cd, index) => {
            const matchSize = defectList.find((dl) => dl.rtqm_dt_id === cd.rtqm_dt_id);
            console.log("matchSize",matchSize)
            return (
              <tr key={index}>
                <td className="border px-4 py-2">{buyerData.buyer_name}</td>
                <td className="border px-4 py-2">{buyerData.style}</td>
                <td className="border px-4 py-2">{buyerData.color}</td>
                <td className="border px-4 py-2">{matchSize ? matchSize.size : "N/A"}</td>
                {
                  [...new Set(
                    defectList
                      .filter(ob => ob.rtqm_counter_id === cd.id)
                      .map(ob => ob.ob_detail_id)
                  )].map((ob_detail_id, obIndex) => {
                    // Assuming you have access to ob_name corresponding to ob_detail_id
                    const ob_name = defectList.find(ob => ob.ob_detail_id === ob_detail_id)?.ob_name;

                    return (
                      <tr key={obIndex}>
                        <td className="border px-4 py-2">{ob_name}</td>
                        {
                          defectList
                            .filter(ob => ob.rtqm_counter_id === cd.id && ob.ob_detail_id === ob_detail_id)
                            .map((defect, defectIndex) => (
                              <td key={defectIndex} className="border px-4 py-2">
                                {defect.defect_name}
                              </td>
                            ))
                        }
                      </tr>
                    );
                  })
                }


                
                <td className="border px-4 py-2">
                  <input type="checkbox" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table> */}




    </div>
  );
};

export default RectifiedDefectDtList;
