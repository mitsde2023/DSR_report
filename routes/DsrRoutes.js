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

// provide count of sels manegares 

// async function organizeData(data) {
//   const result = {
//     SalesManagers: {},
//   };

//   for (const counselor of data) {
//     const SalesManager = counselor.SalesManager;
//     const TeamManager = counselor.TeamManager;
//     const TeamLeader = counselor.TeamLeaders;

//     if (!result.SalesManagers[SalesManager]) {
//       // Create SalesManager if not exists
//       result.SalesManagers[SalesManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamManagers: {},
//         TeamManagerCount: 0,
//         TeamLeaderCount: 0,
//       };
//     }

//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager]) {
//       // Create TeamManager if not exists under SalesManager
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaders: {},
//         TeamLeaderCount: 0,
//       };
//       result.SalesManagers[SalesManager].TeamManagerCount += 1;
//     }

//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader]) {
//       // Create TeamLeader if not exists under TeamManager
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaderCounselorCount: 0, // Initialize the counselor count to 0
//       };
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaderCount += 1;
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

//     // Increase the counselor count for the specific TeamLeader
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselorCount += 1;

//     // Increment TeamLeaderCount under SalesManager
//     result.SalesManagers[SalesManager].TeamLeaderCount += 1;
//   }

//   // Calculate Sales Managers count based on Team Manager and Team Leader counts
//   for (const salesManagerName in result.SalesManagers) {
//     const managerData = result.SalesManagers[salesManagerName];
//     managerData.SalesManagerCount = managerData.TeamManagerCount + managerData.TeamLeaderCount;
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

//     if (!result.SalesManagers[SalesManager]) {
//       // Create SalesManager if not exists
//       result.SalesManagers[SalesManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamManagers: {},
//         TeamManagerCount: 0,
//         TeamLeaderCount: 0,
//       };
//     }

//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager]) {
//       // Create TeamManager if not exists under SalesManager
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaders: {},
//         TeamLeaderCount: 0,
//       };
//       result.SalesManagers[SalesManager].TeamManagerCount += 1;
//     }

//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader]) {
//       // Create TeamLeader if not exists under TeamManager
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaderCounselorCount: 0, // Initialize the counselor count to 0
//       };
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaderCount += 1;
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

//     // Increase the counselor count for the specific TeamLeader
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselorCount += 1;

//     // Increment TeamLeaderCount under SalesManager
//     result.SalesManagers[SalesManager].TeamLeaderCount += 1;

//     // Increment TeamManagerCount under TeamManager
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamManagerCount += 1;
//   }

//   // Calculate Sales Managers and Team Managers count based on Team Manager and Team Leader counts
//   for (const salesManagerName in result.SalesManagers) {
//     const managerData = result.SalesManagers[salesManagerName];
//     managerData.SalesManagerCount = managerData.TeamManagerCount + managerData.TeamLeaderCount;

//     for (const teamManagerName in managerData.TeamManagers) {
//       const teamManagerData = managerData.TeamManagers[teamManagerName];
//       teamManagerData.TeamManagerCount = teamManagerData.TeamLeaderCount;
//     }
//   }

//   return result;
// }

async function organizeData(data) {
  const result = {
    SalesManagers: {},
  };

  for (const counselor of data) {
    const SalesManager = counselor.SalesManager;
    const TeamManager = counselor.TeamManager;
    const TeamLeader = counselor.TeamLeaders;

    if (!result.SalesManagers[SalesManager]) {
      // Create SalesManager if not exists
      result.SalesManagers[SalesManager] = {
        Target: 0,
        TotalLead: 0,
        Admissions: 0,
        CollectedRevenue: 0,
        BilledRevenue: 0,
        TeamManagers: {},
        TeamManagerCount: 0,
        TeamLeaderCount: 0,
        SalesManagerCount: 0,
      };
    }

    if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager]) {
      // Create TeamManager if not exists under SalesManager
      result.SalesManagers[SalesManager].TeamManagers[TeamManager] = {
        Target: 0,
        TotalLead: 0,
        Admissions: 0,
        CollectedRevenue: 0,
        BilledRevenue: 0,
        TeamLeaders: {},
        TeamLeaderCount: 0,
        TeamManagerCount: 0,
      };
      result.SalesManagers[SalesManager].TeamManagerCount += 1;
    }

    if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader]) {
      // Create TeamLeader if not exists under TeamManager
      result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader] = {
        Target: 0,
        TotalLead: 0,
        Admissions: 0,
        CollectedRevenue: 0,
        BilledRevenue: 0,
        TeamLeaderCounselorCount: 0, // Initialize the counselor count to 0
      };
      result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaderCount += 1;
    }

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

    // Increase the counselor count for the specific TeamLeader
    result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselorCount += 1;

    // Increment TeamLeaderCount under SalesManager
    result.SalesManagers[SalesManager].TeamLeaderCount += 1;

    // Increment TeamManagerCount under TeamManager (without self count)
    if (TeamManager !== SalesManager) {
      result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamManagerCount += 1;
    }
  }

  // Calculate Sales Managers, Team Managers, and Team Leader counts based on actual counts
  for (const salesManagerName in result.SalesManagers) {
    const managerData = result.SalesManagers[salesManagerName];
    managerData.SalesManagerCount = 1;

    for (const teamManagerName in managerData.TeamManagers) {
      const teamManagerData = managerData.TeamManagers[teamManagerName];
      teamManagerData.TeamManagerCount = 1;

      for (const teamLeaderName in teamManagerData.TeamLeaders) {
        teamManagerData.TeamManagerCount += teamManagerData.TeamLeaders[teamLeaderName].TeamLeaderCounselorCount;
        managerData.SalesManagerCount += teamManagerData.TeamManagerCount;
      }
    }
  }

  return result;
}


// provoide correct but 1 extra count

// async function organizeData(data) {
//   const result = {
//     SalesManagers: {},
//   };

//   for (const counselor of data) {
//     const SalesManager = counselor.SalesManager;
//     const TeamManager = counselor.TeamManager;
//     const TeamLeader = counselor.TeamLeaders;

//     if (!result.SalesManagers[SalesManager]) {
//       // Create SalesManager if not exists
//       result.SalesManagers[SalesManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamManagers: {},
//         TeamManagerCount: 0,
//         TeamLeaderCount: 0,
//         SalesManagerCount: 0,
//       };
//     }

//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager]) {
//       // Create TeamManager if not exists under SalesManager
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaders: {},
//         TeamLeaderCount: 0,
//         TeamManagerCount: 0,
//       };
//       result.SalesManagers[SalesManager].TeamManagerCount += 1;
//     }

//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader]) {
//       // Create TeamLeader if not exists under TeamManager
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaderCounselorCount: 0, // Initialize the counselor count to 0
//       };
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaderCount += 1;
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

//     // Increase the counselor count for the specific TeamLeader
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselorCount += 1;

//     // Increment TeamLeaderCount under SalesManager
//     result.SalesManagers[SalesManager].TeamLeaderCount += 1;

//     // Increment TeamManagerCount under TeamManager
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamManagerCount += 1;
//   }

//   // Calculate Sales Managers, Team Managers, and Team Leader counts based on actual counts
//   for (const salesManagerName in result.SalesManagers) {
//     const managerData = result.SalesManagers[salesManagerName];
//     managerData.SalesManagerCount = 1;

//     for (const teamManagerName in managerData.TeamManagers) {
//       const teamManagerData = managerData.TeamManagers[teamManagerName];
//       teamManagerData.TeamManagerCount = 1;

//       for (const teamLeaderName in teamManagerData.TeamLeaders) {
//         teamManagerData.TeamManagerCount += teamManagerData.TeamLeaders[teamLeaderName].TeamLeaderCounselorCount;
//         managerData.SalesManagerCount += teamManagerData.TeamManagerCount;
//       }
//     }
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

//     if (!result.SalesManagers[SalesManager]) {
//       // Create SalesManager if not exists
//       result.SalesManagers[SalesManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamManagers: {},
//         TeamManagerCount: 0,
//       };
//     }

//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager]) {
//       // Create TeamManager if not exists under SalesManager
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaders: {},
//         TeamLeaderCount: 0,
//       };
//       result.SalesManagers[SalesManager].TeamManagerCount += 1;
//     }

//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader]) {
//       // Create TeamLeader if not exists under TeamManager
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader] = {
//         Target: 0,
//         TotalLead: 0,
//         Admissions: 0,
//         CollectedRevenue: 0,
//         BilledRevenue: 0,
//         TeamLeaderCounselorCount: 0, // Initialize the counselor count to 0
//       };
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaderCount += 1;
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

//     // Increase the counselor count for the specific TeamLeader
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselorCount += 1;
//   }

//   return result;
// }


// provide data with team leder detailes
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
//         TeamManagerCount: 0,
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
//         TeamLeaderCount: 0,
//         TeamLeaderCounselors: {}, // Create an object to store TeamLeader counselors
//       };
//       result.SalesManagers[SalesManager].TeamManagerCount += 1;
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
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaderCount += 1;
//     }

//     // Update TeamLeader Counselor Count
//     if (!result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselors) {
//       result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselors = [];
//     }
//     result.SalesManagers[SalesManager].TeamManagers[TeamManager].TeamLeaders[TeamLeader].TeamLeaderCounselors.push({
//       Counselor: counselor.Counselor,
//       Target: counselor.Target,
//       TotalLead: counselor.TotalLead,
//       Admissions: counselor.Admissions,
//       CollectedRevenue: counselor.CollectedRevenue,
//       BilledRevenue: counselor.BilledRevenue,
//     });

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

// async function formatData(response) {
//   const formattedData = [];

//   const res = response;

//   if (res && res.SalesManagers) {
//     for (const managerName in res.SalesManagers) {
//       const manager = res.SalesManagers[managerName];
//       for (const teamManagerName in manager.TeamManagers) {
//         const teamManager = manager.TeamManagers[teamManagerName];
//         for (const teamLeaderName in teamManager.TeamLeaders) {
//           const teamLeader = teamManager.TeamLeaders[teamLeaderName];
//           const admissions = teamLeader.Admissions;
//           const target = teamLeader.Target;
//           const totalLead = teamLeader.TotalLead;
//           const percentAchieve = (admissions / target) * 100;
//           const conversionPercent = (admissions / totalLead) * 100;
//           const teamLeaderCounselorCount = teamLeader.TeamLeaderCounselorCount; // New addition

//           formattedData.push({
//             'AsstManager': managerName,
//             'TeamManager': teamManagerName,
//             'TeamLeader': teamLeaderName,
//             'Target': target,
//             'Admissions': admissions,
//             '%Achieve': percentAchieve,
//             'T-Lead': totalLead,
//             'Conversion%': conversionPercent,
//             'Coll-Revenue': teamLeader.CollectedRevenue,
//             'Bill-Revenue': teamLeader.BilledRevenue,
//             'TeamLeaderCounselorCount': teamLeaderCounselorCount,
//           });
//         }

//         // Check if the TeamManager is not the same as the AsstManager, then add a new row
//         if (managerName !== teamManagerName ) {
//           formattedData.push({
//             'AsstManager': managerName,
//             'TeamManager': teamManagerName,
//             'Target': teamManager.Target, // You can add other TeamManager fields here
//             'Admissions': teamManager.Admissions,
//             '%Achieve': (teamManager.Admissions / teamManager.Target) * 100,
//             'T-Lead': teamManager.TotalLead,
//             'Conversion%': (teamManager.Admissions / teamManager.TotalLead) * 100,
//             'Coll-Revenue': teamManager.CollectedRevenue,
//             'Bill-Revenue': teamManager.BilledRevenue,
//             'TeamLeaderCounselorCount': teamManager.TeamManagerCount,
//           });
//         }
//       }
//     }
//   }

//   return formattedData;
// }







async function formatData(response) {
  const formattedData = [];

  const res = response;

  if (res && res.SalesManagers) {
    for (const managerName in res.SalesManagers) {
      const manager = res.SalesManagers[managerName];
      for (const teamManagerName in manager.TeamManagers) {
        const teamManager = manager.TeamManagers[teamManagerName];
        for (const teamLeaderName in teamManager.TeamLeaders) {
          const teamLeader = teamManager.TeamLeaders[teamLeaderName];
          const admissions = teamLeader.Admissions;
          const target = teamLeader.Target;
          const totalLead = teamLeader.TotalLead;
          const percentAchieve = (admissions / target) * 100;
          const conversionPercent = (admissions / totalLead) * 100;
          const teamLeaderCounselorCount = teamLeader.TeamLeaderCounselorCount; // New addition

     
          formattedData.push({
            'AsstManager': managerName,
            'TeamManager': teamManagerName,
            'TeamLeader': teamLeaderName,
            'TeamLeaderCounselorCount': teamLeaderCounselorCount,
            'Target': target,
            'Admissions': admissions,
            '%Achieve': percentAchieve.toFixed(2),
            'T-Lead': totalLead,
            'Conversion%': conversionPercent.toFixed(2),
            'Coll-Revenue': teamLeader.CollectedRevenue,
            'Bill-Revenue': teamLeader.BilledRevenue,
            'C_PSR': (teamLeader.CollectedRevenue / admissions).toFixed(2),
            'B_PSR': (teamLeader.BilledRevenue / admissions).toFixed(2),
            'C_PCR': (teamLeader.CollectedRevenue / teamLeaderCounselorCount).toFixed(2),
            'B_PCR': (teamLeader.BilledRevenue / teamLeaderCounselorCount).toFixed(2),
            'PCE': (admissions / teamLeaderCounselorCount).toFixed(2)
          });
        }
        // Check if the TeamManager is not the same as the AsstManager, then add a new row
        if (managerName !== teamManagerName) {
          formattedData.push({
            'AsstManager': managerName,
            'TeamManager': teamManagerName,
            'TeamLeaderCounselorCount': teamManager.TeamManagerCount - 1,
            'Target': teamManager.Target,
            'Admissions': teamManager.Admissions,
            '%Achieve': ((teamManager.Admissions / teamManager.Target).toFixed(2) * 100).toFixed(2),
            'T-Lead': teamManager.TotalLead,
            'Conversion%': ((teamManager.Admissions / teamManager.TotalLead).toFixed(2) * 100).toFixed(2),
            'Coll-Revenue': teamManager.CollectedRevenue,
            'Bill-Revenue': teamManager.BilledRevenue,
            'C_PSR': (teamManager.CollectedRevenue / teamManager.Admissions).toFixed(2),
            'B_PSR': (teamManager.BilledRevenue / teamManager.Admissions).toFixed(2),
            'C_PCR': (teamManager.CollectedRevenue / (teamManager.TeamManagerCount - 1)).toFixed(2),
            'B_PCR': (teamManager.BilledRevenue / (teamManager.TeamManagerCount - 1)).toFixed(2),
            'PCE': (teamManager.Admissions / (teamManager.TeamManagerCount - 1)).toFixed(2)
          });
        }

      }
      formattedData.push({
        'AsstManager': managerName,
        'TeamLeaderCounselorCount': manager.TeamLeaderCount,
        'Target': manager.Target,
        'Admissions': manager.Admissions,
        '%Achieve': ((manager.Admissions / manager.Target) * 100).toFixed(2),
        'T-Lead': manager.TotalLead,
        'Conversion%': ((manager.Admissions / manager.TotalLead).toFixed(2) * 100).toFixed(2),
        'Coll-Revenue': manager.CollectedRevenue,
        'Bill-Revenue': manager.BilledRevenue,
        'C_PSR': (manager.CollectedRevenue / manager.Admissions).toFixed(2),
        'B_PSR': (manager.BilledRevenue / manager.Admissions).toFixed(2),
        'C_PCR': (manager.CollectedRevenue / manager.TeamLeaderCount).toFixed(2),
        'B_PCR': (manager.BilledRevenue / manager.TeamLeaderCount).toFixed(2),
        'PCE': (manager.Admissions / manager.TeamLeaderCount).toFixed(2)
      });
    }
  }
  return formattedData;
}












// async function formatData(response) {
//   const formattedData = [];

//   const grandTotal = {
//     'AsstManager': 'Grand Total', // Label for the grand total row
//     'Target': 0,
//     'Admissions': 0,
//     '%Achieve': 0,
//     'T-Lead': 0,
//     'Conversion%': 0,
//     'Coll-Revenue': 0,
//     'Bill-Revenue': 0,
//     'TeamLeaderCounselorCount': 0,
//   };

//   const res = response;

//   if (res && res.SalesManagers) {
//     for (const managerName in res.SalesManagers) {
//       const manager = res.SalesManagers[managerName];
//       for (const teamManagerName in manager.TeamManagers) {
//         const teamManager = manager.TeamManagers[teamManagerName];
//         for (const teamLeaderName in teamManager.TeamLeaders) {
//           const teamLeader = teamManager.TeamLeaders[teamLeaderName];
//           const admissions = teamLeader.Admissions;
//           const target = teamLeader.Target;
//           const totalLead = teamLeader.TotalLead;
//           const percentAchieve = (admissions / target) * 100;
//           const conversionPercent = (admissions / totalLead) * 100;
//           const teamLeaderCounselorCount = teamLeader.TeamLeaderCounselorCount;

//           formattedData.push({
//             'AsstManager': managerName,
//             'TeamManager': teamManagerName,
//             'TeamLeader': teamLeaderName,
//             'Target': target,
//             'Admissions': admissions,
//             '%Achieve': percentAchieve,
//             'T-Lead': totalLead,
//             'Conversion%': conversionPercent,
//             'Coll-Revenue': teamLeader.CollectedRevenue,
//             'Bill-Revenue': teamLeader.BilledRevenue,
//             'TeamLeaderCounselorCount': teamLeaderCounselorCount,
//           });

//           // Update the grand total row
//           grandTotal.Target += target;
//           grandTotal.Admissions += admissions;
//           grandTotal['%Achieve'] += percentAchieve;
//           grandTotal['T-Lead'] += totalLead;
//           grandTotal['Conversion%'] += conversionPercent;
//           grandTotal['Coll-Revenue'] += teamLeader.CollectedRevenue;
//           grandTotal['Bill-Revenue'] += teamLeader.BilledRevenue;
//           grandTotal.TeamLeaderCounselorCount += teamLeaderCounselorCount;
//         }

//         // Check if the TeamManager is not the same as the AsstManager, then add a new row
//         if (managerName !== teamManagerName) {
//           formattedData.push({
//             'AsstManager': managerName,
//             'TeamManager': teamManagerName,
//             'Target': teamManager.Target, // You can add other TeamManager fields here
//             'Admissions': teamManager.Admissions,
//             '%Achieve': (teamManager.Admissions / teamManager.Target) * 100,
//             'T-Lead': teamManager.TotalLead,
//             'Conversion%': (teamManager.Admissions / teamManager.TotalLead) * 100,
//             'Coll-Revenue': teamManager.CollectedRevenue,
//             'Bill-Revenue': teamManager.BilledRevenue,
//             'TeamLeaderCounselorCount': teamManager.TeamManagerCount,
//           });

//           // Update the grand total row with TeamManager data
//           grandTotal.Target += teamManager.Target;
//           grandTotal.Admissions += teamManager.Admissions;
//           grandTotal['%Achieve'] += (teamManager.Admissions / teamManager.Target) * 100;
//           grandTotal['T-Lead'] += teamManager.TotalLead;
//           grandTotal['Conversion%'] += (teamManager.Admissions / teamManager.TotalLead) * 100;
//           grandTotal['Coll-Revenue'] += teamManager.CollectedRevenue;
//           grandTotal['Bill-Revenue'] += teamManager.BilledRevenue;
//           grandTotal.TeamLeaderCounselorCount += teamManager.TeamManagerCount;
//         }
//       }

//       // Add a row at the end of each AsstManager section with all fields for that AsstManager
//       formattedData.push({
//         'AsstManager': managerName,
//         'Target': manager.Target,
//         'Admissions': manager.Admissions,
//         // Add other AsstManager fields here
//       });

//       // Update the grand total row with AsstManager data
//       grandTotal.Target += manager.Target;
//       grandTotal.Admissions += manager.Admissions;
//       // Add other AsstManager fields to the grand total here
//     }
//   }

//   // Push the grand total row to the end of the formatted data
//   formattedData.push(grandTotal);

//   return formattedData;
// }

// Your data


async function addRanking(data) {
  // Create dictionaries to track rankings for each criterion
  const asstManagerRanks = {};
  const teamManagerRanks = {};
  const teamLeaderRanks = {};

  // Create dictionaries to track the counts for each criterion
  const asstManagerCounts = {};
  const teamManagerCounts = {};
  const teamLeaderCounts = {};

  data.forEach((item) => {
    const asstManager = item['AsstManager'];
    const teamManager = item['TeamManager'];
    const teamLeader = item['TeamLeader'];
    const admissions = item['Admissions'];

    // Define a unique identifier based on the combination of names
    const asstManagerKey = `${asstManager}`;
    const teamManagerKey = `${asstManager}-${teamManager}`;
    const teamLeaderKey = `${asstManager}-${teamManager}-${teamLeader}`;

    // Update the counts for each criterion
    asstManagerCounts[asstManagerKey] = asstManagerCounts[asstManagerKey] || 0;
    teamManagerCounts[teamManagerKey] = teamManagerCounts[teamManagerKey] || 0;
    teamLeaderCounts[teamLeaderKey] = teamLeaderCounts[teamLeaderKey] || 0;

    asstManagerCounts[asstManagerKey]++;
    teamManagerCounts[teamManagerKey]++;
    teamLeaderCounts[teamLeaderKey]++;

    // Update rankings only if the names are the same
    if (asstManagerCounts[asstManagerKey] > 1) {
      if (!asstManagerRanks[asstManagerKey]) {
        asstManagerRanks[asstManagerKey] = 1;
      } else {
        asstManagerRanks[asstManagerKey]++;
      }
      item['AsstManagerRanking'] = asstManagerRanks[asstManagerKey];
    }

    if (teamManagerCounts[teamManagerKey] > 1) {
      if (!teamManagerRanks[teamManagerKey]) {
        teamManagerRanks[teamManagerKey] = 1;
      } else {
        teamManagerRanks[teamManagerKey]++;
      }
      item['TeamManagerRanking'] = teamManagerRanks[teamManagerKey];
    }

    if (teamLeaderCounts[teamLeaderKey] > 1) {
      if (!teamLeaderRanks[teamLeaderKey]) {
        teamLeaderRanks[teamLeaderKey] = 1;
      } else {
        teamLeaderRanks[teamLeaderKey]++;
      }
      item['TeamLeaderRanking'] = teamLeaderRanks[teamLeaderKey];
    }
  });

  return data;
}

router.get('/react-table-data', async (req, res) => {
  try {
    const counselorData = await HirrachicalData();
    const organizedData = await organizeData(counselorData);
    const formattedData = await formatData(organizedData);
    const dataWithRanking = await addRanking(formattedData);
    console.log(dataWithRanking.length);
    res.json(dataWithRanking);
  } catch (error) {
    console.error('Error fetching counselor metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.get('/fetchAndFormatData', async (req, res) => {
//   try {
//       const response = await axios.get('http://localhost:7000/dsr_report/counselor-data-hir');
//       const formattedData = [];
//       const data = response.data.SalesManagers; // Renamed variable to data
//       if (data && data.SalesManagers) {
//           for (const managerName in data.SalesManagers) {
//               const manager = data.SalesManagers[managerName];
//               for (const teamManagerName in manager.TeamManagers) {
//                   const teamManager = manager.TeamManagers[teamManagerName];
//                   for (const teamLeaderName in teamManager.TeamLeaders) {
//                       const teamLeader = teamManager.TeamLeaders[teamLeaderName];
//                       const admissions = teamLeader.Admissions;
//                       const target = teamLeader.Target;
//                       const totalLead = teamLeader.TotalLead;
//                       const percentAchieve = (admissions / target) * 100;
//                       const conversionPercent = (admissions / totalLead) * 100;

//                       formattedData.push({
//                           'Asst. Manager': managerName,
//                           'Team Manager': teamManagerName,
//                           'Team Leader': teamLeaderName,
//                           'H-Count': teamLeader.Target,
//                           'Target': target,
//                           'Admissions': admissions,
//                           '% Achieve': percentAchieve,
//                           'T-Lead': totalLead,
//                           'Conversion%': conversionPercent,
//                           'Coll-Revenue': teamLeader.CollectedRevenue,
//                           'Bill-Revenue': teamLeader.BilledRevenue,
//                       });
//                   }
//               }
//           }
//           res.json(formattedData);
//       } else {
//           res.status(404).json({ error: 'Data not found' });
//       }
//   } catch (error) {
//       console.error('Error fetching data:', error);
//       res.status(500).json({ error: 'Error fetching data' });
//   }
// });

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

