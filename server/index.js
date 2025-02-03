import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.js";
import { customerRouter } from "./routes/customer.js";
import { supplierRouter } from "./routes/suppliers.js";
import { itemRouter } from "./routes/item.js";
import { porouter } from "./routes/purchaseorder.js";
import { customerPo } from "./routes/customerpo.js";
import { itempriceRouter } from "./routes/itemPrice.js";

dotenv.config();
const app = express();


// app.use(cors({ origin: '*' }));

app.use(cors({
  origin: 'https://order-management-p53a.onrender.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/customer", customerRouter);
app.use("/supplier", supplierRouter);
app.use("/item", itemRouter);
app.use("/po", porouter);
app.use("/customerPo", customerPo);
app.use("/itemPrice", itempriceRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});

