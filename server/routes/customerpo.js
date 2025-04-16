import express from "express";
import con from "../utils/db.js";

const router = express.Router();

router.post("/insertCustomerPo", async (req, res) => {
  const { CustomerID, ProviderID, SalesOrderNumber, SalesDate, Status, Items } =
    req.body;

  const connection = await con.getConnection();
  try {
    await connection.beginTransaction();

    const checkDuplicateQuery = `
      SELECT CustomerSalesOrderID 
      FROM customersalesorder 
      WHERE CustomerID = ?
    `;
    const [existingOrder] = await connection.execute(checkDuplicateQuery, [
      CustomerID,
    ]);
    if (existingOrder.length > 0) {
      await connection.rollback();
      return res
        .status(409)
        .json({ message: "Is Customer ke liye pehle se Sales Order hai!" });
    }

    const insertSalesOrderQuery = `
      INSERT INTO customersalesorder (CustomerID, ProviderID, SalesOrderNumber, SalesDate, Status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [salesOrderResult] = await connection.execute(insertSalesOrderQuery, [
      CustomerID,
      ProviderID,
      SalesOrderNumber,
      SalesDate,
      Status,
    ]);

    const newSalesOrderID = salesOrderResult.insertId;

    const insertItemQuery = `
      INSERT INTO customersalesorderitems (CustomerSalesOrderID, ItemID, AllocatedQty, UnitCost, SalesPrice, Tax)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    for (const item of Items) {
      await connection.execute(insertItemQuery, [
        newSalesOrderID,
        item.ItemID,
        item.AllocatedQty,
        item.UnitCost,
        item.SalesPrice || 0,
        item.Tax || 0,
      ]);
    }

    await connection.commit();
    res.status(201).json({
      message: "Sales Order created successfully!",
      CustomerSalesOrderID: newSalesOrderID,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating sales order:", error);
    res
      .status(500)
      .json({ message: "Failed to create sales order", error: error.message });
  } finally {
    connection.release();
  }
});

router.put("/updateCustomerPo/:CustomerSalesOrderID", async (req, res) => {
  const { CustomerSalesOrderID } = req.params;
  const { CustomerID, ProviderID, SalesDate, Status, Items } = req.body;

  const connection = await con.getConnection();
  try {
    await connection.beginTransaction();

    const checkDuplicateQuery = `
      SELECT CustomerSalesOrderID 
      FROM customersalesorder 
      WHERE CustomerID = ? AND SalesOrderNumber = ? AND CustomerSalesOrderID != ?
    `;
    const [existingOrder] = await connection.execute(checkDuplicateQuery, [
      CustomerID,
      req.body.SalesOrderNumber,
      CustomerSalesOrderID,
    ]);
    if (existingOrder.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        message:
          "Another Sales Order with this Customer and PO number already exists",
      });
    }

    const updateSalesOrderQuery = `
      UPDATE customersalesorder
      SET CustomerID = ?, ProviderID = ?, SalesDate = ?, Status = ?
      WHERE CustomerSalesOrderID = ?
    `;
    const [salesOrderResult] = await connection.execute(updateSalesOrderQuery, [
      CustomerID,
      ProviderID,
      SalesDate,
      Status,
      CustomerSalesOrderID,
    ]);

    if (salesOrderResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Sales Order not found" });
    }

    const insertItemQuery = `
      INSERT INTO customersalesorderitems 
      (CustomerSalesOrderID, ItemID, AllocatedQty, UnitCost, SalesPrice, Tax)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    for (const item of Items) {
      const { ItemID, AllocatedQty, UnitCost, SalesPrice, Tax } = item;
      if (!ItemID || AllocatedQty === undefined || UnitCost === undefined) {
        throw new Error(
          "Missing required item fields: ItemID, AllocatedQty, or UnitCost"
        );
      }
      await connection.execute(insertItemQuery, [
        CustomerSalesOrderID,
        ItemID,
        AllocatedQty,
        UnitCost,
        SalesPrice || 0,
        Tax || 0,
      ]);
    }

    await connection.commit();
    res.status(200).json({ message: "Sales Order updated successfully!" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating sales order:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    res.status(500).json({
      message: "Failed to update sales order",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

router.get("/getCustomerPo", async (req, res) => {
  const sql = `
    SELECT 
      cso.*, 
      cust.Name AS CustomerName, 
      COALESCE(SUM(csoi.SalesPrice), 0) AS SalesTotalPrice
    FROM customersalesorder cso
    JOIN customers cust ON cso.CustomerID = cust.CustomerID
    LEFT JOIN customersalesorderitems csoi ON cso.CustomerSalesOrderID = csoi.CustomerSalesOrderID
    GROUP BY cso.CustomerSalesOrderID
  `;

  try {
    const [results] = await con.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching sales orders:", err);
    res.status(500).send("An error occurred while fetching sales orders.");
  }
});

router.delete("/deleteCustomerPo", async (req, res) => {
  const { CustomerSalesOrderID } = req.body;

  if (!CustomerSalesOrderID) {
    return res.status(400).send("CustomerSalesOrderID is required.");
  }

  const sql = "DELETE FROM customersalesorder WHERE CustomerSalesOrderID = ?";

  try {
    const [result] = await con.query(sql, [CustomerSalesOrderID]);

    if (result.affectedRows > 0) {
      res.status(200).send("Sales order deleted successfully.");
    } else {
      res.status(404).send("Sales order not found.");
    }
  } catch (err) {
    console.error("Error deleting sales order:", err);
    res.status(500).send("An error occurred while deleting the sales order.");
  }
});

router.post("/addsalesorderitems", async (req, res) => {
  const {
    CustomerSalesOrderID,
    ItemID,
    AllocatedQty,
    UnitCost,
    SalesPrice,
    Tax,
  } = req.body;

  if (!CustomerSalesOrderID || !ItemID) {
    return res
      .status(400)
      .json({ message: "CustomerSalesOrderID and ItemID are required." });
  }

  if (
    isNaN(parseFloat(AllocatedQty)) ||
    isNaN(parseFloat(UnitCost)) ||
    isNaN(parseFloat(SalesPrice)) ||
    isNaN(parseFloat(Tax))
  ) {
    return res
      .status(400)
      .json({ message: "All fields must be valid numbers." });
  }

  const insertSql = `
    INSERT INTO customersalesorderitems 
    (ItemID, AllocatedQty, UnitCost, SalesPrice, Tax, CustomerSalesOrderID)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const updateSql = `
    UPDATE customersalesorder
    SET SalesTotalPrice = (
      SELECT COALESCE(SUM(SalesPrice), 0)
      FROM customersalesorderitems
      WHERE CustomerSalesOrderID = ?
    )
    WHERE CustomerSalesOrderID = ?
  `;

  try {
    await con.query(insertSql, [
      ItemID,
      AllocatedQty,
      UnitCost,
      SalesPrice,
      Tax,
      CustomerSalesOrderID,
    ]);

    await con.query(updateSql, [CustomerSalesOrderID, CustomerSalesOrderID]);

    res.status(201).json({
      message: "Sales order item added successfully and total price updated.",
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      message: "Failed to add sales order item or update total price.",
      error: error.message,
    });
  }
});

router.put("/editsalesorderitem", async (req, res) => {
  const {
    CustomerSalesOrderItemID,
    ItemID,
    AllocatedQty,
    UnitCost,
    SalesPrice,
    Tax,
    CustomerSalesOrderID,
  } = req.body;

  if (!CustomerSalesOrderItemID) {
    return res
      .status(400)
      .json({ message: "CustomerSalesOrderItemID is required." });
  }
  if (!CustomerSalesOrderID) {
    return res
      .status(400)
      .json({ message: "CustomerSalesOrderID is required." });
  }

  const updateItemQuery = `
    UPDATE customersalesorderitems
    SET 
      ItemID = ?,
      AllocatedQty = ?, 
      UnitCost = ?, 
      SalesPrice = ?, 
      Tax = ?,
      CustomerSalesOrderID = ?
    WHERE CustomerSalesOrderItemID = ?;
  `;

  const updateTotalPriceQuery = `
    UPDATE customersalesorder
    SET SalesTotalPrice = (
      SELECT COALESCE(SUM(SalesPrice), 0)
      FROM customersalesorderitems
      WHERE CustomerSalesOrderID = ?
    )
    WHERE CustomerSalesOrderID = ?;
  `;

  try {
    const [itemResult] = await con.query(updateItemQuery, [
      ItemID,
      AllocatedQty,
      UnitCost,
      SalesPrice,
      Tax,
      CustomerSalesOrderID,
      CustomerSalesOrderItemID,
    ]);

    if (itemResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Sales order item not found or already updated." });
    }

    await con.query(updateTotalPriceQuery, [
      CustomerSalesOrderID,
      CustomerSalesOrderID,
    ]);

    res.status(200).json({ message: "Sales order item updated successfully." });
  } catch (error) {
    console.error("Error updating sales order item:", error);
    res.status(500).json({ message: "Failed to update sales order item." });
  }
});

router.get("/getcustomersalesorderitems", (req, res) => {
  const query = `
    SELECT si.CustomerSalesOrderItemID, si.ItemID, si.AllocatedQty, si.UnitCost, si.SalesPrice, si.CustomerSalesOrderID, si.Tax, i.Name AS ItemName
    FROM customersalesorderitems si
    INNER JOIN items i ON si.ItemID = i.ItemID
  `;

  con
    .query(query)
    .then(([rows, fields]) => {
      res.status(200).json({ data: rows });
    })
    .catch((err) => {
      console.error("Error fetching sales order items:", err);
      res.status(500).json({ message: "Database error." });
    });
});

router.delete("/deleteItem/:CustomerSalesOrderItemID", async (req, res) => {
  const { CustomerSalesOrderItemID } = req.params;

  if (!CustomerSalesOrderItemID) {
    return res
      .status(400)
      .json({ message: "CustomerSalesOrderItemID is required" });
  }

  const getCustomerSalesOrderIDQuery = `
    SELECT CustomerSalesOrderID 
    FROM customersalesorderitems 
    WHERE CustomerSalesOrderItemID = ?
  `;

  const deleteQuery = `
    DELETE FROM customersalesorderitems 
    WHERE CustomerSalesOrderItemID = ?
  `;

  const updateTotalPriceQuery = `
    UPDATE customersalesorder
    SET SalesTotalPrice = (
      SELECT COALESCE(SUM(SalesPrice), 0)
      FROM customersalesorderitems
      WHERE CustomerSalesOrderID = ?
    )
    WHERE CustomerSalesOrderID = ?
  `;

  try {
    const [rows] = await con.query(getCustomerSalesOrderIDQuery, [
      CustomerSalesOrderItemID,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const { CustomerSalesOrderID } = rows[0];

    const [deleteResult] = await con.query(deleteQuery, [
      CustomerSalesOrderItemID,
    ]);
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    await con.query(updateTotalPriceQuery, [
      CustomerSalesOrderID,
      CustomerSalesOrderID,
    ]);

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error handling delete operation:", {
      error: error.message,
      stack: error.stack,
      CustomerSalesOrderItemID,
    });
    res.status(500).json({
      message: "Failed to delete item or update SalesTotalPrice",
      error: error.message,
    });
  }
});

export { router as customerPo };
