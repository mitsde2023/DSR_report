const express = require('express');
const router = express.Router();
const DsrModel = require('../models/Dsr');

// Define routes
router.get('/', async (req, res) => {
  try {
    const examples = await DsrModel.find();
    res.json(examples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  const example = new DsrModel({ name, description });

  try {
    const savedExample = await example.save();
    res.json(savedExample);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;




