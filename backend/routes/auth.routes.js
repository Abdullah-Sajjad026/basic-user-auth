const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/security-question", authController.getSecurityQuestion);
router.post("/forgot-password", authController.resetPassword);
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
