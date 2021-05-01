let fs = require("fs");
const YAML = require("yaml");

var path = require('path');
console.log("path.........")
console.log(__dirname)
let common_properties = "../configs/common-properties.yml"
var here = path.basename(__dirname) + '/' + common_properties


console.log(here)
let common = fs.readFileSync(
  here,
  "utf8"
);
let commonpaths = YAML.parse(common);

// let db = fs.readFileSync("configs/db-properties.yaml", "utf8");

exports.db_path = function () {
  return commonpaths.base + commonpaths.db;
};

exports.api_path = function () {
  return commonpaths.base + commonpaths.api;
};
