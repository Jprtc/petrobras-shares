const express = require("express");
const path = require("path");

// Import the file that fetches de csv file and "converts" it into a sqlite file
const GetPetrobrasShares = require("./GetPetrobrasShares.js");
// Fetch the data from the sqlite DB file
const GetTableData = require("./GetTableData.js");

// Using express and allowing the html to use the files in the /public path
const app = express();
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("scripts", path.join(__dirname, "scripts"));

const port = 3000;

GetPetrobrasShares();

app.get("/", async (req, res) => {
  try {
    const tableName = "your_table";
    const tableData = await GetTableData(tableName);
    res.render("index.ejs", { tableData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
