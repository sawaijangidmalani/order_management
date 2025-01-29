import React, { useState, useEffect } from "react";

function EditCustomerPO({ onSalesData, saleData, customers }) {
  const [customer, setCustomer] = useState(saleData?.customer || customers[0]?.name || "");
  const [date, setDate] = useState(saleData?.date || "");
  const [invoice, setInvoice] = useState(saleData?.invoice || "");
  const [total, setTotal] = useState(saleData?.total || "");
  const [status, setStatus] = useState(saleData?.status || "Draft");

  useEffect(() => {
    if (saleData) {
      setCustomer(saleData.customer);
      setDate(saleData.date);
      setInvoice(saleData.invoice);
      setTotal(saleData.total);
      setStatus(saleData.status);
    }
  }, [saleData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
      customer,
      date,
      invoice,
      total,
      status,
    };
    onSalesData(newData);
  };

  return (
    <form onSubmit={handleSubmit} className="salesorder-form">
      <h3 className="salesorder-form-heading">Add / Edit Customer PO</h3>
      <label htmlFor="customer" className="customer-salesorder_label">
        Customer Name
      </label>
      <select
        id="customer"
        value={customer}
        onChange={(event) => setCustomer(event.target.value)}
        className="customer-salesorder_input"
      >
        {customers.map((cust) => (
          <option key={cust.id} value={cust.name}>
            {cust.name}
          </option>
        ))}
      </select>
      <label htmlFor="invoice" className="invoice-salesorder_label">
        Customer PO
      </label>
      <input
        type="text"
        id="invoice"
        value={invoice}
        onChange={(event) => setInvoice(event.target.value)}
        className="invoice-salesorder_input"
      />
      <label htmlFor="date" className="date-salesorder_label">
        Date:
      </label>
      <input
        type="date"
        id="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="date-salesorder_input"
      />
      <label htmlFor="total" className="total-salesorder_label">
        Total Purchase
      </label>
      <input
        type="number"
        id="total"
        value={total}
        onChange={(event) => setTotal(event.target.value)}
        className="total-salesorder_input"
      />
      <label htmlFor="status" className="status-salesorder_label">
        Status:
      </label>
      <select 
        id="status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="status-salesorder_input"
      >
        <option value="Draft">Draft</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button type="submit" className="submit-salesorder_button">Save</button>
      <button type="button" onClick={() => onSalesData(null)} className="submit-salesorder_button">Cancel</button>
    </form>
  );
}

export default EditCustomerPO;
