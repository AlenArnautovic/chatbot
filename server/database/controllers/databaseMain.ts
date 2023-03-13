import * as mysql from 'mysql2';

export class Database {
  public static getConnection(): mysql.Connection {
    return mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'chatbot',
    });
  }

  public static async checkPatientsData(vNumber: string): Promise<any> {
    const connection = this.getConnection();
    const query =
      'SELECT "Yes" AS Correct_PATIENT_Data FROM chatbot.PATIENT WHERE vnumber = ?';

    return new Promise((resolve, reject) => {
      connection.query(query, [vNumber], (err, res) => {
        if (err) reject(err);
        else resolve(res);
        connection.end();
      });
    });
  }

  public static async checkIfPatientHasAppointmentForDisease(
    vNumber: string,
    disease: string
  ): Promise<any> {
    const connection = this.getConnection();
    const query =
      'SELECT     CONCAT(d.prename,  " ", d.lastname) AS DocName, s.spec_name, CONCAT(p.prename," ",  p.lastname) AS PatientName, oh.time_from, oh.time_to FROM Chatbot.SPECIALIZATION s INNER JOIN	Chatbot.doctor_specialization ds ON s.spec_id = ds.spec_id INNER JOIN  Chatbot.doctor d ON ds.doc_id = d.doc_id INNER JOIN  Chatbot.doctor_location dl ON d.doc_id = dl.doc_id INNER JOIN  Chatbot.appointment a ON dl.doctor_location_id = a.docloc_id INNER JOIN  Chatbot.openinghours oh ON a.openinghours_id = oh.openinghours_id INNER JOIN  Chatbot.patient p ON a.pat_id = p.patient_id WHERE p.vnumber = ? AND a.disease = ?';

    return new Promise((resolve, reject) => {
      connection.query(query, [vNumber, disease], (err, res) => {
        if (err) reject(err);
        else resolve(res);
        connection.end();
      });
    });
  }

  public static async checkIfAppointmentForDiseaseIsAvailable(
    disease: string,
    appointment: string
  ): Promise<any> {
    const connection = this.getConnection();

    const query =
      'SELECT "True"  AS TerminIsAvaiable FROM chatbot.appointment a RIGHT JOIN chatbot.openinghours oh ON a.openinghours_id = oh.openinghours_id LEFT JOIN chatbot.doctor_location dl ON a.docloc_id = dl.doctor_location_id LEFT JOIN chatbot.doctor d ON d.doc_id = dl.doc_id WHERE (a.docloc_id NOT IN (SELECT d.doc_id FROM chatbot.DOCTOR d INNER JOIN chatbot.doctor_specialization ds ON d.doc_id = ds.doc_id LEFT JOIN chatbot.SPECIALIZATION s ON ds.spec_id = s.spec_id WHERE s.spec_name = ?) OR a.docloc_id iS NULL) AND time_from = ? ORDER BY oh.openinghours_id ; ';

    return new Promise((resolve, reject) => {
      connection.query(query, [disease, appointment], (err, res) => {
        if (err) reject(err);
        else resolve(res);
        connection.end();
      });
    });
  }

  public static async checkIfDoctorForDiseaseIsAvailableForASpecificAppointment(
    disease: string,
    appointment: string
  ): Promise<any> {
    const connection = this.getConnection();

    const query =
      'SELECT convert_tz(oh.time_from,"+00:00","+1:00") AS Time_From, convert_tz(oh.time_to,"+00:00","+1:00") AS Time_To FROM chatbot.appointment a RIGHT JOIN chatbot.openinghours oh ON a.openinghours_id = oh.openinghours_id LEFT JOIN chatbot.doctor_location dl ON a.docloc_id = dl.doctor_location_id LEFT JOIN chatbot.doctor d ON d.doc_id = dl.doc_id WHERE (a.docloc_id NOT IN (SELECT d.doc_id FROM chatbot.DOCTOR d INNER JOIN chatbot.doctor_specialization ds ON d.doc_id = ds.doc_id LEFT JOIN chatbot.SPECIALIZATION s ON ds.spec_id = s.spec_id WHERE s.spec_name = ? ) OR a.docloc_id iS NULL) AND time_from >= ? ORDER BY oh.openinghours_id LIMIT 5;';

    return new Promise((resolve, reject) => {
      connection.query(query, [disease, appointment], (err, res) => {
        if (err) reject(err);
        else resolve(res);
        connection.end();
      });
    });
  }

  public static async bookAppointment(
    vNumber: string,
    appointment: string,
    disease: string,
    symptoms: string
  ): Promise<any> {
    const connection = this.getConnection();

    const query =
      'INSERT INTO chatbot.Appointment(DocLoc_ID,Pat_ID,OpeningHours_ID,Disease,Symptoms)SELECT (SELECT dl.doctor_location_id FROM chatbot.DOCTOR d INNER JOIN chatbot.DOCTOR_SPECIALIZATION ds ON d.doc_id = ds.doc_id INNER JOIN chatbot.SPECIALIZATION s ON ds.spec_id = s.spec_id INNER JOIN chatbot.DOCTOR_LOCATION dl ON d.doc_id = dl.doc_id WHERE s.spec_name = ?) AS doctor_location_id,(SELECT patient_id FROM chatbot.PATIENT WHERE vnumber = ?) AS patient_id,(SELECT openinghours_id FROM chatbot.OPENINGHOURS WHERE time_from = ?) AS openinghours_id,? AS disease,? AS symptoms FROM dual;';
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [disease, vNumber, appointment, disease, symptoms],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
          connection.end();
        }
      );
    });
  }

  public static async addPatient(
    vNumber: string,
    preName: string,
    lastName: string,
    phone: string,
    birthdate: string,
    address_ID: string
  ): Promise<any> {
    const connection = this.getConnection();

    const query =
      'INSERT INTO Chatbot.Patient(vNumber,PreName,LastName,Phone,Birthdate,Address_ID) VALUES (?,?,?,?,?,?);';

    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [vNumber, preName, lastName, phone, birthdate, address_ID],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
          connection.end();
        }
      );
    });
  }
}
