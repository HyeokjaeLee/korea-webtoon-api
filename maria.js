var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "leehyeokjae",
  password: "9390",
  database: "webtoon_info",
});

conn.connect();
var sql = "SELECT * FROM webtoon";
conn.query(sql, function (err, rows) {
  if (err) {
    console.log(err);
  } else {
    console.log("rows", rows);
  }
});
