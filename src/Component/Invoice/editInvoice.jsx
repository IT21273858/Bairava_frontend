import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Utils/navbar";
import PDFGenerator from "../../Utils/pdf";
import apiClient from "../../Utils/config/apiClient"; // Assuming you have an API client set up
import { PropagateLoader } from "react-spinners";
import { FiPenTool, FiPlus, FiTrash2 } from "react-icons/fi";
import Swal from 'sweetalert2'
const EditInvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = id;
  const [activeButton, setActiveButton] = useState("Invoice");
  const [notes, updateNotes] = useState([])
  const [rows, setRows] = useState([]);
  const [itenaries, setItenaries] = useState([]);
  const [accomodation, setAccomodation] = useState([])
  const [isloading, setisloading] = useState(false)
  const [isupdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    bill_to: "",
    iId: "",
    aId: "",
    invoice_no: " ",
    invoice_date: "",
    tour_sdate: "",
    tour_edate: "",
    subject: "",
    type: "",
    items: [{ "name": "", "amount": "", "isadvance": false }],
    advance: "",
    balance: "",
    bank_details: { "b_name": "", "acc_no": "", "bank_branch": "", "bank_name": "", "code": "", "currency_type": "" },
    notes: "",
  });
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchCountries = async () => {
      // setisloading(true)
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country) => country.name.common).sort();
        setCountries(countryNames);
        // setisloading(false)
      } catch (error) {
        // setisloading(false)
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setisloading(true)
        const response = await apiClient.get(`/invoice/get/${orderId}`);
        const itenary = await apiClient.get('/itenary/getAll');
        const accomodation = await apiClient.get('/accomodation/getAll');

        setAccomodation(accomodation.data.accomodations);
        setItenaries(itenary.data.itenaries);
        const data = response.data.invoice;
        console.log(data);
        setFormData({
          bill_to: data.bill_to,
          iId: data.iId,
          aId: data.aId,
          invoice_no: data.invoice_no,
          invoice_date: data.invoice_date,
          tour_sdate: data.tour_sdate,
          tour_edate: data.tour_edate,
          subject: data.subject,
          type: data.type,
          items: data.items,
          advance: data.advance,
          balance: data.balance,
          bank_details: data.bank_details,
          notes: data.notes,
        });
        updateNotes(data.notes)
        setRows(
          data.items.map((item) => ({
            amount: item.amount,
            name: item.name,
            total: data.balance,
            isadvance: item.isadvance
          }))
        );
        setisloading(false)
      } catch (error) {
        setisloading(false)
        console.error("Failed to fetch order", error);
      }
    };

    fetchOrder();
  }, []);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleInputChange = (e) => {
    console.log(e.target.name, e.target.value);

    const { name, value } = e.target;
    console.log(name in formData.bank_details)
    if (name in formData.bank_details) {
      setFormData((prevData) => ({
        ...prevData,
        bank_details: {
          ...prevData.bank_details,
          [name]: value
        }
      }));
    } else {

      const newInvoice = {
        ...formData
      }
      newInvoice[name] = value;
      setFormData(newInvoice);
    }
  };

  const handleRowChange = (index, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addNewRow = () => {
    setRows([
      ...rows,
      { product: "", roomCount: 0, nightCount: 0, price: 0, total: 0 },
    ]);
  };
  const addNewNotes = () => {
    setNotes([
      ...notes,
      { note: "" },
    ]);
  };
  const handleCancel = () => {
    navigate("/purchase-list");
  };
  const handleSubmit = async () => {
    setIsUpdating(true)
    console.log("notes")
    console.log(notes)

    let updatedFormData = {
      ...formData,
      items: rows.map(row => ({
        name: row.name,
        amount: row.amount,
        isadvance: row.isadvance
      }))
    };
    updatedFormData = { ...updatedFormData, notes }

    console.log("Updating....");
    console.log(updatedFormData);

    try {
      const response = await apiClient._patch(
        `/invoice/update/${orderId}`,
        updatedFormData
      );

      if (response.status) {
        let timerInterval;
        Swal.fire({
          title: "Update Sucessfull!",
          html: "Navigating to Invoice list in <b></b> milliseconds.",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          setIsUpdating(false)
          if (result.dismiss === Swal.DismissReason.timer) {
            navigate("/invoice");
          }

        });
      }
      console.log("Invoice updated successfully", response);
      // PDFGenerator(updatedFormData);
    } catch (error) {
      setIsUpdating(false)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: 'Something had happened at our end :( '
      });
      console.error("Failed to update Invoice", error);
    }
  };

  const calculateTotal = (rows) => {
    return (rows.reduce(
      (acc, row) =>
        row.isadvance ? acc - Number(row.amount) : acc + Number(row.amount),
      0
    ))
  }

  return (
    <div className="">
      <Navbar
        buttons={["Dashboard", "Invoice", "Purchase Order", "Calendar"]}
        activeButton={activeButton}
        onButtonClick={handleButtonClick}
      />
      {isloading ? <div className="flex bg-red-800 justify-center items-center w-full mt-10">
        <PropagateLoader
          color="#9630B7"
          size={33}

        />
      </div> :

        <div className="p-6 font-sans">
          <h2 className="text-2xl font-semibold mb-2 ml-2 text-[#9630B7] text-left">
            Edit Invoice
          </h2>
          <div className="flex flex-wrap ml-10 pl-10">
            <div className="w-full md:w-1/2 mb-4 text-left">
              <h3 className="text-lg font-semibold mb-4 ml-[-20px]">
                Main Details
              </h3>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Bill to
                </label>
                <input
                  type="text"
                  name="bill_to"
                  value={formData.bill_to}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Invoice Date
                </label>
                {/* {console.log(formData.invoice_date.split('T')[0])} */}
                <input
                  type="date"
                  name="invoice_date"
                  defaultValue={formData.invoice_date.split('T')[0]}
                  // value={formData.invoice_date.split('T')[0]}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Tour Start Date
                </label>
                <input
                  type="date"
                  name="tour_sdate"
                  defaultValue={formData.tour_sdate.split('T')[0]}
                  // value={formData.tour_sdate}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Invoice Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 text-left mt-11 ml-[-8px]">
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Invoice Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                >
                  <option>Tour Invoice</option>
                  <option>Accomodation Invoice</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Invoice No:
                </label>
                <input
                  type="text"
                  name="invoice_no"
                  value={formData.invoice_no}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Tour End Date
                </label>
                <input
                  type="date"
                  name="tour_edate"
                  defaultValue={formData.tour_edate.split('T')[0]}
                  // value={formData.tour_edate}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              {
                formData.type == "Tour Invoice" ? <div className="mb-4">
                  <label className="block mb-2 text-left text-purple-700">
                    Select Itenary
                  </label>
                  <select
                    name="iId"
                    value={formData.iId}
                    onChange={handleInputChange}
                    className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                  >

                    {itenaries.map((itenary, i) => (
                      <option key={i} value={itenary.id}>{itenary.title}</option>
                    ))}
                  </select>
                </div> : ""
              }

              {formData.type == "Accomodation Invoice" ? <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Select Accomodation
                </label>
                <select
                  name="aId"
                  value={formData.aId}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                >

                  {accomodation.map((accomodation, i) => (
                    <option key={i} value={accomodation.id}>{accomodation.h_name}</option>
                  ))}
                </select>
              </div> : ""}

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-6 flex items-center flex-col mb-4">
            <div className="flex justify-start items-center w-full">
              <h3 className="text-lg font-semibold mb-4 ">
                General Details
              </h3>
            </div>
            <div className="flex w-full">
              <table className="max-w-full w-full bg-white border border-gray-500 relative ml-[100px] rounded-md">
                <thead>
                  <tr>
                    <th
                      style={{ width: "40%" }}
                      className="p-4 border border-gray-500 text-[#9630B7]"
                    >
                      Description
                    </th>
                    <th
                      style={{ width: "15%" }}
                      className="p-4 border border-gray-500 text-[#9630B7]"
                    >
                      Amount
                    </th>
                    <th
                      style={{ width: "15%" }}
                      className="p-4 border border-gray-500 text-[#9630B7]"
                    >
                      Advance
                    </th>

                    <th
                      style={{ width: "15%" }}
                      className="p-4 border border-gray-500 text-[#9630B7]"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td className="p-4 border border-gray-500">
                        <input
                          type="text"
                          value={row.name}
                          placeholder="Description"
                          className="w-full"
                          onChange={(e) =>
                            setRows(
                              rows.map((r, i) =>
                                i === index ? { ...r, name: e.target.value } : r
                              )
                            )
                          }
                        />
                      </td>

                      <td className="p-4 border border-gray-500">
                        <input
                          type="number"
                          value={row.amount}
                          min="0"
                          placeholder="Amount"
                          className="w-full"
                          onChange={(e) =>
                            setRows(
                              rows.map((r, i) =>
                                i === index ? { ...r, amount: e.target.value } : r
                              )
                            )
                          }
                        />
                      </td>

                      <td className="p-4 border border-gray-500">
                        <select
                          name="isadvance"
                          value={row.isadvance}
                          onChange={(e) =>
                            setRows(
                              rows.map((r, i) =>
                                i === index ? { ...r, isadvance: e.target.value === "true" } : r
                              )
                            )
                          }
                          className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                        >
                          <option>Select</option>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>

                      </td>
                      <td className="p-4 border border-gray-500">
                        <button
                          onClick={() =>
                            setRows(rows.filter((_, i) => i !== index))
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4" className="p-4 border border-gray-500 text-right font-semibold">
                      Grand Total
                    </td>
                    <td className="p-4 border border-gray-500">
                      $ {calculateTotal(rows)}
                      {/* {rows.reduce(
                        (acc, row) =>
                          row.isadvance ? acc - Number(row.amount) : acc + Number(row.amount),
                        0
                      )} */}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="absolute transform -translate-x-1/2 p-2 text-[#9630B7] border border-[#9630B7] rounded-full flex items-center"
                style={{
                  top: `calc(${rows.length * 60}px + 944)`,
                  left: "4%",
                  position: "absolute",
                }}
                onClick={addNewRow}
              >
                <AiOutlinePlus />
              </button>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="flex flex-wrap pl-10 ml-10">
            <div className="w-full md:w-1/2 mb-4 text-left">
              <h3 className="text-lg font-semibold mb-3 ml-[-20px]">
                Bank Account Details
              </h3>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  name="b_name"
                  value={formData.bank_details.b_name}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
                {/* {console.log(formData)} */}

              </div>

              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Bank Branch
                </label>
                <input
                  type="text"
                  name="bank_branch"
                  value={formData.bank_details.bank_branch}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  BIC/SWIFT Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.bank_details.code}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 mb-4 text-left mt-10 block items-right">
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_details.bank_name}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Account Number
                </label>
                <input
                  type="text"
                  name="acc_no"
                  value={formData.bank_details.acc_no}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-left text-purple-700">
                  Account Currency
                </label>
                <input
                  type="text"
                  name="currency_type"
                  value={formData.bank_details.currency_type}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex h-fit flex-col">
            <div className="w-full flex h-fit items-center justify-between font-bold text-xl">
              <div className="">Notes</div>
            </div>
            <div className="w-full flex h-fit items-center justify-end">
              <div
                onClick={() => {
                  updateNotes((prev) => [...prev, "enter new note"])
                }}
                className=" px-2 py-1  items-center rounded-md bg-[#9630B7] hover:bg-[#9630B7]/50 cursor-pointer text-white flex gap-1">
                <FiPlus />
                <span className="">Add Notes</span>
              </div>
            </div>
            {notes.length != 0 &&
              <div id="notesContainer" className=" flex h-60 items-start overflow-scroll">
                <div className="w-full  my-3 h-fit gap-3  text-lg grid">
                  {notes.map((note, imx) => <div key={imx} className="w-full py-2 flex text-white h-fit px-3 rounded-md items-center justify-between bg-[#9630B7]">
                    <div className=" w-full flex gap-3 items-center justify-start">
                      <FiPenTool />
                      <input type="text" className=" w-full px-5 text-white bg-transparent" defaultValue={note} onChange={(e) => {
                        const nt = e.currentTarget.value;

                        const newarr = [...notes];
                        newarr[imx] = nt;

                        updateNotes(newarr)
                      }} />
                      {/* <span className="">{note}</span> */}
                    </div>
                    <div
                      onClick={() => {
                        updateNotes((prev) => prev.filter((v, i) => i != imx))
                      }}
                      className=" px-3 rounded-md py-2 bg-red-400 text-white cursor-pointer hover:bg-opacity-50 ">
                      <FiTrash2 />
                    </div>
                  </div>)

                  }
                </div>
              </div>

            }
          </div>

          <div className="flex justify-end mt-6">
            <button className="ml-4 px-6 py-2 border border-[#9630B7] text-[#9630B7] rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="ml-4 px-6 py-2 border border-[#9630B7] text-[#9630B7] rounded"
              onClick={handleSubmit}
            >
              {isupdating ? "Updating.." : "Update"}
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default EditInvoiceForm;
