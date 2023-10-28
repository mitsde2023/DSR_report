const express = require('express');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');
const CounselorData = require('../models/CounselorData');
const CounselorWiseSummary = require('../models/CounselorWiseSummary');



router.get('/counselor-metrics', async (req, res) => {
  try {
    const counselorMetrics = await CounselorData.findAll({
      include: [
        {
          model: CounselorWiseSummary,
          required: true,
          attributes: ['AmountReceived', 'AmountBilled'],
        },
      ],
      attributes: [
        'Counselor',
        'TeamLeaders',
        'TeamManager',
        'SalesManager',
        'Role',
        'Team',
        'Status',
        'Target',
      ],
    });

    // Calculate the sum of AmountReceived and AmountBilled for each counselor
    const result = counselorMetrics.map((counselor) => {
      const AmountReceivedSum = counselor.CounselorWiseSummaries.reduce((sum, summary) => {
        return sum + (summary.AmountReceived || 0);
      }, 0);

      const AmountBilledSum = counselor.CounselorWiseSummaries.reduce((sum, summary) => {
        return sum + (summary.AmountBilled || 0);
      }, 0);

      return {
        ...counselor.toJSON(),
        Admissions: counselor.CounselorWiseSummaries.length, // Count of CounselorWiseSummaries
        CollectedRevenue: AmountReceivedSum,
        BilledRevenue: AmountBilledSum,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching counselor metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.get('/counselor-metrics', async (req, res) => {
//   try {
//     const counselorMetrics = await CounselorData.findAll({
//       include: [
//         {
//           model: CounselorWiseSummary,
//           required: true,
//           attributes: [],
//         },
//       ],
//       attributes: [
//         'CounselorData.id',
//         'Counselor',
//         'TeamLeaders',
//         'TeamManager',
//         'SalesManager',
//         'Role',
//         'Team',
//         'Status',
//         'Target',
//         [Sequelize.fn('count', Sequelize.col('CounselorWiseSummaries.id')), 'Admissions'],
//         [Sequelize.fn('sum', Sequelize.col('CounselorWiseSummaries.AmountReceived')), 'CollectedRevenue'],
//         [Sequelize.fn('sum', Sequelize.col('CounselorWiseSummaries.AmountBilled')), 'BilledRevenue'],
//       ],
//       group: [
//         'Counselor',
//         'TeamLeaders',
//         'TeamManager',
//         'SalesManager',
//         'Role',
//         'Team',
//         'Status',
//         'Target',
//         'CounselorData.id',
//         'CounselorWiseSummaries.id', 
//       ],
//     });

//     res.json(counselorMetrics);
//   } catch (error) {
//     console.error('Error fetching counselor metrics:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// router.get('/counselor-metrics', async (req, res) => {
//   try {
//     // Use Sequelize to perform the data aggregation
//     const counselorMetrics = await CounselorData.findAll({
//       attributes: [
//         'CounselorData.id',
//         'Counselor',
//         'TeamLeaders',
//         'TeamManager',
//         'SalesManager',
//         'Role',
//         'Team',
//         'Status',
//         'Target',
//         [Sequelize.fn('count', Sequelize.col('CounselorWiseSummaries.ExecutiveName')), 'Admissions'],
//         [Sequelize.fn('sum', Sequelize.col('CounselorWiseSummaries.AmountReceived')), 'CollectedRevenue'],
//         [Sequelize.fn('sum', Sequelize.col('CounselorWiseSummaries.AmountBilled')), 'BilledRevenue'],
//       ],

//       include: {
//         model: CounselorWiseSummary,
//         required: true,
//       },
//       group: [
//         'Counselor',
//         'TeamLeaders',
//         'TeamManager',
//         'SalesManager',
//         'Role',
//         'Team',
//         'Status',
//         'Target',
//         'CounselorData.id', 
//         'CounselorWiseSummaries.id', 
//       ],

//     });
//     res.json(counselorMetrics);
//   } catch (error) {
//     console.error('Error fetching counselor metrics:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.get('/counselor-metrics', async (req, res) => {
//   try {
//     const counselorMetrics = await CounselorData.findAll({
//       include: {
//         model: CounselorWiseSummary,
//         required: true,
//         attributes: ['AmountReceived', 'AmountBilled'],
//       },
//     });

//     res.json(counselorMetrics);
//   } catch (error) {
//     console.error('Error fetching counselor metrics:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });





module.exports = router;


module.exports = router;
