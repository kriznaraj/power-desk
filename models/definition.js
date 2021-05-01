// let definition = {
//   id: "string",
//   name: "string",
//   modules: "string[]",
//   params: "Map(String, String)",
//   rules: Map(ruleId, ruleMap)",
//   actions: "actionID[]",
//   priority: "string", // P0, P1, P2, P3, P4
// };

class Definition {
  id;
  name;
  modules;
  params;
  rules;
  actions;
  priority;

  constructor() {}
}

module.exports = Definition;
