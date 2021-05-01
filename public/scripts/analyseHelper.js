$(document).ready(function () {
  console.log("From analyseHelper");

});
function signOut1() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
};

var submitParams = async function () {
  alert("Submitted");
  console.log("From analyseHelper submit");
  var $form = $(this);
  var entity_value = $("#paramVal").val();
  var domain = $("#domain").val();
  var module = $("#module").val();

  //take the values from the form, and put them in an object
  var data = {
    module: module,
    entity_value: entity_value,
    domain: domain
  }
  console.log(definition.id);
  return data;
};
$('#submitParams').submit(function () {
  alert("Submitted");
  console.log("From analyseHelper submit");
  var $form = $(this);
  var entity_value = $("#paramVal").val();
  var domain = $("#domain").val();
  var module = $("#module").val();
  var x = fetchTable();

  //take the values from the form, and put them in an object
  var data = {
    module: module,
    entity_value: entity_value,
    domain: domain
  }
});
async function fetchTable(dbResult) {
  var $table = $("#table2");
  const rows = JSON.stringify(dbResult.invoiceResult);

  $(function () {
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = "Invoice details";
    $table.bootstrapTable({
      data: rows,
    });
  });
  return rows;
};