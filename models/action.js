class Action {
  id;
  name;
  type;
  script;

  execute() {
    let action = require("../scripts/script_name.js");
    // Assume all of the scripts would have an execute function
    action.execute();
    // TODO: Add execution details to Firebase DB.
  }
}
