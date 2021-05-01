var config = {
    apiKey: "39PNFKGYhQA4pgsyNwEth9nUSbrsyiIvNWXNDySl",
    authDomain: "prodesk-d11dc-default-rtdb.firebaseapp.com",
    databaseURL: "https://prodesk-d11dc-default-rtdb.firebaseio.com",
    projectId: "prodesk-d11dc-default-rtdb",
    storageBucket: "",
    messagingSenderId: "103083708993"
};

function initDatbaseConn() {
    firebase.initializeApp(config);
    var database = firebase.database();
    return database;
}

function getJobsRefByUserId(userId, database) {
    return database.ref('users/' + userId);
    
}

function gotJobByJobId(jobId, database) {
    return database.ref('Jobs/workflowJobs/' + jobId);
}

function getOutputForJobId(jobId, database) {
    return database.ref('Jobs/workflowJobs/' + jobId + "/output");
}

function createAJob(data, database, userId) {
    console.log("in createAJob")
    let ref = database.ref('Jobs/workflowJobs');
    let result = ref.push(data, gotData);
    console.log("result" +result.key);
    console.log("userId"+ userId);
    ref = database.ref('users/'+userId);
    ref.set({"currentRunningJob":result.key});//change to update
}

function getDashboardData(schemaPath, database) {
    return database.ref(schemaPath);
}

function gotData(data) {
    let result = data.val();
    return result;
}

function errData(error) {
    if (error)
        console.log(error)
    else
        console.log("no error");
}