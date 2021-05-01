const db = require('./db-service/firebase-service');
const definitionService = require('./db-service/definition-service');
const ruleService = require('./db-service/rule-service');

const Rule = require("./../models/rule");
const Definition = require('./../models/definition');

exports.execute = async function (module, params) {
    let definitions = await definitionService.findMatchingDefinitions(module, params);
    console.log(`INFO definitions would be runnig, ${JSON.stringify(definitions)}`);
    let workflowId = params.workflowId || getWorkflowId();
    addJob(params, workflowId);
    await scheduleWorkflow(workflowId, definitions, params)
};

exports.executeADefinition = async function (definitionId, params) {
    let definition = await definitionService.getDefinitionById(definitionId);
    console.log(`INFO a definition would be runnig, ${JSON.stringify(definition)}`);
    let workflowId = params.workflowId || getWorkflowId();
    addJob(params, workflowId);
    await scheduleExecution(workflowId, definition, params);
};

let currentRunningJobRef = db.firebase_db().ref('users/user1/currentRunningJob');
let workflowJobPrefix = 'Jobs/workflowJobs';
currentRunningJobRef.on('value', async (snapshot) => {

    try {
        let jobId = snapshot.val();
        console.log('TRIGGER CurrentRunningJob ' + jobId);
        let job = await db.getCollections(`${workflowJobPrefix}/${jobId}`);
        console.log('INFO triggered job ' + JSON.stringify(job));
        if (!job || job.status != 'SCHEDULED') {
            return;
        }

        console.log(`INFO Job ${jobId} is scheduled. Job Details - ${JSON.stringify(job)}`);

        let moduleId = job.jobContext.module;
        job.jobContext.domain = job.domainName;
        job.jobContext.workflowId = jobId;

        await this.execute(moduleId, job.jobContext);
        console.log(`INFO Job ${jobId} is complete`);
    } catch (e) {
        console.error(e);
    }
});


let getWorkflowId = function () {
    return Date.now();
}

let scheduleExecution = async function (workflowId, definition, params) {
    setTimeout(async function () {
        await executeDefinition(workflowId, definition, params);
    }, 100);
}

let scheduleWorkflow = async function (workflowId, definitions, params) {
    for (let i = 0; i < definitions.length; i++) {
        const definition = definitions[i];
        scheduleExecution(workflowId, definition, params);
    }
}

let updateJobResponse = function (workflowId, definitionId, rootCause, status) {
    let outPut = {
        rootCause: rootCause || 'Root cause not defined',
        status
    };
    console.log(`${workflowJobPrefix}/${workflowId}/output/${definitionId}`);
    db.firebase_db().ref(`${workflowJobPrefix}/${workflowId}/output/${definitionId}`).set(outPut);
    db.firebase_db().ref(`${workflowJobPrefix}/${workflowId}/status`).set('COMPLETED');
}

let addJob = function (params, workflowId, domain) {
    let jobId = getWorkflowId();
    let job = {
        domainName: domain || 'freshworks',
        jobContext: params,
        workflowId,
        status: 'SCHEDULED'
    };
    db.firebase_db().ref(`${workflowJobPrefix}/${jobId}`).set(job);
}

/**
 * @param {Definition} definition
 */
let executeDefinition = async function (workflowId, definition, params) {
    console.log(`INFO executing definition ${definition.id}`);
    console.log('INFO params ' + JSON.stringify(params));

    let responseMap = {};

    try {
        responseMap[definition.id] = {
            response: params
        };
        let rules = definition.rulesOrder;
        let isFailed = false;
        for (let i = 0; i < rules.length; i++) {
            let ruleId = rules[i];
            const ruleMap = definition.rules[ruleId];
            let input = ruleMap.input;
            let param = {};
            for (const paramId in input) {
                const p = input[paramId];
                const source = responseMap[p["source"]];
                param[paramId] = source.response[p["field"]];
            }

            let rule = await ruleService.getRuleById(ruleId);
            let ruleResponse = await executeRule(workflowId, definition.id, rule, param);
            if (ruleResponse.status == "FAIL") {
                //stop and update status to the db
                responseMap[ruleId] = ruleResponse;
                isFailed = true;
                break;
            }
            responseMap[ruleId] = ruleResponse;
        }
        console.log(`INFO Definition ${definition.id} is complete. Response ${JSON.stringify(responseMap)}`);
        if(isFailed) {
            updateJobResponse(workflowId, definition.id, definition.cause, 'FAIL');
            db.addRunningMessage(`Definition ${definition.id} is complete. Root Cause - ${definition.cause}`);
            definitionService.logDefinitionResponse(workflowId, params, responseMap, 'FAIL', definition.id);
            console.log(`INFO Root cause is not found`);
        } else {
            updateJobResponse(workflowId, definition.id, definition.cause, 'PASS');
            db.addRunningMessage(`Definition ${definition.id} is complete. Root Cause - ${definition.cause}`);
            definitionService.logDefinitionResponse(workflowId, params, responseMap, 'PASS', definition.id);
            console.log(`INFO A root cause found - ${definition.cause}`);
        }
        
    } catch (e) {
        console.error(e);
        updateJobResponse(workflowId, definition.id, definition.cause, 'FAILED');
        definitionService.logDefinitionResponse(workflowId, params, responseMap, 'FAIL', definition.id);
        db.addRunningMessage(`Definition ${definition.id} is failed.`);
    }
};

/**
 * @param {Rule} rule
 */
let executeRule = async function (workflowId, definitionId, rule, params) {
    console.log('INFO executing rule ' + rule.id);
    console.log('INFO params ' + JSON.stringify(params));

    let response;
    try {
        let script = require(`./../script/rules/${rule.script}`);
        response = await script.execute(params);
        response.message = rule.statusMessageMap[response.status];
        console.log('INFO rule response ' + JSON.stringify(response));
        db.addRunningMessage(`Rule ${rule.id} is complete. Response ${JSON.stringify(response)}`);
        db.addRunningMessage(response.message);
    } catch (e) {
        console.error(e);
        ruleService.logRuleResponse(workflowId, params, response, 'FAIL', rule.id, definitionId);
    }
    ruleService.logRuleResponse(workflowId, params, response, 'PASS', rule.id, definitionId);
    return response;
};