import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineDownload, AiOutlineSortAscending } from "react-icons/ai";
import { FiEdit, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Utils/navbar";
import apiClient from "../../Utils/config/apiClient"; // Assuming you have an API client set up
import Swal from "sweetalert2";
import AlertPopup from "../Alertpopup";
import FetchLoader from "../loader/fetchloader";
const InvoiceList = () => {
  const [activeButton, setActiveButton] = useState("Invoice");
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for the search term
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleting, setisDeleting] = useState(false)
  const [isloading,setIsloading] = useState(false)
  const rowsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsloading(true)
      try {
        const response = await apiClient._get('/invoice/getAll');
        setRows(response.invoices); // Assuming the API returns an array of orders
        console.log("Response");
        console.log(response);
        setIsloading(false)
      } catch (error) {
        setIsloading(false)
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, [deleting]);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditClick = (orderId) => {
    navigate(`/edit-invoice/${orderId}`); // Navigate to the EditOrderForm component
  };
  const handlePdfClick = async (orderId) => {
    try {
      const response = await apiClient.get(`/invoice/get/${orderId}`);
      const payload = response.data.invoice;
      if (payload) {
        console.log(payload);
        InvoicePDFGenerator(payload)
      } else {
        console.error("No invoice order data found.");
      }
    } catch (error) {
      console.error("Error fetching invoice order data:", error);
    }
  }

  const handleDeleteClick = async (orderid) => {
    setisDeleting(false)
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
        await apiClient._delete(`/invoice/delete/${orderid}`)
          .then((data) => {
            if (data.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Invoice has been deleted.",
                icon: "success",
              });
              setisDeleting(true)
            }
          })
          .catch((err) => {
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
  const handleCreateInvoiceClick = () => {
    navigate('/create-invoice'); // Navigate to the CreateOrderForm component
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };
  const sortRows = (rowsToSort) => {
    return rowsToSort.sort((a, b) => {
      const dateA = new Date(a.createdAt); // Assuming the field is named 'created_at'
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const handleSortClick = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc")); // Toggle sort order
  };

  // Filter and sort rows based on search term and current sort order
  const filteredRows = sortRows(
    rows.filter((row) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        row.invoice_no.toLowerCase().includes(searchLower) ||
        row.bill_to.toLowerCase().includes(searchLower) ||
        row.type.toLowerCase().includes(searchLower) ||
        row.iterany?.title?.toLowerCase().includes(searchLower) ||
        row.accomodation?.h_name?.toLowerCase().includes(searchLower)
      );
    })
  ).slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    
    <div className="sm:container md:mx-auto">
      <Navbar
        buttons={["Dashboard", "Invoice", "Booking", "Calendar"]}
        activeButton={activeButton}
        onButtonClick={handleButtonClick}
        />

      <div className="mt-4">
        <div className="flex justify-between items-center md:px-4 px-2">
          <h2 className="md:text-2xl text-lg font-semibold text-purple-700">All Invoices</h2>
          <div className="flex items-center gap-2 border border-gray-300 rounded">
            <span className="text-purple-800 p-2"> <FiSearch /></span>
            <input
              type="text"
              placeholder="Search here..."
              className="p-2 text-sm md:w-72 w-44"
              value={searchTerm}
              onChange={handleSearchChange}
              />
          </div>
          <button className="flex md:ml-4 ml-2 text-purple-700 border-2 border-purple-700 rounded-lg md:px-5 px-2 md:py-2 py-1" onClick={handleSortClick}>
            <AiOutlineSortAscending size={24} /> <span>Sort</span>
          </button>
        </div>
        <div className="flex justify-center items-center mt-6">
              {isloading&&<FetchLoader text="Fetching invoices... please hold" />}
        </div>

        {
          !isloading && (
            <>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border border-gray-300 bg-white">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-4 border-b border-gray-300 text-purple-700">Invoice No</th>
                <th className="p-4 border-b border-gray-300 text-purple-700">Title</th>
                <th className="p-4 border-b border-gray-300 text-purple-700">Invoice Type</th>
                <th className="p-4 border-b border-gray-300 text-purple-700">Guest Name</th>
                <th className="p-4 border-b border-gray-300 text-purple-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows && filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <tr key={row.id}>
                    <td className="p-4 border border-gray-300">{row.invoice_no}</td>
                    <td className="p-4 border border-gray-300">{row.type == "Tour Invoice" ? row.iterany?.title : row.accomodation?.h_name} </td>
                    <td className="p-4 border border-gray-300">{row.type}</td>
                    <td className="p-4 border border-gray-300">{row.bill_to}</td>
                    <td className="p-4 border border-gray-300 space-x-4">
                      <button
                        className="text-purple-700"
                        onClick={() => handleEditClick(row.id)}
                      >
                        <FiEdit size={13} />
                      </button>
                      <button className="text-purple-700"
                        onClick={() => handlePdfClick(row.id)}
                      >
                        <AiOutlineDownload size={13} />

                      </button>
                      <button className="text-purple-700" onClick={() => { handleDeleteClick(row.id) }}>
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    No Invoices found.
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
            onClick={() =>
              handlePageChange(
                Math.min(Math.ceil(rows.length / rowsPerPage), currentPage + 1)
              )
            }
            disabled={currentPage === Math.ceil(rows.length / rowsPerPage)}
          >
            &gt;
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2 border-purple-500 border-4 text-purple-800 rounded"
            onClick={handleCreateInvoiceClick}
          >
            Create Invoice
          </button>
        </div>
            
            </>
            
          )
        }
      </div>
    </div>
  );
};

export default InvoiceList;
