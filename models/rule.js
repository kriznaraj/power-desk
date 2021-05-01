// let rule = {
//     id: "string",
//     name: "string",
//     statusMessageMap:{
//         PASS: "This would be the message",
//         FAIL: "Fail Message",
//         ERROR: "Something went wrong"
//     },
//     script: "string",
//     params: {
//       invoiceId: "string"
//     },
//     output: {
//       id: "string",
//       invoice: "object"
//     }
//   }

class Rule {
  id;
  name;
  statusMessageMap;
  script;
  params;
  output;

  constructor() {}
}

module.exports = Rule;
