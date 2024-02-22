const express = require("express");

const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const bcrypt = require("bcrypt");

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken/Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken/Incorrect inputs",
    });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    username: req.body.username,
    password: hashedPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
    user: user,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
  });

  if (user) {
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        JWT_SECRET
      );

      return res.json({
        token: token,
        user: user,
      });
    }
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne(req.body, {
    id: req.userId,
  });

  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const getToken = () => {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      return token;
    }
  };

  try {
    const filter = req.query.filter || "";
    const token = getToken(); // Extract the JWT token from the Authorization header
    const decoded = jwt.verify(token, JWT_SECRET); // Decode the JWT token
    const userId = decoded.userId; // Extract the userId from the decoded token
    // Find all users excluding the logged-in user
    const users = await User.find({
      _id: { $ne: userId }, // Exclude the logged-in user
      $or: [
        { firstName: { $regex: filter, $options: "i" } }, // Case-insensitive regex for firstName
        { lastName: { $regex: filter, $options: "i" } }, // Case-insensitive regex for lastName
      ],
    });

    // Map the users to include only necessary information
    const usersWithBalance = await Promise.all(
      users.map(async (user) => {
        const account = await Account.findOne({ userId: user._id });
        return {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id,
          balance: account ? account.balance : 0, // Include balance if account exists, otherwise default to 0
        };
      })
    );

    // Return the filtered users
    res.json({ users: usersWithBalance });
  } catch (error) {
    // Handle any errors
    console.error("Error while fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
