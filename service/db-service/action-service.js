const db = require("./firebase-service");

exports.executeById = async function (actionId, param) {
  let action = await db.getCollections("/actions/" + actionId);
  console.log(action.id);
  return this.executeAction(action, param);
};

exports.executeAction = function (action, param) {
  if (action.type == "immediate") {
    //do immediate
    return "Immediate";
  } else {
    //do anything else
  }
};
