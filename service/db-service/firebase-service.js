let axios = require("axios").default;
let firebase = require("firebase");

let config = {
  method: "get",
  headers: {
    Authorization: "Bearer ya29.c.KqAB-weAZfJR2gSMQGvU7niJLGWbabKf1jpZSQBpYvOckQwoBPIpE1f7MgauYQf6s-yDmMcwcYUSupo3_WEMJDR0xEMdw84kkY4HYI0fb59iWlzc4IIElkUVi2X4tdW0mYhJHnHFY8wXOG_sjTOfRiox7LZAyCeJzAWBcrss9LEDbdJFDOd9G1yvKChrMapeocjYowq-u304kajQwRKcpHYXFg",
  },
};

const dbConfig = {
  apiKey: "39PNFKGYhQA4pgsyNwEth9nUSbrsyiIvNWXNDySl",
  authDomain: "prodesk-d11dc-default-rtdb.firebaseapp.com",
  databaseURL: "https://prodesk-d11dc-default-rtdb.firebaseio.com",
  projectId: "prodesk-d11dc-default-rtdb",
  storageBucket: "",
  messagingSenderId: "103083708993",
};
firebase.initializeApp(dbConfig);
let database = firebase.database();

exports.firebase_db = function () {
  return database;
};

let baseUrl = "https://prodesk-d11dc-default-rtdb.firebaseio.com/";

exports.getCollections = async function (collection) {
  let queryUrl = baseUrl + collection + ".json";
  console.log(queryUrl);
  return await axios
    .get(queryUrl)
    .then(function (response) {
      // console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
};

exports.addRunningMessage = function (msg, domain, type) {
  let message = {
    domain: domain || 'freshdesk',
    type: type || 'info',
    message: msg
  };
  let ref = firebase.database().ref('running_messages');
  var newMessageRef = ref.push();
  newMessageRef.set(message);
}

