import * as snowflake from 'snowflake-sdk'

const snowConnect = snowflake.createConnection({
    account: "ob95661.europe-west4.gcp",
    username: "CHATBOT", 
    password: "Chatbot123",
    authenticator: "SNOWFLAKE", 
    warehouse: "COMPUTE_WH",
    role: "SYSADMIN", // Create a role for API calls
    clientSessionKeepAlive: true,
    });
snowflake.configure({ ocspFailOpen: false })

snowConnect.connect(function (err, conn) {
        if (err) {
        console.error("Unable to connect: " + err.message)
        } else {
        console.log("Successfully connected as id: " + snowConnect.getId())
        } 
    });


    snowConnect.execute({
        sqlText: `INSERT INTO CHATBOT.PATIENT.PATIENT VALUES (4,'test','test')`,// ${'<your-variable-name>'} for variable values
        complete: function (err, stmt) {
        if (err) {
        console.error("Failed to execute statement due to the following error: " + err.message)
        } else {
        console.log("Successfully executed statement: " + stmt.getSqlText())
        }
        }});