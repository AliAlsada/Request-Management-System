import { db } from "./db.js";

export async function setupDatabase() {

    // SQL statement for creating the general Requests table
    const createRequestsTable = 
        `CREATE TABLE IF NOT EXISTS Requests (
           RequestID INTEGER PRIMARY KEY,
           RequestType INTEGER NOT NULL,
           RequestStatus INTEGER NOT NULL,
           CompanyName TEXT NOT NULL
       );`;

    const createAccountRequestTable =
       `CREATE TABLE IF NOT EXISTS AccountRequest (
           AccountID INTEGER PRIMARY KEY,
           RequestID INTEGER,
           RequesterName TEXT,
           ApplicantName TEXT,
           UserName TEXT,
           ContactEmail TEXT,
           FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
       );`;

    const createPermissionTable =
       `CREATE TABLE IF NOT EXISTS Permissions(
           PermissionID INTEGER PRIMARY KEY,
           AccountID INTEGER,
           PermissionType TEXT NOT NULL,
           FOREIGN KEY (AccountID) REFERENCES AccountRequest(AccountID)
       );`;


    const createNewLicenseTable =
        `CREATE TABLE IF NOT EXISTS NewLicense (
            LicenseID INTEGER PRIMARY KEY,
            RequestID INTEGER,
            LicenseType TEXT,
            IsOffice BOOLEAN,
            OfficeName TEXT,
            OfficeServiceNumber TEXT,
            RequestDate DATE,
            Activities TEXT,
            FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
        );`;


    const createInspectionRequestTable =
        `CREATE TABLE IF NOT EXISTS InspectionRequest (
            InspectionID INTEGER PRIMARY KEY,
            RequestID INTEGER,
            InspectionDate DATE,
            InspectionTime TIME,
            InspectionType TEXT,
            FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
        );`;


    const createAddActivity = 
        `CREATE TABLE IF NOT EXISTS AddActivity(
            AddActivityID INTEGER PRIMARY KEY,
            RequestID INTEGER,
            LicenseID TEXT,
            FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
    )`

    const createActivities = 
        `CREATE TABLE IF NOT EXISTS Activity(
            ActivityID INTEGER PRIMARY KEY,
            AddActivityID INTEGER,
            ActivityType TEXT NOT NULL,
            FOREIGN KEY (AddActivityID) REFERENCES AddActivity(AddActivityID)
    )`


    const createStampLicenseTable =
        `CREATE TABLE IF NOT EXISTS StampLicense (
            StampLicenseID TEXT PRIMARY KEY,
            RequestID INTEGER,
            LicenseID TEXT NOT NULL,
            RequestDate DATE,
            FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
    );`;


    try {
        db.query(createRequestsTable).run();
        db.query(createNewLicenseTable).run();
        db.query(createAccountRequestTable).run();
        db.query(createInspectionRequestTable).run();
        db.query(createAddActivity).run();
        db.query(createActivities).run();
        db.query(createStampLicenseTable).run();
        db.query(createPermissionTable).run();

        // const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`).all();
        // console.log(tables);

        console.log("Database tables setup completed.");
    } catch (error) {
        console.error("Error setting up database tables:", error);
    }
}


