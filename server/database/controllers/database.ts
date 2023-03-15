import { Request, Response } from "express";
import { Connect, Query } from "../mysql";

const NAMESPACE = "Database";
const Connection = Connect();


export const createDatabase = async () => {
    console.log(
        NAMESPACE, 
        "CREATE Database Structure"
    );

    const query = 'DROP  database  IF  EXISTS chatbot; Create  database  IF NOT EXISTS chatbot; CREATE TABLE Chatbot.Doctor ( Doc_ID int Primary Key auto_increment, PreName varchar(255) NOT NULL,   LastName varchar(255) NOT NULL  );   CREATE TABLE Chatbot.Specialization (   Spec_ID int Primary Key auto_increment,   Spec_Name varchar(255) NOT NULL  );   CREATE TABLE Chatbot.Doctor_Specialization (   Doctor_Specialization_ID int Primary Key auto_increment,   Doc_ID int NOT NULL,   Spec_ID int NOT NULL,  FOREIGN KEY (Doc_ID) REFERENCES Chatbot.Doctor(Doc_ID),  FOREIGN KEY (Spec_ID) REFERENCES Chatbot.Specialization(Spec_ID)  );      CREATE TABLE Chatbot.Address (   Address_ID int Primary Key auto_increment,   Addressline varchar(255) NOT NULL,   City varchar(255) NOT NULL,   Postcode varchar(255) NOT NULL,   Province varchar(255),   Country varchar(255) NOT NULL  );    CREATE TABLE Chatbot.Location (   Loc_ID int Primary Key auto_increment,   Loc_Name varchar(255) NOT NULL,   Rooms int NOT NULL,   Phone varchar(20) NOT NULL,   Address_id int NOT NULL,  FOREIGN KEY (address_id) REFERENCES Chatbot.Address(Address_id)  );    CREATE TABLE Chatbot.Doctor_Location (   Doctor_Location_ID int Primary Key auto_increment,   Doc_ID int NOT NULL,   Loc_ID int NOT NULL,   RoomNo int NOT NULL,  FOREIGN KEY (Doc_ID) REFERENCES Chatbot.Doctor(Doc_ID),  FOREIGN KEY (Loc_ID) REFERENCES Chatbot.Location(Loc_ID)  );         CREATE TABLE Chatbot.Patient (   Patient_ID int Primary Key auto_increment,   vNumber varchar(255) NOT NULL UNIQUE,   PreName varchar(255) NOT NULL,   LastName varchar(255) NOT NULL,   Phone varchar (255) NOT NULL,   birthdate date NOT NULL,   address_id int NOT NULL,  FOREIGN KEY (address_id) REFERENCES Chatbot.Address(Address_id)  );CREATE TABLE Chatbot.OpeningHours (   OpeningHours_ID int NOT NULL Primary Key,   Time_From DATETIME,   Time_To DATETIME   );    CREATE TABLE Chatbot.Appointment (   Appointment_ID int PRIMARY KEY auto_increment,   DocLoc_ID int NOT NULL,   Pat_ID int NOT NULL,   OpeningHours_ID int NOT NULL,   Disease varchar(1000),   Symptoms varchar(1000), CONSTRAINT uniqueAppointment UNIQUE (DocLoc_ID,Pat_ID),FOREIGN KEY (DocLoc_ID) REFERENCES Chatbot.Doctor_Location(Doctor_Location_ID),    FOREIGN KEY (Pat_ID) REFERENCES Chatbot.Patient(Patient_ID),    FOREIGN KEY (OpeningHours_ID) REFERENCES Chatbot.OpeningHours(OpeningHours_ID)  );       SET SQL_SAFE_UPDATES = 0;';
    (await Connection).query(query, (error, result) => {
        if (error) {
          console.log(NAMESPACE, error.message, error);
          return null;
        }
        console.log(result);
        //return res.status(200).json({result});
        return result;
      });
      (await Connection).end;
}

export const insertTestData = async () => {
    console.log(
        NAMESPACE,
         "INSERT TEST DATA"
    );

    
    (await Connection).query(query, (error, result) => {
        if (error) {
          console.log(NAMESPACE, error.message, error);
          return null;
        }
        console.log(result);
        //return res.status(200).json({result});
        return result;
      });
      (await Connection).end;
}