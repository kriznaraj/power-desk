const db = require("./firebase-service");

exports.getRuleById = async function (ruleId) {
  return await db.getCollections("/rules/" + ruleId);
};

exports.logRuleResponse = async function (workflowId, params, response, status, ruleId, definitionId, domain) {
  let context = {
    domain: domain || 'freshdesk',
    params,
    status,
    definitionId,
    ruleId,
    workflowId,
    response
  };
  db.firebase_db().ref(`logs/rules/${ruleId}/${workflowId}/${definitionId}`).set(context);

}