import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../Style/Add.css";
import axios from "axios";
import toast from "react-hot-toast";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

function AddCustomer({ closeModal, editingCustomer }) {
  const navigate = useNavigate();
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);

  const initialData = {
    CustomerID: null,
    ProviderID: "1",
    Name: "",
    Email: "",
    Phone: "",
    Address: "",
    Area: "",
    City: "",
    State: "",
    Status: "",
    GST: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    } else {
      setFormData({ ...initialData });
    }
  }, [editingCustomer]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, closeModal]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Email || !formData.Name || !formData.Phone) {
      toast.warn("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    const apiUrl = editingCustomer
      ? "https://order-management-p53a.onrender.com/customer/updateCustomer"
      : "https://order-management-p53a.onrender.com/customer/add_customer";

    try {
      const response = await axios.post(apiUrl, formData);
      toast.success(
        editingCustomer
          ? "Customer updated successfully!"
          : "Customer saved successfully!"
      );

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong. Try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setShowForm(false);
      closeModal();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div>
      {loading && (
        <div className="overlay">
          <FaSpinner className="spinner" />
        </div>
      )}
      {showForm && (
        <div className="style-model">
          <Modal ref={modalRef}>
            <div className="body-container">
              <form onSubmit={handleSubmit} className="customer-form">
                <h3 className="form-heading">
                  {editingCustomer ? "Edit Customer" : "Add Customer"}
                </h3>

                <label className="customer-form__label">
                  Name: <span style={{ color: "red" }}>*</span>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="customer-form__input"
                    required
                  />
                </label>

                <label className="customer-form__label">
                  Email: <span style={{ color: "red" }}>*</span>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="customer-form__input"
                    required
                  />
                </label>

                <label className="customer-form__label">
                  Phone:
                  <span style={{ color: "red" }}>*</span>
                  <input
                    type="tel"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    className="customer-form__input"
                    required
                    pattern="[0-9]{10}"
                    maxLength="10"
                    title="Please enter a valid 10-digit phone number"
                  />
                </label>

                <label className="customer-form__label">
                  Address:
                  <input
                    type="text"
                    name="Address"
                    value={formData.Address}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  />
                </label>

                <label className="customer-form__label">
                  Area:
                  <input
                    type="text"
                    name="Area"
                    value={formData.Area}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  />
                </label>

                <label className="customer-form__label">
                  City:
                  <input
                    type="text"
                    name="City"
                    value={formData.City}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  />
                </label>

                <label className="customer-form__label">
                  State:
                  <input
                    type="text"
                    name="State"
                    value={formData.State}
                    onChange={handleInputChange}
                    className="customer-form__input"
                  />
                </label>

                <label className="customer-form__label">
                  Status:
                  <span style={{ color: "red" }}>*</span>
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                    className="customer-form__input"
                    required
                  >
                    <option>Select Status</option>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </label>

                <label className="customer-form__label">
                  GST:
                  <span style={{ color: "red" }}>*</span>
                  <input
                    type="text"
                    name="GST"
                    value={formData.GST}
                    onChange={handleInputChange}
                    className="customer-form__input"
                    required
                    pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$"
                    maxLength="15"
                    title="Please enter a valid 15-character GSTIN (e.g., 22AAAAA0000A1Z5)"
                  />
                </label>

                <div className="customer-form__button-container">
                  <button
                    type="submit"
                    className="customer-form__button"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="customer-form__button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default AddCustomer;
