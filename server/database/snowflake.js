"use strict";
exports.__esModule = true;
var snowflake = require("snowflake-sdk");
var snowConnect = snowflake.createConnection({
    account: "ob95661.europe-west4.gcp",
    username: "CHATBOT",
    password: "Chatbot123",
    authenticator: "SNOWFLAKE",
    warehouse: "COMPUTE_WH",
    role: "SYSADMIN",
    clientSessionKeepAlive: true
});
snowflake.configure({ ocspFailOpen: false });
snowConnect.connect(function (err, conn) {
    if (err) {
        console.error("Unable to connect: " + err.message);
    }
    else {
        console.log("Successfully connected as id: " + snowConnect.getId());
    }
});
/*
snowConnect.execute({
    sqlText: "INSERT INTO CHATBOT.PATIENT.PATIENT VALUES (76,'test','test')",
    complete: function (err, stmt) {
        if (err) {
            console.error("Failed to execute statement due to the following error: " + err.message);
        }
        else {
            console.log("Successfully executed statement: " + stmt.getSqlText());
        }
    }
});

*/
