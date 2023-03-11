import * as snowflake from 'snowflake-sdk'

const snowConnect = snowflake.createConnection({
    account: "dk51672.europe-west4.gcp",
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


export function executeDrop(){
    snowConnect.execute({
        sqlText: `DROP DATABASE TEST3`,
        complete: function (err, stmt) {
        if (err) {
        console.error("Failed to execute statement due to the following error: " + err.message)
        } else {
        console.log("Successfully executed statementstatement: " + stmt.getSqlText())
        }
        }});
    }


//Gibt yes zurück , wenn Patient in DB gefunden wurde,
//Ansonsten NULL
export function checkPatientData (age:number ,prename:string, lastname:string, vNumber:string){
    snowConnect.execute({
        sqlText: `SELECT 	'Yes' AS Correct_PATIENT_Data
                    FROM 	CHATBOT.DOCTORSPRACTICE.PATIENT
                    WHERE 	floor(datediff(month,birthdate,sysdate())/12) = '30'
                    AND		PRENAME = Charles 
                    AND		LASTNAME = Garcia
                    AND		vnumber = 123456789`,
        complete: function (err, stmt) {
        if (err) {
        console.error("Failed to execute statement due to the following error: " + err.message)
        } else {
        console.log("Successfully executed Check Patient Data statement: " + stmt.getSqlText())
        }
        }});
     }

//Gibt Selecr Part aus, wenn es einen treffer mit der DB gibt
//Anonsten NULL
export function checkIfPatientHasAppointmentForDisease(vNumber:string,disease:string){
    snowConnect.execute({
        sqlText: `SELECT    d.prename || ' '|| d.lastname AS DocName
                            , s.spec_name
                            , p.prename || ' '||  p.lastname AS PatientName
                            , oh.time_from
                            , oh.time_to
                FROM        SPECIALIZATION s
                INNER JOIN	doctor_specialization ds
                ON          s.spec_id = ds.spec_id
                INNER JOIN  doctor d
                ON          ds.doc_id = d.doc_id
                INNER JOIN  doctor_location dl
                ON          d.doc_id = dl.doc_id
                INNER JOIN  appointment a
                ON          dl.doctor_location_id = a.docloc_id
                INNER JOIN  openinghours oh
                ON          a.openinghours_id = oh.openinghours_id
                INNER JOIN  patient p
                ON          a.pat_id = p.patient_id
                WHERE       p.vnumber = ${vNumber}
                AND         a.disease = ${disease};`,
        complete: function (err, stmt) {
        if (err) {
        console.error("Failed to execute statement due to the following error: " + err.message)
        } else {
        console.log("Successfully executed Check If Patient Has Appointment With Doctor statement: " + stmt.getSqlText())
        }
        }});
    }


    export function checkIfPatientHasAppointmentAtTime(vNumber:string,appointment:string){
        snowConnect.execute({
            sqlText: `SELECT 		p.prename || ' '||  p.lastname AS PatientName
                                ,'YES' AS HasAppointment
                                ,oh.time_from
                                , oh.time_to
                    FROM 		SPECIALIZATION s
                    INNER JOIN	doctor_specialization ds
                    ON 			s.spec_id = ds.spec_id
                    INNER JOIN 	doctor d
                    ON 			ds.doc_id = d.doc_id
                    INNER JOIN 	doctor_location dl
                    ON 			d.doc_id = dl.doc_id
                    INNER JOIN 	appointment a
                    ON 			dl.doctor_location_id = a.docloc_id
                    INNER JOIN 	openinghours oh
                    ON 			a.openinghours_id = oh.openinghours_id
                    INNER JOIN 	patient p
                    ON 			a.pat_id = p.patient_id
                    WHERE 		p.vnumber = ${vNumber}
                    AND 		oh.time_from = ${appointment};`,
            complete: function (err, stmt) {
            if (err) {
            console.error("Failed to execute statement due to the following error: " + err.message)
            } else {
            console.log("Successfully executed Check If Patient Has Appointment With Doctor statement: " + stmt.getSqlText())
            }
            }});
        }


    //Gibt alle Termine zurück die frei sind für eine Disease
  export function checkIfDoctorForDiseaseIsAvailable(disease:string){
        snowConnect.execute({
            sqlText: `SELECT 		oh.time_from, oh.time_to
                        FROM 		appointment a
                        RIGHT JOIN 	openinghours oh
                        ON 			a.openinghours_id = oh.openinghours_id
                        LEFT JOIN 	doctor_location dl
                        ON 			a.docloc_id = dl.doctor_location_id 
                        LEFT JOIN 	doctor d
                        ON 			d.doc_id = dl.doc_id
                        WHERE 		a.docloc_id NOT IN (SELECT 		d.doc_id 
                                                        FROM 		DOCTOR d
                                                        INNER JOIN 	doctor_specialization ds
                                                        ON 			d.doc_id = ds.doc_id 
                                                        LEFT JOIN 	SPECIALIZATION s
                                                        ON 			ds.spec_id = s.spec_id
                                                        WHERE		s.spec_name = ${disease}                                
                                                        ) 
                        OR a.docloc_id iS NULL
                        ORDER BY oh.openinghours_id;`,
            complete: function (err, stmt) {
            if (err) {
            console.error("Failed to execute statement due to the following error: " + err.message)
            } else {
            console.log("Successfully executed Check If Patient Has Appointment With Doctor statement: " + stmt.getSqlText())
            }
            }});
        }

        //Gibt einen Wert zurück, wenn Termin frei ist
        export function checkIfDoctorForDiseaseIsAvailableForASpecificAppointment(disease:string, appointment:string){
            snowConnect.execute({
                sqlText: `SELECT 		oh.time_from, oh.time_to
                            FROM 		appointment a
                            RIGHT JOIN 	openinghours oh
                            ON 			a.openinghours_id = oh.openinghours_id
                            LEFT JOIN 	doctor_location dl
                            ON 			a.docloc_id = dl.doctor_location_id 
                            LEFT JOIN 	doctor d
                            ON 			d.doc_id = dl.doc_id
                            WHERE 		a.docloc_id NOT IN (SELECT 		d.doc_id 
                                                            FROM 		DOCTOR d
                                                            INNER JOIN 	doctor_specialization ds
                                                            ON 			d.doc_id = ds.doc_id 
                                                            LEFT JOIN 	SPECIALIZATION s
                                                            ON 			ds.spec_id = s.spec_id
                                                            WHERE		s.spec_name = ${disease}                                
                                                            ) 
                            OR a.docloc_id iS NULL
                            AND time_from = ${appointment}
                            ORDER BY oh.openinghours_id;`,
                complete: function (err, stmt) {
                if (err) {
                console.error("Failed to execute statement due to the following error: " + err.message)
                } else {
                console.log("Successfully executed Check If Patient Has Appointment With Doctor statement: " + stmt.getSqlText())
                }
                }});
            }


export function checkIfDoctorForDiseaseIsAvailableAndReturnFirstFiveValues(disease:string, appointment:string){
            snowConnect.execute({
                sqlText: `SELECT 		oh.time_from, oh.time_to
                            FROM 		appointment a
                            RIGHT JOIN 	openinghours oh
                            ON 			a.openinghours_id = oh.openinghours_id
                            LEFT JOIN 	doctor_location dl
                            ON 			a.docloc_id = dl.doctor_location_id 
                            LEFT JOIN 	doctor d
                            ON 			d.doc_id = dl.doc_id
                            WHERE 		a.docloc_id NOT IN (SELECT 		d.doc_id 
                                                            FROM 		DOCTOR d
                                                            INNER JOIN 	doctor_specialization ds
                                                            ON 			d.doc_id = ds.doc_id 
                                                            LEFT JOIN 	SPECIALIZATION s
                                                            ON 			ds.spec_id = s.spec_id
                                                            WHERE		s.spec_name = ${disease}                                
                                                            ) 
                            OR a.docloc_id iS NULL
                            AND time_from >= ${appointment}
                            ORDER BY oh.openinghours_id
                            LIMIT 5;`,
                complete: function (err, stmt) {
                if (err) {
                console.error("Failed to execute statement due to the following error: " + err.message)
                } else {
                console.log("Successfully executed Check If Patient Has Appointment With Doctor statement: " + stmt.getSqlText())
                }
                }});
            }


export function getInformationOfAppointment(vNumber:string,appointment:string ){
    snowConnect.execute({
        sqlText: `SELECT 		
                            d.prename || ' ' || d.lastname AS Doc_Name
                            ,p.prename || p.lastname AS Patient_Name
                            ,oh.time_from
                            ,oh.time_to
                            ,add.addressline || '\n' || add.city || ' ' || add.postcode || '\n' || add.province || ' ' || add.country AS Address  
                            ,dl.roomno
                FROM 		APPOINTMENT a
                INNER JOIN	openinghours oh
                ON			a.openinghours_id = oh.openinghours_id
                INNER JOIN	DOCTOR_LOCATION dl
                ON 			a.docloc_id = dl.doctor_location_id
                INNER JOIN	LOCATION l
                ON			dl.loc_id = l.loc_id
                INNER JOIN	ADDRESS add
                ON			l.address_id = add.address_id
                INNER JOIN	PATIENT p
                ON			a.pat_id = p.patient_id
                INNER JOIN	DOCTOR d
                ON			dl.doc_id = d.doc_id
                WHERE 		p.vnumber = ${vNumber} 
                AND			oh.time_from = ${appointment};`,
        complete: function (err, stmt) {
        if (err) {
        console.error("Failed to execute statement due to the following error: " + err.message)
        } else {
        console.log("Successfully executed statementstatement: " + stmt.getSqlText())
        }
        }});
    }

export function bookAppointment(vNumber:string, appointment:string, disease:string, symptoms:string  ){
    snowConnect.execute({
        sqlText: `INSERT INTO Appointment(DocLoc_ID,Pat_ID,OpeningHours_ID,Disease,Symptoms) 
                 SELECT (SELECT 	dl.doctor_location_id
                                    FROM 		DOCTOR d
                                    INNER JOIN 	DOCTOR_SPECIALIZATION ds
                                    ON 			d.doc_id = ds.doc_id
                                    INNER JOIN 	SPECIALIZATION s
                                    ON 			ds.spec_id = s.spec_id
                                    INNER JOIN 	DOCTOR_LOCATION dl
                                    ON 			d.doc_id = dl.doc_id
                                    WHERE 		s.spec_name = ${disease}) AS doctor_location_id
                ,(SELECT 		patient_id
                                    FROM 		PATIENT
                                    WHERE 		vnumber = ${vNumber}) AS patient_id
                
                ,(SELECT openinghours_id
                                    FROM OPENINGHOURS
                                    WHERE time_from = ${appointment}) AS openinghours_id
                
                ,${disease} AS disease
                
                ,${symptoms} AS symptoms
        FROM dual;`,
        complete: function (err, stmt) {
        if (err) {
        console.error("Failed to execute statement due to the following error: " + err.message)
        } else {
        console.log("Successfully executed statementstatement: " + stmt.getSqlText())
        }
        }});
    }

    export function changeAppointment(vNumber:string, oldAppointment:string,newAppointment:string, disease:string ){
        snowConnect.execute({
            sqlText: `UPDATE 		APPOINTMENT
            SET			DocLoc_ID = (
                                        SELECT 		dl.doctor_location_id
                                        FROM 		DOCTOR d
                                        INNER JOIN 	DOCTOR_SPECIALIZATION ds
                                        ON 			d.doc_id = ds.doc_id
                                        INNER JOIN 	SPECIALIZATION s
                                        ON 			ds.spec_id = s.spec_id
                                        INNER JOIN 	DOCTOR_LOCATION dl
                                        ON 			d.doc_id = dl.doc_id
                                        WHERE 		s.spec_name = ${disease}
                                    ) ,
                        Pat_ID = (	
                                        SELECT 		patient_id
                                        FROM 		PATIENT
                                        WHERE 		vnumber = ${vNumber}
                                    ),
                    OpeningHours_ID = (
                                        SELECT openinghours_id
                                        FROM OPENINGHOURS
                                        WHERE time_from = ${newAppointment}
                                       )
            WHERE   DocLoc_ID = (SELECT dl.doctor_location_id
                                        FROM 		DOCTOR d
                                        INNER JOIN 	DOCTOR_SPECIALIZATION ds
                                        ON 			d.doc_id = ds.doc_id
                                        INNER JOIN 	SPECIALIZATION s
                                        ON 			ds.spec_id = s.spec_id
                                        INNER JOIN 	DOCTOR_LOCATION dl
                                        ON 			d.doc_id = dl.doc_id
                                        WHERE 		s.spec_name = ${disease}
                                )
            AND     Pat_ID =    (	
                                        SELECT 		patient_id
                                        FROM 		PATIENT
                                        WHERE 		vnumber = ${vNumber}
                                )
            AND OpeningHours_ID = (     SELECT openinghours_id
                                        FROM OPENINGHOURS
                                        WHERE time_from = ${oldAppointment});`,
            complete: function (err, stmt) {
            if (err) {
            console.error("Failed to execute statement due to the following error: " + err.message)
            } else {
            console.log("Successfully executed statementstatement: " + stmt.getSqlText())
            }
            }});
        }

export function deleteAppointment(vNumber:string, appointment:string ){
    snowConnect.execute({
        sqlText: `DELETE FROM APPOINTMENT
                    WHERE pat_id 		= (SELECT 		patient_id
                                            FROM 		PATIENT
                                            WHERE 		vnumber = ${vNumber})
                    AND openinghours_id = (SELECT openinghours_id
                                            FROM OPENINGHOURS
                                            WHERE time_from = ${appointment});`,
        complete: function (err, stmt) {
        if (err) {
        console.error("Failed to execute statement due to the following error: " + err.message)
        } else {
        console.log("Successfully executed statementstatement: " + stmt.getSqlText())
        }
        }});
    }