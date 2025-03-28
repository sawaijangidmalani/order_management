import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import toast from "react-hot-toast";
import "../Style/Add.css";
import { FaSpinner } from "react-icons/fa";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 20%;
  left: 35%;
  border-radius: 20px;
`;

const AddOrEdit = ({
  selectedPurchaseId,
  onClose,
  itemToEdit,
  availableQTY,
}) => {
  const [products, setProducts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableQty, setAvailableQty] = useState(availableQTY || 0);
  const [allocatedQty, setAllocatedQty] = useState(0);
  const [remainingQty, setRemainingQty] = useState(availableQTY || 0);
  const [unitCost, setUnitCost] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchingCPOItems, setMatchingCPOItems] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://order-management-mnty.onrender.com/customerpo/getcustomersalesorderitems"
        );
        setProducts(res.data.data);
        console.log("CPO Item:", res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPO = async () => {
      try {
        const res = await axios.get("https://order-management-mnty.onrender.com/po/getpo");
        if (res.data && Array.isArray(res.data)) {
          setPurchaseOrders(res.data);
          const matchedOrder = res.data.find(order => order.PurchaseOrderID === selectedPurchaseId);
          if (matchedOrder) {
            console.log("Matched Purchase Order Details:", matchedOrder);
            const matchingItems = products.filter(product => product.CustomerSalesOrderID === matchedOrder.CustomerSalesOrderID);
            if (matchingItems.length > 0) {
              console.log("Matching CPO Items:", matchingItems);
              setMatchingCPOItems(matchingItems);
            } else {
              setMatchingCPOItems([]);
            }
          } else {
            console.log(`No match found for Purchase Order ID: ${selectedPurchaseId}`);
            setMatchingCPOItems([]);
          }
        } else {
          console.error("Unexpected response structure:", res.data);
        }
      } catch (err) {
        console.error("Error fetching purchase orders:", err);
      }
    };
    fetchPO();
  }, [selectedPurchaseId, products]);

  const handleProductChange = (event) => {
    const itemId = event.target.value;
    const product = products.find((p) => p.ItemID.toString() === itemId);
    if (product) {
      setSelectedProduct(product);
      setAvailableQty(product.AllocatedQty || product.Stock || 0);
      setAllocatedQty(0);
      setRemainingQty(product.AllocatedQty || product.Stock || 0);
      setUnitCost(0);
      setPurchasePrice(0); 
    }
  };

  const calculatePurchasePrice = (qty, cost) => {
    return (qty * cost).toFixed(2);
  };

  const handleAllocatedQtyChange = (e) => {
    const qty = parseFloat(e.target.value) || 0;
    setAllocatedQty(qty);
    setRemainingQty((availableQty || 0) - qty);
    setPurchasePrice(calculatePurchasePrice(qty, unitCost));
  };

  const handleUnitCostChange = (e) => {
    const cost = parseFloat(e.target.value) || 0;
    setUnitCost(cost);
    setPurchasePrice(calculatePurchasePrice(allocatedQty, cost));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const purchaseOrderItem = {
      PurchaseOrderItemID: itemToEdit?.PurchaseOrderItemID || null,
      PurchaseOrderID: selectedPurchaseId,
      ItemID: selectedProduct?.ItemID || null,
      AllocatedQty: parseFloat(allocatedQty) || 0,
      UnitCost: parseFloat(unitCost) || 0,
      PurchasePrice: parseFloat(purchasePrice) || 0,
      InvoiceNumber: invoice || "",
      InvoiceDate: date || null,
    };

    try {
      let response;
      if (itemToEdit) {
        response = await axios.put(
          "https://order-management-mnty.onrender.com/po/editpurchaseorderitems",
          purchaseOrderItem
        );
      } else {
        response = await axios.post(
          "https://order-management-mnty.onrender.com/po/addpurchaseorderitems",
          purchaseOrderItem
        );
      }

      if (response.data && response.data.success) {
        toast.success(
          itemToEdit ? "Item updated successfully!" : "Item added successfully!"
        );
        setSelectedProduct(null);
        setAllocatedQty("");
        setAvailableQty("");
        setRemainingQty("");
        setUnitCost("");
        setPurchasePrice("");
        setInvoice("");
        setDate("");
        onClose();
      } else {
        toast.error(
          response.data?.message || "Something went wrong, please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting purchase order item:", error);
      toast.error(
        error.response?.data?.message || "An error occurred: " + error.message
      );
    }
    setLoading(false);
  };

  return (
    <Modal>
      {loading && (
        <div className="overlay">
          <FaSpinner className="spinner" />
        </div>
      )}
      <div className="body-container">
        <form onSubmit={handleSubmit} className="customer-form">
          <h3 className="form-heading">
            {itemToEdit ? "Edit" : "Add"} Purchase Order Item
          </h3>

          <label htmlFor="item" className="customer-form__label">
            Item: <span style={{ color: "red" }}>*</span>
            <select
              id="item"
              value={selectedProduct?.ItemID || ""}
              onChange={handleProductChange}
              className="customer-form__input"
              required
            >
              <option value="" disabled>Select Item</option>
              {matchingCPOItems.length > 0 ? (
                matchingCPOItems.map((item) => (
                  <option key={item.ItemID} value={item.ItemID}>
                    {item.ItemName}
                  </option>
                ))
              ) : (
                <option disabled>No Matching CPO Items</option>
              )}
            </select>
          </label>

          <label htmlFor="availableQty" className="customer-form__label">
            Available Qty:
            <input
              type="number"
              id="availableQty"
              value={availableQty || 0}
              readOnly
              className="customer-form__input"
            />
          </label>

          <label htmlFor="allocatedQty" className="customer-form__label">
            Allocated Qty:
            <span style={{ color: "red" }}>*</span>
            <input
              id="allocatedQty"
              type="number"
              value={allocatedQty || ""}
              onChange={handleAllocatedQtyChange}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="remainingQty" className="customer-form__label">
            Remaining Qty:
            <input
              id="remainingQty"
              type="number"
              value={remainingQty || 0}
              readOnly
              className="customer-form__input"
            />
          </label>

          <label htmlFor="unitCost" className="customer-form__label">
            Unit Cost:
            <span style={{ color: "red" }}>*</span>
            <input
              id="unitCost"
              type="number"
              value={unitCost || ""}
              onChange={handleUnitCostChange}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="purchasePrice" className="customer-form__label">
            Purchase Price:
            <input
              id="purchasePrice"
              type="number"
              value={purchasePrice || 0}
              readOnly
              className="customer-form__input"
            />
          </label>

          <label htmlFor="invoice" className="customer-form__label">
            Invoice Number:
            <span style={{ color: "red" }}>*</span>
            <input
              type="text"
              id="invoice"
              value={invoice || ""}
              onChange={(event) => setInvoice(event.target.value)}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="date" className="customer-form__label">
            Invoice Date:
            <span style={{ color: "red" }}>*</span>
            <input
              type="date"
              id="date"
              value={date || ""}
              onChange={(event) => setDate(event.target.value)}
              className="customer-form__input"
              required
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
              className="customer-form__button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrEdit;