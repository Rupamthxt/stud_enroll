
var token = "90931723|-31949214383460174|90963685";

function reset(){
  $("#stuName").prop('disabled', true);
  $("#stuClass").prop('disabled', true);
  $("#stuDate").prop('disabled', true);
  $("#stuAddress").prop('disabled', true);
  $("#enroll").prop('disabled', true);
  $("#stuSave").prop('disabled', true);
  $("#stuUpdate").prop('disabled', true);
  $("#stuReset").prop('disabled', true);
  $("#stuRoll").prop('disabled', false);
  $("#stuRoll").focus();
  $("#stuRoll").val("");
  $("#stuName").val("");
  $("#stuClass").val("");
  $("#stuDate").val("");
  $("#stuAddress").val("");
  $("#enroll").val("");
}

reset();

function saveLocal(jsonObj){
  var lsData = JSON.parse(jsonObj);
  localStorage.setItem('recNo', lsData.rec_no);
}

function hitReset(){
  reset();
}

function unlockP(data){
  saveLocal(data);
  data = JSON.parse(data);
  $("#stuName").val(data.record.name);
  $("#stuClass").val(data.record.class);
  $("#stuDate").val(data.record.DOB);
  $("#stuAddress").val(data.record.address);
  $("#enroll").val(data.record.enrollment);
  $("#stuName").prop('disabled', false);
  $("#stuClass").prop('disabled', false);
  $("#stuDate").prop('disabled', false);
  $("#stuAddress").prop('disabled', false);
  $("#enroll").prop('disabled', false);
  $("#stuSave").prop('disabled', true);
  $("#stuUpdate").prop('disabled', false);
  $("#stuReset").prop('disabled', false);
  $("#stuRoll").prop('disabled', true);
}

function unlockA(){
  $("#stuName").prop('disabled', false);
  $("#stuClass").prop('disabled', false);
  $("#stuDate").prop('disabled', false);
  $("#stuAddress").prop('disabled', false);
  $("#enroll").prop('disabled', false);
  $("#stuSave").prop("disabled", false);
  $("#stuUpdate").prop("disabled", true);
  $("#stuReset").removeProp("disabled");
}

function getStudent(){
    if($("stuRoll").val == ""){
      alert("Student Roll is Required Value");
      $("#stuRoll").focus();
      return;
    }
    var jsonObj = {
        roll : $("#stuRoll").val(),
    };
    jsonObj = JSON.stringify(jsonObj);
    var getReq =  createGET_BY_KEYRequest(token, "SCHOOL-DB", "STUDENT-TABLE", jsonObj, true, true);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(
    getReq,
    "http://api.login2explore.com:5577",
    "/api/irl"
    );
    jQuery.ajaxSetup({ async: true });
    if(resultObj.status === 200){
      unlockP(resultObj.data);
    }
    else{
      unlockA();
    }
}

function saveStudent(){
  var req = validateAndGetFormData();
  if(req !=""){
  var putReq = createPUTRequest(token, req, "SCHOOL-DB", "STUDENT-TABLE");
  jQuery.ajaxSetup({ async: false });
    var put = executeCommand(
    putReq,
    "http://api.login2explore.com:5577",
    "/api/iml"
    );
    jQuery.ajaxSetup({ async: true });
    reset();
  return;
  }
}

function changeStudent(){
  var req = validateAndGetFormData();
  var updateReq = createUPDATERecordRequest(token, req, "SCHOOL-DB", "STUDENT-TABLE", localStorage.recNo);
  jQuery.ajaxSetup({ async: false });
    var update = executeCommand(
    updateReq,
    "http://api.login2explore.com:5577",
    "/api/iml"
    );
    jQuery.ajaxSetup({ async: true });
    reset();
}

function validateAndGetFormData() {
  var stuRoll = $("#stuRoll").val();
  if (stuRoll === "") {
    alert("Student Roll is Required Value");
    $("#stuRoll").focus();
    return "";
  }
  var stuName = $("#stuName").val();
  if (stuName === "") {
    alert("Student Name is Required Value");
    $("#stuName").focus();
    return "";
  }
  var stuClass = $("#stuClass").val();
  if (stuClass === "") {
    alert("Student Class is Required Value");
    $("#stuClass").focus();
    return "";
  }
  var stuDate = $("#stuDate").val();
  if (stuDate === "") {
    alert("Student Birth Date is Required Value");
    $("#stuDate").focus();
    return "";
  }
  var stuAddress = $("#stuAddress").val();
  if (stuAddress === "") {
    alert("Student Address is Required Value");
    $("#stuAddress").focus();
    return "";
  }
  var enroll = $("#enroll").val();
  if (enroll === "") {
    alert("Student Enrollment Date is Required Value");
    $("#enroll").focus();
    return "";
  }
  var jsonStrObj = {
    roll: stuRoll,
    name: stuName,
    class: stuClass,
    DOB: stuDate,
    address: stuAddress,
    enrollment: enroll,
  };
  return JSON.stringify(jsonStrObj);
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
  var putRequest =
    "{\n" +
    '"token" : "' +
    connToken +
    '",' +
    '"dbName": "' +
    dbName +
    '",\n' +
    '"cmd" : "PUT",\n' +
    '"rel" : "' +
    relName +
    '",' +
    '"jsonStr": \n' +
    jsonObj +
    "\n" +
    "}";
  return putRequest;
}

function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
  var url = dbBaseUrl + apiEndPointUrl;
  var jsonObj;
  $.post(url, reqString, function (result) {
    jsonObj = JSON.parse(result);
  }).fail(function (result) {
    var dataJsonObj = result.responseText;
    jsonObj = JSON.parse(dataJsonObj);
  });
  return jsonObj;
}


