import { useState, useEffect } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import axios from "axios";
import "../Style/Customer.css";
import { Tooltip, Popconfirm, Pagination } from "antd";
import AddOrEdit from "./AddOrEdit";
import toast from "react-hot-toast";

function AddPurchaseItem({ selectedPurchaseId }) {
  const [itemsData, setItemsData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItemsData();
  }, [selectedPurchaseId]);

  const fetchItemsData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/po/getpurchaseorderitems"
      );

      if (res.data && res.data.data) {
        const filteredItems = res.data.data.filter(
          (item) => item.PurchaseOrderID === selectedPurchaseId
        );

        setItemsData(filteredItems);
        calculateTotal(filteredItems);
      } else {
        console.error("No data found in the response.");
      }
    } catch (err) {
      console.error("Error fetching items data:", err);
    }
  };

  const calculateTotal = (items) => {
    const newTotal = items.reduce((acc, item) => {
      const unitCost = parseFloat(item.UnitCost) || 0;
      const allocatedQty = parseFloat(item.AllocatedQty) || 0;

      const itemTotal = allocatedQty * unitCost;
      return acc + itemTotal;
    }, 0);

    setTotal(newTotal.toFixed(2));
  };

  const handleDelete = async (PurchaseOrderItemID) => {
    try {
      await axios.delete(
        `http://localhost:8000/po/deleteItem/${PurchaseOrderItemID}`
      );
      toast.success("Purchase item deleted successfully!");
      fetchItemsData();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item! Please try again.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUpdate = (item) => {
    setEditingItem(item);
  };

  const paginatedData = itemsData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover shadow">
        <thead className="table-secondary">
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Cost</th>
            <th>Purchase Price</th>
            <th>Invoice No</th>
            <th>Invoice Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.ItemName}</td>
              <td>{item.AllocatedQty}</td>
              <td>{item.UnitCost}</td>
              <td>{item.PurchasePrice}</td>
              <td>{item.InvoiceNumber}</td>
              <td>{new Date(item.InvoiceDate).toLocaleDateString()}</td>
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
                      onClick={() => handleUpdate(item)}
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
                      description="Are you sure to delete this item?"
                      onConfirm={() => handleDelete(item.PurchaseOrderItemID)}
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

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={itemsData.length}
        onChange={handlePageChange}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>
          <b>Purchase Total:</b>{" "}
          <span style={{ paddingLeft: "15px" }}>{total}</span>
        </p>
        <p>
          <b>Sales Total:</b>{" "}
          <span style={{ paddingLeft: "15px" }}>{total}</span>
        </p>
        <p>
          <b>Profit/Loss:</b>{" "}
          <span style={{ paddingLeft: "15px" }}>{total}</span>
        </p>
      </div>

      {editingItem && (
        <AddOrEdit
          selectedPurchaseId={selectedPurchaseId}
          onClose={() => setEditingItem(false)}
          onPurchaseOrderItemData={fetchItemsData}
          refreshItemsData={fetchItemsData}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
}

export default AddPurchaseItem;
