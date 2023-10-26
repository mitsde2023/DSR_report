const { DataTypes } = require('sequelize');
const sequelize = require('../config');

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
  Admissions: {
    type: DataTypes.INTEGER,
  },
  CollectedRevenue: {
    type: DataTypes.INTEGER,
  },
  BilledRevenue: {
    type: DataTypes.INTEGER,
  },
  TotalLead: {
    type: DataTypes.INTEGER,
  },
  AchievementPercentage: {
    type: DataTypes.FLOAT,
  },
  ConversionPercentage: {
    type: DataTypes.FLOAT,
  },
  CPST: {
    type: DataTypes.STRING,
  },
  BPST: {
    type: DataTypes.STRING,
  },
  ConnectedCall: {
    type: DataTypes.INTEGER,
  },
  TalkTime: {
    type: DataTypes.STRING,
  },
  FinalGroup: {
    type: DataTypes.STRING,
  },
},{
  timestamps: false,
});

module.exports = CounselorData;
