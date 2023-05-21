var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// create Register, Login, Logout routes
router.post("/register", async function (req, res) {
  try {
    const { name, email, password } = req?.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!hashedPassword)
      res.status(400).json({ message: "Password could not be hashed" });

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    if (!user) res.status(400).json({ message: "User could not be created" });

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/login", function (req, res) {
  res.send("Login");
});

router.get("/logout", function (req, res) {
  res.send("Logout");
});

module.exports = router;
