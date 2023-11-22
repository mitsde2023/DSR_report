const express = require('express');
const { Sequelize } = require('sequelize');
const router = express.Router();

// Import Sequelize models
const CounselorData = require('../models/CounselorData');
const CounselorWiseSummary = require('../models/CounselorWiseSummary');

// Define a route for deleting all records
router.delete('/deleteAllRecords', async (req, res) => {
  try {
    // Delete all records from CounselorWiseSummary
    await CounselorWiseSummary.destroy({
      where: {},
      truncate: true, // This option ensures that all records are deleted without logging individual deletions
    });

    // Delete all records from CounselorData
    await CounselorData.destroy({
      where: {},
      truncate: true,
    });

    res.status(200).json({ message: 'All records deleted successfully.' });
  } catch (error) {
    console.error('Error deleting records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
