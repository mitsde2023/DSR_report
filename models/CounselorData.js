const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const CounselorWiseSummary = require('./CounselorWiseSummary');

const CounselorData = sequelize.define('CounselorData', {
  Counselor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  TeamLeaders: {
    type: DataTypes.STRING,
  },
  TeamManager: {
    type: DataTypes.STRING,
  },
  SalesManager: {
    type: DataTypes.STRING,
  },
  Role: {
    type: DataTypes.STRING,
  },
  Team: {
    type: DataTypes.STRING,
  },
  Status: {
    type: DataTypes.STRING,
  },
  Target: {
    type: DataTypes.INTEGER,
  },
  TotalLead: {
    type: DataTypes.INTEGER,
  },
  ConnectedCall: {
    type: DataTypes.INTEGER,
  },
  TalkTime: {
    type: DataTypes.STRING,
  },
  Final: {
    type: DataTypes.STRING,
  },
  Group: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
});

CounselorData.hasMany(CounselorWiseSummary, {
  foreignKey: 'ExecutiveName', // This is the name of the column in the CounselorWiseSummary table
  sourceKey: 'Counselor', // This is the name of the column in the CounselorData table
});

module.exports = CounselorData;
