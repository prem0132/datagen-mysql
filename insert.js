require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.SOURCE_DB
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');

    // Create the table if it doesn't exist
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS sourcetable (
            id INT AUTO_INCREMENT PRIMARY KEY,
            text_col1 VARCHAR(255),
            text_col2 VARCHAR(255),
            int_col1 INT,
            int_col2 INT,
            date_ns_col DATETIME(6),
            date_s_col DATETIME,
            UNIQUE KEY (id)
        )
    `;
    
    connection.query(createTableSQL, (err, results) => {
        if (err) throw err;
        console.log('Table ensured to exist.');

        const recordsPerSecond = parseInt(process.env.RECORDS_PER_SECOND);
        const waitTime = parseInt(process.env.WAIT_TIME);

        const insertRandomData = () => {
            const randomText1 = Math.random().toString(36).substring(2, 15);
            const randomText2 = Math.random().toString(36).substring(2, 15);
            const randomInt1 = Math.floor(Math.random() * 10000);
            const randomInt2 = Math.floor(Math.random() * 10000);
            
            // MySQL doesn't have native nanosecond support. You may need to store it as a BIGINT or VARCHAR.
            const dateWithNanoseconds = new Date().toISOString().replace('Z', '') + '000'; // ISO string + 3 zeroes for faux nanoseconds
            const dateWithSeconds = new Date().toISOString().split('.')[0];

            connection.query(`INSERT INTO sourcetable (text_col1, text_col2, int_col1, int_col2, date_ns_col, date_s_col) VALUES (?, ?, ?, ?, ?, ?)`, 
                [randomText1, randomText2, randomInt1, randomInt2, dateWithNanoseconds, dateWithSeconds], 
                (err, results) => {
                    if (err) throw err;
                    console.log(`Inserted: ${randomText1}, ${randomText2}, ${randomInt1}, ${randomInt2}, ${dateWithNanoseconds}, ${dateWithSeconds}`);
                }
            );
        };              


        const insertPerSecond = () => {
            for (let i = 0; i < recordsPerSecond; i++) {
                setTimeout(insertRandomData, i * (1000 / recordsPerSecond));
            }
        };

        setInterval(insertPerSecond, 1000 + waitTime);
    });
});
