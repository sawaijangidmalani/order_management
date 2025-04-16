import React, { useState, useEffect } from "react";
import AddPurchaseItem from "./AddPurchaseItem";
import AddOrEdit from "./AddOrEdit";
import axios from "axios";
import "../Style/Add.css";
import "../Style/salesorder.css";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const PurchaseOrder = ({
  onCloses,
  editData,
  customesId,
  selectedPurchaseId,
  existingOrder,
  resetForm,
}) => {
  const [customerID, setCustomerID] = useState("");
  const [customerPO, setCustomerPO] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [items, setItems] = useState([]);
  const [addClick, setAddClick] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomerPoData = async () => {
      try {
        const response = await axios.get(
          "https://order-management-tgh3.onrender.com/customerpo/getCustomerPo"
        );
        const activeCustomerPo = response.data.filter(
          (customer) => customer.Status === 1
        );

        const uniqueCustomers = Array.from(
          new Map(
            activeCustomerPo.map((customer) => [
              customer.CustomerName,
              customer,
            ])
          ).values()
        );

        setCustomerData(uniqueCustomers);
      } catch (error) {
        console.error("Error fetching customer PO data:", error);
      }
    };
    fetchCustomerPoData();
  }, []);

  useEffect(() => {
    if (!customerID) {
      setSalesData([]);
      return;
    }

    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "https://order-management-tgh3.onrender.com/customerpo/getCustomerPo"
        );
        const activeCPOs = response.data
          .filter(
            (item) =>
              item.Status === 1 && item.CustomerID === parseInt(customerID)
          )
          .map((item) => ({
            CustomerSalesOrderID: item.CustomerSalesOrderID,
            SalesOrderNumber: item.SalesOrderNumber,
          }));
        setSalesData(activeCPOs);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [customerID]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      PurchaseOrderID: editData ? editData.PurchaseOrderID : "",
      CustomerSalesOrderID: customerPO || null,
      CustomerID: customerID || null,
      ProviderID: 1,
      PurchaseOrderNumber: purchaseOrderNumber,
      PurchaseDate: date,
      Status: status,
      PurchaseTotalPrice: calculateTotalPrice(items),
      items,
    };

    try {
      let response;

      if (editData && editData.PurchaseOrderID) {
        response = await axios.put(
          `https://order-management-tgh3.onrender.com/po/updatepo/${editData.PurchaseOrderID}`,
          data
        );
      } else {
        response = await axios.post("https://order-management-tgh3.onrender.com/po/insertpo", data);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Purchase order saved successfully");
      }

      window.location.reload();
      onCloses();
      resetForm();

      return;
    } catch (error) {
      console.error("Error inserting/updating purchase order:", error);

      if (error.response) {
        if (error.response.status === 409) {
          toast.error("This customer already exists.");
        } else {
          toast.error(
            error.response.data.message ||
              "An error occurred while saving the purchase order."
          );
        }
      } else {
        // toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (existingOrder) {
      setCustomerID(existingOrder.CustomerID);
      setCustomerPO(existingOrder.CustomerSalesOrderID);
      setDate(
        existingOrder.PurchaseDate
          ? existingOrder.PurchaseDate.slice(0, 10)
          : ""
      );
      setStatus(existingOrder.Status);
      setPurchaseOrderNumber(existingOrder.PurchaseOrderNumber);
    }
  }, [existingOrder]);

  const handleAddItemClick = () => {
    setAddClick(true);
  };

  const handleAddItem = (item) => {
    const updateItems = [...purchaseOrderItems, item];
    setPurchaseOrderItems(updateItems);
    calculateTotalPrice(updateItems);
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCancel = () => {
    setAddClick(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "CustomerID") setCustomerID(value);
    else if (name === "CustomerPO") setCustomerPO(value);
    else if (name === "PurchaseOrderNumber") setPurchaseOrderNumber(value);
    else if (name === "Date") setDate(value);
    else if (name === "Status") setStatus(value);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = purchaseOrderItems.filter((_, i) => i !== index);
    setPurchaseOrderItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const handleCancelAndRefresh = () => {
    onCloses();
    window.location.reload();
  };

  return (
    <div>
      {loading && (
        <div className="overlay">
          <FaSpinner className="spinner" />
        </div>
      )}
      {addClick ? (
        <AddOrEdit
          onClose={handleCancel}
          selectedPurchaseId={selectedPurchaseId}
          onPurchaseData={handleAddItem}
          customesId={customesId}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="salesorder-form">
            <h3 className="salesorder-form-heading">
              {editData ? "Edit Purchase Order" : "Add Purchase Order"}
            </h3>

            <label htmlFor="customer">
              Customer: <span style={{ color: "red" }}>*</span>
              <select
                id="customer"
                name="CustomerID"
                value={customerID}
                onChange={handleInputChange}
                className="customer-salesorder_input"
                required
              >
                <option value="">Select Customer</option>
                {customerData.map((customer) => (
                  <option key={customer.CustomerID} value={customer.CustomerID}>
                    {customer.CustomerName}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="date">
              Date:
              <span style={{ color: "red" }}>*</span>
              <input
                type="date"
                id="date"
                name="Date"
                value={date}
                onChange={handleInputChange}
                className="customer-salesorder_input"
                required
              />
            </label>

            <label htmlFor="customerpo">
              Customer PO: <span style={{ color: "red" }}>*</span>
              <select
                id="customerPO"
                name="CustomerPO"
                value={customerPO}
                onChange={handleInputChange}
                className="customer-salesorder_input"
                required
                disabled={!customerID}
              >
                <option value="">Select CPO</option>
                {salesData.map((item) => (
                  <option
                    key={item.CustomerSalesOrderID}
                    value={item.CustomerSalesOrderID}
                  >
                    {item.SalesOrderNumber}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="purchaseOrderNumber">
              Purchase Order Number:
              <span style={{ color: "red" }}>*</span>
              <input
                id="purchaseOrderNumber"
                name="PurchaseOrderNumber"
                value={purchaseOrderNumber}
                onChange={handleInputChange}
                className="customer-salesorder_input"
                required
              />
            </label>

            <label htmlFor="status">
              Status:
              <span style={{ color: "red" }}>*</span>
              <select
                id="status"
                name="Status"
                value={status}
                onChange={handleInputChange}
                className="status-salesorder_input"
                required
              >
                <option>Select Status</option>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </label>

            {selectedPurchaseId ? (
              <button
                type="button"
                onClick={handleAddItemClick}
                className="add-item"
              >
                Add Item
              </button>
            ) : (
              ""
            )}
          </form>

          {selectedPurchaseId ? (
            <AddPurchaseItem
              selectedPurchaseId={selectedPurchaseId}
              items={purchaseOrderItems}
              handleDeleteItem={handleDeleteItem}
              availableQTY={selectedItem ? selectedItem.Stock : 0}
            />
          ) : (
            ""
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
              onClick={handleCancelAndRefresh}
              className="customer-form__button"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PurchaseOrder;
