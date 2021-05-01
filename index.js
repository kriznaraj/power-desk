var express = require("express");
var mysql = require("mysql");
var app = express();
var bodyParser = require("body-parser");
var axios = require('axios');
var nodemailer = require('nodemailer');

let ruleEngine = require('./service/rule_engine');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.engine(".html", require("ejs").__express);
app.set("view engine", "ejs");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cb_local_gen_test",
});
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
});

//firebase
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
const e = require("express");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://prodesk-d11dc-default-rtdb.firebaseio.com",
});

app.get("/", function (req, res) {
  res.render("dashboard");
  
});
app.get("/analyse", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  console.log(req.query);
  res.render("analyse", {
    data: {
      username: [{
        owner_name: cuser
      }]
    }
  });
});
app.post("/analyse", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  console.log(req.query);
  res.render("run_definition", {
    username: [{
      owner_name: cuser
    }]
  });
});

app.get("/ruleTemplate", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  var ruleName = req.query.name;
  console.log(req.query);
  res.render("ruleTemplate", {
    dbResult: {
      ruleName: ruleName,
      UserInfo: {
        username: cuser,
      },
    },
  });
  // go to get Query
});

app.get("/indexng", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  res.render("index", {});
});
app.get("/index", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  res.render("index-gsign", {});
});
app.get("/search", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  res.render("searchDocs", {username:cuser});
});

app.get("/run_definition", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  res.render("run_definition",{username:cuser});
});

app.get("/dashboard", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  res.render("dashboard",{username:cuser});
});

app.get("/analytics", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  res.render("analytics",{username:cuser});
});

app.get("/view_definitions", function (req, res) {
  let definition_id = req.params.id;
  console.log(definition_id);
  res.render("viewDefinitions", {definitionId : definition_id});
});

app.post("definition/trigger/:id", function (req, res) {
  let defId = req.params.id;

  //trigger that definition for all possible entity and check if there any cause found
  // definitionService.executeById(defId, )
});

app.get("/read/:collection", async function (req, res) {
  let r = await db.getCollections(req.params.collection);
  console.log(r);
  res.send(r);
});

app.post("/triggerdefinition", async function (req, res) {
  let defId = req.body.definitionId;
  let params = req.body.params;
  await ruleEngine.executeADefinition(defId, params);
  res.sendStatus(200);
});

app.post("/trigger", async function (req, res) {
  let module = req.body.module;
  let params = req.body.params;
  await ruleEngine.execute(module, params);
  res.sendStatus(200);
});

app.get("/trigger_actions", function (req, res) {
  let type = req.query.type;
  let definitionId = req.query.definitionId;
  console.log()
  if(type == 'sendSlackMessage'){
    triggerSlack();
  }else{
    triggerEmail();
  }
  res.redirect("/view_definitions?id="+definitionId);
});

function triggerSlack(){
  axios.post('https://hooks.slack.com/services/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', {
    text: 'Hello From Mission Possible, There is an potential escalation'
  })
  .then(res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  })
}


function triggerEmail(){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sudalagunta.nandita@gmail.com',
      pass: 'madhubabus'
    }
  });
  
  var mailOptions = { 
    from: 'sudalagunta.nandita@gmail.com',
    to: 'madhu.kiran@chargebee.com',
    subject: 'Hello From Mission Possible, There is an potential escalation',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

app.get("/fetchInvoice", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  console.log(req.query);
  var invoice_id = req.query.invoice_id;
  //select * from invoices where id = 244000000000
  var query = "select * from invoices where id =" + invoice_id;
  connection.query(query, cuser, function (err, rows, result) {
    console.log(rows);
    res.render("fetchInvoice", {
      dbResult: {
        UserInfo:{username:cuser},
        invoiceResult: rows,
      },
    });
    console.log(JSON.stringify(rows));
    console.log(cuser);
  });
});
app.get("/listEntity", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  console.log(req.query);
  var type = req.query.type;
  //if type = rules, fetch rules from db
  //if type = defs ,fetch from defs list
  // var query = 'select * from invoices where id =' + invoice_id;
  if (type != undefined && type != "Rules") {
    type = "defs";
  } else {
    type = "Rules";
  }
  //send the json data for the rules
  res.render("listTemplate", {
    listJson: {
      type: "Rules",
      UserInfo: { username: cuser },
      list: [
        {
          name: "fetchInvoice",
        },
        {
          name: "getPlanID",
        },
      ],
    },
  });
  console.log(cuser);
});

app.get("/getPlanID", function (req, res) {
  var cuser = req.query.username;
  var cpass = req.query.password;
  console.log(req.query);
  var invoice_id = req.query.invoice_id;
  //select * from invoices where id = 244000000000
  var query =
    "select s.plan_id as `plan_id`  from invoices i join subscriptions s on s.id = i.subscription_id where i.id =" +
    invoice_id;
  connection.query(query, cuser, function (err, rows, result) {
    console.log(rows);
    res.render("getPlanID", {
      dbResult: {
        UserInfo: { username: cuser },
        planResult: rows,
      },
    });
    console.log(JSON.stringify(rows));
    console.log(cuser);
  });
});

app.listen(3030);
console.log("Express server listening on port 3030");