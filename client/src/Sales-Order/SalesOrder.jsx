import React, { useState, useEffect } from "react";
import "../Style/salesorder.css";
import AddSalesItem from "./AddSalesItem";
import AddOrEditCustomer from "./AddorEditCustomer";
import axios from "axios";
import "../Style/Add.css";
import { toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const SalesOrder = ({ onClose, existingOrder, selectedSaleId, customesId }) => {
  const [customerData, setCustomerData] = useState([]);
  const [salesOrderItems, setSalesOrderItems] = useState([]);
  const [addClick, setAddClick] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    CustomerID: "",
    ProviderID: "1",
    SalesOrderNumber: "",
    SalesDate: "",
    Status: "",
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const res = await axios.get(
          "https://order-management-tgh3.onrender.com/customer/getCustomerData"
        );
        const activeCustomers = res.data.filter(
          (customer) => customer.Status === 1
        );
        setCustomerData(activeCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomerData();
  }, []);

  useEffect(() => {
    if (existingOrder) {
      setFormData({
        CustomerID: existingOrder.CustomerID ?? "",
        ProviderID: "1",
        SalesOrderNumber: existingOrder.SalesOrderNumber ?? "",
        SalesDate: existingOrder.SalesDate
          ? existingOrder.SalesDate.slice(0, 10)
          : "",
        Status: existingOrder.Status ?? "",
      });
      setSalesOrderItems(existingOrder.items || []);
    }
  }, [existingOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSaleItem = (item) => {
    setSalesOrderItems((prevItems) => {
      const updatedItems = [
        ...prevItems,
        {
          ...item,
          CustomerSalesOrderItemID: item.CustomerSalesOrderItemID ?? null,
          CustomerSalesOrderID: item.CustomerSalesOrderID ?? selectedSaleId,
          ItemID: item.ItemID ?? null,
          ItemName: item.ItemName ?? "",
          AllocatedQty: item.AllocatedQty ?? 0,
          UnitCost: item.UnitCost ?? 0,
          SalesPrice: item.SalesPrice ?? 0,
          Tax: item.Tax ?? 0,
        },
      ];
      return updatedItems;
    });
    setAddClick(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const cleanedFormData = {
      CustomerID: formData.CustomerID || null,
      ProviderID: formData.ProviderID || "1",
      SalesOrderNumber: formData.SalesOrderNumber || null,
      SalesDate: formData.SalesDate || null,
      Status: formData.Status || null,
    };

    const cleanedItems = salesOrderItems.map((item) => ({
      CustomerSalesOrderItemID: item.CustomerSalesOrderItemID ?? null,
      CustomerSalesOrderID: item.CustomerSalesOrderID ?? selectedSaleId,
      ItemID: item.ItemID ?? null,
      ItemName: item.ItemName ?? "",
      AllocatedQty: item.AllocatedQty ?? 0,
      UnitCost: item.UnitCost ?? 0,
      SalesPrice: item.SalesPrice ?? 0,
      Tax: item.Tax ?? 0,
    }));

    const data = {
      ...cleanedFormData,
      Items: cleanedItems,
    };

    console.log("Submitting data:", JSON.stringify(data, null, 2));

    try {
      if (existingOrder && existingOrder.CustomerSalesOrderID) {
        const url = `https://order-management-tgh3.onrender.com/customerpo/updateCustomerPo/${existingOrder.CustomerSalesOrderID}`;
        const response = await axios.put(url, data);
        console.log("Response:", response.data);
        toast.success("Sales Order updated successfully!");
      } else {
        const response = await axios.post(
          "https://order-management-tgh3.onrender.com/customerpo/insertCustomerPo",
          data
        );
        console.log("Response:", response.data);
        toast.success("Sales Order created successfully!");
      }
      onClose();
      resetForm();
    } catch (err) {
      console.error("Full error details:", err);
      console.error(
        "Error response:",
        err.response ? err.response.data : "No response data"
      );
      if (err.response && err.response.status === 409) {
        toast.error("This Customer is Already Added!");
      } else {
        toast.error(
          "Error saving sals order: " +
            (err.response?.data?.message || err.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (index) => {
    setSalesOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setAddClick(true);
  };

  const handleCancel = () => {
    setAddClick(false);
  };

  const resetForm = () => {
    setFormData({
      CustomerID: "",
      ProviderID: "1",
      SalesOrderNumber: "",
      SalesDate: "",
      Status: "",
    });
    setSalesOrderItems([]);
  };

  return (
    <>
      {loading && (
        <div className="overlay">
          <FaSpinner className="spinner" />
        </div>
      )}
      {addClick ? (
        <AddOrEditCustomer
          onClose={handleCancel}
          selectedSaleId={selectedSaleId}
          onPurchaseData={handleAddSaleItem}
          customesId={customesId}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="salesorder-form">
            <h3 className="salesorder-form-heading">Add / Edit Customer PO</h3>

            <label htmlFor="customer" className="salesorder-form-label">
              Customer:
              <span style={{ color: "red" }}>*</span>
              <select
                id="customer"
                name="CustomerID"
                value={formData.CustomerID}
                onChange={handleInputChange}
                className="customer-salesorder_input"
                required
              >
                <option value="">Select Customer</option>
                {customerData.map((customer) => (
                  <option key={customer.CustomerID} value={customer.CustomerID}>
                    {customer.Name}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="salesOrderNumber" className="salesorder-form-label">
              Customer PO:
              <span style={{ color: "red" }}>*</span>
              <input
                type="text"
                id="salesOrderNumber"
                name="SalesOrderNumber"
                value={formData.SalesOrderNumber}
                onChange={handleInputChange}
                className="salesorder_input"
                required
              />
            </label>

            <label htmlFor="salesDate" className="salesorder-form-label">
              Sales Date:
              <span style={{ color: "red" }}>*</span>
              <input
                type="date"
                id="salesDate"
                name="SalesDate"
                value={formData.SalesDate}
                onChange={handleInputChange}
                className="salesorder_input"
                required
              />
            </label>

            <label htmlFor="status" className="salesorder-form-label">
              Status:
              <span style={{ color: "red" }}>*</span>
              <select
                id="status"
                name="Status"
                value={formData.Status}
                onChange={handleInputChange}
                className="status-salesorder_input"
                required
              >
                <option value="">Select Status</option>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </label>

            {selectedSaleId && (
              <button type="button" onClick={handleAdd} className="add-item">
                Add Item
              </button>
            )}
          </form>

          {selectedSaleId && (
            <AddSalesItem
              selectedSaleId={selectedSaleId}
              items={salesOrderItems}
              handleDeleteItem={handleDeleteItem}
            />
          )}

          <div className="customer-form__button-container">
            <button
              type="submit"
              className="customer-form__button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : existingOrder ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="customer-form__button"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SalesOrder;
