import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Get Item Prices
router.get("/getItemPrices/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const [results] = await con.query(
      "SELECT * FROM itemsstock WHERE ItemID = ?",
      [itemId]
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching item prices:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Add Item Price
router.post("/addItemPrice", async (req, res) => {
  const { ItemID, PurchasePrice, ProviderID, PurchaseDate, Qty, RemainingQty } =
    req.body;

  const insertSql = `
    INSERT INTO itemsstock 
    (ItemID, PurchasePrice, ProviderID, PurchaseDate, Qty, RemainingQty) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const updateSql = `
    UPDATE items i
    JOIN (
        SELECT ItemID, SUM(Qty) AS TotalQty
        FROM itemsstock
        GROUP BY ItemID
    ) is_total ON i.ItemID = is_total.ItemID
    SET i.Stock = is_total.TotalQty
    WHERE i.ItemID = ?
  `;

  try {
    const [insertResult] = await con.query(insertSql, [
      ItemID,
      PurchasePrice,
      ProviderID || "1",
      PurchaseDate,
      Qty,
      RemainingQty || Qty,
    ]);

    await con.query(updateSql, [ItemID]);

    res.status(201).json({
      message: "Item price added successfully and stock updated",
      ItemStockID: insertResult.insertId,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Failed to add item price or update stock",
      error: error.message,
    });
  }
});

// Update Item Price
router.put("/updateItemPrice/:id", async (req, res) => {
  const { id } = req.params;
  const { PurchasePrice, Qty, PurchaseDate, ItemID } = req.body;

  const updateItemStockSql = `
    UPDATE itemsstock 
    SET PurchasePrice = ?, Qty = ?, PurchaseDate = ? 
    WHERE ItemStockID = ?
  `;

  const updateStockSql = `
    UPDATE items i
    JOIN (
        SELECT ItemID, SUM(Qty) AS TotalQty
        FROM itemsstock
        GROUP BY ItemID
    ) is_total ON i.ItemID = is_total.ItemID
    SET i.Stock = is_total.TotalQty
    WHERE i.ItemID = ?
  `;

  try {
    const [updateResult] = await con.query(updateItemStockSql, [
      PurchasePrice,
      Qty,
      PurchaseDate,
      id,
    ]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    await con.query(updateStockSql, [ItemID]);

    res.json({
      message: "Item price and stock updated successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Failed to update item price or stock",
      error: error.message,
    });
  }
});

// Delete Item Price
router.delete("/deleteItemPrice/:id", async (req, res) => {
  const { id } = req.params;

  const fetchItemSql = `
    SELECT ItemID 
    FROM itemsstock 
    WHERE ItemStockID = ?
  `;

  const deleteItemSql = `
    DELETE FROM itemsstock 
    WHERE ItemStockID = ?
  `;

  const updateStockSql = `
    UPDATE items i
    JOIN (
        SELECT ItemID, SUM(Qty) AS TotalQty
        FROM itemsstock
        GROUP BY ItemID
    ) is_total ON i.ItemID = is_total.ItemID
    SET i.Stock = COALESCE(is_total.TotalQty, 0)
    WHERE i.ItemID = ?
  `;

  try {
    const [itemData] = await con.query(fetchItemSql, [id]);
    if (itemData.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    const { ItemID } = itemData[0];

    const [deleteResult] = await con.query(deleteItemSql, [id]);
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    await con.query(updateStockSql, [ItemID]);

    res.json({ message: "Item price deleted and stock updated successfully" });
  } catch (error) {
    console.error("Error deleting item price:", error);
    return res.status(500).json({
      message: "Failed to delete item price or update stock",
      error: error.message,
    });
  }
});

export { router as itempriceRouter };
