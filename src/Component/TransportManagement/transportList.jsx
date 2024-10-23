import React, { useEffect, useState } from 'react';
import { FiEdit, FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Utils/navbar";
import apiClient from "../../Utils/config/apiClient";
import Swal from "sweetalert2";
import AlertPopup from "../Alertpopup";
import FetchLoader from "../loader/fetchloader";


const TransportList = () => {
  const [transports, setTransports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeButton, setActiveButton] = useState("Transport");
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState(true)
  const [isdeleting, setIsdeleting] = useState(false)
  const [isreload, setIsreload] = useState(false)
  const rowsPerPage = 6;
  const navigate = useNavigate();

  const fetchTransports = async () => {
    setIsloading(true)
    try {
      // Simulate API call with dummy data
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
  useEffect(() => {
    fetchTransports();
  }, [isreload]);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditClick = (transportId) => {
    navigate(`/edit-transport/${transportId}`); // Navigate to the EditTransportForm component
  };

  const handleDeleteClick = (transportId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsdeleting(true)
        try {
          // Simulate deletion, replace with actual API call if needed
          await apiClient.delete(`/transport/delete/${transportId}`);
          setTransports(transports.filter(transport => transport._id !== transportId));
          Swal.fire("Deleted!", "Transport has been deleted.", "success");
          setIsdeleting(false)
          setIsloading(false)
          setIsreload(true)
        } catch (error) {
          setIsdeleting(false)
          console.error("Error deleting transport:", error);
          AlertPopup({
            message: "Something happened on our end.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleCreateTransportClick = () => {
    navigate('/create-transport'); // Navigate to the CreateTransportForm component
  };

  // Filter transports based on the search term
  const filteredTransports = transports.filter((transport) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      transport.t_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      transport.status.toLowerCase().includes(lowerCaseSearchTerm) ||
      transport.t_drivername.toLowerCase().includes(lowerCaseSearchTerm) ||
      transport.t_driverContactNo.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  // Paginate the filtered transports
  const paginatedTransports = filteredTransports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="sm:container md:mx-auto">
      <Navbar
        buttons={["Dashboard", "Transport", "User", "Calendar"]}
        activeButton={activeButton}
        onButtonClick={handleButtonClick}
      />

      <div className="mt-4">
        <div className="flex justify-between items-center md:px-4 px-2">
          <h2 className="md:text-2xl text-lg font-semibold text-purple-700">Transport Management</h2>
          <div className="flex items-center border border-gray-300 rounded">
            <span className="text-purple-800 p-2">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search here..."
              className="p-2 text-sm md:w-72 min-w-44"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isloading && <FetchLoader text="Fetching Transports... please hold" />}
        {isdeleting && <FetchLoader text="Deleting Transport... please hold" />}

        {
          !(isloading || isdeleting) && (
            <>

              <div className="overflow-x-auto mt-4 px-2">
                <table className="w-full border border-gray-300 bg-white">
                  <thead>
                    <tr className="bg-gray-300">
                      <th className="p-4 border-b border-gray-300 text-purple-700">Transport Name</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Vehicle Number</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Driver's Name</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Driver NIC</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Driver Contact No</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Status</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Image</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransports.map((transport) => (
                      <tr key={transport._id}>
                        <td className="p-4 border border-gray-300">{transport.t_name}</td>
                        <td className="p-4 border border-gray-300">{transport.t_numberplate}</td>
                        <td className="p-4 border border-gray-300">{transport.t_drivername}</td>
                        <td className="p-4 border border-gray-300">{transport.t_driverNic}</td>
                        <td className="p-4 border border-gray-300">{transport.t_driverContactNo}</td>
                        <td className="p-4 border border-gray-300">
                          <span
                            className={`px-2 py-1 rounded-full ${transport.status === 'Active' ? 'bg-green-400' :
                              transport.status === 'Inactive' ? 'bg-red-400' :
                                'bg-yellow-400'
                              }`}
                          >
                            {transport.status}
                          </span>
                        </td>
                        <td className="p-4 border border-gray-300 justify-center items-center">
                          <img src={transport.t_image} alt="Transport" className="h-16 w-16 object-cover rounded-2xl items-center justify-center" />
                        </td>
                        <td className="p-4 border border-gray-300 space-x-4">
                          <button
                            className="text-purple-700"
                            onClick={() => handleEditClick(transport.id)} // Use _id instead of id
                          >
                            <FiEdit size={13} />
                          </button>
                          <button
                            className="text-purple-700"
                            onClick={() => handleDeleteClick(transport.id)} // Use _id instead of id
                          >
                            <RiDeleteBin6Line size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {paginatedTransports.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center p-4">
                          No transports found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex mt-4 justify-end mr-3">
                <button
                  className="px-3 py-2 border border-black"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <div className="px-3 py-2 border border-black bg-gray-200">
                  {currentPage}
                </div>
                <button
                  className="px-3 py-1 border border-black"
                  onClick={() => handlePageChange(Math.min(Math.ceil(filteredTransports.length / rowsPerPage), currentPage + 1))}>
                  &gt;
                </button>
              </div>

              <div className="flex justify-end mt-6 mr-3">
                <button
                  className="px-10 py-2 border border-purple-500 text-[#D55AA9] text-5 font-medium rounded"
                  onClick={handleCreateTransportClick}
                >
                  Create
                </button>
              </div>

            </>
          )
        }


      </div>
    </div>
  );
};

export default TransportList;
