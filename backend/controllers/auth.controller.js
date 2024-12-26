const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const config = require("../config/config");

const authController = {
  async register(req, res) {
    try {
      const {
        email,
        password,
        name,
        securityQuestion,
        securityAnswer,
        answerHint,
      } = req.body;

      if (
        !email ||
        !password ||
        !name ||
        !securityQuestion ||
        !securityAnswer ||
        !answerHint
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await User.create({
        email,
        password,
        name,
        securityQuestion,
        securityAnswer,
        answerHint,
      });

      const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
        expiresIn: "24h",
      });

      res.status(201).json({
        message: "User registered successfully",
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
        expiresIn: "24h",
      });

      res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  },

  async getSecurityQuestion(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({
        where: { email },
        attributes: ["securityQuestion", "answerHint"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        securityQuestion: user.securityQuestion,
        answerHint: user.answerHint,
      });
    } catch (error) {
      console.error("Get security question error:", error);
      res.status(500).json({ message: "Error fetching security question" });
    }
  },

  async resetPassword(req, res) {
    try {
      const { email, securityAnswer, newPassword } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValidAnswer = await user.compareSecurityAnswer(securityAnswer);
      if (!isValidAnswer) {
        return res.status(401).json({ message: "Incorrect security answer" });
      }

      await user.update({ password: newPassword });

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Error resetting password" });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: { exclude: ["password", "securityAnswer"] },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  },
};

module.exports = authController;
