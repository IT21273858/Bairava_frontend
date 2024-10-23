import React, { useState, useEffect } from "react";
import apiClient from "../../Utils/config/apiClient"; // Assuming you have an API client set up
import Navbar from "../../Utils/navbar";
import { useNavigate } from "react-router-dom";

const LeadFormCreate = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const [formData, setFormData] = useState({
    Iid: "",
    name: "",
    email: "",
    phoneNumber: "",
    handleby: "",
    status: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const { Iid, name, email, phoneNumber, handleby, status } = formData;
    if (!Iid || !name || !email || !phoneNumber || !handleby || !status) {
      setErrorMessage("All fields are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const currentDate = new Date().toISOString(); // Get current date in ISO format

    const dataToSend = {
      ...formData,
      dob: currentDate, // Automatically set the current date as DOB
    };

    try {
      const response = await apiClient.post('/leads/create', dataToSend);
      console.log('Lead created:', response.data);
      navigate("/lead-list");
    } catch (error) {
      console.error("Failed to create lead", error);
      setErrorMessage("Failed to create lead. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center LeadFormCreate bg-white p-0 md:p-10 font-inter -mt-7">
      <Navbar 
        buttons={["Dashboard", "Leads", "User", "Calendar"]}
        activeButton={activeButton}
        onButtonClick={handleButtonClick}
        profilePicture="" 
      />
      <div className="w-full max-w-8xl bg-white md:p-8 flex flex-col flex-grow">
        {/* Form */}
        <div className="ml-[5px] shadow-md rounded-lg mt-0">
          <div className="ml-20">
            <h2 className="text-4xl mb-6 ml-10 pl-11 text-[#9630B7]">
              Create New Lead
            </h2>
            <form className="space-y-6 mr-5 mb-16" onSubmit={handleSubmit}>
              {[{
                id: "Iid",
                label: "Inquiry ID",
                type: "text",
                placeholder: "L01",
              },
              {
                id: "name",
                label: "Client’s Name",
                type: "text",
                placeholder: "Ashmitha",
              },
              {
                id: "email",
                label: "E-mail ID",
                type: "email",
                placeholder: "ash@gmail.com",
              },
              {
                id: "phoneNumber",
                label: "Contact",
                type: "text",
                placeholder: "0772334567",
              },
              { id: "handleby", label: "Handle", type: "text" },
              {
                id: "status",
                label: "Status",
                type: "select",
                options: ["Pending", "Cancel", "New"],
              }
              ].map((field) => (
                <div className="flex items-center mb-6 ml-20" key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="text-[#2B0091] font-medium w-1/5 text-left pr-4 ml-1 text-lg"
                  >
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <div className="relative w-3/5">
                      <select
                        id={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full ml-20 appearance-none pr-10"
                      >
                        {field.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="relative w-3/5">
                      <input
                        type={field.type}
                        id={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`px-4 py-2 border border-gray-300 rounded-lg bg-white w-full ${field.icon ? "pl-10" : "pl-4"} ml-20`}
                      />
                    </div>
                  )}
                </div>
              ))}

              {errorMessage && (
                <div className="text-red-500 text-center mb-4">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-center md:justify-end ml-0 md:ml-[75.5%]">
                <button
                  type="submit"
                  className="border-2 border-purple-500 text-pink-500 font-medium py-1 px-2 h-13 rounded-lg bg-white hover:bg-purple-100 w-full md:w-40 text-lg md:text-2xl"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadFormCreate;
