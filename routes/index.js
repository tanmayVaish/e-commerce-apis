var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// create Register, Login, Logout routes
router.post("/register", async (req, res) => {
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

router.post("/login", async function (req, res) {
  const { email, password } = req?.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) res.status(400).json({ message: "User does not exist" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) res.status(400).json({ message: "Password is incorrect" });

  // create JWT token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  if (!token) res.status(400).json({ message: "Token could not be created" });

  // set token in cookie
  res.cookie("jwt", token);

  res.status(200).json({ message: "User logged in successfully" });
});

router.post("/logout", function (req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully" });
});

module.exports = router;
