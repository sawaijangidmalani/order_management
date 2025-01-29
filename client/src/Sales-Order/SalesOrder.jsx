import React, { useState, useEffect } from "react";
import "../Style/salesorder.css";
import AddSalesItem from "./AddSalesItem";
import AddOrEditCustomer from "./AddorEditCustomer";
import axios from "axios";
import "../Style/Add.css";
import { toast } from "react-hot-toast";

const SalesOrder = ({ onClose, existingOrder, selectedSaleId, customesId }) => {
  const [customerData, setCustomerData] = useState([]);
  const [salesOrderItems, setSalesOrderItems] = useState([]);
  const [addClick, setAddClick] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    CustomerID: "",
    ProviderID: "1",
    SalesOrderNumber: "",
    SalesDate: "",
    Status: "",
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      const res = await axios.get(
        "http://localhost:8000/customer/getCustomerData"
      );
      setCustomerData(res.data);
    };
    fetchCustomerData();
  }, []);

  useEffect(() => {
    if (existingOrder) {
      setFormData({
        CustomerID: existingOrder.CustomerID,
        ProviderID: "1",
        SalesOrderNumber: existingOrder.SalesOrderNumber,
        SalesDate: existingOrder.SalesDate
          ? existingOrder.SalesDate.slice(0, 10)
          : "",
        Status: existingOrder.Status,
        // SalesTotalPrice: existingOrder.SalesTotalPrice,
      });
      setSalesOrderItems(existingOrder.items || []);
    } else {
      resetForm();
    }
  }, [existingOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSaleItem = (item) => {
    const updatedItems = [...salesOrderItems, item];
    setSalesOrderItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.qty * item.unitCost,
      0
    );
    // setFormData((prev) => ({ ...prev, SalesTotalPrice: total }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      ...formData,
      Items: salesOrderItems,
    };

    console.log(data);

    try {
      if (existingOrder && existingOrder.CustomerSalesOrderID) {
        await axios.put(
          `http://localhost:8000/customerpo/updateCustomerPo/${formData.CustomerSalesOrderID}`,
          data
        );

        toast.success("Sales Order updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8000/customerpo/insertCustomerPo",
          data
        );
        toast.success("Sales Order created successfully!");
      }
      window.location.reload();
      onClose();
      resetForm();
    } catch (err) {
      console.error(
        "Error handling sales order:",
        err.response ? err.response.data : err.message
      );
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = salesOrderItems.filter((_, i) => i !== index);
    setSalesOrderItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const handleAdd = () => {
    setAddClick(true);
    resetForm();
  };

  const handleCancel = () => {
    setAddClick(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      CustomerID: "",
      ProviderID: "1",
      SalesOrderNumber: "",
      SalesDate: "",
      Status: "",
      // SalesTotalPrice: 0.0,
    });
    setSalesOrderItems([]);
  };

  return (
    <>
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
              <select
                id="status"
                name="Status"
                value={formData.Status}
                onChange={handleInputChange}
                className="status-salesorder_input"
                required
              >
                <option value="">Select Status</option>
                <option value={1}>Draft</option>
                <option value={0}>Approved</option>
              </select>
            </label>

            <button type="button" onClick={handleAdd} className="add-item">
              Add Item
            </button>
          </form>

          <AddSalesItem
            selectedSaleId={selectedSaleId}
            items={salesOrderItems}
            handleDeleteItem={handleDeleteItem}
            availableQTY={selectedItem ? selectedItem.Stock : 0}
          />

          <div className="customer-form__button-container">
            <button
              type="submit"
              className="customer-form__button"
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="customer-form__button"
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
