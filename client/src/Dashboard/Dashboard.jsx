import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const StyledDv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  gap: 10px;
`;

const StyledTable = styled.table`
  width: 370px;
  font-size: 18px;
`;

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [customerPOs, setCustomerPOs] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [salesItems, setSalesItems] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [rems, setRems] = useState([]);
  const [selectedCPO, setSelectedCPO] = useState("");
  const [selectedPO, setSelectedPO] = useState("");

  const [dropdownOpenCustomer, setDropdownOpenCustomer] = useState(false);
  const [dropdownOpenCustomerPO, setDropdownOpenCustomerPO] = useState(false);
  const [dropdownOpenPurchaseOrder, setDropdownOpenPurchaseOrder] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerPO, setSelectedCustomerPO] = useState("");
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState("");

  const toggleDropdownCustomer = () =>
    setDropdownOpenCustomer(!dropdownOpenCustomer);
  const toggleDropdownCustomerPO = () =>
    setDropdownOpenCustomerPO(!dropdownOpenCustomerPO);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setDropdownOpenCustomer(false);
    fetchCustomerPOs(customer.CustomerID);
  };

  const handleCustomerPOSelect = (po) => {
    setSelectedCustomerPO(po);
    setSelectedCPO(po);
    setDropdownOpenCustomerPO(false);
  };

  const toggleDropdownPurchaseOrder = () => {
    setDropdownOpenPurchaseOrder(!dropdownOpenPurchaseOrder);
  };

  const handlePurchaseOrderSelect = (purchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setDropdownOpenPurchaseOrder(false);
    setSelectedPO(purchaseOrder);
  };

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/po/getpo");

        const purchaseOrderNumbers = response.data.map(
          (purchase) => purchase.PurchaseOrderNumber
        );

        setPurchaseOrders(purchaseOrderNumbers);
      } catch (error) {
        console.error("Error fetching purchase data:", error);
      }
    };

    fetchPurchaseOrders();
  }, []);

  useEffect(() => {
    const fetchCustomerPOs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/customerpo/getCustomerPo"
        );
        const salesOrderNumbers = response.data.map(
          (item) => item.SalesOrderNumber
        );
        setCustomerPOs(salesOrderNumbers);
      } catch (error) {
        console.error("Error fetching customer POs:", error);
      }
    };

    fetchCustomerPOs();
  }, []);

  // Fetch Customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const result = await axios.get(
          "http://localhost:8000/customer/getCustomerData"
        );
        setCustomers(result.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch Customer POs based on Customer ID
  const fetchCustomerPOs = async (customerID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/customerpo/getCustomerPOs/${customerID}`
      );
      if (response.data.success) {
        setCustomerPOs(response.data.data);
      } else {
        console.error("Error: No Customer POs found.");
        setCustomerPOs([]);
      }
    } catch (err) {
      console.error("Error fetching Customer POs:", err);
      setCustomerPOs([]);
    }
  };

  // Fetch Data for Tables
  useEffect(() => {
    axios
      .get("http://localhost:8000/po/getpurchaseorderitems")
      .then((res) => setPurchaseItems(res.data.data || []))
      .catch((err) =>
        console.error("Error fetching purchase order items:", err)
      );

    axios
      .get("http://localhost:8000/customerpo/getcustomersalesorderitems")
      .then((res) => setSalesItems(res.data.data || []))
      .catch((err) => console.error("Error fetching sales order items:", err));

    // axios
    //   .get("http://localhost:8000/customerPo/getRemainingPurchaseOrder")
    //   .then((res) => setRems(res.data.data || []))
    //   .catch((err) =>
    //     console.error("Error fetching remaining purchase orders:", err)
    //   );
  }, []);

  const salesorderAmount = salesItems.reduce(
    (total, item) => total + (parseFloat(item.SalesPrice) || 0),
    0
  );

  const orderAmount = purchaseItems.reduce(
    (total, item) => total + (parseFloat(item.PurchasePrice) || 0),
    0
  );

  const RemAmount = rems.reduce(
    (acc, rem) => acc + (parseFloat(rem.price) || 0),
    0
  );

  return (
    <div className="container">
      <h1>Dashboard - Profit & Loss</h1>
      <div className="StyledDiv">
        <div className="LeftContainer">
          {/* Customer Dropdown */}
          <div className="dropdowncontainer">
            <button className="StyledIn" onClick={toggleDropdownCustomer}>
              {selectedCustomer.Name || "Select Customer"}
            </button>
            {dropdownOpenCustomer && (
              <div className="dropdownoption">
                {customers.map((customer) => (
                  <div
                    key={customer.CustomerID}
                    className="option"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    {customer.Name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Customer PO Dropdown */}
          <div className="dropdowncontainer">
            <button className="StyledIn" onClick={toggleDropdownCustomerPO}>
              {selectedCustomerPO || "Select CPO"}
            </button>
            {dropdownOpenCustomerPO && (
              <div className="dropdownoption">
                {customerPOs.map((po, index) => (
                  <div
                    key={index}
                    className="option"
                    onClick={() => handleCustomerPOSelect(po)}
                  >
                    {po}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Purchase Order Dropdown */}
          <div className="dropdowncontainer">
            <button className="StyledIn" onClick={toggleDropdownPurchaseOrder}>
              {selectedPurchaseOrder || "Select PO"}
            </button>
            {dropdownOpenPurchaseOrder && (
              <div className="dropdownoption">
                {purchaseOrders.map((po, index) => (
                  <div
                    className="option"
                    key={index}
                    onClick={() => handlePurchaseOrderSelect(po)}
                  >
                    {po}
                  </div>
                ))}
              </div>
            )}
          </div>
          Start Date
          <input type="date" max={getTodayDate()} className="StyledIn" />
          End Date
          <input type="date" max={getTodayDate()} className="StyledIn" />
        </div>

        <button className="StyledButtonSearch" style={{ marginLeft: "10px" }}>
          <BiSearch />
          Search
        </button>
      </div>

      <StyledDv>
        <div className="tables">
          <h3>Customer PO Details: {selectedCPO}</h3>
          {/* <h3>
  Customer PO Details: <span style={{ color: 'black' }}>{selectedCPO}</span>
</h3> */}

          <StyledTable className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {salesItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.ItemName}</td>
                  <td>{item.AllocatedQty}</td>
                  <td>{item.SalesPrice}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>

          <h3>
            Sales Order Amount: {Number(salesorderAmount || 0).toFixed(2)}
          </h3>
        </div>

        <div>
          <h3>Purchase Order Details: {selectedPO}</h3>
          <StyledTable className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {purchaseItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.ItemName}</td>
                  <td>{item.AllocatedQty}</td>
                  <td>{Number(item.PurchasePrice || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>

          <h3>Purchase Order Amount: {Number(orderAmount || 0).toFixed(2)}</h3>
        </div>

        <div>
          <h3>Remaining Purchase Order</h3>
          <StyledTable className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {rems.map((rem, index) => (
                <tr key={index}>
                  <td>{rem.name}</td>
                  <td>{rem.qty}</td>
                  <td>{Number(rem.price || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>

          <h3>Remaining Purchase: {parseFloat(RemAmount || 0).toFixed(2)}</h3>
        </div>
      </StyledDv>
    </div>
  );
}

export default Dashboard;
