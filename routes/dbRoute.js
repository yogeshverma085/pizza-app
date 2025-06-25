const express = require('express');
const router  = express.Router();   // ← use Router, not a new app
const pool    = require('../db');   // pg Pool you created

// GET /api/db/employees
router.get('/employees', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (err) {
    next(err);  // let your global error handler deal with it
  }
});

module.exports = router;