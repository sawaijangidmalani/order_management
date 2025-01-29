import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import toast from "react-hot-toast";

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 10%;
  left: 35%;
  border-radius: 20px;
`;

const AddorEditCustomer = ({
  selectedSaleId,
  onClose,
  itemToEdit,
  availableQTY,
}) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableQty, setAvailableQty] = useState(availableQTY);
  const [allocatedQty, setAllocatedQty] = useState("");
  const [remainingQty, setRemainingQty] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [tax, setTax] = useState("");

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
      const product = products.find((p) => p.ItemID === itemToEdit.ItemID);
      if (product) {
        setSelectedProduct(product);
        setAvailableQty(product.Stock || 0);
        setAllocatedQty(itemToEdit.AllocatedQty || 0);
        setRemainingQty((product.Stock || 0) - (itemToEdit.AllocatedQty || 0));
        setUnitCost(itemToEdit.UnitCost || 0);
        setSalesPrice(itemToEdit.SalesPrice || 0);
        setTax(itemToEdit.Tax || 0);
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
      setSalesPrice(product.SalesPrice || 0);
    }
  };

  const calculateSalesPrice = (qty, cost, tax) => {
    return (qty * cost * (1 + tax / 100)).toFixed(2);
  };

  const handleAllocatedQtyChange = (e) => {
    const qty = parseFloat(e.target.value) || 0;
    setAllocatedQty(qty);
    setRemainingQty((availableQty || 0) - qty);
    setSalesPrice(calculateSalesPrice(qty, unitCost, tax));
  };

  const handleUnitCostChange = (e) => {
    const cost = parseFloat(e.target.value) || 0;
    setUnitCost(cost);
    setSalesPrice(calculateSalesPrice(allocatedQty, cost, tax));
  };

  const handleTaxChange = (e) => {
    const taxValue = parseFloat(e.target.value) || 0;
    setTax(taxValue);
    setSalesPrice(calculateSalesPrice(allocatedQty, unitCost, taxValue));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProduct) {
      toast.error("Please select a product.");
      return;
    }

    const salesOrderItem = {
      CustomerSalesOrderItemID: itemToEdit?.CustomerSalesOrderItemID || null,
      CustomerSalesOrderID: selectedSaleId,
      ItemID: selectedProduct?.ItemID || null,
      AllocatedQty: parseFloat(allocatedQty) || 0,
      UnitCost: parseFloat(unitCost) || 0,
      SalesPrice: parseFloat(salesPrice) || 0,
      Tax: parseFloat(tax) || 0,
    };

    
    console.log("Item to Edit:", itemToEdit);
  



    try {
      let response;
      if (itemToEdit) {
        response = await axios.put(
          "http://localhost:8000/customerpo/editsalesorderitem",
          salesOrderItem
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/customerpo/addsalesorderitems",
          salesOrderItem
        );
      }

      if (response.status === 201 || response.status === 200) {
        const successMessage = itemToEdit
          ? "Item updated successfully!"
          : "Item added successfully!";
        toast.success(successMessage);
      } else {
        toast.error("Failed to save item.");
      }

      setSelectedProduct(null);
      setAllocatedQty("");
      setAvailableQty("");
      setRemainingQty("");
      setUnitCost("");
      setSalesPrice("");
      setTax("");
      onClose();
    } catch (error) {
      console.error("Error submitting sales order item:", error);
      toast.error("Error: " + error.message);
    }
  };

  return (
    <Modal>
      <div className="body-container">
        <form onSubmit={handleSubmit} className="customer-form">
          <h3 className="form-heading">
            {itemToEdit ? "Edit" : "Add"} Sales Order Item
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
              value={availableQty}
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
              value={remainingQty}
              readOnly
              className="customer-form__input"
            />
          </label>

          <label htmlFor="unitCost" className="customer-form__label">
            Unit Cost:
            <input
              id="unitCost"
              type="number"
              value={unitCost}
              onChange={handleUnitCostChange}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="tax" className="customer-form__label">
            Tax (%):
            <input
              id="tax"
              type="number"
              value={tax}
              onChange={handleTaxChange}
              className="customer-form__input"
              required
            />
          </label>

          <label htmlFor="salesPrice" className="customer-form__label">
            Sales Price:
            <input
              id="salesPrice"
              type="number"
              value={salesPrice}
              readOnly
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

export default AddorEditCustomer;
