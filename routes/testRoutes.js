const express = require("express");
const router = express.Router();

// 401 test route
router.get("/unauthorized", (req, res) => {
  res.status(401).json({ error: "Unauthorized access" });
});

// 500 test route
router.get("/server-error", (req, res) => {
  res.status(500).json({ error: "Internal server error" });
});

module.exports = router;
