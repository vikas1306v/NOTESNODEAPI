const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const fetchuser = require("../middleware/getuser.js");

// Importing modules
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// creating the user using: POST "/api/auth/". Doesn't require Auth
router.post(
  "/create",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    //validator code
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }
    try {
      //before creating the user checking if the user with same email exist or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email already exist" });
      }
      //creating the user
      //bycript password hashing
      const salt = await bcrypt.genSalt(10);
      const secpas = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpas,
      });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(req.body.password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const token = jwt.sign({ id: user._id }, JWT_SECRET,{ expiresIn: "1h" });
      res.json({ token });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required

router.post("/getuser", fetchuser, async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
});
module.exports = router;
