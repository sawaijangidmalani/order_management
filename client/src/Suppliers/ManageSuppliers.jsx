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
import "../Style/Manage.css";

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
          "http://localhost:8000/supplier/getSupplierData"
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
    axios
      .delete(`http://localhost:8000/supplier/deleteSupplier`, {
        data: { email },
      })
      .then(() => {
        alert("Supplier deleted successfully");
        setSuppliers(suppliers.filter((supplier) => supplier.email !== email));
        setFilteredSuppliers(
          filteredSuppliers.filter((supplier) => supplier.email !== email)
        );
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
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
