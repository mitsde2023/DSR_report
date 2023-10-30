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
          required: false,
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
        'TotalLead',
        'ConnectedCall',
        'TalkTime',
        'Final',
        'Group',
      ],
    });

    const result = [];
    counselorMetrics.forEach((counselor) => {
      const AmountReceivedSum = counselor.CounselorWiseSummaries.reduce((sum, summary) => {
        return sum + (summary.AmountReceived || 0);
      }, 0);

      const AmountBilledSum = counselor.CounselorWiseSummaries.reduce((sum, summary) => {
        return sum + (summary.AmountBilled || 0);
      }, 0);

      result.push({
        ...counselor.toJSON(),
        Admissions: counselor.CounselorWiseSummaries.length,
        CollectedRevenue: AmountReceivedSum,
        BilledRevenue: AmountBilledSum,
      });
    });

    res.json(result);
    console.log(result.length);
  } catch (error) {
    console.error('Error fetching counselor metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API route to get counselor data with hierarchy and totals
router.get('/counselor-data', async (req, res) => {
  try {
    const counselorData = await CounselorData.findAll({
      include: [
        {
          model: CounselorWiseSummary,
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
        'TotalLead',
      ],
    });

    // Calculate the total targets and admission counts
    const totals = {};

    // Calculate total targets and admission counts for Sales Managers
    totals.salesManagers = await CounselorData.findAll({
      attributes: ['SalesManager'],
      group: ['SalesManager'],
      include: [
        {
          model: CounselorWiseSummary,
          attributes: [],
        },
      ],
      raw: true,
    });

    // Calculate total targets and admission counts for Team Managers
    totals.teamManagers = await CounselorData.findAll({
      attributes: ['TeamManager'],
      group: ['TeamManager'],
      include: [
        {
          model: CounselorWiseSummary,
          attributes: [],
        },
      ],
      raw: true,
    });

    // Calculate total targets and admission counts for Team Leaders
    totals.teamLeaders = await CounselorData.findAll({
      attributes: ['TeamLeaders'],
      group: ['TeamLeaders'],
      include: [
        {
          model: CounselorWiseSummary,
          attributes: [],
        },
      ],
      raw: true,
    });

    // Add these totals to the response data
    const result = counselorData.map((counselor) => {
      // Extracted data for each level
      const extractedData = {
        Counselor: counselor.Counselor,
        TeamLeaders: counselor.TeamLeaders,
        TeamManager: counselor.TeamManager,
        SalesManager: counselor.SalesManager,
        Role: counselor.Role,
        Team: counselor.Team,
        Status: counselor.Status,
        Target: counselor.Target,
        TotalLead: counselor.TotalLead,
        Admissions: counselor.CounselorWiseSummaries.length,
        CollectedRevenue: counselor.CounselorWiseSummaries.reduce(
          (sum, summary) => sum + (summary.AmountReceived || 0),
          0
        ),
        BilledRevenue: counselor.CounselorWiseSummaries.reduce(
          (sum, summary) => sum + (summary.AmountBilled || 0),
          0
        ),
      };

      // Calculate total targets and admission counts based on hierarchy
      extractedData.TotalSalesManagerTargets = totals.salesManagers
        .filter((item) => item.SalesManager === counselor.SalesManager)
        .reduce((sum, item) => sum + item.Target, 0);

      extractedData.TotalTeamManagerTargets = totals.teamManagers
        .filter((item) => item.TeamManager === counselor.TeamManager)
        .reduce((sum, item) => sum + item.Target, 0);

      extractedData.TotalTeamLeaderTargets = totals.teamLeaders
        .filter((item) => item.TeamLeaders === counselor.TeamLeaders)
        .reduce((sum, item) => sum + item.Target, 0);

      return extractedData;
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
//           attributes: ['AmountReceived', 'AmountBilled'],
//         },
//       ],
//       attributes: [
//         'Counselor',
//         'TeamLeaders',
//         'TeamManager',
//         'SalesManager',
//         'Role',
//         'Team',
//         'Status',
//         'Target',
//         'TotalLead',
//         'ConnectedCall',
//         'TalkTime',
//         'Final',
//         'Group'
//       ],
//     });

//     // Calculate the sum of AmountReceived and AmountBilled for each counselor
//     const result = counselorMetrics.map((counselor) => {
//       const AmountReceivedSum = counselor.CounselorWiseSummaries.reduce((sum, summary) => {
//         return sum + (summary.AmountReceived || 0);
//       }, 0);

//       const AmountBilledSum = counselor.CounselorWiseSummaries.reduce((sum, summary) => {
//         return sum + (summary.AmountBilled || 0);
//       }, 0);

//       return {
//         ...counselor.toJSON(),
//         Admissions: counselor.CounselorWiseSummaries.length, 
//         CollectedRevenue: AmountReceivedSum,
//         BilledRevenue: AmountBilledSum,
//       };
//     });

//     res.json(result);
//     console.log(result.length, 55)
//   } catch (error) {
//     console.error('Error fetching counselor metrics:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



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

