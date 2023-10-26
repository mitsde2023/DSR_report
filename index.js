const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Sequelize, Op } = require('sequelize');
const ExcelJS = require('exceljs');
const DsrRoutes = require('./routes/DsrRoutes');
const CounselorWiseSummery = require('./models/CounselorData');
const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());

// Define storage for uploaded Excel files using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const sequelize = new Sequelize('cdrreport', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 6000000,
        idle: 6000000
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

app.use('/dsr_report', DsrRoutes);

app.get('/', (req, res) => {
    res.json('Hello, how are you...');
});

app.post('/upload', upload.single('excelFile'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);

        const worksheet = workbook.getWorksheet(1);

        if (worksheet) {
            const dataToSave = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber !== 1) { // Skip the header row
                    const rowData = {
                        Counselor: row.getCell(1).value,
                        TeamLeaders: row.getCell(2).value,
                        TeamManager: row.getCell(3).value,
                        SalesManager: row.getCell(4).value,
                        Role: row.getCell(5).value,
                        Team: row.getCell(6).value,
                        Status: row.getCell(7).value,
                        Target: row.getCell(8).value,
                        Admissions: row.getCell(9).value,
                        CollectedRevenue: row.getCell(10).value,
                        BilledRevenue: row.getCell(11).value,
                        TotalLead: row.getCell(12).value,
                        AchievementPercentage: row.getCell(13).value,
                        ConversionPercentage: row.getCell(14).value,
                        CPST: row.getCell(15).value,
                        BPST: row.getCell(16).value,
                        ConnectedCall: row.getCell(17).value,
                        TalkTime: row.getCell(18).value,
                        FinalGroup: row.getCell(19).value,
                    };

                    dataToSave.push(rowData);
                }
            });

            await CounselorWiseSummery.bulkCreate(dataToSave)
                .then(() => {
                    console.log('Data saved to the database.');
                })
                .catch(err => {
                    console.error('Error saving data to the database:', err);
                });
            res.json({ message: 'Excel file uploaded and data saved to the database.' });
        } else {
            res.status(400).json({ error: 'No valid worksheet found in the Excel file.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
