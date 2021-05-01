//const db = require("../service/cb_connector/db_connector/db.js");
exports.execute = async function (params) {
  console.log("checkHideZeroEnabled.js");
  //let sql = "select setting from setting_tbl where id = xxy"
  //let res = db.sql();
  return {
    status: "PASS",
    response: {
      invoice: res.invoice,
    },
  };
};