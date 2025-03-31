import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import "../Style/Add.css";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

const AddItem = ({ editItem, closeModal }) => {
  const initialData = {
    ItemID: null,
    ProviderID: "1",
    SupplierID: "",
    Name: "",
    Category: "",
    Brand: "",
    Status: "",
    Description: "",
    ItemUnitID: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [suppliers, setSuppliers] = useState([]);
  const [itemUnits, setItemUnits] = useState([]);
  const [formVisible, setFormVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();

  const loadData = async () => {
    try {
      const [supplierRes, unitsRes] = await Promise.all([
        axios.get("http://localhost:8000/supplier/getSupplierData"),
        axios.get("http://localhost:8000/item/getItemUnits"),
      ]);
      setSuppliers(supplierRes.data);
      setItemUnits(unitsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load suppliers or item units.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editItem && editItem.ItemID) {
      setFormData({
        ItemID: editItem.ItemID,
        ProviderID: "1",
        SupplierID: editItem.SupplierID || "",
        Name: editItem.Name || "",
        Category: editItem.Category || "",
        Brand: editItem.Brand || "",
        Status: editItem.Status || "",
        Description: editItem.Description || "",
        ItemUnitID: editItem.ItemUnitID || "",
      });
    } else {
      setFormData({ ...initialData });
    }
  }, [editItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.SupplierID || !formData.Name) {
      toast.error("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    const isEditMode = editItem && editItem.ItemID;
    const apiUrl = isEditMode
      ? "http://localhost:8000/item/updateItems"
      : "http://localhost:8000/item/add_items";

    try {
      const response = await axios.post(apiUrl, formData);
      if (response.data.error) {
        toast.error(response.data.message || "Failed to process request.");
      } else {
        toast.success(
          isEditMode ? "Item updated successfully!" : "Item added successfully!"
        );
        window.location.reload();
        loadData();
        closeModal();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
    setFormVisible(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <>
      {loading && (
        <div className="overlay">
          <FaSpinner className="spinner" />
        </div>
      )}

      {formVisible && (
        <div className="style-model">
          <Modal ref={modalRef}>
            <form onSubmit={handleSubmit} className="customer-form">
              <h3 className="form-heading">
                {editItem && editItem.ItemID ? "Edit Item" : "Add Item"}
              </h3>

              <label className="customer-form__label">
                Item Name:
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

              {/* <label className="customer-form__label">
                Supplier:
                <span style={{ color: "red" }}>*</span>
                <select
                  name="SupplierID"
                  value={formData.SupplierID}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.SupplierID}
                      value={supplier.SupplierID}
                    >
                      {supplier.Name}
                    </option>
                  ))}
                </select>
              </label> */}

              <label className="customer-form__label">
                Supplier:
                <span style={{ color: "red" }}>*</span>
                <select
                  name="SupplierID"
                  value={formData.SupplierID}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers
                    .filter((supplier) => supplier.Status === 1) // Only active suppliers
                    .map((supplier) => (
                      <option
                        key={supplier.SupplierID}
                        value={supplier.SupplierID}
                      >
                        {supplier.Name}
                      </option>
                    ))}
                </select>
              </label>

              <label className="customer-form__label">
                Category:
                <input
                  type="text"
                  name="Category"
                  value={formData.Category}
                  onChange={handleInputChange}
                  className="customer-form__input"
                />
              </label>

              <label className="customer-form__label">
                Brand:
                <input
                  type="text"
                  name="Brand"
                  value={formData.Brand}
                  onChange={handleInputChange}
                  className="customer-form__input"
                />
              </label>

              <label className="customer-form__label">
                Description:
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  className="customer-form__input"
                />
              </label>

              <label className="customer-form__label">
                Unit:
                <span style={{ color: "red" }}>*</span>
                <select
                  name="ItemUnitID"
                  value={formData.ItemUnitID}
                  onChange={handleInputChange}
                  className="customer-form__input"
                  required
                >
                  <option value="">Select Unit</option>
                  {itemUnits.map((unit) => (
                    <option key={unit.ItemUnitID} value={unit.ItemUnitID}>
                      {unit.UnitName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="customer-form__label">
                Status:
                <select
                  name="Status"
                  value={formData.Status}
                  onChange={handleInputChange}
                  className="customer-form__input"
                >
                  <option value="">Select Status</option>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
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
                  className="customer-form__button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </>
  );
};

export default AddItem;
