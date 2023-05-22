var express = require("express");
var router = express.Router();

const productRouter = require("./product");
const orderRouter = require("./order");

router.use("/product", productRouter);
router.use("/order", orderRouter);

module.exports = router;
