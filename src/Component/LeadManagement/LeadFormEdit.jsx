import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Utils/navbar";
import apiClient from "../../Utils/config/apiClient"; // Assuming you have an API client set up
import FetchLoader from "../loader/fetchloader";
import AlertPopup from "../Alertpopup";

const LeadFormEdit = () => {
  const navigate = useNavigate();
  const { id: leadId } = useParams();
  const [activeButton, setActiveButton] = useState("Leads");
  const [formData, setFormData] = useState({
    Iid: "",
    name: "",
    email: "",
    phoneNumber: "",
    handleby: "",
    status: "",
  });
  const [isloading, setIsLoading] = useState(true)
  const [iseditting, setIseditting] = useState(false)

  useEffect(() => {
    const fetchLeadData = async () => {
      setIsLoading(true)
      try {
        const response = await apiClient.get(`/leads/get/${leadId}`);
        setFormData(response.data.lead);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        AlertPopup({
          message: "Something Happended at our end",
          icon: "error",
        });
        console.error("Failed to fetch lead data", error);
      }
    };

    fetchLeadData();
  }, [leadId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIseditting(true)
      // Use the current date as dob
      const currentDate = new Date().toISOString();

      const { Iid, name, email, phoneNumber, handleby, status } = formData;

      const dataToSend = {
        Iid,
        name,
        email,
        phoneNumber,
        handleby,
        status,
        dob: currentDate, // Assigning the current date for dob
      };

      console.log("Data to send");
      console.log(dataToSend);

      const response = await apiClient.patch(`/leads/update/${leadId}`, dataToSend);
      console.log("Lead updated:", response.data);
      setIseditting(false)
      navigate('/lead-list');
    } catch (error) {
      setIseditting(false)
      AlertPopup({
        message: "Something Happended at our end",
        icon: "error",
      });
      console.error("Failed to update lead", error);
    }
  };

  return (
    <div className="">
      <Navbar
        buttons={["Dashboard", "Leads", "User", "Calendar"]}
        activeButton={activeButton}
        onButtonClick={setActiveButton}
      />

      {isloading && <FetchLoader text="Fetching Lead Details... please hold" />}

      {
        !isloading && (

          <>
            <div className="w-full max-w-8xl bg-white md:p-8 flex flex-col flex-grow">
              <div className="ml-[5px] shadow-md rounded-lg mt-0">
                <div className="ml-20">
                  <h2 className="text-4xl mb-6 ml-10 pl-11 text-[#9630B7]">
                    Edit Lead Details
                  </h2>
                  <form className="space-y-6 mr-5 mb-16" onSubmit={handleSubmit}>
                    {[
                      { id: "Iid", label: "Inquiry ID", type: "text" },
                      { id: "name", label: "Client’s Name", type: "text" },
                      { id: "email", label: "E-mail ID", type: "email" },
                      { id: "phoneNumber", label: "Contact", type: "text" },
                      { id: "handleby", label: "Handle", type: "text" },
                      {
                        id: "status",
                        label: "Status",
                        type: "select",
                        options: ["Pending", "Cancel", "New"],
                      },
                    ].map((field) => (
                      <div className="flex items-center mb-6 ml-20" key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="text-[#2B0091] font-medium w-1/5 text-left pr-4 ml-1 text-lg"
                        >
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            id={field.id}
                            value={formData[field.id]}
                            onChange={handleChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full ml-20"
                          >
                            {field.options.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.id}
                            value={formData[field.id] || ""}
                            onChange={handleChange}
                            className={`px-4 py-2 border border-gray-300 rounded-lg bg-white w-full ml-20`}
                          />
                        )}
                      </div>
                    ))}

                    <div className="flex justify-center md:justify-end ml-0 md:ml-[75.5%]">
                      <button
                        type="submit"
                        className="border-2 border-purple-500 text-pink-500 font-medium py-1 px-2 h-13 rounded-lg bg-white hover:bg-purple-100 w-full md:w-40 text-lg md:text-2xl"
                      >
                        {iseditting ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default LeadFormEdit;
