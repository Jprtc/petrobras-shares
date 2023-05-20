const fs = require("fs");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const csv = require("csv-parser");

async function downloadPetrobrasDailyHistory() {
  const symbol = "PETR4.SA";
  const url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=0&period2=9999999999&interval=1d&events=history`;

  const fileName = `csv/${symbol}_daily_history.csv`;

  const response = await axios.get(url, { responseType: "stream" });
  const writer = fs.createWriteStream(fileName);

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);

    writer.on("finish", () => {
      console.log(`File '${fileName}' downloaded successfully.`);
      resolve(fileName);
    });

    writer.on("error", (err) => {
      reject(err);
    });
  });
}

async function createTableFromCSV(csvFilePath, tableName) {
  const db = new sqlite3.Database("db/database.db");

  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        if (rows.length === 0) {
          reject(new Error("CSV file is empty."));
          return;
        }

        const columnNames = Object.keys(rows[0]);

        db.serialize(() => {
          const createTableStatement = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnNames
            .map((column) => `${column} TEXT`)
            .join(", ")})`;

          db.run(createTableStatement, [], (err) => {
            if (err) {
              reject(err);
              return;
            }

            const placeholders = columnNames.map(() => "?").join(", ");
            const values = rows.map((row) => Object.values(row));

            const stmt = db.prepare(
              `INSERT INTO ${tableName} VALUES (${placeholders})`
            );

            db.parallelize(() => {
              values.forEach((row) => stmt.run(...row));
              stmt.finalize();
            });
          });
        });
      });
  });
}

async function GetPetrobrasShares() {
  try {
    const csvFilePath = await downloadPetrobrasDailyHistory();
    const tableName = "your_table";
    await createTableFromCSV(csvFilePath, tableName);
  } catch (err) {
    console.error(err);
  }
}

module.exports = GetPetrobrasShares;
