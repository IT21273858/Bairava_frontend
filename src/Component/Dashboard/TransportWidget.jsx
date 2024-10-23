import React, { useEffect, useState } from 'react';
import apiClient from "../../Utils/config/apiClient";
import AlertPopup from '../Alertpopup';

const TransportWidget = ({ title, value, icon, style }) => {
    const [transports, setTransports] = useState([]);
    const [isloading, setIsloading] = useState(true)

    useEffect(() => {

        const fetchTransports = async () => {
            setIsloading(true)
            try {
                const response = await apiClient._get('transport/getAll');
                console.log(response); // Debugging

                // Sort transports by 'createdAt' field in descending order (most recent first)
                const sortedTransports = (response.transports || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setTransports(sortedTransports);
                setIsloading(false)
            } catch (error) {
                setIsloading(false)
                AlertPopup({
                    message: "Something Happended at our end",
                    icon: "error",
                });

                console.error('Failed to fetch transports:', error);
            }
        };

        fetchTransports();
    }, []);
    return (
        <div className="bg-white p-4 rounded-lg shadow" style={style}>
            <div className="flex items-start flex-col">
                <div className='flex flex-row'>
                    <div className="text-purple-600 text-2xl mr-4">{icon}</div>
                    <div>
                        <h2 className="font-bold text-purple-600">{title}</h2>
                        <p className="text-3xl font-semibold">{transports.length}</p>
                    </div>
                </div>
                <div className='bg-[#95ADD2] flex flex-col items-center justify-center w-full rounded-lg'>
                    {
                        transports.map((transport, index) => {
                            return (
                                <div className='flex flex-row text-white gap-4 w-full justify-center items-center' key={index}>
                                    <div className='flex flex-row items-center justify-center gap-4 w-full'>
                                        <div className='justify-start w-24'>
                                            {transport.t_name}
                                        </div>
                                        <div>
                                            <img src={transport.t_image} alt="Transport" className="h-8 w-8 object-cover rounded-2xl items-center justify-center" />
                                        </div>
                                        <div>
                                            {transport.t_numberplate}
                                        </div>
                                        <div className='justify-start w-24'>
                                            {transport.t_drivername}
                                        </div>
                                    </div>
                                </div>
                            )
                        })

                    }
                </div>
            </div>
        </div>
    );
};

export default TransportWidget;
