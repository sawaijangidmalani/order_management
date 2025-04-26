import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SalesOrder from "./SalesOrder";
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
import { Tooltip, Popconfirm, Pagination } from "antd";
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

function ManageCPO() {
  const [customers, setCustomers] = useState([]);
  const [customerPOs, setCustomerPOs] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerPO, setSelectedCustomerPO] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSaleIndex, setSelectedSaleIndex] = useState(null);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [customesId, setCustomesId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenCustomerPO, setDropdownOpenCustomerPO] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://order-management-tgh3.onrender.com/customerpo/getCustomerPo"
        );

        const updatedData = response.data.map((item) => ({
          ...item,
          CustomerName: item.CustomerName,
          SalesTotalPrice: item.SalesTotalPrice,
        }));

        setSalesData(updatedData);
        setFilteredData(updatedData);
        setCustomers([
          ...new Set(updatedData.map((item) => item.CustomerName)),
        ]);
        setCustomerPOs([
          ...new Set(updatedData.map((item) => item.SalesOrderNumber)),
        ]);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchData();
  }, []);

  const filterData = () => {
    const filteredResults = salesData.filter((item) => {
      const saleDate = new Date(item.SalesDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const searchTermLower = globalSearchTerm.toLowerCase();
      const matchesGlobalSearch = globalSearchTerm
        ? item.CustomerName.toLowerCase().includes(searchTermLower) ||
          item.SalesOrderNumber.toLowerCase().includes(searchTermLower)
        : true;

      return (
        (!start || saleDate >= start) &&
        (!end || saleDate <= end) &&
        (selectedCustomer ? item.CustomerName === selectedCustomer : true) &&
        (selectedCustomerPO
          ? item.SalesOrderNumber === selectedCustomerPO
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
    salesData,
    startDate,
    endDate,
    selectedCustomer,
    selectedCustomerPO,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (index) => {
    const customerSalesOrderID = filteredData[index].CustomerSalesOrderID;

    try {
      const response = await fetch(
        "https://order-management-tgh3.onrender.com/customerpo/deleteCustomerPo",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ CustomerSalesOrderID: customerSalesOrderID }),
        }
      );

      if (response.ok) {
        toast.success("Sales Order deleted successfully!");
        const updatedSalesData = [...salesData];
        updatedSalesData.splice(index, 1);
        setSalesData(updatedSalesData);
      } else if (response.status === 404) {
        toast.error("Sales order not found.");
      } else {
        toast.error("An error occurred while deleting the sales order.");
      }
    } catch (error) {
      console.error("Error deleting sales order:", error);
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

  const getSortArrow = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? <BiUpArrowAlt /> : <BiDownArrowAlt />;
    }
    return null;
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setDropdownOpen(false);

    const filteredSales = salesData.filter(
      (item) => item.CustomerName === customer
    );
    setCustomerPOs([
      ...new Set(filteredSales.map((item) => item.SalesOrderNumber)),
    ]);
    setSelectedCustomerPO("");
  };

  const handleCustomerPOSelect = (customerPO) => {
    setSelectedCustomerPO(customerPO);
    setDropdownOpenCustomerPO(false);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleDropdownCustomerPO = () =>
    setDropdownOpenCustomerPO(!dropdownOpenCustomerPO);

  const handleGlobalSearchChange = (e) => {
    setGlobalSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    filterData();
  };

  const handleEdit = (item) => {
    setSelectedSaleIndex(item);
    setSelectedSaleId(item.CustomerSalesOrderID);
    setCustomesId(item.CustomerID);
    setShowModal(true);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleClose = () => setShowModal(false);

  return (
    <div className="container">
      <h1>Manage Customer PO</h1>
      <div className="StyledDiv">
        <div className="LeftContainer">
          <div className="dropdowncontainer">
            <button className="StyledIn" onClick={toggleDropdown}>
              {selectedCustomer || "Select Customer"}
            </button>
            {dropdownOpen && (
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
            <BiAddToQueue /> Add CPO
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <h2>Customer PO List</h2>
        <table className="table table-bordered table-striped table-hover shadow">
          <thead className="table-secondary">
            <tr>
              <th onClick={() => handleSort("CustomerName")}>
                Customer Name {getSortArrow("CustomerName")}
              </th>
              <th onClick={() => handleSort("SalesOrderNumber")}>
                Customer PO {getSortArrow("SalesOrderNumber")}
              </th>
              <th onClick={() => handleSort("SalesDate")}>
                Sales Date {getSortArrow("SalesDate")}
              </th>
              <th onClick={() => handleSort("SalesTotalPrice")}>
                Sales Total Price {getSortArrow("SalesTotalPrice")}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                <td>{item.CustomerName}</td>
                <td>{item.SalesOrderNumber}</td>
                <td>{new Date(item.SalesDate).toLocaleDateString()}</td>
                <td>{item.SalesTotalPrice}</td>
                <td>{item.Status === 1 ? "Active" : "Inactive"}</td>
                <td>
                  <div className="buttons-group">
                    <Tooltip
                      title="Edit"
                      overlayInnerStyle={{
                        backgroundColor: "rgb(41, 10, 244)",
                        color: "white",
                        borderRadius: "5px",
                      }}
                    >
                      <button
                        onClick={() => handleEdit(item)}
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
                        borderRadius: "5px",
                      }}
                    >
                      <Popconfirm
                        placement="topLeft"
                        description="Are you sure to delete this CPO?"
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
      {showModal && (
        <div className="stylemodal">
          <Modal>
            <SalesOrder
              onClose={handleClose}
              selectedSaleId={selectedSaleId}
              customesId={customesId}
              existingOrder={selectedSaleIndex}
              salesData={salesData}
            />
          </Modal>
        </div>
      )}
    </div>
  );
}

export default ManageCPO;
