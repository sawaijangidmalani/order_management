import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "../Style/Add.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

function AddSuppliers({ closeModal, editingSuppliers }) {
  const navigate = useNavigate();
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);

  const initialData = {
    SupplierID: null,
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
    if (editingSuppliers) {
      setFormData(editingSuppliers);
    } else {
      setFormData({ ...initialData });
    }
  }, [editingSuppliers]);

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

  const checkSupplierExists = async (name, email) => {
    try {
      const response = await axios.get("https://order-management-tgh3.onrender.com/supplier/checkDuplicate", {
        params: { name, email }
      });
      return {
        nameExists: response.data.nameExists,
        emailExists: response.data.emailExists
      };
    } catch (error) {
      console.error("Error checking supplier:", error);
      return { nameExists: false, emailExists: false };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Email || !formData.Name || !formData.Phone) {
      toast.warn("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    const apiUrl = editingSuppliers
      ? "https://order-management-tgh3.onrender.com/supplier/updateSupplier"
      : "https://order-management-tgh3.onrender.com/supplier/add_supplier";

    try {
      if (!editingSuppliers) {
        const { nameExists, emailExists } = await checkSupplierExists(formData.Name, formData.Email);
        
        if (nameExists && emailExists) {
          toast.error("A supplier with this name and email already exists!");
          setLoading(false);
          return;
        } else if (nameExists) {
          toast.error("A supplier with this name already exists!");
          setLoading(false);
          return;
        } else if (emailExists) {
          toast.error("A supplier with this email already exists!");
          setLoading(false);
          return;
        }
      }

      const response = await axios.post(apiUrl, formData);
      toast.success(
        editingSuppliers
          ? "Supplier updated successfully!"
          : "Supplier saved successfully!"
      );

      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
                  {editingSuppliers ? "Edit Supplier" : "Add Supplier"}
                </h3>
                <label className="customer-form__label">
                  Name:
                  <span style={{ color: "red" }}>*</span>
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
                  Email:
                  <span style={{ color: "red" }}>*</span>
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

export default AddSuppliers;