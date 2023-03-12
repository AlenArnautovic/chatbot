import { AppointmentHelper } from '../../chatbot/support/chatbotAppointmentHelper';
import { Connect } from '../mysql';

const NAMESPACE = 'Patients';
const Connection = Connect();

//Gibt yes zurück , wenn Patient in DB gefunden wurde,
//Ansonsten NULL
export const checkPatientsData = async (
  birthdate: string,
  prename: string,
  lastname: string,
  vNumber: string
) => {
  console.log(NAMESPACE, 'Check Patient Data');
  const query =
    'SELECT "Yes" AS Correct_PATIENT_Data FROM 	chatbot.PATIENT WHERE vnumber = ?';

  (await Connection).query(
    query,
    [vNumber, prename, lastname],
    (error, result) => {
      if (error) {
        return null;
      }
      return AppointmentHelper.convertDatabaseIntoJSON(result);
    }
  );
  (await Connection).end;
};

//Gibt Select Part aus, wenn es einen treffer mit der DB gibt
export const checkIfPatientHasAppointmentForDisease = async (
  vNumber: string,
  disease: string
) => {
  console.log(
    NAMESPACE,
    'Check if Patient has already appointment for disease'
  );
  const query =
    'SELECT     CONCAT(d.prename,  " ", d.lastname) AS DocName, s.spec_name, CONCAT(p.prename," ",  p.lastname) AS PatientName, oh.time_from, oh.time_to FROM Chatbot.SPECIALIZATION s INNER JOIN	Chatbot.doctor_specialization ds ON s.spec_id = ds.spec_id INNER JOIN  Chatbot.doctor d ON ds.doc_id = d.doc_id INNER JOIN  Chatbot.doctor_location dl ON d.doc_id = dl.doc_id INNER JOIN  Chatbot.appointment a ON dl.doctor_location_id = a.docloc_id INNER JOIN  Chatbot.openinghours oh ON a.openinghours_id = oh.openinghours_id INNER JOIN  Chatbot.patient p ON a.pat_id = p.patient_id WHERE p.vnumber = ? AND a.disease = ?';

  (await Connection).query(query, [vNumber, disease], (error, result) => {
    if (error) {
      console.log(NAMESPACE, error.message, error);
      return null;
    }
    return AppointmentHelper.convertDatabaseIntoJSON(result);
  });
  (await Connection).end;
};

//Gibt Select Part aus, wenn es einen treffer mit der DB gibt
export const checkIfPatientHasAppointmentAtTime = async (
  vNumber: string,
  appointment: string
) => {
  console.log(NAMESPACE, 'Check if Patient has already appointment at time');
  const query =
    'SELECT CONCAT(p.prename, " ", p.lastname) AS PatientName,"YES" AS HasAppointment ,oh.time_from , oh.time_to FROM chatbot.SPECIALIZATION s INNER JOIN chatbot.doctor_specialization ds ON s.spec_id = ds.spec_id INNER JOIN chatbot.doctor d ON ds.doc_id = d.doc_id INNER JOIN chatbot.doctor_location dl ON d.doc_id = dl.doc_id INNER JOIN chatbot.appointment a ON dl.doctor_location_id = a.docloc_id INNER JOIN chatbot.openinghours oh ON a.openinghours_id = oh.openinghours_id INNER JOIN chatbot.patient p ON a.pat_id = p.patient_id WHERE p.vnumber = "123456789"AND oh.time_from = "2023-02-01 07:00:00"';
  (await Connection).query(query, [vNumber, appointment], (error, result) => {
    if (error) {
      console.log(NAMESPACE, error.message, error);
      return null;
    }
    console.log(result);
    //return res.status(200).json({result});
    return result;
  });
  (await Connection).end;
};

//Gibt die nächsten 5 Termine zurück die frei sind für eine Disease
export const checkIfDoctorForDiseaseIsAvailable = async (disease: string) => {
  console.log(
    NAMESPACE,
    'Retrieve first 5 avaialable Appointments from Doc to a Speficic Disease'
  );
  const query =
    'SELECT convert_tz(oh.time_from,"+00:00","+1:00") AS Time_From, convert_tz(oh.time_to,"+00:00","+1:00") AS Time_To FROM chatbot.appointment a RIGHT JOIN chatbot.openinghours oh ON a.openinghours_id = oh.openinghours_id LEFT JOIN chatbot.doctor_location dl ON a.docloc_id = dl.doctor_location_id LEFT JOIN chatbot.doctor d ON d.doc_id = dl.doc_id WHERE a.docloc_id NOT IN (SELECT d.doc_id FROM chatbot.DOCTOR d INNER JOIN chatbot.doctor_specialization ds ON d.doc_id = ds.doc_id LEFT JOIN chatbot.SPECIALIZATION s ON ds.spec_id = s.spec_id WHERE s.spec_name = ? ) OR a.docloc_id iS NULL ORDER BY oh.openinghours_id LIMIT 5;';
  (await Connection).query(query, [disease], (error, result) => {
    if (error) {
      console.log(NAMESPACE, error.message, error);
      return null;
    }
    console.log(result);
    //return res.status(200).json({result});
    return result;
  });
  (await Connection).end;
};

//Gibt die nächsten 5 Termine zurück die frei sind für eine Disease
//Ab einem bestimmten Zeitpunkt
export const checkIfDoctorForDiseaseIsAvailableForASpecificAppointment = async (
  disease: string,
  appointment: string
) => {
  console.log(
    NAMESPACE,
    'Retrieve first 5 avaialable Appointments from Doc to a Speficic Disease and Appointment'
  );
  const query =
    'SELECT convert_tz(oh.time_from,"+00:00","+1:00") AS Time_From, convert_tz(oh.time_to,"+00:00","+1:00") AS Time_To FROM chatbot.appointment a RIGHT JOIN chatbot.openinghours oh ON a.openinghours_id = oh.openinghours_id LEFT JOIN chatbot.doctor_location dl ON a.docloc_id = dl.doctor_location_id LEFT JOIN chatbot.doctor d ON d.doc_id = dl.doc_id WHERE (a.docloc_id NOT IN (SELECT d.doc_id FROM chatbot.DOCTOR d INNER JOIN chatbot.doctor_specialization ds ON d.doc_id = ds.doc_id LEFT JOIN chatbot.SPECIALIZATION s ON ds.spec_id = s.spec_id WHERE s.spec_name = ? ) OR a.docloc_id iS NULL) AND time_from >= ? ORDER BY oh.openinghours_id LIMIT 5;';
  (await Connection).query(query, [disease, appointment], (error, result) => {
    if (error) {
      console.log(NAMESPACE, error.message, error);
      return null;
    }
    console.log(result);
    //return res.status(200).json({result});
    return result;
  });
  (await Connection).end;
};

//Information to an Appointment
export const getInformationOfAppointment = async (
  vNumber: string,
  appointment: string
) => {
  console.log(NAMESPACE, 'Get Information about Appointment');
  const query =
    'SELECT CONCAT(d.prename , " ", d.lastname) AS Doc_Name ,CONCAT(p.prename, " ", p.lastname) AS Patient_Name ,oh.time_from ,oh.time_to ,Concat(addr.addressline, " ", addr.city , " " ,addr.postcode, " " , addr.province, " ", addr.country) AS Address ,dl.roomno FROM chatbot.APPOINTMENT a INNER JOIN chatbot.openinghours oh ON a.openinghours_id = oh.openinghours_id INNER JOIN chatbot.DOCTOR_LOCATION dl ON a.docloc_id = dl.doctor_location_id INNER JOIN chatbot.LOCATION l ON dl.loc_id = l.loc_id INNER JOIN chatbot.ADDRESS addr ON l.address_id = addr.address_id INNER JOIN chatbot.PATIENT p ON a.pat_id = p.patient_id INNER JOIN chatbot.DOCTOR d ON dl.doc_id = d.doc_id WHERE p.vnumber = ? AND oh.time_from = ?;';
  (await Connection).query(query, [vNumber, appointment], (error, result) => {
    if (error) {
      console.log(NAMESPACE, error.message, error);
      return null;
    }
    console.log(result);
    //return res.status(200).json({result});
    return result;
  });
  (await Connection).end;
};

//Booking an Appointment
export const bookAppointment = async (
  vNumber: string,
  appointment: string,
  disease: string,
  symptoms: string
) => {
  console.log(NAMESPACE, 'Get Information about Appointment');
  const query =
    'INSERT INTO chatbot.Appointment(DocLoc_ID,Pat_ID,OpeningHours_ID,Disease,Symptoms)SELECT (SELECT dl.doctor_location_id FROM chatbot.DOCTOR d INNER JOIN chatbot.DOCTOR_SPECIALIZATION ds ON d.doc_id = ds.doc_id INNER JOIN chatbot.SPECIALIZATION s ON ds.spec_id = s.spec_id INNER JOIN chatbot.DOCTOR_LOCATION dl ON d.doc_id = dl.doc_id WHERE s.spec_name = ?) AS doctor_location_id,(SELECT patient_id FROM chatbot.PATIENT WHERE vnumber = ?) AS patient_id,(SELECT openinghours_id FROM chatbot.OPENINGHOURS WHERE time_from = ?) AS openinghours_id,? AS disease,? AS symptoms FROM dual;';
  (await Connection).query(
    query,
    [disease, vNumber, appointment, disease, symptoms],
    (error, result) => {
      if (error) {
        console.log(NAMESPACE, error.message, error);
        return null;
      }
      console.log(result);
      //return res.status(200).json({result});
      return result;
    }
  );
  (await Connection).end;
};

//Changing  Appointment
export const changeAppointment = async (
  vNumber: string,
  disease: string,
  oldAppointment: string,
  newAppointment: string
) => {
  console.log(NAMESPACE, 'Change Appointment');
  const query =
    'UPDATE chatbot.APPOINTMENT SET DocLoc_ID = ( SELECT dl.doctor_location_id FROM chatbot.DOCTOR d INNER JOIN chatbot.DOCTOR_SPECIALIZATION ds ON d.doc_id = ds.doc_id INNER JOIN chatbot.SPECIALIZATION s ON ds.spec_id = s.spec_id INNER JOIN chatbot.DOCTOR_LOCATION dl ON d.doc_id = dl.doc_id WHERE s.spec_name = ? ) , Pat_ID = ( SELECT patient_id FROM chatbot.PATIENT WHERE vnumber = ? ), OpeningHours_ID = ( SELECT openinghours_id FROM chatbot.OPENINGHOURS WHERE time_from = ? ) WHERE DocLoc_ID = (SELECT dl.doctor_location_id FROM chatbot.DOCTOR d INNER JOIN chatbot.DOCTOR_SPECIALIZATION ds ON d.doc_id = ds.doc_id INNER JOIN chatbot.SPECIALIZATION s ON ds.spec_id = s.spec_id INNER JOIN chatbot.DOCTOR_LOCATION dl ON d.doc_id = dl.doc_id WHERE s.spec_name = ? ) AND Pat_ID = ( SELECT patient_id FROM chatbot.PATIENT WHERE vnumber = ? ) AND OpeningHours_ID = ( SELECT openinghours_id FROM chatbot.OPENINGHOURS WHERE time_from = ?);';
  (await Connection).query(
    query,
    [disease, vNumber, newAppointment, disease, vNumber, oldAppointment],
    (error, result) => {
      if (error) {
        console.log(NAMESPACE, error.message, error);
        return null;
      }
      console.log(result);
      //return res.status(200).json({result});
      return result;
    }
  );
  (await Connection).end;
};

//Add  Patient
export const addPatient = async (
  vNumber: string,
  preName: string,
  lastName: string,
  phone: string,
  birthdate: string,
  address_ID: string
) => {
  console.log(NAMESPACE, 'Add Patient');
  const query =
    'INSERT INTO Chatbot.Patient(vNumber,PreName,LastName,Phone,Birthdate,Address_ID) VALUES (?,?,?,?,?,?);';
  (await Connection).query(
    query,
    [vNumber, preName, lastName, phone, birthdate, address_ID],
    (error, result) => {
      if (error) {
        console.log(NAMESPACE, error.message, error);
        return null;
      }
      console.log(result);
      return result;
    }
  );
  (await Connection).end;
};

//Delete appointment
export const deleteAppointment = async (
  vNumber: string,
  appointment: string
) => {
  console.log(NAMESPACE, 'Delete Appointment');
  const query =
    'DELETE FROM chatbot.APPOINTMENT WHERE pat_id = (SELECT patient_id FROM chatbot.PATIENT WHERE vnumber =?) AND openinghours_id = (SELECT openinghours_id FROM chatbot.OPENINGHOURS WHERE time_from = ?);';
  (await Connection).query(query, [vNumber, appointment], (error, result) => {
    if (error) {
      console.log(NAMESPACE, error.message, error);
      return null;
    }
    console.log(result);
    //return res.status(200).json({result});
    return result;
  });
  (await Connection).end;
};

/*
export const getAllPatients = (req:Request, res:Response) => {
    console.log(NAMESPACE, "Get All Patients");

    const query = 'SELECT * FROM masterproject.patients;';

    Connect()
    .then(connection => {
        Query(connection, query)
        .then(results => {
            console.log(results);
            return res.status(200).json({
                results
            });
        })
        .catch((error) => {
            console.log(NAMESPACE, error.message, error);
    
            return res.status(500).json({
                message:error.message,
                error
            });
        })
        .finally(() => {
            connection.end();
        });
    })
    .catch((error) => {
        console.log(NAMESPACE, error.message, error);

        return res.status(500).json({
            message:error.message,
            error
        })
    });
}

*/
