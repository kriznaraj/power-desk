const {
  json
} = require("express");
const db = require("./firebase-service");

let checkParamsMatches = function (paramsRequired, paramsPresent) {
  for (const k in paramsRequired) {
    if (!paramsPresent.hasOwnProperty(k)) {
      return false;
    }
  }
  return true;
}


exports.getDefinitionById = async function (definitionId) {
  return await db.getCollections("/definitions/" + definitionId);
};

exports.findMatchingDefinitions = async function (moduleId, params) {
  console.log(`INFO find matching defs ${moduleId}, ${JSON.stringify(params)}`);

  let module = await db.getCollections(`/module/${moduleId}`);
  let defs = module.definitions;

  let definitionsToRun = [];
  for (const k in defs) {
    let definitionId = defs[k];
    let definition = await db.getCollections("/definitions/" + definitionId);
    if (checkParamsMatches(definition.params, params)) {
      definitionsToRun.push(definition);
    }
  }
  return definitionsToRun;
}


let getHash = function (workflow, params, definitionId) {
  var hash = 0,
    i, chr;
  let text = `${workflow}${definitionId}${JSON.stringify(params)}`;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

exports.logDefinitionResponse = async function (workflowId, params, response, status, definitionId, domain) {
  let context = {
    domain: domain || 'freshdesk',
    params,
    status,
    definitionId,
    workflowId,
    response
  };
  db.firebase_db().ref(`logs/definitions/${definitionId}/${workflowId}`).set(context);
  let hash = getHash(workflowId, params, definitionId);
  db.firebase_db().ref(`CurrentStatus/${hash}`).set(context);
}