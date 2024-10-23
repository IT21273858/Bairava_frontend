import React, { useEffect, useState } from "react";
import { AiFillFilePdf, AiOutlineDelete, AiOutlineDownload, AiOutlineFileImage, AiOutlineFilePdf, AiOutlineSortAscending } from "react-icons/ai";
import { FiEdit, FiImage, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Utils/navbar";
import apiClient from "../../Utils/config/apiClient"; // Assuming you have an API client set up
import InvoicePDFGenerator from "../../Utils/productpdf";
import Swal from "sweetalert2";
import AlertPopup from "../Alertpopup";
import FetchLoader from "../loader/fetchloader";
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import ProductPdfGenerator from "../../Utils/productpdf";


const ProductList = () => {
  const [activeButton, setActiveButton] = useState("Products");
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for the search term
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleting, setisDeleting] = useState(false)
  const [isloading, setIsloading] = useState(false)
  const rowsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsloading(true)
      try {
        const response = await apiClient._get('/products/getAll');
        setRows(response.products); // Assuming the API returns an array of orders
        console.log("Response");
        console.log(response.products);
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
    navigate(`/edit-product/${orderId}`); // Navigate to the EditOrderForm component
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

  const handlePdfClicks = async (productId) => {
    try {
      const response = await apiClient.get(`/products/get/${productId}`);
      const payload = response.data.product;
      if (payload) {
        console.log(payload);
        ProductPdfGenerator(payload)
      } else {
        console.error("No invoice order data found.");
      }
    } catch (error) {
      console.error("Error fetching invoice order data:", error);
    }
  }

  function convertImageToBase64(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result); // Base64 string result
      };
      reader.readAsDataURL(xhr.response); // Converts Blob to Base64
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob'; // Use blob to handle binary image data
    xhr.send();
  }
  function handleDownloadPDF(barcodeUrl, barcodeId) {
    const imageUrl = barcodeUrl // Your image URL

    convertImageToBase64(imageUrl, (base64Image) => {
      const doc = new jsPDF();

      // Now add the Base64 image to your PDF
      doc.addImage(base64Image, 'PNG', 10, 10, 50, 50); // Adjust size and position as needed

      doc.save('product-info.pdf');
    });
  }



  const handleDownloadImage = async (barcodeUrl, barcodeId) => {
    try {
      const link = document.createElement("a");
      link.href = barcodeUrl;
      link.download = `barcode-${barcodeId}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  // const handleDownloadPDF = async (barcodeUrl, barcodeId) => {
  //   const pdf = new jsPDF();
  //   try {
  //     const img = new Image();
  //     img.src = barcodeUrl;
  //     img.onload = () => {
  //       pdf.addImage(img, "PNG", 10, 10, 100, 50); // Adjust the dimensions as necessary
  //       pdf.save(`barcode-${barcodeId}.pdf`);
  //     };
  //   } catch (error) {
  //     console.error("Failed to download PDF:", error);
  //   }
  // };


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
        await apiClient._delete(`/products/delete/${orderid}`)
          .then((data) => {
            if (data.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Product has been deleted.",
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
  const handleCreateProduct = () => {
    navigate('/create-product'); // Navigate to the CreateOrderForm component
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
        row.SKU_id.toLowerCase().includes(searchLower) ||
        row.name.toLowerCase().includes(searchLower) ||
        row?.flavour.toLowerCase().includes(searchLower)
      );
    })
  ).slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (

    <div className="sm:container md:mx-auto">
      <Navbar
        buttons={["Dashboard", "Products", "Users"]}
        activeButton={activeButton}
        onButtonClick={handleButtonClick}
      />

      <div className="mt-4">
        <div className="flex justify-between items-center md:px-4 px-2">
          <h2 className="md:text-2xl text-lg font-semibold text-gray-950">All Products</h2>
          <div className="flex items-center gap-2 border border-gray-300 rounded">
            <span className="text-gray-800 p-2"> <FiSearch /></span>
            <input
              type="text"
              placeholder="Search here..."
              className="p-2 text-sm md:w-72 w-44"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button className="flex md:ml-4 ml-2 text-gray-700 border-2 border-gray-950 rounded-lg md:px-5 px-2 md:py-2 py-1 hover:bg-slate-700 hover:text-white" onClick={handleSortClick}>
            <AiOutlineSortAscending size={24} /> <span>Sort</span>
          </button>
        </div>
        <div className="flex justify-center items-center mt-6">
          {isloading && <FetchLoader text="Fetching products... please hold" />}
        </div>

        {
          !isloading && (
            <>
              <div className="overflow-x-auto mt-4">
                <table className="w-full border border-gray-300 bg-white">
                  <thead>
                    <tr className="bg-gray-950">
                      <th className="p-4 border-b border-gray-300 text-white">SKU ID</th>
                      <th className="p-4 border-b border-gray-300 text-white">Title</th>
                      <th className="p-4 border-b border-gray-300 text-white">Description</th>
                      <th className="p-4 border-b border-gray-300 text-white">Flavour</th>
                      <th className="p-4 border-b border-gray-300 text-white">Price</th>
                      <th className="p-4 border-b border-gray-300 text-white">Barcode</th>
                      <th className="p-4 border-b border-gray-300 text-white">Manufacture</th>
                      <th className="p-4 border-b border-gray-300 text-white">Expiary</th>
                      <th className="p-4 border-b border-gray-300 text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows && filteredRows.length > 0 ? (
                      filteredRows.map((row) => (
                        <tr key={row.id}>
                          <td className="p-4 border border-gray-300">{row.SKU_id}</td>
                          <td className="p-4 border border-gray-300">{row.name} </td>
                          <td className="p-4 border border-gray-300">{row.description}</td>
                          <td className="p-4 border border-gray-300">{row.flavour}</td>
                          <td className="p-4 border border-gray-300">{row.price}</td>
                          <td className="p-4 border border-gray-300"><img src={row.barcode_image} className="w-30 h-20" id={`barcode-${row.id}`} alt="Barcode" /></td>
                          <td className="p-4 border border-gray-300">{(row.manufacture_date).split('T')[0]}</td>
                          <td className="p-4 border border-gray-300">{(row.expiary_date).split('T')[0]}</td>
                          <td className="p-4 border border-gray-300 space-x-4">
                            <button
                              className="text-gray-950"
                              onClick={() => handleDownloadImage(row.barcode_image, row.id)}
                            >
                              {/* <AiOutlineDownload size={13} /> */}
                               <AiOutlineFileImage size={18} />
                            </button>
                            <button
                              className="text-gray-950"
                              onClick={() => handlePdfClicks(row.id)}
                            >
                              {/* <AiOutlineDownload size={13} /> */}
                               <AiOutlineFilePdf size={18} />
                            </button>
                            <button className="text-gray-950" onClick={() => { handleDeleteClick(row.id) }}>
                              <AiOutlineDelete />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center p-4">
                          No Products found.
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
                  className="px-6 py-2 border-gray-950 border-2 text-gray-900 rounded-xl hover:bg-gray-950 hover:text-white hover:border-gray-600"
                  onClick={handleCreateProduct}
                >
                  Create Product
                </button>
              </div>

            </>

          )
        }
      </div>
    </div>
  );
};

export default ProductList;
