import { useState, useEffect } from "react";
import AddSuppliers from "./AddSuppliers";
import {
  BiAddToQueue,
  BiSolidEdit,
  BiSearch,
  BiUpArrowAlt,
  BiDownArrowAlt,
} from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { Tooltip, Pagination, Modal, Popconfirm } from "antd";
import "../Style/Customer.css";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

function ManageSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSuppliers, setEditingSuppliers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredSuppliers(suppliers);
      setCurrentPage(1);
    } else {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const filtered = suppliers.filter((supplier) => {
      const name = supplier.Name ? supplier.Name.toLowerCase() : "";
      const email = supplier.Email ? supplier.Email.toLowerCase() : "";
      const phone = supplier.Phone ? supplier.Phone : "";

      return (
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm)
      );
    });

    setFilteredSuppliers(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const result = await axios.get(
          "https://order-management-b0de.onrender.com/supplier/getSupplierData"
        );

        setSuppliers(result.data);
        setFilteredSuppliers(result.data);
      } catch (err) {
        console.error("Error fetching supplier data:", err);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDelete = (email) => {
    setIsLoading(true);
    axios
      .delete(`https://order-management-b0de.onrender.com/supplier/deleteSupplier`, {
        data: { email },
      })
      .then(() => {
        toast.success("Supplier deleted successfully!");

        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((supplier) => supplier.email !== email)
        );
        setFilteredSuppliers((prevFiltered) =>
          prevFiltered.filter((supplier) => supplier.email !== email)
        );
        window.location.reload();
        setTimeout(() => {
          console.log("Supplier deleted:", email);
        }, 3000);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error deleting supplier:", err);
        toast.error("Something went wrong while deleting.");
        setIsLoading(false);
      });
  };

  const handleAddSupplier = () => {
    setEditingSuppliers(null);
    setShowModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSuppliers(supplier);
    setShowModal(true);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const updateSupplierList = (newSupplier) => {
    setSuppliers((prevSuppliers) => {
      if (editingSuppliers) {
        return prevSuppliers.map((supplier) =>
          supplier.SupplierID === newSupplier.SupplierID
            ? newSupplier
            : supplier
        );
      } else {
        return [...prevSuppliers, newSupplier];
      }
    });

    setFilteredSuppliers((prevSuppliers) => {
      if (editingSuppliers) {
        return prevSuppliers.map((supplier) =>
          supplier.SupplierID === newSupplier.SupplierID
            ? newSupplier
            : supplier
        );
      } else {
        return [...prevSuppliers, newSupplier];
      }
    });

    setShowModal(false);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredSuppliers(sortedSuppliers);
  };
  const getSortArrow = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? <BiUpArrowAlt /> : <BiDownArrowAlt />;
    }
    return null;
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = filteredSuppliers.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <>
      {isLoading && (
        <div className="overlay">
          <FaSpinner className="spinner" />
        </div>
      )}
      <div className="container">
        <h1>Manage Suppliers</h1>
        <div className="StyledDiv">
          <div className="ButtonContainer">
            <div>
              <input
                className="StyledIn"
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search"
              />
              <button className="StyledButtonSearch" onClick={handleSearch}>
                <BiSearch /> Search
              </button>
            </div>
            <button className="StyledButtonAdd" onClick={handleAddSupplier}>
              <BiAddToQueue /> Add Supplier
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <h2>Suppliers List</h2>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th onClick={() => handleSort("Name")}>
                  Name {getSortArrow("Name")}
                </th>
                <th onClick={() => handleSort("Email")}>
                  Email {getSortArrow("Email")}
                </th>
                <th onClick={() => handleSort("Phone")}>
                  Phone {getSortArrow("Phone")}
                </th>

                <th onClick={() => handleSort("Area")}>
                  Area {getSortArrow("Area")}
                </th>

                <th onClick={() => handleSort("Status")}>
                  Status {getSortArrow("Status")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((supplier) => (
                <tr key={supplier.Email}>
                  <td>{supplier.Name}</td>
                  <td>{supplier.Email}</td>
                  <td>{supplier.Phone}</td>
                  <td>{supplier.Area}</td>
                  <td>{supplier.Status === 1 ? "Active" : "Inactive"}</td>
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
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <BiSolidEdit />
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
                          description="Are you sure to delete this supplier?"
                          onConfirm={() => handleDelete(supplier.Email)}
                          okText="Delete"
                        >
                          <button className="btns2">
                            <MdDelete />
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
            total={filteredSuppliers.length}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>

        <Modal
          open={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          footer={null}
        ></Modal>

        {showModal && (
          <AddSuppliers
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            closeModal={closeModal}
            editingSuppliers={editingSuppliers}
            updateSupplierList={updateSupplierList}
          />
        )}
      </div>
    </>
  );
}

export default ManageSuppliers;
