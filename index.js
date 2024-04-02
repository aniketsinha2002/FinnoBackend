require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const cors = require("cors");
let MONGO_URL = process.env.MONGO_URL;

// Initialize Express app
const PORT = process.env.PORT || 4000; // Use process.env.PORT if available, otherwise use 4000

// MongoDB connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema
const fishSchema = new mongoose.Schema({
  order_id: String,
  name: String,
  price: String,
  title: String,
  imageUrl: String,
  description: String,
  country: String,
  NutValues_des: String,
  NutValues_energy: String,
  Protin: String,
  TotalFat: String,
  Carbohydrates: String,
  RefundPolicy: String,
  SHS: String,
  PQA: String,
  NHG: String,
  TS: String,
});

// Define model
const Fish = mongoose.model("Fish", fishSchema);

// Define schema for Orders collection
const orderSchema = new mongoose.Schema({
  productCode: String,
  orderId: String,
  cuttingType: String,
  pieceSize: String,
  totalPrice: String,
  totalQty: String,
});

// Define model for Orders collection
const Order = mongoose.model("Order", orderSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// API endpoints
router.post("/fish", (req, res) => {
  const {
    order_id,
    name,
    price,
    title,
    imageUrl,
    description,
    country,
    NutValues_des,
    NutValues_energy,
    Protin,
    TotalFat,
    Carbohydrates,
    RefundPolicy,
    SHS,
    PQA,
    NHG,
    TS,
  } = req.body;
  const fish = new Fish({
    order_id,
    name,
    price,
    title,
    imageUrl,
    description,
    country,
    NutValues_des,
    NutValues_energy,
    Protin,
    TotalFat,
    Carbohydrates,
    RefundPolicy,
    SHS,
    PQA,
    NHG,
    TS,
  });

  fish
    .save()
    .then(() => {
      res.status(201).json({ message: "Fish saved successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not save fish" });
      console.log(err);
    });
});

router.get("/fish", (req, res) => {
  Fish.find({})
    .then((fish) => {
      res.status(200).json(fish);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not fetch fish data" });
      console.log(err);
    });
});

router.post("/orders", (req, res) => {
  const { productCode, orderId, cuttingType, pieceSize, totalPrice, totalQty } =
    req.body;

  const order = new Order({
    productCode,
    orderId,
    cuttingType,
    pieceSize,
    totalPrice,
    totalQty,
  });

  order
    .save()
    .then(() => {
      res.status(201).json({ message: "Order saved successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not save order" });
      console.log(err);
    });
});

// Mount the router middleware
app.use("/api", router);

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the server for running in a serverless environment
module.exports.handler = serverless(app);
