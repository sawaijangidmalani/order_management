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
  const [allCustomerPOs, setAllCustomerPOs] = useState([]);
  const [filteredCustomerPOs, setFilteredCustomerPOs] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [salesItems, setSalesItems] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [rems, setRems] = useState([]);
  const [selectedCPO, setSelectedCPO] = useState("");
  const [selectedPO, setSelectedPO] = useState("");
  const [loadingCPOs, setLoadingCPOs] = useState(false);
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

  const toggleDropdownPurchaseOrder = () =>
    setDropdownOpenPurchaseOrder(!dropdownOpenPurchaseOrder);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setSelectedCustomerPO("");
    setSelectedPO("");
    setSalesItems([]);
    setPurchaseItems([]);
    setRems([]);
    setDropdownOpenCustomer(false);
    fetchCustomerPOs(customer.CustomerID);
  };

  const handleCustomerPOSelect = (po) => {
    console.log("CPO Selected:", po);
    setSelectedCustomerPO(po);
    setSelectedCPO(po);
    setSelectedPO("");
    setPurchaseItems([]);
    setRems([]);
    setDropdownOpenCustomerPO(false);
    fetchPurchaseOrdersForCPO(po);
  };

  const handlePurchaseOrderSelect = (po) => {
    setSelectedPurchaseOrder(po);
    setSelectedPO(po);
    setDropdownOpenPurchaseOrder(false);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const result = await axios.get(
          "https://order-management-pqn2.onrender.com/customer/getCustomerData"
        );
        const activeCustomers = result.data.filter(
          (customer) => customer.Status === 1
        );
        setCustomers(activeCustomers);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    const fetchAllCustomerPOs = async () => {
      try {
        const response = await axios.get(
          "https://order-management-pqn2.onrender.com/customerpo/getCustomerPo"
        );
        const customerPOs = response.data.map((item) => ({
          salesOrderNumber: item.SalesOrderNumber,
          customerSalesOrderID: item.CustomerSalesOrderID,
        }));
        setAllCustomerPOs(customerPOs);
        setFilteredCustomerPOs(customerPOs);
      } catch (error) {
        console.error("Error fetching all customer POs:", error);
      }
    };

    const fetchAllPurchaseOrders = async () => {
      try {
        const response = await axios.get("https://order-management-pqn2.onrender.com/po/getpo");
        const allPOs = response.data.map((po) => ({
          purchaseOrderNumber: po.PurchaseOrderNumber,
          purchaseOrderID: po.PurchaseOrderID,
        }));
        setPurchaseOrders(allPOs);
        console.log("All POs:", allPOs);
      } catch (error) {
        console.error("Error fetching all purchase orders:", error);
      }
    };

    fetchCustomers();
    fetchAllCustomerPOs();
    fetchAllPurchaseOrders();
  }, []);

  const fetchCustomerPOs = async (customerId) => {
    setLoadingCPOs(true);
    try {
      const response = await axios.get(
        `https://order-management-pqn2.onrender.com/customerpo/getCustomerPo?customerId=${customerId}`
      );
      const customerPOs = response.data
        .filter((item) => item.CustomerID === customerId)
        .map((item) => ({
          salesOrderNumber: item.SalesOrderNumber,
          customerSalesOrderID: item.CustomerSalesOrderID,
        }));
      setFilteredCustomerPOs(customerPOs);
    } catch (error) {
      console.error("Error fetching customer POs:", error);
      setFilteredCustomerPOs([]);
    } finally {
      setLoadingCPOs(false);
    }
  };

  const fetchPurchaseOrdersForCPO = async (selectedCPO) => {
    try {
      const response = await axios.get("https://order-management-pqn2.onrender.com/po/getpo");
      const selectedPO = filteredCustomerPOs.find(
        (po) => po.salesOrderNumber === selectedCPO
      );
      const customerSalesOrderID = selectedPO
        ? selectedPO.customerSalesOrderID
        : null;

      const relatedPOs = response.data
        .filter((po) => po.CustomerSalesOrderID === customerSalesOrderID)
        .map((po) => ({
          purchaseOrderNumber: po.PurchaseOrderNumber,
          purchaseOrderID: po.PurchaseOrderID,
        }));

      setPurchaseOrders(relatedPOs);
      console.log("Related POs:", relatedPOs);
    } catch (error) {
      console.error("Error fetching purchase orders for CPO:", error);
      setPurchaseOrders([]);
    }
  };

  const fetchItemsData = async () => {
    try {
      const res = await axios.get(
        "https://order-management-pqn2.onrender.com/customerpo/getcustomersalesorderitems"
      );
      if (res.data && res.data.data) {
        const selectedPO = filteredCustomerPOs.find(
          (po) => po.salesOrderNumber === selectedCustomerPO
        );
        const customerSalesOrderID = selectedPO
          ? selectedPO.customerSalesOrderID
          : null;

        const filteredItems = res.data.data.filter(
          (item) => item.CustomerSalesOrderID === customerSalesOrderID
        );
        console.log("Filtered Items:", filteredItems);
        setSalesItems(filteredItems);
      } else {
        console.error("No data found in the response.");
        setSalesItems([]);
      }
    } catch (err) {
      console.error("Error fetching sales order items:", err);
      setSalesItems([]);
    }
  };

  const fetchPurchaseItems = async () => {
    try {
      const res = await axios.get(
        "https://order-management-pqn2.onrender.com/po/getpurchaseorderitems"
      );
      if (res.data && res.data.data) {
        const selectedPO = purchaseOrders.find(
          (po) => po.purchaseOrderNumber === selectedPurchaseOrder
        );
        const purchaseOrderID = selectedPO ? selectedPO.purchaseOrderID : null;

        const filteredItems = res.data.data.filter(
          (item) => item.PurchaseOrderID === purchaseOrderID
        );
        console.log("Filtered Purchase Items:", filteredItems);
        setPurchaseItems(filteredItems);
      } else {
        console.error("No data found in the response.");
        setPurchaseItems([]);
      }
    } catch (err) {
      console.error("Error fetching purchase order items:", err);
      setPurchaseItems([]);
    }
  };

  const calculateRemainingItems = () => {
    if (!salesItems.length || !purchaseItems.length) {
      setRems([]);
      return;
    }

    const remaining = salesItems
      .map((salesItem) => {
        const matchingPurchaseItem = purchaseItems.find(
          (purchaseItem) => purchaseItem.ItemName === salesItem.ItemName
        );

        if (!matchingPurchaseItem) {
          return null;
        }

        const salesQty = parseFloat(salesItem.AllocatedQty) || 0;
        const purchaseQty = parseFloat(matchingPurchaseItem.AllocatedQty) || 0;
        const remainingQty = salesQty - purchaseQty;

        return {
          name: salesItem.ItemName,
          qty: remainingQty > 0 ? remainingQty : 0,
          price: salesItem.UnitCost || "0",
        };
      })
      .filter((item) => item !== null && item.qty > 0);

    console.log("Remaining Items:", remaining);
    setRems(remaining);
  };

  useEffect(() => {
    if (selectedCustomerPO) {
      fetchItemsData();
    }
  }, [selectedCustomerPO]);

  useEffect(() => {
    if (selectedPurchaseOrder) {
      fetchPurchaseItems();
    }
  }, [selectedPurchaseOrder]);

  useEffect(() => {
    if (salesItems.length > 0 && purchaseItems.length > 0) {
      calculateRemainingItems();
    } else {
      setRems([]);
    }
  }, [salesItems, purchaseItems]);

  const salesorderAmount = salesItems.reduce(
    (total, item) => total + (parseFloat(item.SalesPrice) || 0),
    0
  );

  const orderAmount = purchaseItems.reduce(
    (total, item) => total + (parseFloat(item.PurchasePrice) || 0),
    0
  );

  const profitLoss = salesorderAmount - orderAmount;

  return (
    <div className="container">
      <h1>Dashboard - Profit & Loss</h1>
      <div className="StyledDiv">
        <div className="LeftContainer">
          <div className="dropdowncontainer">
            <button className="StyledIn" onClick={toggleDropdownCustomer}>
              {selectedCustomer.Name || "Select Customer"}
            </button>
            {dropdownOpenCustomer && (
              <div className="dropdownoption">
                <div
                  className="option"
                  onClick={() =>
                    handleCustomerSelect({
                      CustomerID: null,
                      Name: "Select Customer",
                    })
                  }
                >
                  Select Customer
                </div>
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
          <div className="dropdowncontainer">
            <button className="StyledIn" onClick={toggleDropdownCustomerPO}>
              {selectedCustomerPO || "Select CPO"}
            </button>
            {dropdownOpenCustomerPO && (
              <div className="dropdownoption">
                {loadingCPOs ? (
                  <div>Loading...</div>
                ) : filteredCustomerPOs.length > 0 ? (
                  <>
                    <div
                      className="option"
                      onClick={() => handleCustomerPOSelect("Select CPO")}
                    >
                      Select CPO
                    </div>
                    {filteredCustomerPOs.map((po, index) => (
                      <div
                        key={index}
                        className="option"
                        onClick={() =>
                          handleCustomerPOSelect(po.salesOrderNumber)
                        }
                      >
                        {po.salesOrderNumber}
                      </div>
                    ))}
                  </>
                ) : (
                  <div>No CPO Available</div>
                )}
              </div>
            )}
          </div>
          <div className="dropdowncontainer">
            <button className="StyledIn" onClick={toggleDropdownPurchaseOrder}>
              {selectedPurchaseOrder || "Select PO"}
            </button>
            {dropdownOpenPurchaseOrder && (
              <div className="dropdownoption">
                {purchaseOrders.length > 0 ? (
                  <>
                    <div
                      className="option"
                      onClick={() => handlePurchaseOrderSelect("Select PO")}
                    >
                      Select PO
                    </div>
                    {purchaseOrders.map((po, index) => (
                      <div
                        className="option"
                        key={index}
                        onClick={() =>
                          handlePurchaseOrderSelect(po.purchaseOrderNumber)
                        }
                      >
                        {po.purchaseOrderNumber}
                      </div>
                    ))}
                  </>
                ) : (
                  <div>No PO Available</div>
                )}
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
          <StyledTable className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {salesItems.length > 0 ? (
                salesItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ItemName || "N/A"}</td>
                    <td>{item.AllocatedQty || "N/A"}</td>
                    <td>{item.SalesPrice || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No Items Available</td>
                </tr>
              )}
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
              {purchaseItems.length > 0 ? (
                purchaseItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ItemName || "N/A"}</td>
                    <td>{item.AllocatedQty || "N/A"}</td>
                    <td>{item.PurchasePrice || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No Items Available</td>
                </tr>
              )}
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
              {rems.length > 0 ? (
                rems.map((rem, index) => (
                  <tr key={index}>
                    <td>{rem.name || "N/A"}</td>
                    <td>{rem.qty || "N/A"}</td>
                    <td>{rem.price || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No Remaining Items</td>
                </tr>
              )}
            </tbody>
          </StyledTable>
          <h3>Profit/Loss: {Number(profitLoss || 0).toFixed(2)}</h3>
        </div>
      </StyledDv>
    </div>
  );
}

export default Dashboard;
