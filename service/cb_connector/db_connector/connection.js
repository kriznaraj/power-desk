let fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const pathResolver = require("../../../utils/path_resolver");
let mysql = require("mysql");
let propertiesFilePath = pathResolver.db_path();
let propertiesFile = fs.readFileSync(propertiesFilePath, "utf8");
let properties = YAML.parse(propertiesFile);
let db = properties.localhost;

// console.log("Path from Connection: " + path.resolve());
var host = db.host;
var user = db.user;
var password = db.password;
var database = db.database;

exports.connection = function () {
  return mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
  });
};

exports.getconnection = function (databaseName) {
  if (!databaseName) {
    return "Database name isn't present";
  }
  return mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: databaseName,
  });
};
