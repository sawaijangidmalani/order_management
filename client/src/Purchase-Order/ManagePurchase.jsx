import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PurchaseOrder from "./PurchaseOrder";
import axios from "axios";
import "../Style/Customer.css";
import {
  BiEdit,
  BiTrash,
  BiSearch,
  BiAddToQueue,
  BiUpArrowAlt,
  BiDownArrowAlt,
} from "react-icons/bi";
import { Popconfirm, Tooltip, Pagination } from "antd";
import toast from "react-hot-toast";

const Modal = styled.div`
  position: absolute;
  top: 3%;
  left: 30%;
  background-color: #eceeef;
  height: auto;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`;

function ManagePurchase() {
  const [customers, setCustomers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState([]);
  const [selectedPurchaseIndex, setSelectedPurchaseIndex] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPurchaseData, setSelectedPurchaseData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropdownOpenCustomer, setDropdownOpenCustomer] = useState(false);
  const [dropdownOpenPurchaseOrder, setDropdownOpenPurchaseOrder] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [customesId, setCustomesId] = useState(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://order-management-tgh3.onrender.com/po/getpo");
        const updatedData = response.data.map((purchase) => ({
          ...purchase,
          CustomerName: purchase.CustomerName,
          PurchaseTotalPrice: purchase.PurchaseTotalPrice,
          CustomerPO: purchase.CustomerPO || purchase.SalesOrderNumber,
        }));

        setPurchaseData(updatedData);
        setFilteredData(updatedData);
        setCustomers([
          ...new Set(updatedData.map((purchase) => purchase.CustomerName)),
        ]);
        setPurchaseOrders([
          ...new Set(
            updatedData.map((purchase) => purchase.PurchaseOrderNumber)
          ),
        ]);
      } catch (error) {
        console.error("Error fetching purchase data:", error);
      }
    };
    fetchData();
  }, []);

  const filterData = () => {
    const filteredResults = purchaseData.filter((purchase) => {
      const purchaseDate = new Date(purchase.PurchaseDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const searchTermLower = globalSearchTerm.toLowerCase();
      const customerPO = purchase.CustomerPO || purchase.SalesOrderNumber || "";

      const matchesGlobalSearch = globalSearchTerm
        ? purchase.CustomerName.toLowerCase().includes(searchTermLower) ||
          purchase.PurchaseOrderNumber.toLowerCase().includes(
            searchTermLower
          ) ||
          customerPO.toLowerCase().includes(searchTermLower)
        : true;

      return (
        (!start || purchaseDate >= start) &&
        (!end || purchaseDate <= end) &&
        (selectedCustomer
          ? purchase.CustomerName === selectedCustomer
          : true) &&
        (selectedPurchaseOrder
          ? purchase.PurchaseOrderNumber === selectedPurchaseOrder
          : true) &&
        matchesGlobalSearch
      );
    });

    setFilteredData(filteredResults);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterData();
  }, [
    globalSearchTerm,
    purchaseData,
    startDate,
    endDate,
    selectedCustomer,
    selectedPurchaseOrder,
  ]);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setDropdownOpenCustomer(false);

    const filteredPurchases = purchaseData.filter(
      (purchase) => purchase.CustomerName === customer
    );
    setPurchaseOrders([
      ...new Set(
        filteredPurchases.map((purchase) => purchase.PurchaseOrderNumber)
      ),
    ]);

    setSelectedPurchaseOrder("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (index) => {
    const purchaseOrderNumber = filteredData[index].PurchaseOrderNumber;

    try {
      const response = await fetch(
        "https://order-management-tgh3.onrender.com/po/deletePurchaseOrder",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ PurchaseOrderNumber: purchaseOrderNumber }),
        }
      );

      if (response.ok) {
        toast.success("Purchase Order deleted successfully!");
        const updatedPurchaseData = [...purchaseData];
        updatedPurchaseData.splice(index, 1);
        setPurchaseData(updatedPurchaseData);
      } else if (response.status === 404) {
        toast.error("Purchase order not found.");
      } else {
        toast.error("An error occurred while deleting the purchase order.");
      }
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[field] === undefined || b[field] === undefined) return 0;
      if (typeof a[field] === "string" && typeof b[field] === "string") {
        return order === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      } else {
        return order === "asc" ? a[field] - b[field] : b[field] - a[field];
      }
    });

    setFilteredData(sortedData);
    setCurrentPage(1);
  };

  const handleClsoe = () => setShowModal(false);

  const getSortArrow = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? <BiUpArrowAlt /> : <BiDownArrowAlt />;
    }
    return null;
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const toggleDropdown = () => setDropdownOpenCustomer(!dropdownOpenCustomer);

  const handleGlobalSearchChange = (e) => {
    setGlobalSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    filterData();
  };

  const handleEdit = (purchase) => {
    setSelectedPurchaseIndex(purchase);
    setSelectedPurchaseId(purchase.PurchaseOrderID);
    setCustomesId(purchase.CustomerID);
    setShowModal(true);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleDropdownPurchaseOrder = () =>
    setDropdownOpenPurchaseOrder(!dropdownOpenPurchaseOrder);

  const handlePurchaseOrderSelect = (purchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setDropdownOpenPurchaseOrder(false);
  };

  useEffect(() => {
    localStorage.setItem("purchaseData", JSON.stringify(purchaseData));
  }, [purchaseData]);

  const handlePurchaseData = (data) => {
    if (selectedPurchaseIndex !== null) {
      const updatedPurchaseData = [...purchaseData];
      updatedPurchaseData[selectedPurchaseIndex] = data;
      setPurchaseData(updatedPurchaseData);
      setSelectedPurchaseIndex(null);
    } else {
      setPurchaseData([...purchaseData, data]);
    }
    setShowModal(false);
    setEditModalVisible(false);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setSelectedPurchaseIndex(null);
    setSelectedPurchaseData(null);
  };

  return (
    <>
      <div className="container">
        <h1>Manage Purchases</h1>
        <div className="StyledDiv">
          <div className="LeftContainer">
            <div className="dropdowncontainer">
              <button className="StyledIn" onClick={toggleDropdown}>
                {selectedCustomer || "Select Customer"}
              </button>
              {dropdownOpenCustomer && (
                <div className="dropdownoption">
                  {customers.map((customer, index) => (
                    <div
                      key={index}
                      className="option"
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      {customer}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="dropdowncontainer">
              <button
                className="StyledIn"
                onClick={toggleDropdownPurchaseOrder}
              >
                {selectedPurchaseOrder || "Select PO"}
              </button>
              {dropdownOpenPurchaseOrder && (
                <div className="dropdownoption">
                  {purchaseOrders.map((po) => (
                    <div
                      className="option"
                      key={po}
                      onClick={() => handlePurchaseOrderSelect(po)}
                    >
                      {po}
                    </div>
                  ))}
                </div>
              )}
            </div>
            Order Date:
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="StyledIn"
            />
            To
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="StyledIn"
            />
            <input
              type="text"
              placeholder="Search"
              value={globalSearchTerm}
              onChange={handleGlobalSearchChange}
              className="StyledIn"
              style={{ marginLeft: "10px", width: "100px" }}
            />
            <button
              className="StyledButtonSearch"
              onClick={handleSearch}
              style={{ marginLeft: "10px" }}
            >
              <BiSearch /> Search
            </button>
          </div>
          <div className="RightContainer">
            <button
              className="StyledButtonAdd"
              onClick={() => setShowModal(true)}
            >
              <BiAddToQueue /> Add PO
            </button>
          </div>
        </div>
        <div>
          <h2>Purchase List</h2>
          <table className="table table-bordered table-striped">
            <thead className="table-secondary">
              <tr>
                <th onClick={() => handleSort("CustomerName")}>
                  Customer Name {getSortArrow("CustomerName")}
                </th>
                <th onClick={() => handleSort("PurchaseOrderNumber")}>
                  Purchase Order {getSortArrow("PurchaseOrderNumber")}
                </th>
                <th onClick={() => handleSort("SalesOrderNumber")}>
                  Customer PO {getSortArrow("SalesOrderNumber")}
                </th>
                <th onClick={() => handleSort("PurchaseDate")}>
                  Purchase Date {getSortArrow("PurchaseDate")}
                </th>
                <th onClick={() => handleSort("PurchaseTotalPrice")}>
                  Total Purchase {getSortArrow("PurchaseTotalPrice")}
                </th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((purchase, index) => (
                <tr key={index}>
                  <td>{purchase.CustomerName}</td>
                  <td>{purchase.PurchaseOrderNumber}</td>
                  <td>{purchase.SalesOrderNumber || purchase.CustomerPO}</td>
                  <td>
                    {new Date(purchase.PurchaseDate).toLocaleDateString()}
                  </td>
                  <td>{purchase.PurchaseTotalPrice}</td>
                  <td>{purchase.Status === 1 ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="buttons-group">
                      <Tooltip
                        title="Edit"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(41, 10, 244)",
                          color: "white",
                          borderRadius: "10%",
                        }}
                      >
                        <button
                          onClick={() => handleEdit(purchase)}
                          className="btns1"
                        >
                          <BiEdit />
                        </button>
                      </Tooltip>
                      <Tooltip
                        title="Delete"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(244, 10, 10)",
                          color: "white",
                          borderRadius: "10%",
                        }}
                      >
                        <Popconfirm
                          placement="topLeft"
                          description="Are you sure to delete this PO"
                          onConfirm={() => handleDelete(index)}
                          okText="Delete"
                        >
                          <button className="btns2">
                            <BiTrash />
                          </button>
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          onChange={handlePageChange}
        />
      </div>
      {showModal && (
        <div className="stylemodal">
          <Modal>
            <PurchaseOrder
              handlePurchaseData={handlePurchaseData}
              selectedPurchaseId={selectedPurchaseId}
              customesId={customesId}
              existingOrder={selectedPurchaseIndex}
              purchaseData={purchaseData}
              onCloses={handleClsoe}
            />
          </Modal>
        </div>
      )}
      {editModalVisible && (
        <div className="stylemodal">
          <Modal>
            <PurchaseOrder
              purchaseData={selectedPurchaseData}
              handlePurchaseData={handlePurchaseData}
              handleCancelEdit={handleCancelEdit}
            />
          </Modal>
        </div>
      )}
    </>
  );
}

export default ManagePurchase;
