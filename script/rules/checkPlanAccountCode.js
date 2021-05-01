exports.execute = async function (params) {
  let plan = params.plan;
  console.log("checkPlanAccountCode.js");
  if (!plan.accounting_code) {
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