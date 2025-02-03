import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import toast from "react-hot-toast";

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableQty, setAvailableQty] = useState(availableQTY || 0);
  const [allocatedQty, setAllocatedQty] = useState(0);
  const [remainingQty, setRemainingQty] = useState(availableQTY || 0);
  const [unitCost, setUnitCost] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/item/getItems");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (itemToEdit && products.length > 0) {
      const selectedItem = products.find((p) => p.ItemID === itemToEdit.ItemID);
      if (selectedItem) {
        setSelectedProduct(selectedItem);
        setAvailableQty(selectedItem.Stock || 0);
        setAllocatedQty(itemToEdit.AllocatedQty || 0);
        setRemainingQty(
          (selectedItem.Stock || 0) - (itemToEdit.AllocatedQty || 0)
        );
        setUnitCost(itemToEdit.UnitCost);
        setPurchasePrice(itemToEdit.PurchasePrice);
        setInvoice(itemToEdit.InvoiceNumber);

        const formattedDate = itemToEdit.InvoiceDate
          ? new Date(itemToEdit.InvoiceDate).toISOString().split("T")[0]
          : "";
        setDate(formattedDate);
      }
    }
  }, [itemToEdit, products]);

  const handleProductChange = (event) => {
    const productName = event.target.value;
    const product = products.find((p) => p.Name === productName);
    if (product) {
      setSelectedProduct(product);
      setAvailableQty(product.Stock);
      setAllocatedQty(0);
      setRemainingQty(product.Stock || 0);
      setUnitCost(product.UnitCost || 0);
      setPurchasePrice(product.PurchasePrice || 0);
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
          "http://localhost:8000/po/editpurchaseorderitems",
          purchaseOrderItem
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/po/addpurchaseorderitems",
          purchaseOrderItem
        );
      }

      if (response.data && response.data.success) {
        toast.success(
          itemToEdit ? "Item updated successfully!" : "Item added successfully!"
        );
        

        // Reset form
        setSelectedProduct(null);
        setAllocatedQty("");
        setAvailableQty("");
        setRemainingQty("");
        setUnitCost("");
        setPurchasePrice("");
        setInvoice("");
        setDate("");
        onClose();
        // window.location.reload();

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
  };

  return (
    <Modal>
      <div className="body-container">
        <form onSubmit={handleSubmit} className="customer-form">
          <h3 className="form-heading">
            {itemToEdit ? "Edit" : "Add"} Purchase Order Item
          </h3>

          <label htmlFor="item" className="customer-form__label">
            Item:
            <select
              id="item"
              value={selectedProduct?.Name || ""}
              onChange={handleProductChange}
              className="customer-form__input"
              required
            >
              <option value="">Select an Item</option>
              {products.map((product) => (
                <option key={product.ItemID} value={product.Name}>
                  {product.Name}
                </option>
              ))}
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
            <input
              id="unitCost"
              type="number"
              value={unitCost || 0}
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
              required
            />
          </label>

          <label htmlFor="invoice" className="customer-form__label">
            Invoice Number:
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
            <button type="submit" className="customer-form__button">
              Save
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
