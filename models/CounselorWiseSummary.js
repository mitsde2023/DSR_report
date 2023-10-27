const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const CounselorWiseSummary = sequelize.define('CounselorWiseSummary', {
  Month: {
    type: DataTypes.STRING,
  },
  LeadID: {
    type: DataTypes.STRING,
  },
  'Lead Creation Date': {
    type: DataTypes.DATE,
  },
  'Executive Name': {
    type: DataTypes.STRING,
  },
  Team: {
    type: DataTypes.STRING,
  },
  'Student Name': {
    type: DataTypes.STRING,
  },
  'Course Short Name': {
    type: DataTypes.STRING,
  },
  Specialization: {
    type: DataTypes.STRING,
  },
  'Amount Received': {
    type: DataTypes.NUMBER,
  },
  'Discount Amount': {
    type: DataTypes.INTEGER,
  },
  'Discount Reason': {
    type: DataTypes.STRING,
  },
  'Study Material': {
    type: DataTypes.STRING,
  },
  'Study Material Discount': {
    type: DataTypes.STRING,
  },
  'Amount Billed': {
    type: DataTypes.INTEGER,
  },
  'Payment Mode': {
    type: DataTypes.STRING,
  },
  'Account details': {
    type: DataTypes.STRING,
  },
  'Payment Option': {
    type: DataTypes.STRING,
  },
  'Sale Date': {
    type: DataTypes.DATE,
  },
  'Contact Number': {
    type: DataTypes.STRING,
  },
  'Email ID': {
    type: DataTypes.STRING,
  },
  'Source type': {
    type: DataTypes.STRING,
  },
  Team2: {
    type: DataTypes.STRING,
  },
  'Primary Source': {
    type: DataTypes.STRING,
  },
  'Secondary Source': {
    type: DataTypes.STRING,
  },
  LeadID2: {
    type: DataTypes.STRING,
  },
  Source: {
    type: DataTypes.STRING,
  },
  'Agency Source': {
    type: DataTypes.STRING,
  },
  '1st payment amt': {
    type: DataTypes.INTEGER,
  },

  'Enrollment Id': {
    type: DataTypes.STRING,
  },
  Cohort: {
    type: DataTypes.STRING,
  },
  'Secondary Source2': {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false, // If you don't have timestamps columns
});

module.exports = CounselorWiseSummary;