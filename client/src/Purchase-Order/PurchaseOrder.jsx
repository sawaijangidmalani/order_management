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
        toast.error("Failed to fetch customer data.");
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
        toast.error("Failed to fetch sales data.");
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
      console.log("Submitting data:", data);
      let response;

      if (editData && editData.PurchaseOrderID) {
        response = await axios.put(
          `https://order-management-tgh3.onrender.com/po/updatepo/${encodeURIComponent(
            purchaseOrderNumber
          )}`,
          data
        );
      } else {
        response = await axios.post("https://order-management-tgh3.onrender.com/po/insertpo", data);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          editData
            ? "Purchase order updated successfully"
            : "Purchase order saved successfully"
        );
        onCloses();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error inserting/updating purchase order:", error, {
        code: error.code,
        message: error.message,
        response: error.response ? error.response.data : null,
      });

      if (error.response) {
        if (error.response.status === 409) {
          toast.error("This customer already has a purchase order.");
        } else if (error.response.status === 404) {
          toast.error("Purchase order not found.");
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message || "Invalid data provided.");
        } else if (error.response.status === 500) {
          toast.error(error.response.data.message || "Server error occurred.");
        } else {
          toast.error(
            error.response.data.message ||
              "An unexpected server error occurred."
          );
        }
      } else if (error.request) {
        toast.error("Network error: Could not connect to the server.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (existingOrder) {
      setCustomerID(existingOrder.CustomerID || "");
      setCustomerPO(existingOrder.CustomerSalesOrderID || "");
      setDate(
        existingOrder.PurchaseDate
          ? existingOrder.PurchaseDate.slice(0, 10)
          : ""
      );
      setStatus(existingOrder.Status || "");
      setPurchaseOrderNumber(existingOrder.PurchaseOrderNumber || "");
      setItems(existingOrder.items || []);
    }
  }, [existingOrder]);

  const handleAddItemClick = () => {
    setAddClick(true);
  };

  const handleAddItem = (item) => {
    const updateItems = [...purchaseOrderItems, item];
    setPurchaseOrderItems(updateItems);
    setItems(updateItems);
    calculateTotalPrice(updateItems);
  };

  const calculateTotalPrice = (items) => {
    return items.reduce(
      (total, item) =>
        total + (item.Price || item.price || 0) * (item.Quantity || 0),
      0
    );
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
    setItems(updatedItems);
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
                <option value="">Select Status</option>
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
