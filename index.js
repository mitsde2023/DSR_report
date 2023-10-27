const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ExcelJS = require('exceljs');
const DsrRoutes = require('./routes/DsrRoutes');
const sequelize = require('./config');
const CounselorWiseSummery = require('./models/CounselorData');
const CounselorWiseSummary = require('./models/CounselorWiseSummary')
const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

    (async () => {
        try {
          await sequelize.sync();
          console.log('Table created successfully.');
        } catch (error) {
          console.error('Error creating table:', error);
        } 
      })();
      
app.use('/dsr_report', DsrRoutes);

app.get('/', (req, res) => {
    res.json('Hello, how are you...');
});

app.post('/summary/upload', upload.single('excelFile'), async (req, res) => {
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
                        Month: row.getCell(1).value || null,
                        LeadID: row.getCell(2).value || null,
                        'Lead Creation Date': row.getCell(3).value || null,
                        'Executive Name': row.getCell(4).value || null,
                        Team: row.getCell(5).value || null,
                        'Student Name': row.getCell(6).value || null,
                        'Course Short Name': row.getCell(7).value || null,
                        Specialization: row.getCell(8).value || null,
                        'Amount Received': row.getCell(9).value || null,
                        'Discount Amount': row.getCell(10).value || null,
                        'Discount Reason': row.getCell(11).value || null,
                        'Study Material': row.getCell(12).value || null,
                        'Study Material Discount': row.getCell(13).value || null,
                        'Amount Billed': row.getCell(14).value || null,
                        'Payment Mode': row.getCell(15).value || null,
                        'Account details': row.getCell(16).value || null,
                        'Payment Option': row.getCell(17).value || null,
                        'Sale Date': row.getCell(18).value || null,
                        'Contact Number': row.getCell(19).value || null,
                        'Email ID': row.getCell(20).value || null,
                        'Source type': row.getCell(21).value || null,
                        Team2: row.getCell(22).value || null,
                        'Primary Source': row.getCell(23).value || null,
                        'Secondary Source': row.getCell(24).value || null,
                        LeadID2: row.getCell(25).value || null,
                        Source: row.getCell(26).value || null,
                        'Agency Source': row.getCell(27).value || null,
                        '1st payment amt': row.getCell(28).value || null,
                        'Enrollment Id': row.getCell(29).value || null,
                        Cohort: row.getCell(30).value || null,
                        'Secondary Source2': row.getCell(31).value || null,
                    };

                    dataToSave.push(rowData);
                }
            });

            await CounselorWiseSummary.bulkCreate(dataToSave)
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
