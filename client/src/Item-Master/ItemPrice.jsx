import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { Tooltip, Popconfirm, Pagination } from "antd";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: ${(props) => (props.$show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Spinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
  font-size: 50px;
  color: #007bff;
`;

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  top: 5%;
  left: 35%;
  border-radius: 20px;
`;

function ItemPrice({
  handleClose,
  selectedItemName,
  selectedItemId,
  onDataUpdate,
}) {
  const [itemPriceData, setItemPriceData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    ItemStockID: null,
    ItemID: selectedItemId,
    PurchasePrice: "",
    ProviderID: "1",
    PurchaseDate: "",
    Qty: "",
    RemainingQty: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [sortOrder, setSortOrder] = useState({
    PurchasePrice: "asc",
    Qty: "asc",
    PurchaseDate: "asc",
  });

  const fetchItemPrices = async (itemId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/itemPrice/getItemPrices/${itemId}`
      );
      setItemPriceData(response.data);
      if (onDataUpdate) onDataUpdate(response.data);
    } catch (error) {
      console.error("Error fetching item prices:", error);
      toast.error("Failed to fetch item prices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItemId) fetchItemPrices(selectedItemId);
  }, [selectedItemId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "PurchaseDate" ? value : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      ItemID: selectedItemId,
      RemainingQty: formData.RemainingQty || formData.Qty,
    };

    try {
      if (isEditing && editItemId) {
        await axios.put(
          `http://localhost:8000/itemPrice/updateItemPrice/${editItemId}`,
          payload
        );
        toast.success("Item price updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8000/itemPrice/addItemPrice",
          payload
        );
        toast.success("Item price added successfully!");
      }
      await fetchItemPrices(selectedItemId);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        `Failed to ${isEditing ? "update" : "add"} item price: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setFormData({
      ...item,
      PurchaseDate: new Date(item.PurchaseDate).toISOString().split("T")[0],
    });
    setIsEditing(true);
    setEditItemId(item.ItemStockID);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8000/itemPrice/deleteItemPrice/${id}`
      );
      await fetchItemPrices(selectedItemId);
      toast.success("Item price deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item price: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ ...initialFormState });
    setIsEditing(false);
    setEditItemId(null);
  };

  const handleCancel = () => {
    handleClose();
    resetForm();
  };

  const sortedData = [...itemPriceData].sort((a, b) => {
    const priceComparison =
      sortOrder.PurchasePrice === "asc"
        ? a.PurchasePrice - b.PurchasePrice
        : b.PurchasePrice - a.PurchasePrice;
    if (priceComparison !== 0) return priceComparison;

    const qtyComparison =
      sortOrder.Qty === "asc" ? a.Qty - b.Qty : b.Qty - a.Qty;
    if (qtyComparison !== 0) return qtyComparison;

    const dateA = new Date(a.PurchaseDate);
    const dateB = new Date(b.PurchaseDate);
    return sortOrder.PurchaseDate === "asc" ? dateA - dateB : dateB - dateA;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalQty = itemPriceData.reduce(
    (total, item) => total + (parseInt(item.Qty) || 0),
    0
  );

  return (
    <>
      <Overlay $show={loading}>
        <Spinner />
      </Overlay>
      <div className="style-model">
        <Modal>
          <div className="body-container">
            <form onSubmit={handleSubmit} className="item-price-form">
              <h3 className="form-heading">
                {isEditing ? "Edit Item Price" : "Add Item Price"}
              </h3>
              <label>
                Item Name: <strong>{selectedItemName}</strong>
              </label>
              <label>
                Purchase Price:
                <span style={{ color: "red" }}>*</span>
                <input
                  type="number"
                  name="PurchasePrice"
                  value={formData.PurchasePrice}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Purchase Date:
                <span style={{ color: "red" }}>*</span>
                <input
                  type="date"
                  name="PurchaseDate"
                  value={formData.PurchaseDate}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Quantity:
                <span style={{ color: "red" }}>*</span>
                <input
                  type="number"
                  name="Qty"
                  value={formData.Qty}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <div className="table-responsive">
                <h2>Item Price List: {selectedItemName}</h2>
                <table className="table table-bordered table-striped table-hover shadow">
                  <thead className="table-secondary">
                    <tr>
                      <th
                        onClick={() =>
                          setSortOrder((prev) => ({
                            ...prev,
                            PurchasePrice:
                              prev.PurchasePrice === "asc" ? "desc" : "asc",
                          }))
                        }
                      >
                        Price {sortOrder.PurchasePrice === "asc" ? "↑" : "↓"}
                      </th>
                      <th
                        onClick={() =>
                          setSortOrder((prev) => ({
                            ...prev,
                            Qty: prev.Qty === "asc" ? "desc" : "asc",
                          }))
                        }
                      >
                        Quantity {sortOrder.Qty === "asc" ? "↑" : "↓"}
                      </th>
                      <th
                        onClick={() =>
                          setSortOrder((prev) => ({
                            ...prev,
                            PurchaseDate:
                              prev.PurchaseDate === "asc" ? "desc" : "asc",
                          }))
                        }
                      >
                        Date {sortOrder.PurchaseDate === "asc" ? "↑" : "↓"}
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item.ItemStockID}>
                        <td>{item.PurchasePrice}</td>
                        <td>{item.Qty}</td>
                        <td>
                          {
                            new Date(item.PurchaseDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td>
                          <div className="buttons-group">
                            <Tooltip title="Edit">
                              <button
                                className="btns1"
                                type="button"
                                onClick={() => handleEditItem(item)}
                              >
                                <BiSolidEdit />
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Popconfirm
                                placement="topRight"
                                description="Are you sure to delete this item price?"
                                onConfirm={() => handleDelete(item.ItemStockID)}
                                okText="Delete"
                              >
                                <button className="btns1" disabled={loading}>
                                  {loading ? <FaSpinner /> : <MdDelete />}
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
                pageSize={itemsPerPage}
                total={itemPriceData.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
              <div>
                <p>
                  <b>Total Qty:</b>{" "}
                  <span style={{ paddingLeft: "10px" }}>{totalQty}</span>
                </p>
              </div>
              <div className="customer-form__button-container">
                <button
                  type="submit"
                  className="customer-form__button"
                  disabled={loading}
                >
                  {loading ? <FaSpinner /> : isEditing ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="customer-form__button"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default ItemPrice;
