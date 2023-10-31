const express = require('express');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');
const CounselorData = require('../models/CounselorData');
const CounselorWiseSummary = require('../models/CounselorWiseSummary');



// router.get('/hierarchy-data', async (req, res) => {
//   try {
//     const hierarchyData = await CounselorData.findAll({
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
//       ],
//     });

//     const hierarchyLevels = {
//       SalesManager: [],
//       TeamManager: [],
//       TeamLeader: [],
//       Counselor: [],
//     };

//     hierarchyData.forEach((counselor) => {
//       const target = counselor.Target;
//       const totalLead = counselor.TotalLead;

//       const hierarchyEntry = {
//         Counselor: counselor.Counselor,
//         Target: target,
//         TotalLead: totalLead,
//       };

//       if (counselor.SalesManager) {
//         hierarchyLevels.SalesManager.push(hierarchyEntry);
//       } else if (counselor.TeamManager) {
//         hierarchyLevels.TeamManager.push(hierarchyEntry);
//       } else if (counselor.TeamLeaders) {
//         hierarchyLevels.TeamLeader.push(hierarchyEntry);
//       } else {
//         hierarchyLevels.Counselor.push(hierarchyEntry);
//       }
//     });

//     // Calculate totals for each hierarchy level
//     const calculateHierarchyTotal = (level) => {
//       return level.reduce(
//         (total, entry) => ({
//           Target: total.Target + entry.Target,
//           TotalLead: total.TotalLead + entry.TotalLead,
//         }),
//         { Target: 0, TotalLead: 0 }
//       );
//     };

//     const response = {
//       SalesManager: {
//         data: hierarchyLevels.SalesManager,
//         total: calculateHierarchyTotal(hierarchyLevels.SalesManager),
//       },
//       TeamManager: {
//         data: hierarchyLevels.TeamManager,
//         total: calculateHierarchyTotal(hierarchyLevels.TeamManager),
//       },
//       TeamLeader: {
//         data: hierarchyLevels.TeamLeader,
//         total: calculateHierarchyTotal(hierarchyLevels.TeamLeader),
//       },
//       Counselor: {
//         data: hierarchyLevels.Counselor,
//         total: calculateHierarchyTotal(hierarchyLevels.Counselor),
//       },
//     };
//     res.json(response);
//   } catch (error) {
//     console.error('Error fetching hierarchy data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


router.get('/counselor-metrics', async (req, res) => {
  try {
    const counselorMetrics = await CounselorData.findAll({
      include: [
        {
          model: CounselorWiseSummary,
          required: false,
          attributes: ['AmountReceived', 'AmountBilled', 'Specialization'],
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

  } catch (error) {
    console.error('Error fetching counselor metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



async function HirrachicalData() {
  try {
    const counselorMetrics = await CounselorData.findAll({
      include: [
        {
          model: CounselorWiseSummary,
          required: false,
          attributes: ['AmountReceived', 'AmountBilled', 'Specialization'],
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

    return result;
  } catch (error) {
    console.error('Error fetching counselor metrics:', error);
    // Handle the error, or throw it if needed
    throw error;
  }
}

async function organizeData(data) {
  const result = {
    SalesManagers: {},
  };

  for (const counselor of data) {
    const SalesManager = counselor.SalesManager;
    const TeamManager = counselor.TeamManager;
    const TeamLeader = counselor.TeamLeaders;

    // Create SalesManager if not exists
    if (!result.SalesManagers[SalesManager]) {
      result.SalesManagers[SalesManager] = {
        Target: 0,
        TotalLead: 0,
        Admissions: 0,
        CollectedRevenue: 0,
        BilledRevenue: 0,
        TeamManagers: {},
        TeamManagerCount: 0,
      };
    }

    // Create TeamManager if not exists under SalesManager
    if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager]) {
      result.SalesManagers[SalesManager].TeamManagers[TeamManager] = {
        Target: 0,
        TotalLead: 0,
        Admissions: 0,
        CollectedRevenue: 0,
        BilledRevenue: 0,
        TeamLeaders: {},
        TeamLeaderCount: 0,
        TeamLeaderCounselors: {}, // Create an object to store TeamLeader counselors
      };
      result.SalesManagers[SalesManager].TeamManagerCount += 1;
    }

    // Create TeamLeader if not exists under TeamManager
    if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader]) {
      result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader] = {
        Target: 0,
        TotalLead: 0,
        Admissions: 0,
        CollectedRevenue: 0,
        BilledRevenue: 0,
      };
      result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaderCount += 1;
    }

    // Update TeamLeader Counselor Count
    if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselors) {
      result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselors = [];
    }
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselors.push({
      Counselor: counselor.Counselor,
      Target: counselor.Target,
      TotalLead: counselor.TotalLead,
      Admissions: counselor.Admissions,
      CollectedRevenue: counselor.CollectedRevenue,
      BilledRevenue: counselor.BilledRevenue,
    });

    // Update data
    result.SalesManagers[SalesManager].Target += counselor.Target;
    result.SalesManagers[SalesManager].TotalLead += counselor.TotalLead;
    result.SalesManagers[SalesManager].Admissions += counselor.Admissions;
    result.SalesManagers[SalesManager].CollectedRevenue += counselor.CollectedRevenue;
    result.SalesManagers[SalesManager].BilledRevenue += counselor.BilledRevenue;

    result.SalesManagers[SalesManager].TeamManagers[TeamManager].Target += counselor.Target;
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].TotalLead += counselor.TotalLead;
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].Admissions += counselor.Admissions;
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].CollectedRevenue += counselor.CollectedRevenue;
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].BilledRevenue += counselor.BilledRevenue;

    result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].Target += counselor.Target;
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TotalLead += counselor.TotalLead;
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].Admissions += counselor.Admissions;
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].CollectedRevenue += counselor.CollectedRevenue;
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].BilledRevenue += counselor.BilledRevenue;
  }

  return result;
}


// async function organizeData(data) {
//   const result = {
//     SalesManagers: {},
//     TeamManagerCount: 0, 
//     TeamLeaderCount: 0,  
//   };

//   for (const counselor of data) {
//     const SalesManager = counselor.SalesManager;
//     const TeamManager = counselor.TeamManager;
//     const TeamLeader = counselor.TeamLeaders;

//     // Create SalesManager if not exists
//     if (!result.SalesManagers[SalesManager]) {
//       result.SalesManagers[SalesManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamManagers: {},
//       };
//     }

//     // Create TeamManager if not exists under SalesManager
//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager]) {
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaders: {},
//       };
//     }

//     // Create TeamLeader if not exists under TeamManager
//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader]) {
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//       };
//     }

//     if (TeamManager && !result.SalesManagers[SalesManager].TeamManagers[TeamManager].counted) {
//       result.TeamManagerCount += 1;
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].counted = true;
//     }

//     // Increment TeamLeader count
//     if (TeamLeader && !result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].counted) {
//       result.TeamLeaderCount += 1;
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].counted = true;
//     }
//     // Update data
//     result.SalesManagers[SalesManager].Target += counselor.Target;
//     result.SalesManagers[SalesManager].TotalLead += counselor.TotalLead;
//     result.SalesManagers[SalesManager].Admissions += counselor.Admissions;
//     result.SalesManagers[SalesManager].CollectedRevenue += counselor.CollectedRevenue;
//     result.SalesManagers[SalesManager].BilledRevenue += counselor.BilledRevenue;

//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].Target += counselor.Target;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TotalLead += counselor.TotalLead;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].Admissions += counselor.Admissions;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].CollectedRevenue += counselor.CollectedRevenue;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].BilledRevenue += counselor.BilledRevenue;

//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].Target += counselor.Target;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TotalLead += counselor.TotalLead;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].Admissions += counselor.Admissions;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].CollectedRevenue += counselor.CollectedRevenue;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].BilledRevenue += counselor.BilledRevenue;
//   }

//   return result;
// }

// async function organizeData(data) {
//   const result = {
//     SalesManagers: {},
//   };

//   for (const counselor of data) {
//     const SalesManager = counselor.SalesManager;
//     const TeamManager = counselor.TeamManager;
//     const TeamLeader = counselor.TeamLeaders;

//     // Create SalesManager if not exists
//     if (!result.SalesManagers[SalesManager]) {
//       result.SalesManagers[SalesManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamManagers: {},
//         TeamManagerCount: 0, // Initialize TeamManager count
//       };
//     }

//     // Create TeamManager if not exists under SalesManager
//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager]) {
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaders: {},
//         TeamLeaderCount: 0, // Initialize TeamLeader count
//       };
//       result.SalesManagers[SalesManager].TeamManagerCount += 1; // Increment TeamManager count
//     }

//     // Create TeamLeader if not exists under TeamManager
//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader]) {
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//       };
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaderCount += 1; // Increment TeamLeader count
//     }

//     // Update data
//     result.SalesManagers[SalesManager].Target += counselor.Target;
//     result.SalesManagers[SalesManager].TotalLead += counselor.TotalLead;
//     result.SalesManagers[SalesManager].Admissions += counselor.Admissions;
//     result.SalesManagers[SalesManager].CollectedRevenue += counselor.CollectedRevenue;
//     result.SalesManagers[SalesManager].BilledRevenue += counselor.BilledRevenue;

//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].Target += counselor.Target;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TotalLead += counselor.TotalLead;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].Admissions += counselor.Admissions;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].CollectedRevenue += counselor.CollectedRevenue;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].BilledRevenue += counselor.BilledRevenue;

//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].Target += counselor.Target;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TotalLead += counselor.TotalLead;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].Admissions += counselor.Admissions;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].CollectedRevenue += counselor.CollectedRevenue;
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].BilledRevenue += counselor.BilledRevenue;
//   }

//   return result;
// }

router.get('/counselor-data-hir', async (req, res) => {
  try {
    const counselorData = await HirrachicalData();
    const organizedData = await organizeData(counselorData);
    res.json(organizedData);
  } catch (error) {
    console.error('Error fetching counselor metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/count-data', async (req, res) => {
  try {
    // Retrieve the counselor data from your database.
    const counselorData = await HirrachicalData();
    // const organizedData = await organizeData(counselorData);
    const metrics = {
      SalesManagers: {},
      TeamManagers: {},
      TeamLeaders: {},
    };

    // Iterate through the counselor data
    counselorData.forEach((counselor) => {
      const {
        Counselor,
        TeamLeaders,
        TeamManager,
        SalesManager,
        Target,
        TotalLead,
        Admissions,
        CollectedRevenue,
        BilledRevenue,
      } = counselor;

      // Update SalesManager metrics
      if (SalesManager) {
        if (!metrics.SalesManagers[SalesManager]) {
          metrics.SalesManagers[SalesManager] = {
            Target: 0,
            TotalLead: 0,
            Admissions: 0,
            CollectedRevenue: 0,
            BilledRevenue: 0,
          };
        }
        metrics.SalesManagers[SalesManager].Target += Target;
        metrics.SalesManagers[SalesManager].TotalLead += TotalLead;
        metrics.SalesManagers[SalesManager].Admissions += Admissions;
        metrics.SalesManagers[SalesManager].CollectedRevenue += CollectedRevenue;
        metrics.SalesManagers[SalesManager].BilledRevenue += BilledRevenue;
      }

      // Update TeamManager metrics
      if (TeamManager) {
        if (!metrics.TeamManagers[TeamManager]) {
          metrics.TeamManagers[TeamManager] = {
            Target: 0,
            TotalLead: 0,
            Admissions: 0,
            CollectedRevenue: 0,
            BilledRevenue: 0,
          };
        }
        metrics.TeamManagers[TeamManager].Target += Target;
        metrics.TeamManagers[TeamManager].TotalLead += TotalLead;
        metrics.TeamManagers[TeamManager].Admissions += Admissions;
        metrics.TeamManagers[TeamManager].CollectedRevenue += CollectedRevenue;
        metrics.TeamManagers[TeamManager].BilledRevenue += BilledRevenue;
      }

      // Update TeamLeader metrics
      if (TeamLeaders) {
        if (!metrics.TeamLeaders[TeamLeaders]) {
          metrics.TeamLeaders[TeamLeaders] = {
            Target: 0,
            TotalLead: 0,
            Admissions: 0,
            CollectedRevenue: 0,
            BilledRevenue: 0,
          };
        }
        metrics.TeamLeaders[TeamLeaders].Target += Target;
        metrics.TeamLeaders[TeamLeaders].TotalLead += TotalLead;
        metrics.TeamLeaders[TeamLeaders].Admissions += Admissions;
        metrics.TeamLeaders[TeamLeaders].CollectedRevenue += CollectedRevenue;
        metrics.TeamLeaders[TeamLeaders].BilledRevenue += BilledRevenue;
      }
    });

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching counselor metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// API route to get counselor data with hierarchy and totals
// router.get('/counselor-data', async (req, res) => {
//   try {
//     const counselorData = await CounselorData.findAll({
//       include: [
//         {
//           model: CounselorWiseSummary,
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
//       ],
//     });
//     console.log('Fetched counselorData:', counselorData);
//     // Calculate the total targets and admission counts
//     const totals = {};


//     totals.salesManagers = await CounselorData.findAll({
//       attributes: ['SalesManager'],
//       group: ['SalesManager'],
//       include: [
//         {
//           model: CounselorWiseSummary,
//           attributes: [],
//         },
//       ],
//       raw: true,
//     });

//     // Calculate total targets and admission counts for Team Managers
//     totals.teamManagers = await CounselorData.findAll({
//       attributes: ['TeamManager'],
//       group: ['TeamManager'],
//       include: [
//         {
//           model: CounselorWiseSummary,
//           attributes: [],
//         },
//       ],
//       raw: true,
//     });

//     // Calculate total targets and admission counts for Team Leaders
//     totals.teamLeaders = await CounselorData.findAll({
//       attributes: ['TeamLeaders'],
//       group: ['TeamLeaders'],
//       include: [
//         {
//           model: CounselorWiseSummary,
//           attributes: [],
//         },
//       ],
//       raw: true,
//     });

//     // Add these totals to the response data
//     const result = counselorData.map((counselor) => {
//       // Extracted data for each level
//       const extractedData = {
//         Counselor: counselor.Counselor,
//         TeamLeaders: counselor.TeamLeaders,
//         TeamManager: counselor.TeamManager,
//         SalesManager: counselor.SalesManager,
//         Role: counselor.Role,
//         Team: counselor.Team,
//         Status: counselor.Status,
//         Target: counselor.Target,
//         TotalLead: counselor.TotalLead,
//         Admissions: counselor.CounselorWiseSummaries.length,
//         CollectedRevenue: counselor.CounselorWiseSummaries.reduce(
//           (sum, summary) => sum + (summary.AmountReceived || 0),
//           0
//         ),
//         BilledRevenue: counselor.CounselorWiseSummaries.reduce(
//           (sum, summary) => sum + (summary.AmountBilled || 0),
//           0
//         ),
//       };

//       // Calculate total targets and admission counts based on hierarchy
//       extractedData.TotalSalesManagerTargets = totals.salesManagers
//         .filter((item) => item.SalesManager === counselor.SalesManager)
//         .reduce((sum, item) => sum + item.Target, 0);

//       extractedData.TotalTeamManagerTargets = totals.teamManagers
//         .filter((item) => item.TeamManager === counselor.TeamManager)
//         .reduce((sum, item) => sum + item.Target, 0);

//       extractedData.TotalTeamLeaderTargets = totals.teamLeaders
//         .filter((item) => item.TeamLeaders === counselor.TeamLeaders)
//         .reduce((sum, item) => sum + item.Target, 0);

//       return extractedData;
//     });

//     res.json(result);
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

