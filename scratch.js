let db = require("./service/db-service/firebase-service");
let path = "/definitions/verifyAccountCodeForInvoice";

function get_ref() {
  const dbRef = db.firebase_db.ref();
  dbRef
    .child("definitions")
    .child("verifyAccountCodeForInvoice")
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  //   let data = null;

  //   reference.on(
  //     "value",
  //     function (snapshot) {
  //       console.log(snapshot.val());
  //     },
  //     function (errorObject) {
  //       console.log("The read failed: " + errorObject.code);
  //     }
  //   );

  //   reference.once("value", function (dataVal) {
  //     console.log("Data1: " + dataVal.val());
  //   });

  //   dataRef.then((dataVal2) => {
  //     console.log(dataVal2);
  //   });
  //   return data;
}

console.log(get_ref());
