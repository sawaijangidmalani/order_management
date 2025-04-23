import React, { useState, useEffect } from "react";
import AddItem from "./AddItem";
import ItemStockUtilization from "./ItemStockUtilization.jsx";
import ItemPrice from "./ItemPrice";
import {
  BiInfoCircle,
  BiPackage,
  BiSolidEdit,
  BiSearch,
  BiAddToQueue,
  BiUpArrowAlt,
  BiDownArrowAlt,
} from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { Tooltip, Pagination, Popconfirm } from "antd";
import "../Style/Customer.css";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

function ManageItem() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchTermItem, setSearchTermItem] = useState("");
  const [searchTermSupplier, setSearchTermSupplier] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [showStocks, setShowStocks] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", order: "asc" });
  const [selectedItemStock, setSelectedItemStock] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/item/getItems").then((data) => {
      if (!data?.data?.error) {
        setItems(data?.data?.data);
        setFilteredItems(data?.data?.data);
      }
    });
  }, []);

  useEffect(() => {
    fetchItemPrices();
  }, [items]);

  const filterData = () => {
    const filtered = items.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm
        ? item.Name.toLowerCase().includes(searchTermLower) ||
          item.SupplierName.toLowerCase().includes(searchTermLower) ||
          item.Category.toLowerCase().includes(searchTermLower) ||
          item.Brand.toLowerCase().includes(searchTermLower)
        : true;

      return (
        (selectedItem ? item.Name === selectedItem : true) &&
        (selectedSupplier ? item.SupplierName === selectedSupplier : true) &&
        matchesSearch
      );
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
    fetchItemPrices(filtered);
  };

  useEffect(() => {
    filterData();
  }, [searchTerm, items, selectedItem, selectedSupplier]);

  const handleShowStock = (item) => {
    setSelectedItemName(item.Name);
    setSelectedItemId(item.ItemID);
    setSelectedItemStock(item.Stock || 0);
    setShowStocks(true);
  };

  const handleShowStocks = (item) => {
    setSelectedItemName(item.Name);
    setSelectedItemStock(item.Stock || 0);
    setShowStock(true);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemSelect = (itemName) => {
    setSelectedItem(itemName);
    setSelectedSupplier("");
    setIsItemDropdownOpen(false);
    setSearchTerm("");
    filterData();
  };

  const handleSupplierSelect = (supplierName) => {
    setSelectedSupplier(supplierName);
    setIsSupplierDropdownOpen(false);
    setSearchTerm("");
    filterData();
  };

  const handleSearch = () => {
    filterData();
  };

  const handleSearchChangeItem = (e) => {
    const value = e.target.value;
    setSearchTermItem(value);
  };

  const handleSearchChangeSupplier = (e) => {
    const value = e.target.value;
    setSearchTermSupplier(value);
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.order === "asc" ? <BiUpArrowAlt /> : <BiDownArrowAlt />;
    }
    return null;
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = filteredItems.slice(startIndex, startIndex + pageSize);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    const newOrder = sortConfig.order === "asc" ? "desc" : "asc";
    setSortConfig({ key, order: newOrder });

    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a[key] < b[key]) return newOrder === "asc" ? -1 : 1;
      if (a[key] > b[key]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredItems(sortedItems);
  };

  const handleDelete = (ItemID) => {
    setIsLoading(true);
    axios
      .delete("http://localhost:8000/item/deleteItems", {
        data: { ItemID: ItemID },
      })
      .then(() => {
        toast.success("Item deleted successfully");
        setItems((prevItems) =>
          prevItems.filter((item) => item.ItemID !== ItemID)
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
        alert("Failed to delete item");
        setIsLoading(false);
      });
  };

  const toggleSupplierDropdown = () => {
    setIsSupplierDropdownOpen(!isSupplierDropdownOpen);
    setIsItemDropdownOpen(false);
  };

  const toggleItemDropdown = () => {
    setIsItemDropdownOpen(!isItemDropdownOpen);
    setIsSupplierDropdownOpen(false);
  };

  const handleAddItem = (item) => {
    setEditItem(item);
    setShowModal(true);
    setSelectedItemStock(item?.Stock || 0);
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchItemPrices = async (itemsToFetch = filteredItems) => {
    try {
      const itemStockRequests = itemsToFetch.map((item) =>
        axios.get(
          `http://localhost:8000/itemPrice/getItemPrices/${item.ItemID}`
        )
      );
      const responses = await Promise.all(itemStockRequests);

      const stockMap = {};

      responses.forEach((response) => {
        const itemPrices = response.data;
        itemPrices.forEach((item) => {
          const qty = parseInt(item.Qty || 0, 10);
          if (stockMap[item.ItemID]) {
            stockMap[item.ItemID] += qty;
          } else {
            stockMap[item.ItemID] = qty;
          }
        });
      });

      const updatedFilteredItems = filteredItems
        .map((item) => ({
          ...item,
          Stock: stockMap[item.ItemID] || 0,
        }))
        .filter((item) => item.ItemID > 0);

      setFilteredItems(updatedFilteredItems);
    } catch (err) {}
  };

  const getSuppliersForSelectedItem = () => {
    if (!selectedItem) {
      return [...new Set(items.map((item) => item.SupplierName))];
    }
    const relatedItems = items.filter((item) => item.Name === selectedItem);
    return [...new Set(relatedItems.map((item) => item.SupplierName))];
  };

  return (
    <>
      {isLoading && (
        <div className="overlay">
          <FaSpinner className="spinner" />
        </div>
      )}
      <div className="container">
        <h1>Manage Items</h1>
        <div className="StyledDiv">
          <div className="LeftContainer">
            <div className="dropdowncontainer">
              <button className="StyledIn" onClick={toggleItemDropdown}>
                {selectedItem || "Select Item"}
              </button>
              {isItemDropdownOpen && (
                <div className="dropdownoption">
                  {items.map((item) => (
                    <div
                      className="option"
                      key={item.ItemID}
                      onClick={() => handleItemSelect(item.Name)}
                    >
                      {item.Name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdowncontainer">
              <button className="StyledIn" onClick={toggleSupplierDropdown}>
                {selectedSupplier || "Select Supplier"}
              </button>
              {isSupplierDropdownOpen && (
                <div className="dropdownoption">
                  {getSuppliersForSelectedItem().map((supplier) => (
                    <div
                      className="option"
                      key={supplier}
                      onClick={() => handleSupplierSelect(supplier)}
                    >
                      {supplier}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              className="StyledIn"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search"
              style={{ width: "100px" }}
            />

            <button className="StyledButtonSearch" onClick={handleSearch}>
              <BiSearch /> Search
            </button>
          </div>
          <div className="RightContainer">
            <button className="StyledButtonAdd" onClick={handleAddItem}>
              <BiAddToQueue /> Add Item
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <h2>Item List</h2>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th onClick={() => handleSort("Name")}>
                  Item Name {getSortArrow("Name")}
                </th>
                <th onClick={() => handleSort("SupplierID")}>
                  Supplier {getSortArrow("SupplierID")}
                </th>
                <th onClick={() => handleSort("Category")}>
                  Category {getSortArrow("Category")}
                </th>
                <th onClick={() => handleSort("Brand")}>
                  Brand {getSortArrow("Brand")}
                </th>
                <th onClick={() => handleSort("Stock")}>
                  Stock {getSortArrow("Stock")}
                </th>
                <th onClick={() => handleSort("ItemUnitID")}>
                  Unit {getSortArrow("ItemUnitID")}
                </th>
                <th onClick={() => handleSort("Status")}>
                  Status {getSortArrow("Status")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.Name}>
                  <td>{item.Name}</td>
                  <td>{item.SupplierName}</td>
                  <td>{item.Category}</td>
                  <td>{item.Brand}</td>
                  <td>{item.Stock || 0}</td>
                  <td>{item.UnitName}</td>
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
                          className="btns1"
                          onClick={() => handleEditItem(item)}
                        >
                          <BiSolidEdit />
                        </button>
                      </Tooltip>
                      <Tooltip
                        title="Stock"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(41, 10, 244)",
                          color: "white",
                          borderRadius: "5px",
                        }}
                      >
                        <button
                          className="btns1"
                          onClick={() => handleShowStock(item)}
                        >
                          <BiPackage />
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
                          description="Are you sure to delete this item?"
                          onConfirm={() => handleDelete(item.ItemID)}
                          okText="Delete"
                        >
                          <button className="btns1">
                            <MdDelete />
                          </button>
                        </Popconfirm>
                      </Tooltip>
                      <Tooltip
                        title="Stock Utilization"
                        overlayInnerStyle={{
                          backgroundColor: "rgb(41, 10, 244)",
                          color: "white",
                          borderRadius: "5px",
                        }}
                      >
                        <button
                          className="btns1"
                          onClick={() => handleShowStocks(item)}
                        >
                          <BiInfoCircle />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredItems.length}
            onChange={onPageChange}
          />
        </div>
      </div>
      {showModal && (
        <AddItem
          visible={showModal}
          editItem={editItem}
          onClose={handleClose}
          closeModal={closeModal}
        />
      )}
      {showStock && (
        <ItemStockUtilization
          setShowStock={setShowStock}
          selectedItemName1={selectedItemName}
          currentData={currentData}
          selectedItemStock={selectedItemStock}
        />
      )}
      {showStocks && (
        <ItemPrice
          handleClose={() => setShowStocks(false)}
          selectedItemName={selectedItemName}
          selectedItemId={selectedItemId}
          selectedItemStock={selectedItemStock}
        />
      )}
    </>
  );
}

export default ManageItem;
