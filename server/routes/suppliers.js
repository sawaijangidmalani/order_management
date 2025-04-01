import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

router.get("/checkDuplicate", async (req, res) => {
  const { name, email } = req.query;

  try {
    const [nameResult] = await pool.query(
      "SELECT COUNT(*) as count FROM suppliers WHERE Name = ?",
      [name]
    );
    const [emailResult] = await pool.query(
      "SELECT COUNT(*) as count FROM suppliers WHERE Email = ?",
      [email]
    );

    res.json({
      nameExists: nameResult[0].count > 0,
      emailExists: emailResult[0].count > 0,
    });
  } catch (err) {
    console.error("Error checking duplicates:", err.stack);
    res.status(500).json({
      nameExists: false,
      emailExists: false,
      error: "Error checking duplicates",
    });
  }
});

router.post("/add_supplier", async (req, res) => {
  const formData = req.body;

  try {
    const [nameResult] = await pool.query(
      "SELECT COUNT(*) as count FROM suppliers WHERE Name = ?",
      [formData.Name]
    );
    const [emailResult] = await pool.query(
      "SELECT COUNT(*) as count FROM suppliers WHERE Email = ?",
      [formData.Email]
    );

    if (nameResult[0].count > 0) {
      return res.status(400).json({
        added: false,
        message: "A supplier with this name already exists",
      });
    }
    if (emailResult[0].count > 0) {
      return res.status(400).json({
        added: false,
        message: "A supplier with this email already exists",
      });
    }

    const sql = `
      INSERT INTO suppliers 
      (Name, Email, Phone, Address, Area, City, State, Status, GST, ProviderID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      formData.Name,
      formData.Email,
      formData.Phone,
      formData.Address,
      formData.Area,
      formData.City,
      formData.State,
      formData.Status,
      formData.GST,
      formData.ProviderID || 1,
    ];

    const [result] = await pool.query(sql, values);
    res.json({ added: true, data: formData });
  } catch (err) {
    console.error("Error inserting data:", err.stack);
    res.status(500).send("Error inserting data");
  }
});

router.get("/getSupplierData", async (req, res) => {
  const sql = "SELECT * FROM suppliers";
  try {
    const [result] = await pool.query(sql);
    res.json(result);
  } catch (err) {
    console.error("Error fetching supplier data:", err.stack);
    res.status(500).send("Error fetching supplier data");
  }
});

router.delete("/deleteSupplier", async (req, res) => {
  const { email } = req.body;
  const sql = "DELETE FROM suppliers WHERE Email = ?";

  try {
    const [result] = await pool.query(sql, [email]);
    res.json({
      status: result.affectedRows > 0,
      message:
        result.affectedRows > 0
          ? "Supplier deleted successfully"
          : "Supplier not found",
    });
  } catch (err) {
    console.error("Error deleting supplier:", err.stack);
    res.status(500).json({ status: false, message: "Error deleting supplier" });
  }
});

router.post("/updateSupplier", async (req, res) => {
  const { Email, Name, Phone, Area, Address, City, State, Status, GST } =
    req.body;

  try {
    const [nameResult] = await pool.query(
      "SELECT COUNT(*) as count FROM suppliers WHERE Name = ? AND Email != ?",
      [Name, Email]
    );

    if (nameResult[0].count > 0) {
      return res.status(400).json({
        status: false,
        message: "Another supplier with this name already exists",
      });
    }

    const sql = `
      UPDATE suppliers
      SET Name = ?, Phone = ?, Area = ?, Address = ?, City = ?, State = ?, Status = ?, GST = ?
      WHERE Email = ?
    `;

    const [result] = await pool.query(sql, [
      Name,
      Phone,
      Area,
      Address,
      City,
      State,
      Status,
      GST,
      Email,
    ]);

    res.json({
      status: result.affectedRows > 0,
      message:
        result.affectedRows > 0
          ? "Supplier data updated successfully"
          : "Supplier not found",
    });
  } catch (err) {
    console.error("Error updating supplier:", err.stack);
    res
      .status(500)
      .json({ status: false, message: "Error updating supplier data" });
  }
});

export { router as supplierRouter };
