let conn = require("./connection.js");
let connection = conn.connection();

exports.use = function (database_name) {
  connection = conn.getconnection(database_name);
};

exports.sql = function (query) {
  //Execute SQL Query
  let output = connection.query(query, function (err, rows, result) {
    console.log(rows);
  });
  //Return output of execution
  return output;
};

// exports.getByFilters = function (tableName, filterCol, filterValues) {
//   //    Generate SQL query based on tableName and filter
//   //    Execute SQL
//   //    Return Output
//   let query = "SELECT * FROM " + tableName;
//   if (filterCol.length > 0 && filterValues.length>0) {
//     query.push(" where")

//   }
//     filters.forEach((filter, index) => {
//       console.log(`Argument ${index}:`, filter);
//     });

//   return output;
// };

exports.getAllFromTable = function (tableName) {
  let tableRows = [];
  let query = "SELECT * FROM " + tableName;
  connection.query(query, function (err, row, result) {
    tableRows.push(row);
  });
  return tableRows;
};

// this.sql("select * from site_settings");
this.getAllFromTable("site_settings").length;
// this.getByFilters("site_settings", ["site_id"], ["mannar-test"]);
