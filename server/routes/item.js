import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

const sendErrorResponse = (res, statusCode, message, details = null) => {
  res.status(statusCode).json({ error: true, message, details });
};

router.get("/getItemUnits", async (req, res) => {
  try {
    const [units] = await pool.query("SELECT * FROM ItemUnits");
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item units" });
  }
});


router.get("/getItems", async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const query = `
  SELECT 
    i.ItemID, i.Name, i.Category, i.Brand, 
    i.Status, i.Description, 
    u.UnitName AS UnitName,
    i.ItemUnitID,
    s.Name AS SupplierName,
    i.SupplierID,
    i.Stock  -- Add this line to fetch Stock
  FROM items i
  JOIN itemunits u ON i.ItemUnitID = u.ItemUnitID
  JOIN suppliers s ON i.SupplierID = s.SupplierID
  LIMIT ? OFFSET ?;
`;

  const countQuery = "SELECT COUNT(*) as totalItems FROM items;";

  try {
    const [data] = await pool.query(query, [parseInt(limit), parseInt(offset)]);
    const [countResult] = await pool.query(countQuery);

    const totalItems = countResult[0].totalItems;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      error: false,
      data,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({
      error: true,
      message: "Database query failed",
      details: error.message,
    });
  }
});

// Add new item
router.post("/add_items", async (req, res) => {
  const {
    ProviderID,
    SupplierID,
    Name,
    Category,
    Brand,
    Status,
    Description,
    ItemUnitID,
    Stock,
  } = req.body;

  if (!SupplierID || !Name || !Category || !Brand || !Status || !ItemUnitID) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required." });
  }

  const sql = `
    INSERT INTO items 
    (ProviderID, SupplierID, Name, Category, Brand, Status, Description, ItemUnitID, Stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    ProviderID || 1,
    SupplierID,
    Name,
    Category,
    Brand,
    Status,
    Description,
    ItemUnitID,
    Stock || 0,
  ];

  try {
    const [result] = await pool.query(sql, values);
    res.status(201).json({
      added: true,
      message: "Item added successfully",
      data: req.body,
    });
  } catch (err) {
    console.error("Error inserting data:", err);
    res
      .status(500)
      .json({ error: true, message: "Database error", details: err });
  }
});

// Update Items
router.post("/updateItems", async (req, res) => {
  const {
    SupplierID,
    Name,
    Category,
    Brand,
    Status,
    Description,
    ItemUnitID,
    ItemID,
  } = req.body;

  const sql = `
    UPDATE Items
    SET SupplierID = ?, Name = ?, Category = ?, Brand = ?, Status = ?, Description = ?, ItemUnitID = ?
    WHERE ItemID = ?; 
  `;

  try {
    const [result] = await pool.query(sql, [
      SupplierID,
      Name,
      Category,
      Brand,
      Status,
      Description,
      ItemUnitID,
      ItemID,
    ]);

    res.json({
      status: result.affectedRows > 0,
      message:
        result.affectedRows > 0
          ? "Item updated successfully"
          : "Item not found",
    });
  } catch (err) {
    console.error("Error updating Item:", err.stack);
    res.status(500).json({ status: false, message: "Error updating Item" });
  }
});

router.delete("/deleteItems", async (req, res) => {
  const { ItemID } = req.body;

  if (!ItemID) {
    return res.status(400).json({
      error: true,
      message: "ItemID is required",
    });
  }

  const query = "DELETE FROM items WHERE ItemID = ?";

  try {
    const [result] = await pool.query(query, [ItemID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: "Item not found",
      });
    }

    res.status(200).json({
      error: false,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      error: true,
      message: "Failed to delete item",
      details: error.message,
    });
  }
});

export { router as itemRouter };
