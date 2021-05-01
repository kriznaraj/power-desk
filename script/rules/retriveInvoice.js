let cbApi = require("../../service/cb_connector/api_connector/api.js");
exports.execute = async function (params) {
  console.log("retrieveInvoice.js");
  let res = await cbApi.retrieveByRoute("invoices/" + params.invoiceId.trim());
  return {
    status: "PASS",
    response: {
      invoice: res.invoice,
    },
  };
};