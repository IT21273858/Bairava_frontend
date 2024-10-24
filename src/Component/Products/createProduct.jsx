import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Utils/navbar";
import apiClient from "../../Utils/config/apiClient"; // Assuming you have an API client set up
import FetchLoader from "../loader/fetchloader";
import AlertPopup from "../Alertpopup";

const CreateProductForm = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("Products");
  const [formData, setFormData] = useState({
    SKU_id: "",
    name: "",
    description: "", // Optional
    flavour: "", // Optional
    price: "",
    expiary_date: "",
    manufacture_date: "",
    net_weight: "",
  });
  const [errors, setErrors] = useState({});
  const [isloading, setIsLoading] = useState(false);
  const [iseditting, setIseditting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "price",
      "expiary_date",
      "manufacture_date",
      "net_weight",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.keys(validationErrors).map((err) => {
        if (Object.keys(validationErrors).length === 7) {
          AlertPopup({
            message: "Did you fill all inputs?",
            icon: "question",
          });
        } else {
          AlertPopup({
            message: `${err} is required`,
            icon: "warning",
          });
        }
      });
      setIsLoading(false);
      return;
    }

    try {
      setIseditting(true);

      const { name, description, flavour, price, expiary_date, manufacture_date, net_weight } = formData;

      const dataToSend = {
        name,
        description,
        flavour,
        price,
        expiary_date,
        manufacture_date,
        net_weight,
      };

      console.log("Data to send");
      console.log(dataToSend);

      const response = await apiClient.post(`/products/create`, dataToSend);
      console.log("Product Created:", response.data);
      setIseditting(false);
      navigate("/product");
      setIsLoading(false);
    } catch (error) {
      setIseditting(false);
      setIsLoading(false);
      AlertPopup({
        message: "Something Happened at our end",
        icon: "error",
      });
      console.error("Failed to create product", error);
    }
  };

  return (
    <div className="">
      <Navbar
        buttons={["Dashboard", "Products", "Users"]}
        activeButton={activeButton}
        onButtonClick={setActiveButton}
      />

      {isloading && <FetchLoader text="Creating Barcode... please hold" />}

      {!isloading && (
        <>
          <div className="w-full max-w-8xl bg-white md:p-8 flex flex-col flex-grow">
            <div className="ml-[5px] shadow-md rounded-lg mt-0 bg-gray-200">
              <div className="md:ml-20 ml:0">
                <h2 className="text-4xl font-serif mb-6 ml-5 text-[#0e0e0f] mt-4">
                  Create Product Details
                </h2>
                <form className="space-y-6 mr-5 mb-5" onSubmit={handleSubmit}>
                  {[
                    { id: "name", label: "Product Name", type: "text" },
                    { id: "description", label: "Description", type: "text" },
                    { id: "flavour", label: "Flavour", type: "text" },
                    { id: "price", label: "Price (Rs.)", type: "text" },
                    { id: "net_weight", label: "Net Weight", type: "text" },
                    { id: "manufacture_date", label: "Manufacture Date", type: "date" },
                    { id: "expiary_date", label: "Expiary Date", type: "date" },
                  ].map((field) => (
                    <div className="flex items-center mb-6 md:ml-20 ml-1" key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="text-[#191521] font-medium md:w-1/5 w-2/5 h-10 items-center flex text-left ml-1 md:text-lg text-sm  rounded-lg"
                      >
                        {field.label}{" "}
                        {["name", "price", "expiary_date", "manufacture_date", "net_weight"].includes(field.id) && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                        className={`px-4 py-2 border ml-2 border-gray-300 rounded-lg bg-white w-full ${errors[field.id] ? "border-red-500" : ""
                          }`}
                      />
                    </div>
                  ))}

                  <div className="flex justify-center md:justify-end ml-0 md:ml-[75.5%]">
                    <button
                      type="submit"
                      className="px-6 py-2 border-gray-950 border-2 text-gray-900 rounded-xl hover:bg-gray-950 hover:text-white hover:border-gray-600"
                    >
                      {iseditting ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateProductForm;
