var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/create", async function (req, res) {
  try {
    const transaction = await prisma.product.create({
      data: {
        name: req?.body?.name,
        description: req?.body?.description,
        price: req?.body?.price,
        authorId: req?.body?.userId,
        variant: {
          createMany: {
            data: req?.body?.variant,
          },
        },
      },
    });

    if (!transaction)
      res.status(400).json({ message: "Product could not be created" });

    res.status(200).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/update/:id", async function (req, res) {
  const { name, description, price, variant } = req?.body;
  const { id } = req?.params;

  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingProduct)
      res.status(400).json({ message: "Product does not exist" });

    const product = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        // update only if the value is not null
        ...(name && { name: name }),
        ...(description && { description: description }),
        ...(price && { price: price }),
        // !TODO: update variant not working
        ...(variant && {
          variant: {
            updateMany: {
              where: {
                productId: parseInt(id),
              },
            },
          },
        }),
      },
    });

    if (!product)
      res.status(400).json({ message: "Product could not be updated" });

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", async function (req, res) {
  const { name, description, variantName } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          { name: { contains: name || "" } },
          { description: { contains: description || "" } },
          { variant: { some: { name: { contains: variantName || "" } } } },
        ],
      },
      include: {
        variant: true,
      },
    });

    if (!products)
      res.status(400).json({ message: "Products could not be fetched" });

    res.status(200).json({ products: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async function (req, res) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: parseInt(req?.params?.id),
      },
    });

    if (!existingProduct)
      res.status(400).json({ message: "Product does not exist" });

    const product = await prisma.product.delete({
      where: {
        id: parseInt(req?.params?.id),
      },
    });

    if (!product)
      res.status(400).json({ message: "Product could not be deleted" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
