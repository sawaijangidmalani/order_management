import React, { useState, useEffect } from "react";
import axios from "axios";

const AddOrEdit = ({ onPurchaseData, onClose }) => {
  const [customer, setCustomer] = useState("");
  const [availableQty, setAvailableQty] = useState("");
  const [qtyAllocated, setQtyAllocated] = useState("");
  const [remainingQty, setRemainingQty] = useState("");
  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:8000/item/getItems");
        console.log(res.data.data);
        setItems(res.data.data);
        if (res.data.data.length > 0) {
          const defaultItem = res.data.data[0];
          setSelectedItem(defaultItem);
          setCustomer(defaultItem.name);
          setAvailableQty(defaultItem.quantity);
          setRemainingQty(defaultItem.quantity);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem.quantity) {
      setRemainingQty(selectedItem.quantity - (qtyAllocated || 0));
    }
  }, [qtyAllocated, selectedItem]);

  const handleCustomerChange = (e) => {
    const selectedItemName = e.target.value;
    const item = items.find(item => item.Name === selectedItemName);
    setSelectedItem(item);
    setCustomer(selectedItemName);
    setAvailableQty(item.quantity);
    setRemainingQty(item.quantity - (qtyAllocated || 0));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const price = (selectedItem.price || 0) * (qtyAllocated || 0);
    const item = {
      customer,
      price,
      qtyAllocated,
      singleQuantityPrice: selectedItem.price || 0,
      invoice,
      date,
    };
    console.log("hi")
    console.log(item);
    
    onPurchaseData(item);
    setCustomer("");
    setAvailableQty("");
    setQtyAllocated("");
    setRemainingQty("");
    setInvoice("");
    setDate("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="salesorder-form">
        <h3 className="salesorder-form-heading">Add / Edit Item</h3>
        <label htmlFor="customer" className="customer-salesorder_label">
          Item Name:
        </label>
        <select
          id="customer"
          value={customer}
          onChange={handleCustomerChange}
          className="customer-salesorder_input"
        >
          <option value="">Select a Item</option>
          {items.map((item) => (
            <option key={item.Name} value={item.Name}>
              {item.Name}
            </option>
          ))}
        </select>
        <label htmlFor="availableQty" className="availableQty-salesorder_label">
          Available Qty:
        </label>
        <input  
          type="number"
          id="availableQty"
          value={availableQty}
          readOnly
          className="availableQty-salesorder_input"
        />
        <label htmlFor="qtyAllocated" className="qtyAllocated-salesorder_label">
          Qty Allocated:
        </label>
        <input
          type="number"
          id="qtyAllocated"
          value={qtyAllocated}
          onChange={(event) => {
            const value = Math.max(0, Math.min(event.target.value, availableQty)); 
            setQtyAllocated(value);
            setRemainingQty(availableQty - value);
          }}
          className="qtyAllocated-salesorder_input"
        />
        <label htmlFor="remainingQty" className="remainingQty-salesorder_label">
          Remaining Qty:
        </label>
        <input
          type="number"
          id="remainingQty"
          value={remainingQty}
          readOnly
          className="remainingQty-salesorder_input"
        />
        <label htmlFor="invoice" className="remainingQty-salesorder_label">
          Invoice Number:
        </label>
        <input
          type="number"
          id="invoice"
          value={invoice}
          onChange={(event) => setInvoice(event.target.value)}
          className="remainingQty-salesorder_input"
        />
        <label htmlFor="date" className="remainingQty-salesorder_label">
          Invoice Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="remainingQty-salesorder_input"
        />

        <div className="buttons-group">
        <button type="submit" className="customer-form__button">
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
      </form>
    </>
  );
};

export default AddOrEdit;
