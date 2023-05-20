const sqlite3 = require("sqlite3").verbose();

async function GetTableData(tableName) {
  const db = new sqlite3.Database("db/database.db");

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT DISTINCT Date, Open, High, Low, Close FROM ${tableName} ORDER BY Date DESC LIMIT 200`,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

module.exports = GetTableData;
