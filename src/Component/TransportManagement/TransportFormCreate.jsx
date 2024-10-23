import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Utils/navbar";
import axios from "axios";
import apiClient from "../../Utils/config/apiClient";

const TransportFormCreate = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
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
  const [loading, setIsLoading] = useState(false)

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
      formData.append("image", file);
      formData.append("type", type);

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/upload/upload`,
        formData
      );

      if (response.status === 200) {
        const uploadedImageUrl = response.data.fileUrl;
        const cUrl = "https://" + uploadedImageUrl.slice(31);
        return cUrl;
      }
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();

    const formDataCopy = { ...formData };

    // If an image file is selected, upload it
    if (imageFile) {
      const uploadedImageUrl = await uploadImage(imageFile, `transport/${formDataCopy.t_name}`);
      if (uploadedImageUrl) {
        formDataCopy.t_image = uploadedImageUrl;
      }
    }

    try {
      const response = await apiClient.post(`/transport/create`, formDataCopy, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Transport created:", response.data);
      setIsLoading(false)
      navigate("/transport-list");
    } catch (error) {
      setIsLoading(false)
      console.error("Failed to create transport", error);
    }
  };

  return (
    <div className="flex flex-col items-center TransportFormEdit bg-white p-0 md:p-10 font-inter -mt-7">
      <Navbar
        buttons={["Dashboard", "Transports", "User", "Bookings"]}
        activeButton={activeButton}
        onButtonClick={setActiveButton}
      />
      <div className="w-full max-w-8xl bg-white md:p-8 flex flex-col flex-grow">
        <div className="ml-[5px] shadow-md rounded-lg mt-0">
          <div className="ml-20">
            <h2 className="text-4xl mb-6 ml-10 pl-11 text-[#9630B7]">
              Create Transport
            </h2>
            <form className="space-y-6 mr-5 mb-16" onSubmit={handleSubmit}>
              {[
                { id: "t_name", label: "Transport Name", type: "text", placeholder: "Vehicle Name" },
                { id: "t_numberplate", label: "Number Plate", type: "text", placeholder: "AW-1090" },
                { id: "t_drivername", label: "Driver's Name", type: "text", placeholder: "Driver name" },
                { id: "t_driverNic", label: "Driver's NIC", type: "text", placeholder: "Driver Nic" },
                { id: "t_driverContactNo", label: "Driver's Contact No", type: "text", placeholder: "Contact No" },
              ].map((field) => (
                <div className="flex items-center mb-6 ml-20" key={field.id}>
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
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    className={`px-4 py-2 border border-gray-300 rounded-lg bg-white w-full ml-20`}
                  />
                </div>
              ))}

              <div className="flex items-center mb-6 ml-20">
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

              <div className="flex items-center mb-6 ml-20">
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
                  {loading ? "Saving..." : "Save"}

                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportFormCreate;
