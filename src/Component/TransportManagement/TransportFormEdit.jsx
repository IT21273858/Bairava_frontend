import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Utils/navbar";
import apiClient from "../../Utils/config/apiClient";
import axios from "axios";
import FetchLoader from "../loader/fetchloader";
import AlertPopup from "../Alertpopup";


const TransportFormEdit = () => {
  const navigate = useNavigate();
  const { id: transportId } = useParams();
  const [activeButton, setActiveButton] = useState("Transports");
  const [formData, setFormData] = useState({
    t_name: "",
    t_image: "",
    t_numberplate: "",
    t_drivername: "",
    t_driverNic: "",
    t_driverContactNo: "",
    status: "Active", // Default status
  });
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [imageFile, setImageFile] = useState(null); // For file upload
  const [isloading, setIsLoading] = useState(false)
  const [issubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchTransportData = async () => {
      setIsLoading(true)
      try {
        const response = await apiClient.get(`/transport/get/${transportId}`);
        const transportData = response.data.transport;
        setFormData(transportData);
        setPreviewImage(transportData.t_image); // Set the preview to the existing image
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        AlertPopup({
          message: "Something Happended at our end",
          icon: "error",
        });
        console.error("Failed to fetch transport data", error);
      }
    };

    fetchTransportData();
  }, [transportId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file)); // Generate a preview URL for the selected image
  };

  const uploadImage = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // The API expects the 'image' key for file uploads
      formData.append("type", type); // Dynamically set the file type (like "profile", "transport", etc.)

      // Make the POST request to the server
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/upload/upload`,
        formData
      );

      // If the upload is successful, handle the returned image URL
      if (response.status === 200) {
        const uploadedImageUrl = response.data.fileUrl;

        // Adjust the URL formatting if needed
        const cUrl = "https://" + uploadedImageUrl.slice(31);
        return cUrl; // Return the formatted full URL
      }
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      return null; // Return null if the upload fails
    }
  };

  const handleSubmit = async (e) => {
    setIsSubmitting(true)
    e.preventDefault();

    const formDataCopy = { ...formData };

    // Remove any timestamps if they exist
    delete formDataCopy.created_at;
    delete formDataCopy.updated_at;
    delete formDataCopy.id

    // If an image file is selected, upload it using the uploadImage function
    if (imageFile) {
      const uploadedImageUrl = await uploadImage(imageFile, `transport/${formDataCopy.t_name}`);
      if (uploadedImageUrl) {
        formDataCopy.t_image = uploadedImageUrl; // Set the image URL in the form data
      }
    }

    try {
      const response = await apiClient.patch(`/transport/update/${transportId}`, formDataCopy, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Transport updated:", response.data);
      setIsSubmitting(false)
      navigate("/transport-list");
    } catch (error) {
      setIsSubmitting(false)
      console.error("Failed to update transport", error);
    }
  };

  return (
    <div className="">
      <Navbar
        buttons={["Dashboard", "Transports", "User", "Bookings"]}
        activeButton={activeButton}
        onButtonClick={setActiveButton}
      />
      {isloading && <FetchLoader text="Fetching Transport Details... please hold" />}
      {
        !isloading && (
          <div className="w-full max-w-8xl bg-white md:p-8 flex flex-col flex-grow">
            <div className="ml-[5px] shadow-md rounded-lg mt-0">
              <div className="md:ml-20 ml-2">
                <h2 className="text-4xl mb-6 md:ml-10 ml-2 md:pl-11 text-[#9630B7]">
                  Edit Transport Details
                </h2>
                <>
                  <form className="space-y-6 mr-5 mb-16" onSubmit={handleSubmit}>
                    {[
                      { id: "t_name", label: "Transport Name", type: "text" },
                      { id: "t_numberplate", label: "Number Plate", type: "text" },
                      { id: "t_drivername", label: "Driver's Name", type: "text" },
                      { id: "t_driverNic", label: "Driver's NIC", type: "text" },
                      { id: "t_driverContactNo", label: "Driver's Contact No", type: "text" },
                    ].map((field) => (
                      <div className="flex items-center mb-6 md:ml-20 ml-2" key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="text-[#2B0091] font-medium w-1/5 text-left pr-4 ml-1 text-lg"
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          id={field.id}
                          value={formData[field.id] || ""}
                          onChange={handleChange}
                          className={`px-4 py-2 border border-gray-300 rounded-lg bg-white w-full ml-20`}
                        />
                      </div>
                    ))}

                    {/* Transport Image Upload */}
                    <div className="flex items-center mb-6 md:ml-20 ml-2">
                      <label
                        htmlFor="t_image"
                        className="text-[#2B0091] font-medium w-1/5 text-left pr-4 ml-1 text-lg"
                      >
                        Transport Image
                      </label>
                      <input
                        type="file"
                        id="t_image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full ml-20"
                      />
                    </div>

                    {/* Status Field */}
                    <div className="flex items-center mb-6 md:ml-20 ml-2">
                      <label
                        htmlFor="status"
                        className="text-[#2B0091] font-medium w-1/5 text-left pr-4 ml-1 text-lg"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full ml-20"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Preview the selected or existing image */}
                    {previewImage && (
                      <div className="flex justify-center mb-6">
                        <img
                          src={previewImage}
                          alt="Transport Preview"
                          className="h-48 w-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex justify-center md:justify-end ml-0 md:ml-[75.5%]">
                      <button
                        type="submit"
                        className="border-2 border-purple-500 text-pink-500 font-medium py-1 px-2 h-13 rounded-lg bg-white hover:bg-purple-100 w-full md:w-40 text-lg md:text-2xl"
                      >
                        {issubmitting ? "Editing..." : "Edit"}
                      </button>
                    </div>
                  </form>

                </>

              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default TransportFormEdit;
