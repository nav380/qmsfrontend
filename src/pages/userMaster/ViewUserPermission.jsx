import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DjangoConfig from '../../config/Config';
import axios from 'axios';

const ViewUserPermission = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();
    const [userName ,setUserName] = useState('')

    useEffect(() => {
        fetchUserPermissionData();
    }, [userId]);

    const fetchUserPermissionData = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = `${DjangoConfig.apiUrl}/rtqm/qms_user_master/?user_id=${userId}`;
            const response = await axios.get(url);

            if (response.status === 200) {
                setTableData(response.data.permission_data);
                setUserName(response.data.permission_data[0].user__username)
            } else {
                setError(`Unexpected status code: ${response.status}`);
            }
        } catch (err) {
            setError('Error fetching user permission data.');
            console.error("Error fetching user permission data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Permissions {userName}</h1>
            {loading && <p className="text-blue-500">Loading data...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {tableData.length === 0 && !loading && !error ? (
                <p className="text-gray-500">No data available</p>
            ) : (
                tableData.length > 0 && (
                    <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left text-gray-600 font-semibold">Process</th>
                                <th className="py-2 px-4 text-left text-gray-600 font-semibold">Section</th>
                                <th className="py-2 px-4 text-left text-gray-600 font-semibold">Unit</th>
                                <th className="py-2 px-4 text-left text-gray-600 font-semibold">Floor</th>
                                <th className="py-2 px-4 text-left text-gray-600 font-semibold">Line</th>
                                {/* Add more headers as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map(user => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4 text-gray-800">{user.process__name}</td>
                                    <td className="py-2 px-4 text-gray-800">{user.section__name}</td>
                                    <td className="py-2 px-4 text-gray-800">{user.unit_name}</td>
                                    <td className="py-2 px-4 text-gray-800">{user.floor_name}</td>
                                    <td className="py-2 px-4 text-gray-800">{user.line_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
};

export default ViewUserPermission;
