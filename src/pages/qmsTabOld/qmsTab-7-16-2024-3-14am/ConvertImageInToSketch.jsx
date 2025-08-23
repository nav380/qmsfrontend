import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DjangoConfig from '../../config/Config';

const ConvertImageInToSketch = () => {
    const navigate = useNavigate();
    const [frontImageUrl, setFrontImageUrl] = useState('');
    const [backImageUrl, setBackImageUrl] = useState('');
    const [frontSketchImageUrl, setFrontSketchImageUrl] = useState('');
    const [backSketchImageUrl, setBackSketchImageUrl] = useState('');

    const handleFileChange = async (event, setImageUrl, setSketchImageUrl) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.post(`${DjangoConfig.apiUrl}/rtqm/qms_defect_process/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    const imageUrl = URL.createObjectURL(file);
                    setImageUrl(imageUrl);

                    // const normalizedSketchImageUrl = response.data.sketch_image_url.replace(/\\/g, '/');
                    const sketchImagePath = response.data.sketch_image_url;
                    const sketchImageUrl = `${DjangoConfig.apiUrl}${sketchImagePath}`;
                    setSketchImageUrl(sketchImageUrl); 
                } else {
                    console.error('Failed to process image:', response.statusText);
                }
            } catch (error) {
                console.error('Error processing image:', error);
            }
        }
    };

    const handleFrontFileChange = (event) => {
        handleFileChange(event, setFrontImageUrl, setFrontSketchImageUrl);
    };

    const handleBackFileChange = (event) => {
        handleFileChange(event, setBackImageUrl, setBackSketchImageUrl);
    };

    const handleSave = () => {
        localStorage.setItem('frontSketchImageUrl', frontSketchImageUrl);
        localStorage.setItem('backSketchImageUrl', backSketchImageUrl);
        navigate("/qms-tab/defect-mark-location");
    };

    useEffect(() => {
        const storedFrontSketchImageUrl = localStorage.getItem('frontSketchImageUrl');
        const storedBackSketchImageUrl = localStorage.getItem('backSketchImageUrl');

        if (storedFrontSketchImageUrl) {
            setFrontSketchImageUrl(storedFrontSketchImageUrl);
        }
        if (storedBackSketchImageUrl) {
            setBackSketchImageUrl(storedBackSketchImageUrl);
        }
    }, []);

    
    // localStorage.clear();

    

   
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8">Upload Image to Sketch Converter</h1>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
                <div className="mb-2 flex justify-around ">
                    <div>
                        <label className="block mb-2 font-bold text-gray-700">Upload Front Side Image:</label>
                        <input type="file" onChange={handleFrontFileChange} />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold text-gray-700">Upload Back Side Image:</label>
                        <input type="file" onChange={handleBackFileChange} />
                    </div>
                </div>
                {/* <div className="mb-4 flex flex-wrap justify-around">
                    <div>
                        {frontImageUrl && (
                            <img src={frontImageUrl} alt="Uploaded" className="mt-2 max-w-full h-auto rounded-lg" />
                        )}
                    </div>
                    <div>
                        {backImageUrl && (
                            <img src={backImageUrl} alt="Uploaded" className="mt-2 max-w-full h-auto rounded-lg" />
                        )}
                    </div>
                </div> */}
                <div className="mb-4 flex flex-wrap justify-around">
                    <div>
                        {frontSketchImageUrl && (
                            <img src={frontSketchImageUrl} alt="Sketch" className="mt-2 max-w-full h-auto rounded-lg" />
                        )}
                    </div>
                    <div>
                        {backSketchImageUrl && (
                            <img src={backSketchImageUrl} alt="Sketch" className="mt-2 max-w-full h-auto rounded-lg" />
                        )}
                    </div>
                </div>
                
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 center text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ConvertImageInToSketch;
