import { db } from "./db.js";

async function setupDatabase() {

    // SQL statement for creating the general Requests table
    const createRequestsTable = 
        `CREATE TABLE IF NOT EXISTS Requests (
           RequestID INTEGER PRIMARY KEY AUTOINCREMENT,
           RequestType INTEGER NOT NULL,
           RequestStatus INTEGER NOT NULL,
           CompanyName TEXT NOT NULL
       );`;

    // SQL statement for creating the NewLicense table
    const createNewLicenseTable =
        `CREATE TABLE IF NOT EXISTS NewLicense (
            LicenseRequestID INTEGER PRIMARY KEY AUTOINCREMENT,
            RequestID INTEGER,
            LicenseType TEXT,
            IsOffice BOOLEAN,
            OfficeName TEXT,
            OfficeServiceNumber TEXT,
            RequestDate DATE,
            FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
        );`;

    const createAccountRequestTable =
        `CREATE TABLE IF NOT EXISTS AccountRequest (
            AccountRequestID INTEGER PRIMARY KEY AUTOINCREMENT,
            RequestID INTEGER,
            RequesterName TEXT,
            ApplicantName TEXT,
            UserName TEXT,
            ContactEmail TEXT,
            FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
        );`;

    const createInspectionRequestTable =
        `CREATE TABLE IF NOT EXISTS InspectionRequest (
            InspectionRequestID INTEGER PRIMARY KEY AUTOINCREMENT,
            RequestID INTEGER,
            InspectionDate DATE,
            InspectionTime TIME,
            InspectionType TEXT,
            FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
        );`;


    const createAddActivity = 
    `CREATE TABLE IF NOT EXISTS AddActivity(
        AddActivityID INTEGER PRIMARY KEY AUTOINCREMENT,
        RequestID INTEGER,
        LicenceID TEXT,
        FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
    )`

    const createActivities = 
    `CREATE TABLE IF NOT EXISTS Activity(
        ActivityID INTEGER PRIMARY KEY AUTOINCREMENT,
        AddActivityID INTEGER,
        ActivityDescription TEXT NOT NULL,
        FOREIGN KEY (AddActivityID) REFERENCES AddActivity(AddActivityID)
    )`


    const createStampLicenceTable =
    `CREATE TABLE IF NOT EXISTS StampLicence (
        StampLicenceID INTEGER PRIMARY KEY AUTOINCREMENT,
        RequestID INTEGER,
        LicenceID TEXT UNIQUE NOT NULL,
        RequestDate DATE NOT NULL,
        FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)
    );`;

    const createPermissionTable =
    `CREATE TABLE IF NOT EXISTS Permissions(
        PermissionID INTEGER PRIMARY KEY AUTOINCREMENT,
        AccountRequestID INTEGER,
        PermissionType TEXT NOT NULL,
        FOREIGN KEY (AccountRequestID) REFERENCES AccountRequest(AccountRequestID)
    );`;

    try {
        await db.query(createRequestsTable);
        await db.query(createNewLicenseTable);
        await db.query(createAccountRequestTable);
        await db.query(createInspectionRequestTable);
        await db.query(createAddActivity);
        await db.query(createActivities);
        await db.query(createStampLicenceTable);
        await db.query(createPermissionTable);

        console.log("Database tables setup completed.");
    } catch (error) {
        console.error("Error setting up database tables:", error);
    }
}


setupDatabase();
