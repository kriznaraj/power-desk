let cbApi = require("../../service/cb_connector/api_connector/api.js");
exports.execute = async function (params) {
  console.log("checkPlanAmountIsNotZero.js");
  let plan = await cbApi.retrieveByRoute("plans/" + planId);
  if (plan.price!=0) {
    return {
      status: "PASS",
      response: {}
    };
  } else {
    return {
      status: "FAIL",
      response: {}
    };
  }
};