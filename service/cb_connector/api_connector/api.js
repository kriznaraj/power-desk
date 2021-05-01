const pathResolver = require("../../../utils/path_resolver.js");
const fs = require("fs");
const YAML = require("yaml");
const url = require("url");
const axios = require("axios").default;
const {
  get
} = require("http");
console.log(pathResolver.api_path());
const apiProperties = YAML.parse(
  fs.readFileSync(pathResolver.api_path(), "utf8")
);
let credentials = new Map();
credentials["site"] = apiProperties.chargebee.site;
credentials["api_key"] = apiProperties.chargebee.api_key;
console.log(credentials["api"]);
let baseUrl = "http://" + credentials["site"] + ".localcb.in:8080/api/v2/";
axios.defaults.headers.common["Authorization"] =
  "Basic " + Buffer.from(credentials["api_key"]).toString("base64");

function createCBUrl(route, domain = credentials["site"]) {
  let prefix = "http://";
  let url = prefix + domain + ".localcb.in:8080/api/v2/" + route;
  //   console.log(url);
  return url;
}


exports.retrieveByRoute = async function (route, site = credentials["site"]) {
  let cbUrl = createCBUrl(route, site);
  console.log('Route to retrieve: ' + cbUrl);

  return await axios
    .get(cbUrl)
    .then((resp) => {
      return resp.data;
    })
    .catch(function (error) {
      console.error(error);
      return {
        status: 'error',
        error
      };
    });
};
