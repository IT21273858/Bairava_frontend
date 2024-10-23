import React, { useEffect, useState } from 'react';
import { FiEdit, FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Utils/navbar";
import apiClient from "../../Utils/config/apiClient";
import FetchLoader from "../loader/fetchloader";
import AlertPopup from '../Alertpopup';
import Swal from "sweetalert2";

const Leadslist = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeButton, setActiveButton] = useState("Leads");
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState(false)
  const [isdeleting, setIsdeleting] = useState(false)
  const [isreload, setIsreload] = useState(false)
  const rowsPerPage = 6;
  const navigate = useNavigate();

  const fetchLeads = async () => {
    setIsloading(true)
    try {
      const response = await apiClient._get('leads/getAll');
      console.log(response); // Debugging

      // Sort leads by 'createdAt' field in descending order (most recent first)
      const sortedLeads = (response.users || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setLeads(sortedLeads);
      setIsloading(false)
    } catch (error) {
      setIsloading(false)
      AlertPopup({
        message: "Something Happended at our end",
        icon: "error",
      });
      console.error('Failed to fetch leads:', error);
    }
  };
  useEffect(() => {
    fetchLeads();
  }, [isreload]);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditClick = (leadId) => {
    navigate(`/edit-lead/${leadId}`); // Navigate to the EditLeadForm component
  };

  const handleDeleteClick = async (leadId) => {
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
        await apiClient._delete(`/leads/delete/${leadId}`)
          .then((data) => {
            if (data.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Lead has been deleted.",
                icon: "success",
              });
              setIsreload(true)
            }
            setIsdeleting(false)
          })
          .catch((err) => {
            setIsdeleting(false)
            if (err.response.status == 403) {
              AlertPopup({
                message: "Access Denied",
                icon: "warning",
              });
            } else {
              console.error(err);
              AlertPopup({
                message: "Something Happended at our end",
                icon: "error",
              });
            }
          });
      }
    })
  }


  const handleCreateLeadClick = () => {
    navigate('/create-lead'); // Navigate to the CreateLeadForm component
  };

  // Filter leads based on the search term
  const filteredLeads = leads.filter((lead) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      lead.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      lead.Iid.toLowerCase().includes(lowerCaseSearchTerm) ||
      lead.phoneNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
      lead.handleby.toLowerCase().includes(lowerCaseSearchTerm) ||
      lead.status.toLowerCase().includes(lowerCaseSearchTerm) ||
      (lead.dob && new Date(lead.dob).toLocaleDateString().toLowerCase().includes(lowerCaseSearchTerm))
    );
  });


  // Paginate the filtered leads
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="sm:container md:mx-auto">
      <Navbar
        buttons={["Dashboard", "Leads", "User", "Calendar"]}
        activeButton={activeButton}
        onButtonClick={handleButtonClick}
      />

      <div className="mt-4">
        <div className="flex justify-between gap-2 items-center md:px-4 px-2">
          <h2 className="md:text-2xl text-lg font-semibold text-purple-700">Lead Management</h2>
          <div className="flex items-center border border-gray-300 rounded">
            <span className="text-purple-800 p-2">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search here..."
              className="p-2 text-sm md:w-72 w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isloading && <FetchLoader text="Fetching Lead List... please hold" />}
        {isdeleting && <FetchLoader text="Deleting Lead List... please hold" />}


        {
          !(isloading || isdeleting) && (

            <>
              <div className="overflow-x-auto mt-4">
                <table className="w-full border border-gray-300 bg-white">
                  <thead>
                    <tr className="bg-gray-300">
                      <th className="p-4 border-b border-gray-300 text-purple-700">Inquiry ID</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Client's Name</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700 hidden md:table-cell">E-mail ID</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Contact</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700 hidden md:table-cell">Date of Birth</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700 hidden md:table-cell">Handle</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Status</th>
                      <th className="p-4 border-b border-gray-300 text-purple-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLeads.map((lead, index) => (
                      <tr key={index}>
                        <td className="p-4 border border-gray-300">{lead.Iid}</td>
                        <td className="p-4 border border-gray-300">{lead.name}</td>
                        <td className="p-4 border border-gray-300 hidden md:table-cell">{lead.email}</td>
                        <td className="p-4 border border-gray-300">{lead.phoneNumber}</td>
                        <td className="p-4 border border-gray-300 hidden md:table-cell">{new Date(lead.dob).toLocaleDateString()}</td>
                        <td className="p-4 border border-gray-300 hidden md:table-cell">{lead.handleby}</td>
                        <td className="p-4 border border-gray-300">
                          <span
                            className={`px-2 py-1 rounded-full ${lead.status === 'Pending'
                              ? 'bg-yellow-400'
                              : lead.status === 'Cancel'
                                ? 'bg-red-400'
                                : 'bg-blue-400'
                              }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4 border border-gray-300 space-x-4">
                          <button
                            className="text-purple-700"
                            onClick={() => handleEditClick(lead.id)}
                          >
                            <FiEdit size={13} />
                          </button>
                          <button
                            className="text-purple-700"
                            onClick={() => handleDeleteClick(lead.id)}
                          >
                            <RiDeleteBin6Line size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {paginatedLeads.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center p-4">
                          No leads found.
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
                  onClick={() => handlePageChange(Math.min(Math.ceil(filteredLeads.length / rowsPerPage), currentPage + 1))}>
                  &gt;
                </button>
              </div>

              <div className="flex justify-end mt-6 mr-3">
                <button
                  className="px-10 py-2 border border-purple-500 text-[#D55AA9] text-5 font-medium rounded"
                  onClick={handleCreateLeadClick}
                >
                  Create
                </button>
              </div>
            </>
          )
        }

      </div>
    </div >
  );
};

export default Leadslist;
