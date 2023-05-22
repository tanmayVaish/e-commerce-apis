var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const { log } = require("debug/src/browser");
const prisma = new PrismaClient();

router.post("/create", async function (req, res) {
  const { status, totalCost, customerId, products } = req?.body;

  if (!status || !totalCost || !customerId || !products) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }

  try {
    const allVariants = await prisma.variant.findMany({
      where: {
        id: {
          in: products,
        },
      },
    });

    if (allVariants.length !== products.length) {
      res.status(400).json({ message: "Invalid product" });
      return;
    }

    if (allVariants.some((variant) => variant.stock <= 0)) {
      res.status(400).json({ message: "Product out of stock" });
      return;
    }

    const [newOrder, updatedVariants] = await prisma.$transaction([
      prisma.order.create({
        data: {
          status,
          totalCost,
          customer: {
            connect: {
              id: customerId,
            },
          },
          products: {
            connect: allVariants.map((variant) => {
              return {
                id: variant.id,
              };
            }),
          },
        },
      }),
      prisma.variant.updateMany({
        where: {
          id: {
            in: products,
          },
        },
        data: {
          stock: {
            decrement: 1,
          },
        },
      }),
    ]);

    if (!newOrder || !updatedVariants) {
      res.status(400).json({ message: "Order could not be created" });
      return;
    }
    res.status(200).json({ message: "Order created successfully", newOrder });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/get/:id", async function (req, res) {
  const { id } = req?.params;

  try {
    const order = await prisma.order.findMany({
      where: {
        customerId: parseInt(id),
      },
    });

    res.status(200).json({ message: "Order retrieved successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
