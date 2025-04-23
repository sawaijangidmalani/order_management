import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

router.post("/insertpo", async (req, res) => {
  const {
    CustomerID,
    CustomerSalesOrderID,
    ProviderID,
    PurchaseOrderNumber,
    PurchaseDate,
    Status,
    PurchaseTotalPrice,
    items,
  } = req.body;

  if (
    !CustomerID ||
    !CustomerSalesOrderID ||
    !PurchaseOrderNumber ||
    !PurchaseDate ||
    Status === undefined
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Missing or invalid data" });
  }

  try {
    // Optional: Commenting out duplicate check if multiple POs per customer are allowed
    /*
    const checkDuplicateQuery = `SELECT COUNT(*) AS count FROM purchaseorders WHERE CustomerID = ?`;
    const [duplicateResult] = await pool.query(checkDuplicateQuery, [CustomerID]);
    const existingPOCount = duplicateResult[0]?.count || 0;

    if (existingPOCount > 0) {
      return res.status(409).json({
        error: true,
        message: "A purchase order for this customer already exists.",
      });
    }
    */

    const insertPOQuery = `
      INSERT INTO purchaseorders 
      (CustomerSalesOrderID, CustomerID, ProviderID, PurchaseOrderNumber, PurchaseDate, Status, PurchaseTotalPrice)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    await pool.query("START TRANSACTION");

    const [poResult] = await pool.query(insertPOQuery, [
      CustomerSalesOrderID,
      CustomerID,
      ProviderID || 1,
      PurchaseOrderNumber,
      PurchaseDate,
      Status,
      PurchaseTotalPrice || 0,
    ]);

    const PurchaseOrderID = poResult.insertId;

    if (items && items.length > 0) {
      const insertItemsQuery = `
        INSERT INTO purchaseorderitems (PurchaseOrderID, ItemID, Quantity, Price)
        VALUES ?;
      `;
      const itemValues = items.map((item) => [
        PurchaseOrderID,
        item.ItemID,
        item.Quantity,
        item.Price || 0,
      ]);
      await pool.query(insertItemsQuery, [itemValues]);
    }

    await pool.query("COMMIT");
    res.status(201).json({ message: "Purchase order inserted successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error inserting purchase order:", error.message);
    res.status(500).json({
      error: true,
      message: "Error inserting purchase order",
      details: error.message,
    });
  }
});

router.put("/updatepo/:purchaseOrderNumber", async (req, res) => {
  const { purchaseOrderNumber } = req.params;
  const {
    CustomerID,
    CustomerSalesOrderID,
    ProviderID,
    PurchaseDate,
    Status,
    PurchaseTotalPrice,
    items,
  } = req.body;

  if (
    !CustomerID ||
    !CustomerSalesOrderID ||
    !PurchaseDate ||
    Status === undefined
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Missing or invalid data" });
  }

  try {
    await pool.query("START TRANSACTION");

    const updatePOQuery = `
      UPDATE purchaseorders
      SET 
        CustomerSalesOrderID = ?, 
        CustomerID = ?, 
        ProviderID = ?,
        PurchaseDate = ?, 
        Status = ?,
        PurchaseTotalPrice = ?
      WHERE PurchaseOrderNumber = ?;
    `;

    const updatePOValues = [
      CustomerSalesOrderID,
      CustomerID,
      ProviderID || 1,
      PurchaseDate,
      Status,
      PurchaseTotalPrice || 0,
      purchaseOrderNumber,
    ];

    const [poResult] = await pool.query(updatePOQuery, updatePOValues);

    if (poResult.affectedRows === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({
        error: true,
        message: "Purchase order not found",
      });
    }

    if (items && items.length > 0) {
      const deleteItemsQuery = `
        DELETE FROM purchaseorderitems 
        WHERE PurchaseOrderID = (SELECT PurchaseOrderID FROM purchaseorders WHERE PurchaseOrderNumber = ?);
      `;
      await pool.query(deleteItemsQuery, [purchaseOrderNumber]);

      const insertItemsQuery = `
        INSERT INTO purchaseorderitems (PurchaseOrderID, ItemID, Quantity, Price)
        VALUES ?;
      `;
      const [poData] = await pool.query(
        `SELECT PurchaseOrderID FROM purchaseorders WHERE PurchaseOrderNumber = ?`,
        [purchaseOrderNumber]
      );
      const PurchaseOrderID = poData[0].PurchaseOrderID;

      const itemValues = items.map((item) => [
        PurchaseOrderID,
        item.ItemID,
        item.Quantity,
        item.Price || 0,
      ]);
      await pool.query(insertItemsQuery, [itemValues]);
    }

    await pool.query("COMMIT");
    res.status(200).json({ message: "Purchase order updated successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error updating purchase order:", error.message);
    res.status(500).json({
      error: true,
      message: "Error updating purchase order",
      details: error.message,
    });
  }
});

router.get("/getpo", async (req, res) => {
  const sql = `
SELECT
  po.*,
  cust.Name AS CustomerName,
  so.SalesOrderNumber,
  COALESCE(SUM(poi.PurchasePrice), 0) AS PurchaseTotalPrice
FROM purchaseorders po
JOIN customers cust ON po.CustomerID = cust.CustomerID
JOIN customersalesorder so ON po.CustomerSalesOrderID = so.CustomerSalesOrderID
LEFT JOIN purchaseorderitems poi ON po.PurchaseOrderID = poi.PurchaseOrderID
GROUP BY po.PurchaseOrderID;
`;

  try {
    const [results] = await pool.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching purchase orders:", err);
    res.status(500).send("An error occurred while fetching purchase orders.");
  }
});

router.delete("/deletePurchaseOrder", async (req, res) => {
  const { PurchaseOrderNumber } = req.body;

  if (!PurchaseOrderNumber) {
    return res.status(400).send("PurchaseOrderNumber is required.");
  }

  const sql = "DELETE FROM purchaseorders WHERE PurchaseOrderNumber = ?";

  try {
    const [result] = await pool.query(sql, [PurchaseOrderNumber]);

    if (result.affectedRows > 0) {
      res.status(200).send("Purchase order deleted successfully.");
    } else {
      res.status(404).send("Purchase order not found.");
    }
  } catch (err) {
    console.error("Error deleting purchase order:", err);
    res
      .status(500)
      .send("An error occurred while deleting the purchase order.");
  }
});

router.post("/addpurchaseorderitems", async (req, res) => {
  const {
    ItemID,
    AllocatedQty,
    UnitCost,
    PurchasePrice,
    InvoiceNumber,
    InvoiceDate,
    PurchaseOrderID,
  } = req.body;

  if (!PurchaseOrderID || !ItemID) {
    return res.status(400).json({
      success: false,
      message: "PurchaseOrderID and ItemID are required.",
    });
  }

  if (
    isNaN(parseFloat(AllocatedQty)) ||
    isNaN(parseFloat(UnitCost)) ||
    isNaN(parseFloat(PurchasePrice)) ||
    !InvoiceNumber ||
    !InvoiceDate
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid or missing fields: AllocatedQty, UnitCost, PurchasePrice, InvoiceNumber, and InvoiceDate must be valid.",
    });
  }

  const calculatedPurchasePrice = (
    parseFloat(AllocatedQty) * parseFloat(UnitCost)
  ).toFixed(2);
  if (parseFloat(PurchasePrice).toFixed(2) !== calculatedPurchasePrice) {
    return res.status(400).json({
      success: false,
      message: "PurchasePrice does not match AllocatedQty * UnitCost.",
    });
  }

  const insertSql = `
    INSERT INTO purchaseorderitems
    (PurchaseOrderItemID, ItemID, AllocatedQty, UnitCost, PurchasePrice, InvoiceNumber, InvoiceDate, PurchaseOrderID) 
    VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)
  `;

  const updateSql = `
    UPDATE purchaseorders
    SET PurchaseTotalPrice = (
      SELECT COALESCE(SUM(PurchasePrice), 0)
      FROM purchaseorderitems
      WHERE PurchaseOrderID = ?
    )
    WHERE PurchaseOrderID = ?
  `;

  try {
    await pool.query(insertSql, [
      ItemID,
      AllocatedQty,
      UnitCost,
      PurchasePrice,
      InvoiceNumber,
      InvoiceDate,
      PurchaseOrderID,
    ]);

    await pool.query(updateSql, [PurchaseOrderID, PurchaseOrderID]);

    res.status(201).json({
      success: true,
      message: "Purchase order item added successfully.",
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: `Database error: ${error.sqlMessage || error.message}`,
    });
  }
});

router.put("/editpurchaseorderitems", async (req, res) => {
  const {
    PurchaseOrderItemID,
    ItemID,
    AllocatedQty,
    UnitCost,
    PurchasePrice,
    InvoiceNumber,
    InvoiceDate,
    PurchaseOrderID,
  } = req.body;

  if (!PurchaseOrderItemID || !ItemID || !PurchaseOrderID) {
    return res.status(400).json({
      success: false,
      message: "PurchaseOrderItemID, ItemID, and PurchaseOrderID are required.",
    });
  }
  if (
    isNaN(parseFloat(AllocatedQty)) ||
    isNaN(parseFloat(UnitCost)) ||
    isNaN(parseFloat(PurchasePrice)) ||
    !InvoiceNumber ||
    !InvoiceDate
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid or missing fields: AllocatedQty, UnitCost, PurchasePrice, InvoiceNumber, and InvoiceDate must be valid.",
    });
  }

  const calculatedPurchasePrice = (
    parseFloat(AllocatedQty) * parseFloat(UnitCost)
  ).toFixed(2);
  if (parseFloat(PurchasePrice).toFixed(2) !== calculatedPurchasePrice) {
    return res.status(400).json({
      success: false,
      message: "PurchasePrice does not match AllocatedQty * UnitCost.",
    });
  }

  const updateItemQuery = `
    UPDATE purchaseorderitems
    SET
      ItemID = ?,
      AllocatedQty = ?, 
      UnitCost = ?,
      PurchasePrice = ?,
      InvoiceNumber = ?,
      InvoiceDate = ?,
      PurchaseOrderID = ?
    WHERE PurchaseOrderItemID = ?
  `;

  const updateTotalPriceQuery = `
    UPDATE purchaseorders
    SET PurchaseTotalPrice = (
        SELECT COALESCE(SUM(PurchasePrice), 0)
        FROM purchaseorderitems
        WHERE PurchaseOrderID = ?
    )
    WHERE PurchaseOrderID = ?
  `;

  try {
    const [itemResult] = await pool.query(updateItemQuery, [
      ItemID,
      AllocatedQty,
      UnitCost,
      PurchasePrice,
      InvoiceNumber,
      InvoiceDate,
      PurchaseOrderID,
      PurchaseOrderItemID,
    ]);

    if (itemResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase order item not found." });
    }

    await pool.query(updateTotalPriceQuery, [PurchaseOrderID, PurchaseOrderID]);

    res.status(200).json({
      success: true,
      message: "Purchase order item updated successfully.",
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({
      success: false,
      message: `Database error: ${error.sqlMessage || error.message}`,
    });
  }
});

router.get("/getpurchaseorderitems", (req, res) => {
  const query = `
   SELECT si.PurchaseOrderItemID, si.PurchaseOrderID, si.ItemID, si.AllocatedQty, si.UnitCost, 
       si.PurchasePrice, si.InvoiceNumber, si.InvoiceDate, 
       i.Name AS ItemName 
FROM purchaseorderitems si
INNER JOIN items i ON si.ItemID = i.ItemID

  `;
  pool
    .query(query)
    .then(([rows, fields]) => {
      res.status(200).json({ data: rows });
    })
    .catch((err) => {
      console.error("Error fetching purchase order items:", err);
      res.status(500).json({ message: "Database error." });
    });
});

router.delete("/deleteItem/:PurchaseOrderItemID", async (req, res) => {
  const { PurchaseOrderItemID } = req.params;

  if (!PurchaseOrderItemID) {
    return res.status(400).json({ message: "PurchaseOrderItemID is required" });
  }

  const getPurchaseOrderIDQuery = `
    SELECT PurchaseOrderID
    FROM purchaseorderitems
    WHERE PurchaseOrderItemID = ?
  `;

  const deleteQuery = `
    DELETE FROM purchaseorderitems
    WHERE PurchaseOrderItemID = ?
  `;

  const updateTotalPriceQuery = `
    UPDATE purchaseorders 
    SET PurchaseTotalPrice = (
      SELECT COALESCE(SUM(PurchasePrice), 0)
      FROM purchaseorderitems
      WHERE PurchaseOrderID = ?
    )
    WHERE PurchaseOrderID = ?
  `;

  try {
    const [rows] = await pool.query(getPurchaseOrderIDQuery, [
      PurchaseOrderItemID,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const { PurchaseOrderID } = rows[0];

    const [deleteResult] = await pool.query(deleteQuery, [PurchaseOrderItemID]);
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    await pool.query(updateTotalPriceQuery, [PurchaseOrderID, PurchaseOrderID]);

    res.status(200).json({
      message: "Item deleted successfully!",
    });
  } catch (error) {
    console.error("Error handling delete operation:", error);
    res.status(500).json({
      message: "Failed to delete item or update PurchaseTotalPrice",
      error: error.message,
    });
  }
});

export { router as porouter };
